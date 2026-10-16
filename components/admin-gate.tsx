"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { getBrowserSession } from "@/lib/supabase/client";

type GateState = "loading" | "signed-out" | "forbidden" | "allowed";

export function AdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) return setState("signed-out");
        const response = await fetch("/api/admin/session", { headers: { Authorization: `Bearer ${session.access_token}` } });
        const data = await response.json() as { isAdmin?: boolean };
        setState(data.isAdmin ? "allowed" : "forbidden");
      } catch {
        setState("signed-out");
      }
    })();
  }, []);

  if (state === "allowed") return <>{children}</>;

  return <main className="page shell admin-gate-page">
    <section className="card admin-gate-card">
      {state === "loading" ? <><ShieldCheck size={25} /><div><span className="eyebrow">ADMIN CONSOLE</span><h1>Checking secure access…</h1><p className="notice">Your account is being verified.</p></div></> : <><LockKeyhole size={25} /><div><span className="eyebrow">ADMIN CONSOLE</span><h1>{state === "signed-out" ? "Sign in to continue" : "This account is not an administrator"}</h1><p className="notice">{state === "signed-out" ? "Use the approved administrator email, then return here to manage members, orders, subscriptions, and public content." : "Your personal dashboard remains available. Administrator access is limited to the owner email configured for DreamAyla."}</p><div className="plan-actions"><Link className="button" href={state === "signed-out" ? "/login?next=/admin" : "/dashboard"}>{state === "signed-out" ? "Sign in" : "Open my dashboard"}</Link><Link className="button secondary" href="/">Back to DreamAyla</Link></div></div></>}
    </section>
  </main>;
}
