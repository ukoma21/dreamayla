import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin";
import { readSupportConversation, type ConsultationMessage } from "@/lib/consultations";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await adminFromRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { message } = await request.json() as { message?: unknown };
    const body = typeof message === "string" ? message.trim() : "";
    if (body.length < 2 || body.length > 3000) return NextResponse.json({ error: "A reply must be between 2 and 3,000 characters." }, { status: 400 });
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const thread = await prisma.dreamConversation.findFirst({ where: { id, dreamId: null } });
    const consultation = thread ? readSupportConversation(thread.messages) : null;
    if (!thread || !consultation) return NextResponse.json({ error: "Consultation not found." }, { status: 404 });
    const reply: ConsultationMessage = { id: crypto.randomUUID(), sender: "admin", body, createdAt: new Date().toISOString() };
    const updated = await prisma.dreamConversation.update({ where: { id }, data: { messages: { ...consultation, messages: [...consultation.messages, reply] } } });
    return NextResponse.json({ message: reply, updatedAt: updated.createdAt.toISOString() });
  } catch {
    return NextResponse.json({ error: "Unable to send this reply right now." }, { status: 500 });
  }
}
