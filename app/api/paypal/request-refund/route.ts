import { NextResponse } from "next/server";
import { paypalBase, paypalToken } from "@/lib/paypal";
import { supabaseServer } from "@/lib/supabase/server";

const refundWindowMs = 3 * 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const supabase = supabaseServer();
    if (!token || !supabase) return NextResponse.json({ error: "Please sign in before requesting a refund." }, { status: 401 });
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return NextResponse.json({ error: "Please sign in before requesting a refund." }, { status: 401 });

    const { prisma } = await import("@/lib/prisma");
    const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
    const firstPayment = await prisma.payment.findFirst({ where: { userId: user.id, status: "COMPLETED" }, orderBy: { createdAt: "asc" } });
    if (!subscription?.paypalSubscriptionId || !firstPayment) return NextResponse.json({ error: "There is no eligible membership payment to refund." }, { status: 400 });

    const previousGuarantee = await prisma.creditTransaction.findFirst({
      where: { userId: user.id, type: "REFUND_GUARANTEE_USED" },
      select: { id: true },
    });
    const previousRefund = await prisma.payment.findFirst({
      where: { userId: user.id, status: { in: ["REFUND_PENDING", "REFUNDED"] } },
      select: { id: true },
    });
    if (previousGuarantee || previousRefund) {
      return NextResponse.json({ error: "The three-day refund guarantee has already been used for this account. You can still manage future membership renewal from your billing page." }, { status: 400 });
    }

    const deadline = firstPayment.createdAt.getTime() + refundWindowMs;
    if (Date.now() > deadline) return NextResponse.json({ error: "The three-day refund window has ended. You can still cancel renewal from your billing page." }, { status: 400 });

    const accessToken = await paypalToken();
    const refund = await fetch(`${paypalBase()}/v1/payments/sale/${encodeURIComponent(firstPayment.paypalPaymentId)}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `dreamayla-refund-${firstPayment.id}`,
      },
      body: JSON.stringify({ amount: { total: (firstPayment.amount / 100).toFixed(2), currency: firstPayment.currency } }),
    });
    if (!refund.ok) return NextResponse.json({ error: "PayPal could not start your refund. Please contact support with your receipt reference." }, { status: 502 });

    // Record the accepted refund before the separate subscription call. This
    // makes a retry safe if PayPal accepts the refund but its cancellation API
    // is temporarily unavailable.
    await prisma.$transaction([
      prisma.payment.update({ where: { id: firstPayment.id }, data: { status: "REFUND_PENDING" } }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 0,
          type: "REFUND_GUARANTEE_USED",
          metadata: { paymentId: firstPayment.id, subscriptionId: subscription.paypalSubscriptionId },
        },
      }),
    ]);

    const cancellation = await fetch(`${paypalBase()}/v1/billing/subscriptions/${encodeURIComponent(subscription.paypalSubscriptionId)}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Three-day satisfaction guarantee refund" }),
    });
    if (!cancellation.ok) return NextResponse.json({ error: "Your refund was accepted by PayPal, but your membership needs a cancellation review. Please contact support." }, { status: 502 });

    await prisma.$transaction([
      prisma.subscription.update({ where: { id: subscription.id }, data: { status: "CANCELED", cancelAtPeriodEnd: false } }),
      prisma.creditTransaction.create({
        data: {
          userId: user.id,
          amount: 0,
          type: "MEMBERSHIP_CANCELED",
          metadata: { subscriptionId: subscription.paypalSubscriptionId, reason: "refund_guarantee" },
        },
      }),
    ]);
    return NextResponse.json({ ok: true, deadline: new Date(deadline).toISOString() });
  } catch {
    return NextResponse.json({ error: "We could not process your refund request right now. Please try again shortly." }, { status: 500 });
  }
}
