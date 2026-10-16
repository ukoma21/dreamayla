import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const { id } = await params; const { prisma } = await import("@/lib/prisma");
    const dream = await prisma.dream.findFirst({ where: { id, userId: user.id }, include: { symbols: true, emotions: true } });
    if (!dream) return NextResponse.json({ error: "Dream not found" }, { status: 404 });
    return NextResponse.json({ dream });
  } catch { return NextResponse.json({ error: "Unable to load this dream." }, { status: 500 }); }
}
