import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase/server";

const dreamInput = z.object({
  title: z.string().max(140).optional(), content: z.string().min(3).max(5000), mood: z.string().max(48).optional(),
  parsed: z.record(z.any()), report: z.record(z.any()),
});

async function currentUser(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

export async function GET(request: Request) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const { prisma } = await import("@/lib/prisma");
    const dreams = await prisma.dream.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, title: true, mood: true, summary: true, createdAt: true } });
    return NextResponse.json({ dreams });
  } catch { return NextResponse.json({ dreams: [], dataSourceUnavailable: true }); }
}

export async function POST(request: Request) {
  const user = await currentUser(request);
  if (!user) return NextResponse.json({ error: "Create an account to save your dream." }, { status: 401 });
  if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
    return NextResponse.json({ error: "Dream saving is being activated. Your report remains available on this device; please try again shortly." }, { status: 503 });
  }
  try {
    const input = dreamInput.parse(await request.json());
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.upsert({ where: { id: user.id }, create: { id: user.id, email: user.email ?? `${user.id}@dreamayla.local` }, update: { email: user.email ?? undefined } });
    const report = input.report as { overall_theme?: { title?: string } };
    const parsed = input.parsed as { summary?: string; symbols?: string[]; emotions?: string[] };
    const dream = await prisma.dream.create({ data: {
      userId: user.id, title: input.title || report.overall_theme?.title || "Untitled dream", rawContent: input.content, mood: input.mood,
      summary: parsed.summary, parserData: input.parsed, report: input.report,
      symbols: { create: (parsed.symbols || []).slice(0, 12).map((name) => ({ name, importance: 60 })) },
      emotions: { create: (parsed.emotions || []).slice(0, 8).map((name) => ({ name, score: 55 })) },
    } });
    return NextResponse.json({ dream: { id: dream.id } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save this dream just yet. Your report is still available here, so please try again shortly." }, { status: 503 });
  }
}
