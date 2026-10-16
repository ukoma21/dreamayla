import { NextResponse } from "next/server";
import { readConsultation, type ConsultationMessage } from "@/lib/consultations";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const { message } = await request.json() as { message?: unknown };
    const body = typeof message === "string" ? message.trim() : "";
    if (body.length < 2 || body.length > 3000) return NextResponse.json({ error: "A message must be between 2 and 3,000 characters." }, { status: 400 });
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
    if (subscription?.status !== "ACTIVE" || subscription.billingPlan !== "plus") return NextResponse.json({ error: "Dreamayla Premium is required for consultation messages." }, { status: 402 });
    const thread = await prisma.dreamConversation.findFirst({ where: { id, userId: user.id, dreamId: null } });
    const consultation = thread ? readConsultation(thread.messages) : null;
    if (!thread || !consultation) return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
    const reply: ConsultationMessage = { id: crypto.randomUUID(), sender: "member", body, createdAt: new Date().toISOString() };
    await prisma.dreamConversation.update({ where: { id }, data: { messages: { ...consultation, messages: [...consultation.messages, reply] } } });
    return NextResponse.json({ message: reply });
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
