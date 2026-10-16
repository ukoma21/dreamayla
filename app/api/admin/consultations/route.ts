import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin";
import { lastConsultationActivity, readSupportConversation } from "@/lib/consultations";

export async function GET(request: Request) {
  if (!await adminFromRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.dreamConversation.findMany({ where: { dreamId: null }, orderBy: { createdAt: "desc" }, take: 100 });
    const users = rows.length ? await prisma.user.findMany({ where: { id: { in: [...new Set(rows.map((row) => row.userId))] } }, select: { id: true, email: true } }) : [];
    const emailByUserId = new Map(users.map((user) => [user.id, user.email]));
    const consultations = rows.flatMap((row) => {
      const consultation = readSupportConversation(row.messages);
      return consultation ? [{ id: row.id, userId: row.userId, email: emailByUserId.get(row.userId) ?? "Member", kind: consultation.kind, subject: consultation.subject, messages: consultation.messages, createdAt: row.createdAt.toISOString(), updatedAt: lastConsultationActivity(consultation, row.createdAt) }] : [];
    }).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return NextResponse.json({ consultations });
  } catch {
    return NextResponse.json({ error: "Unable to load consultation requests." }, { status: 500 });
  }
}
