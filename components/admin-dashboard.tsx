"use client";

import { useEffect, useState } from "react";
import { Activity, BadgeDollarSign, FileText, Sparkles, UsersRound } from "lucide-react";
import { getBrowserSession } from "@/lib/supabase/client";

type Metrics = {
  users: number;
  dreams: number;
  dreamsToday: number;
  premium: number;
  aiCallsToday: number;
  dataSourceUnavailable?: boolean;
};

const metricDefinitions = [
  { key: "users", label: "Total members", helper: "Verified accounts", icon: UsersRound },
  { key: "premium", label: "Active memberships", helper: "Paid plan access", icon: BadgeDollarSign },
  { key: "dreams", label: "Dreams recorded", helper: "Private reports saved", icon: FileText },
  { key: "dreamsToday", label: "Dreams today", helper: "New reports since midnight", icon: Sparkles },
  { key: "aiCallsToday", label: "Interpretations today", helper: "Interpretation activity", icon: Activity },
] as const;

export function AdminDashboard() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) throw new Error("Please sign in with an administrator account.");
        const response = await fetch("/api/admin/metrics", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!response.ok) throw new Error(response.status === 403 ? "This account is not an administrator." : "Unable to load metrics.");
        setData((await response.json()) as Metrics);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load metrics.");
      }
    })();
  }, []);

  if (error) return <div className="card admin-metrics-message">{error}</div>;
  if (!data) return <div className="card admin-metrics-message">Loading private operational metrics…</div>;

  return <>
    {data.dataSourceUnavailable && <div className="card admin-metrics-message">The console is ready, but its live member and order data will appear only after the production database connection is added.</div>}
    <section className="admin-metrics" aria-label="Operational metrics">
      {metricDefinitions.map(({ key, label, helper, icon: Icon }) => <article className="card admin-metric-card" key={key}>
        <div className="admin-metric-icon"><Icon size={18} /></div>
        <span>{label}</span>
        <strong>{data.dataSourceUnavailable ? "—" : data[key]}</strong>
        <small>{helper}</small>
      </article>)}
    </section>
  </>;
}
