"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CreditCard, MessageCircleHeart, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/site-chrome";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";
import { useMembership } from "@/components/membership-provider";

type Billing = {
  subscription: { plan: string; billingPlan?: string | null; status: string; currentPeriodEnd?: string | null; paypalSubscriptionId?: string | null; cancelAtPeriodEnd?: boolean } | null;
  payments: Array<{ id: string; paypalPaymentId?: string; amount: number; currency: string; status: string; createdAt: string }>;
  membershipEvents: Array<{ id: string; type: "MEMBERSHIP_CANCELED" | "REFUND_GUARANTEE_USED"; createdAt: string; metadata?: unknown }>;
  refundGuaranteeUsed?: boolean;
};

export default function Billing() {
  const membershipState = useMembership();
  const [email, setEmail] = useState("");
  const [data, setData] = useState<Billing | null>(null);
  const [message, setMessage] = useState("");
  const [canceling, setCanceling] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);

  useEffect(() => {
    let stopped=false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const waiting=new URLSearchParams(window.location.search).get("payment")==="pending";
    const load=async (attempt=0) => {
    try {
      const supabase = supabaseBrowser();
      const session = await getBrowserSession();
      if (!session) { setMessage("Sign in to view your billing and renewal details."); return; }
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || "");
      const response = await fetch("/api/billing", { headers: { Authorization: `Bearer ${session.access_token}` } });
      if (!response.ok) throw new Error("Your billing details are temporarily unavailable. Please try again shortly.");
      const billing=await response.json() as Billing;
      if(stopped)return;
      setData(billing);
      if(waiting){
        const returnedId=new URLSearchParams(window.location.search).get("subscription_id");
        const confirmed=billing.subscription?.status==="ACTIVE" && (!returnedId||billing.subscription.paypalSubscriptionId===returnedId) && billing.payments.some(payment=>payment.status==="COMPLETED");
        setPaymentPending(!confirmed);
        setMessage(confirmed?"Your payment is confirmed. Your membership is ready.":"We are waiting for PayPal to confirm your payment. Please do not pay again.");
        if(confirmed){
          await membershipState.refreshMembership();
          window.history.replaceState({}, "", "/billing");
        }
        if(!confirmed && attempt<20)timer=setTimeout(()=>{void load(attempt+1);},1500);
        else if(!confirmed)setMessage("Your payment confirmation is taking longer than usual. Return to this page shortly to check your membership. Please do not pay again.");
      }
    } catch {
      if(!stopped)setMessage("Your billing details are temporarily unavailable. Please try again shortly.");
    }
    };
    setPaymentPending(waiting);
    void load();
    return ()=>{stopped=true;if(timer)clearTimeout(timer);};
  }, [membershipState.refreshMembership]);

  const subscription = data?.subscription;
  const membership = subscription?.billingPlan ? `${subscription.billingPlan[0].toUpperCase()}${subscription.billingPlan.slice(1)} membership` : subscription?.plan;
  const isActive = subscription?.status === "ACTIVE";
  const hasAylaAccess = isActive && subscription?.billingPlan === "plus";
  const canCancel = isActive && Boolean(subscription?.paypalSubscriptionId);
  const firstCompletedPayment = data?.payments.find((payment) => payment.status === "COMPLETED");
  const refundDeadline = firstCompletedPayment ? new Date(new Date(firstCompletedPayment.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000) : null;
  const refundAvailable = !!subscription?.paypalSubscriptionId && isActive && !!refundDeadline && refundDeadline.getTime() > Date.now() && !data?.refundGuaranteeUsed;

  async function cancelMembership() {
    if (!subscription || !window.confirm("Cancel this PayPal membership? You will not be charged again. Your account will update after PayPal confirms the cancellation.")) return;
    setCanceling(true);
    setMessage("");
    try {
      const session = await getBrowserSession();
      if (!session) throw new Error("Please sign in again before managing your membership.");
      const response = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ reason: "Cancelled from the DreamAyla billing page" }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "PayPal could not cancel this membership.");
      setData((current) => current?.subscription ? { ...current, subscription: { ...current.subscription, status: "CANCELED", cancelAtPeriodEnd: false } } : current);
      await membershipState.refreshMembership();
      setMessage("Your membership has been cancelled. You will not be charged again.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not cancel this membership right now.");
    } finally {
      setCanceling(false);
    }
  }

  async function requestRefund() {
    if (!refundDeadline || !window.confirm("Request a full refund and cancel your membership? The guarantee applies within three days of your first successful payment.")) return;
    setRefunding(true);
    setMessage("");
    try {
      const session = await getBrowserSession();
      if (!session) throw new Error("Please sign in again before requesting a refund.");
      const response = await fetch("/api/paypal/request-refund", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "PayPal could not start your refund.");
      setData((current) => current ? {
        ...current,
        subscription: current.subscription ? { ...current.subscription, status: "CANCELED", cancelAtPeriodEnd: false } : current.subscription,
        payments: current.payments.map((payment) => payment.id === firstCompletedPayment?.id ? { ...payment, status: "REFUND_PENDING" } : payment),
      } : current);
      await membershipState.refreshMembership();
      setMessage("Your full refund request was sent to PayPal and your membership has been cancelled. PayPal will confirm the refund shortly.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not process your refund request right now.");
    } finally {
      setRefunding(false);
    }
  }

  return <><Header /><main className="page shell billing-page">
    {paymentPending && <div className="verification-next" role="status">Checking your PayPal confirmation. This page will update automatically.</div>}
    <div className="pagehead"><div className="eyebrow">ACCOUNT & BILLING</div><h1>Your membership</h1><p className="sectionintro">View your plan, renewal status, payment history, and the DreamAyla spaces included with your account.</p></div>
    <section className="card formcard"><span className="eyebrow">CURRENT PLAN</span><h2>{membership || "No active membership"}</h2><p className="notice">{email || "Loading your account…"}</p>{subscription && <div className="config-list"><div className="config-row"><span>Status</span><b>{subscription.status}</b></div><div className="config-row"><span>{subscription.cancelAtPeriodEnd ? "Access until" : "Membership valid until"}</span><b>{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : hasAylaAccess && !subscription.paypalSubscriptionId ? "Lifetime access" : "Managed by PayPal"}</b></div>{subscription.cancelAtPeriodEnd && <div className="config-row"><span>Renewal</span><b>Cancelled — no further charge</b></div>}</div>}{refundAvailable && <div className="refund-guarantee"><div><span className="eyebrow">THREE-DAY GUARANTEE</span><b>Not the right fit? Receive a full refund.</b><p>Request one full refund within three days of your first successful membership payment. Your membership will end immediately.</p></div><button className="button secondary" disabled={refunding} onClick={requestRefund}>{refunding ? "Contacting PayPal…" : "Request full refund"}</button></div>}<div className="plan-actions">{hasAylaAccess && <Link className="button" href="/dream-coach" prefetch><MessageCircleHeart size={16} /> Open Ayla Dream Guide</Link>}{hasAylaAccess && <Link className="button secondary" href="/consultations" prefetch>Request one-on-one consultation</Link>}{canCancel ? <button className="button secondary" disabled={canceling || refunding} onClick={cancelMembership}>{canceling ? "Contacting PayPal…" : "Cancel membership"}</button> : !isActive && <Link className="button" href="/pricing">{subscription ? "Renew membership" : "Choose a plan"}</Link>}<Link className="button secondary" href="/pricing">{subscription ? "Compare plans" : "View memberships"}</Link><Link className="button secondary" href="/dashboard">Back to dashboard</Link></div>{message && <p className="auth-message" role="status">{message}</p>}</section>
    <section className="dashboard-grid billing-access-grid"><article className="card dashboard-panel"><div className="panel-head"><div><span className="eyebrow">YOUR ACCESS</span><h2>Included with membership</h2></div><Sparkles size={20} /></div><p className="notice">{isActive ? "Your active plan keeps your DreamAyla reports, Studio Tools, and account history together." : "After your complimentary experience, membership unlocks the ongoing DreamAyla practice."}</p><div className="admin-quick-links"><Link href="/dream-interpreter">Dream reports</Link><Link href="/tools">Explore</Link><Link href="/dream-journal">Dream Journal</Link><Link href="/dream-coach">Dream Coach</Link></div></article><article className="card dashboard-panel"><div className="panel-head"><div><span className="eyebrow">PAYPAL</span><h2>Renewal and receipts</h2></div><CreditCard size={20} /></div><p className="notice">PayPal securely processes your recurring membership. Your receipt history, plan status, and renewal date are kept here once live payment confirmation is enabled.</p><Link className="text-link" href="/pricing">Review plan options →</Link></article></section>
    <section className="report payment-history"><div className="panel-head"><div><span className="eyebrow">PAYMENT HISTORY</span><h2>Receipts</h2><p className="notice">A clear record of your DreamAyla membership payments and membership changes.</p></div><BookOpen size={20} /></div><div className="receipt-list">{data?.membershipEvents?.map(event => {
      const eventDate = new Date(event.createdAt);
      const cancelled = event.type === "MEMBERSHIP_CANCELED";
      return <article className="receipt-card" key={`event-${event.id}`}><div className="receipt-topline"><div><span className="receipt-label">DREAMAYLA MEMBERSHIP</span><h3>{cancelled ? "Membership cancelled" : "Refund guarantee used"}</h3></div><strong>{cancelled ? "No further charge" : "Refund requested"}</strong></div><div className="receipt-details"><div><span>Status</span><b className="receipt-status">{cancelled ? "Cancelled" : "Refund pending"}</b></div><div><span>Recorded on</span><b>{eventDate.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</b></div><div><span>Payment method</span><b>PayPal membership</b></div></div></article>
    })}{data?.payments?.length ? data.payments.map(payment => {
      const paidAt=new Date(payment.createdAt);
      const reference=payment.paypalPaymentId ? `•••• ${payment.paypalPaymentId.slice(-8)}` : `•••• ${payment.id.slice(-8)}`;
      return <article className="receipt-card" key={payment.id}><div className="receipt-topline"><div><span className="receipt-label">DREAMAYLA MEMBERSHIP</span><h3>{membership || "Dreamayla membership"}</h3></div><strong>{payment.currency} {(payment.amount / 100).toFixed(2)}</strong></div><div className="receipt-details"><div><span>Payment status</span><b className={payment.status === "COMPLETED" ? "receipt-status complete" : "receipt-status"}>{payment.status === "COMPLETED" ? "Paid" : payment.status}</b></div><div><span>Payment date</span><b>{paidAt.toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</b></div><div><span>Payment method</span><b>PayPal recurring payment</b></div><div><span>Receipt reference</span><b>{reference}</b></div></div></article>
    }) : !data?.membershipEvents?.length && <div className="card receipt-empty"><p className="notice">Payment receipts will appear here after PayPal confirms your membership.</p></div>}</div></section>
  </main><Footer /></>;
}
