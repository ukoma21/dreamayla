import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin";

export async function GET(request: Request) {
  if (!await adminFromRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const [subscriptions, payments] = await Promise.all([
      prisma.subscription.findMany({
        include: { user: { select: { email: true, createdAt: true } } },
        orderBy: { currentPeriodEnd: "desc" },
        take: 25,
      }),
      prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    ]);

    const memberIds = [...new Set(payments.map((payment) => payment.userId).filter(Boolean))] as string[];
    const members = memberIds.length
      ? await prisma.user.findMany({ where: { id: { in: memberIds } }, select: { id: true, email: true } })
      : [];
    const emailById = new Map(members.map((member) => [member.id, member.email]));

    return NextResponse.json({
      subscriptions: subscriptions.map((subscription) => ({
        id: subscription.id,
        email: subscription.user.email,
        plan: subscription.billingPlan ?? subscription.plan,
        status: subscription.status,
        renewsOn: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        joinedAt: subscription.user.createdAt,
      })),
      payments: payments.map((payment) => ({
        id: payment.id,
        email: payment.userId ? emailById.get(payment.userId) ?? "Member" : "Unmatched payment",
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
      })),
    });
  } catch {
    return NextResponse.json({
      subscriptions: [],
      payments: [],
      dataSourceUnavailable: true,
    });
  }
}
