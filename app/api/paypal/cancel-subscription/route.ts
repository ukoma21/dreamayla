import { NextResponse } from "next/server";
import { z } from "zod";
import { paypalBase, paypalToken } from "@/lib/paypal";
import { supabaseServer } from "@/lib/supabase/server";

const input = z.object({ reason: z.string().trim().max(127).optional() });

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const supabase = supabaseServer();
    if (!token || !supabase) return NextResponse.json({ error: "Please sign in before managing a membership." }, { status: 401 });
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ error: "Please sign in before managing a membership." }, { status: 401 });

    const { prisma } = await import("@/lib/prisma");
    const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
    if (!subscription?.paypalSubscriptionId || subscription.status !== "ACTIVE") {
      return NextResponse.json({ error: "There is no active PayPal membership to cancel." }, { status: 400 });
    }

    const { reason } = input.parse(await request.json().catch(() => ({})));
    const accessToken = await paypalToken();
    const response = await fetch(`${paypalBase()}/v1/billing/subscriptions/${subscription.paypalSubscriptionId}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason || "Cancelled by the DreamAyla member" }),
    });

    if (!response.ok) return NextResponse.json({ error: "PayPal could not cancel this membership. Please try again or contact support." }, { status: 400 });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "CANCELED", cancelAtPeriodEnd: false },
    });
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: 0,
        type: "MEMBERSHIP_CANCELED",
        metadata: { subscriptionId: subscription.paypalSubscriptionId, reason: "member_request" },
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not update your membership right now. Please try again." }, { status: 500 });
  }
}
