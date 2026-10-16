"use client";

import { useEffect, useState } from "react";
import { ReceiptText, UsersRound } from "lucide-react";
import { getBrowserSession } from "@/lib/supabase/client";

type Subscription = { id: string; email: string; plan: string; status: string; renewsOn?: string | null; cancelAtPeriodEnd: boolean; joinedAt: string };
type Payment = { id: string; email: string; amount: number; currency: string; status: string; createdAt: string };
type OrderData = { subscriptions: Subscription[]; payments: Payment[]; dataSourceUnavailable?: boolean };

function formatPlan(plan: string) {
  return plan.replace(/(^|[-_ ])\w/g, (part) => part.toUpperCase());
}

export function AdminOrders() {
  const [data, setData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) throw new Error("Please sign in with the administrator account.");
        const response = await fetch("/api/admin/orders", { headers: { Authorization: `Bearer ${session.access_token}` } });
        if (!response.ok) throw new Error(response.status === 403 ? "This account is not an administrator." : "Unable to load member orders.");
        setData(await response.json() as OrderData);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load member orders.");
      }
    })();
  }, []);

  return <section className="admin-orders-section">
    <div className="admin-section-heading"><div><span className="eyebrow">MEMBERS & REVENUE</span><h2>Orders and membership activity</h2></div><p>See plan status and successful PayPal payments without exposing private dream content.</p></div>
    {error && <div className="card admin-metrics-message">{error}</div>}
    {!error && !data && <div className="card admin-metrics-message">Loading orders and memberships…</div>}
    {data?.dataSourceUnavailable && <div className="card admin-metrics-message">The order database will appear here as soon as the production database is connected.</div>}
    {data && !data.dataSourceUnavailable && <div className="admin-order-grid">
      <article className="card admin-order-card"><div className="panel-head"><div><span className="eyebrow">ACTIVE & PAST MEMBERSHIPS</span><h3>Subscription ledger</h3></div><UsersRound size={20} /></div>{data.subscriptions.length ? <div className="admin-table">{data.subscriptions.map((subscription) => <div className="admin-table-row" key={subscription.id}><div><b>{subscription.email}</b><small>{formatPlan(subscription.plan)} · joined {new Date(subscription.joinedAt).toLocaleDateString()}</small></div><div className="admin-row-status"><span className={subscription.status === "ACTIVE" ? "status-ok" : "status-missing"}>{subscription.cancelAtPeriodEnd ? "Ending" : subscription.status}</span><small>{subscription.renewsOn ? `Renews ${new Date(subscription.renewsOn).toLocaleDateString()}` : "PayPal schedule pending"}</small></div></div>)}</div> : <p className="notice">No membership records yet. New PayPal confirmations will appear here automatically.</p>}</article>
      <article className="card admin-order-card"><div className="panel-head"><div><span className="eyebrow">SUCCESSFUL PAYMENTS</span><h3>Recent receipts</h3></div><ReceiptText size={20} /></div>{data.payments.length ? <div className="admin-table">{data.payments.map((payment) => <div className="admin-table-row" key={payment.id}><div><b>{payment.email}</b><small>{new Date(payment.createdAt).toLocaleDateString()} · {payment.status}</small></div><strong>{payment.currency} {(payment.amount / 100).toFixed(2)}</strong></div>)}</div> : <p className="notice">Confirmed PayPal receipts will appear here after the live webhook is enabled.</p>}</article>
    </div>}
  </section>;
}
