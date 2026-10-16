import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase/server";
import { readSupportConversation, type ConsultationMessage, type ConsultationPayload } from "@/lib/consultations";

const schema = z.object({ message: z.string().min(2).max(1000) });

async function premiumUser(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;
  const { prisma } = await import("@/lib/prisma");
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (!subscription || subscription.status !== "ACTIVE" || subscription.billingPlan !== "plus") return { user, allowed: false as const, prisma };
  return { user, allowed: true as const, prisma };
}

async function coachThread(userId: string) {
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.dreamConversation.findMany({ where: { userId, dreamId: null }, orderBy: { createdAt: "desc" }, take: 50 });
  for (const row of rows) {
    const conversation = readSupportConversation(row.messages);
    if (conversation?.kind === "coach") return { row, conversation };
  }
  return null;
}

export async function GET(request: Request) {
  try {
    const account = await premiumUser(request);
    if (!account) return NextResponse.json({ error: "Sign in to view your private Ayla conversation." }, { status: 401 });
    if (!account.allowed) return NextResponse.json({ error: "Ayla Dream Guide is included with Dreamayla Premium." }, { status: 402 });
    const thread = await coachThread(account.user.id);
    return NextResponse.json({ messages: thread?.conversation.messages ?? [] });
  } catch {
    return NextResponse.json({ error: "Unable to load your Ayla conversation." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message } = schema.parse(await request.json());
    const account = await premiumUser(request);
    if (!account) return NextResponse.json({ error: "Sign in to use Ayla Dream Guide with your private dream history.", code: "SIGN_IN_REQUIRED" }, { status: 401 });
    if (!account.allowed) return NextResponse.json({ error: "Ayla Dream Guide is included with Dreamayla Premium. Upgrade your membership to open this private channel.", code: "UPGRADE_REQUIRED" }, { status: 402 });

    const dreams = await account.prisma.dream.findMany({
      where: { userId: account.user.id }, orderBy: { createdAt: "desc" }, take: 12,
      select: { title: true, summary: true, mood: true, parserData: true, createdAt: true },
    });

    let reply: string;
    if (!dreams.length) {
      reply = "Save at least one dream first, and Ayla can connect your question to the symbols, emotions, and themes you have recorded.";
    } else {
      const key = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
      if (!key) {
        reply = `Based on your ${dreams.length} saved dream${dreams.length === 1 ? "" : "s"}, this is a useful reflection prompt: “${message}” Pay attention to which emotion repeats, what changes from one dream to the next, and what situation in waking life feels similar.`;
      } else {
        const ai = new OpenAI({ apiKey: key, baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com" : "https://api.openai.com/v1" });
        const history = dreams.map((dream) => ({ title: dream.title || "Untitled dream", mood: dream.mood || "not specified", summary: dream.summary || "", parserData: dream.parserData || {} }));
        const response = await ai.chat.completions.create({ model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o-mini", temperature: .55, messages: [
          { role: "system", content: "You are Ayla, DreamAyla's private dream guide. Answer only from the user's private dream history supplied in the prompt. Be warm, specific, and practical. Connect repeated symbols, emotions, people, places, and changes over time. Never diagnose, predict the future, or claim certainty. Use cautious language such as may, might, could, and one possible pattern. Write 3-5 short paragraphs with a clear takeaway and one reflection question." },
          { role: "user", content: JSON.stringify({ question: message, savedDreams: history }) },
        ] });
        reply = response.choices[0].message.content || "I could not create a reflection from your dream history just now.";
      }
    }

    const memberMessage: ConsultationMessage = { id: crypto.randomUUID(), sender: "member", body: message, createdAt: new Date().toISOString() };
    const aylaMessage: ConsultationMessage = { id: crypto.randomUUID(), sender: "ayla", body: reply, createdAt: new Date().toISOString() };
    const existing = await coachThread(account.user.id);
    let conversation: ConsultationPayload;
    if (existing) {
      conversation = { ...existing.conversation, messages: [...existing.conversation.messages, memberMessage, aylaMessage] };
      await account.prisma.dreamConversation.update({ where: { id: existing.row.id }, data: { messages: conversation } });
    } else {
      conversation = { kind: "coach", subject: "Ayla Dream Guide", messages: [memberMessage, aylaMessage] };
      await account.prisma.dreamConversation.create({ data: { userId: account.user.id, dreamId: null, messages: conversation } });
    }

    return NextResponse.json({ reply, messages: conversation.messages });
  } catch {
    return NextResponse.json({ error: "Ayla is unavailable right now. Please try again." }, { status: 400 });
  }
}
