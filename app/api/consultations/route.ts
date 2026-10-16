import { NextResponse } from "next/server";
import { readConsultation, lastConsultationActivity, type ConsultationMessage } from "@/lib/consultations";
import { supabaseServer } from "@/lib/supabase/server";

async function memberFromRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

async function hasPremiumConsultationAccess(userId: string) {
  const { prisma } = await import("@/lib/prisma");
  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  return subscription?.status === "ACTIVE" && subscription.billingPlan === "plus";
}

export async function GET(request: Request) {
  const user = await memberFromRequest(request);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const allowed = await hasPremiumConsultationAccess(user.id);
    if (!allowed) return NextResponse.json({ error: "Dreamayla Premium is required for one-on-one consultations." }, { status: 402 });
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.dreamConversation.findMany({ where: { userId: user.id, dreamId: null }, orderBy: { createdAt: "desc" }, take: 25 });
    const consultations = rows.flatMap((row) => {
      const conversation = readConsultation(row.messages);
      return conversation ? [{ id: row.id, subject: conversation.subject, messages: conversation.messages, createdAt: row.createdAt.toISOString(), updatedAt: lastConsultationActivity(conversation, row.createdAt) }] : [];
    }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return NextResponse.json({ consultations });
  } catch {
    return NextResponse.json({ error: "Unable to load consultations right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await memberFromRequest(request);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    if (!await hasPremiumConsultationAccess(user.id)) return NextResponse.json({ error: "Dreamayla Premium is required for one-on-one consultations." }, { status: 402 });
    const body = await request.json() as { subject?: unknown; message?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const suppliedSubject = typeof body.subject === "string" ? body.subject.trim() : "";
    if (message.length < 10 || message.length > 3000) return NextResponse.json({ error: "Please share a question between 10 and 3,000 characters." }, { status: 400 });
    const subject = (suppliedSubject || message.replace(/\s+/g, " ").slice(0, 90)).slice(0, 120);
    const createdAt = new Date().toISOString();
    const firstMessage: ConsultationMessage = { id: crypto.randomUUID(), sender: "member", body: message, createdAt };
    const { prisma } = await import("@/lib/prisma");
    const consultation = await prisma.dreamConversation.create({ data: { userId: user.id, dreamId: null, messages: { kind: "consultation", subject, messages: [firstMessage] } } });
    return NextResponse.json({ consultation: { id: consultation.id, subject, messages: [firstMessage], createdAt: consultation.createdAt.toISOString(), updatedAt: createdAt } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to send your consultation request right now." }, { status: 500 });
  }
}
