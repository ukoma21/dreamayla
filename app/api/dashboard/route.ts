import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const { prisma } = await import("@/lib/prisma");
    const [dreamCount, recentDreams, patterns, subscription] = await Promise.all([
      prisma.dream.count({ where: { userId: user.id } }),
      prisma.dream.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4, select: { id: true, title: true, mood: true, summary: true, createdAt: true } }),
      prisma.dreamPattern.findMany({ where: { userId: user.id }, orderBy: { frequency: "desc" }, take: 3 }),
      prisma.subscription.findUnique({ where: { userId: user.id } }),
    ]);
    const commonEmotion = recentDreams.find((dream: { mood: string | null }) => dream.mood)?.mood ?? "Not enough data";
    return NextResponse.json({ dreamCount, recentDreams, patterns, commonEmotion, subscription });
  } catch {
    return NextResponse.json({ dreamCount: 0, recentDreams: [], patterns: [], commonEmotion: "Not enough data", subscription: null, dataSourceUnavailable: true });
  }
}
