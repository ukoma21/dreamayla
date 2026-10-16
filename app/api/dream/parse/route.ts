import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseDream } from "@/lib/ai";
import { supabaseServer } from "@/lib/supabase/server";

const schema = z.object({ content: z.string().min(10).max(5000), title: z.string().max(120).optional(), mood: z.string().max(30).optional() });

async function hasActiveMembership(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return { signedIn: false, paid: false };
  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return { signedIn: false, paid: false };
  try {
    const { prisma } = await import("@/lib/prisma");
    const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
    return { signedIn: true, paid: Boolean(subscription && subscription.status === "ACTIVE" && ["PREMIUM", "ANNUAL"].includes(subscription.plan)) };
  } catch {
    return { signedIn: true, paid: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await hasActiveMembership(request);
    const freeReportUsed = request.cookies.get("dreamayla_free_report_used")?.value === "1";
    if (!access.paid && freeReportUsed) {
      return NextResponse.json({
        error: access.signedIn ? "Your free DreamAyla report has been used. Choose a plan to continue." : "Your free DreamAyla report has been used. Create an account and choose a plan to continue.",
        code: access.signedIn ? "UPGRADE_REQUIRED" : "SIGNUP_REQUIRED",
      }, { status: 402 });
    }
    const body = schema.parse(await request.json());
    const parsed = await parseDream(body.content);
    return NextResponse.json({ parsed });
  } catch {
    return NextResponse.json({ error: "Something went wrong while analyzing your dream. Please try again." }, { status: 400 });
  }
}
