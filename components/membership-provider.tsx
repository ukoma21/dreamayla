"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";

export type MembershipState = {
  loading: boolean;
  signedIn: boolean;
  allowed: boolean;
  plan: string;
  billingPlan: "journal" | "plus" | null;
  status: string;
};

const emptyMembership: MembershipState = {
  loading: true,
  signedIn: false,
  allowed: false,
  plan: "FREE",
  billingPlan: null,
  status: "INACTIVE",
};

type MembershipContextValue = MembershipState & {
  refreshMembership: () => Promise<MembershipState>;
};

const MembershipContext = createContext<MembershipContextValue | null>(null);
const storageKey = "dreamayla:membership";

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const [membership, setMembership] = useState<MembershipState>(emptyMembership);
  const membershipRef = useRef<MembershipState>(emptyMembership);
  const requestRef = useRef<Promise<MembershipState> | null>(null);

  const applyMembership = useCallback((next: MembershipState, broadcast = true) => {
    membershipRef.current = next;
    setMembership(next);
    if (broadcast) {
      try { localStorage.setItem(storageKey, JSON.stringify({ ...next, loading: false, updatedAt: Date.now() })); } catch {}
    }
    window.dispatchEvent(new CustomEvent("dreamayla:membership-change", { detail: next }));
  }, []);

  const refreshMembership = useCallback(async () => {
    if (requestRef.current) return requestRef.current;
    const request = (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) {
          const next = { ...emptyMembership, loading: false };
          applyMembership(next);
          return next;
        }
        const response = await fetch("/api/account/entitlement", {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({})) as Partial<MembershipState>;
        const next: MembershipState = {
          loading: false,
          signedIn: response.status === 401 ? false : data.signedIn !== false,
          allowed: response.ok && Boolean(data.allowed),
          plan: data.plan || "FREE",
          billingPlan: data.billingPlan === "journal" || data.billingPlan === "plus" ? data.billingPlan : null,
          status: data.status || "INACTIVE",
        };
        applyMembership(next);
        return next;
      } catch {
        setMembership((current) => ({ ...current, loading: false }));
        return { ...membershipRef.current, loading: false };
      } finally {
        requestRef.current = null;
      }
    })();
    requestRef.current = request;
    return request;
  }, [applyMembership]);

  useEffect(() => {
    let stopped = false;
    try {
      const cached = JSON.parse(localStorage.getItem(storageKey) || "null") as (MembershipState & { updatedAt?: number }) | null;
      if (cached?.updatedAt && Date.now() - cached.updatedAt < 60_000) setMembership({ ...cached, loading: true });
    } catch {}
    void refreshMembership();
    const refreshWhenVisible = () => { if (!stopped && document.visibilityState === "visible") void refreshMembership(); };
    const receiveCrossTabUpdate = (event: StorageEvent) => {
      if (event.key !== storageKey || !event.newValue) return;
      try { applyMembership({ ...JSON.parse(event.newValue), loading: false } as MembershipState, false); } catch {}
    };
    const interval = window.setInterval(refreshWhenVisible, 15_000);
    window.addEventListener("focus", refreshWhenVisible);
    window.addEventListener("storage", receiveCrossTabUpdate);
    const { data: { subscription } } = supabaseBrowser().auth.onAuthStateChange(() => void refreshMembership());
    return () => {
      stopped = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      window.removeEventListener("storage", receiveCrossTabUpdate);
      subscription.unsubscribe();
    };
  }, [applyMembership, refreshMembership]);

  return <MembershipContext.Provider value={{ ...membership, refreshMembership }}>{children}</MembershipContext.Provider>;
}

export function useMembership() {
  const value = useContext(MembershipContext);
  if (!value) throw new Error("MembershipProvider is required");
  return value;
}
