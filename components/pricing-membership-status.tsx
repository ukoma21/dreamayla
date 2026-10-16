"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useMembership } from "@/components/membership-provider";

export function PricingMembershipStatus() {
  const membership = useMembership();
  if (membership.loading || !membership.signedIn || membership.status !== "ACTIVE") return null;
  const name = membership.billingPlan === "plus" ? "Dreamayla Premium" : "Dream Journal";
  return <section className="pricing-current-plan" aria-live="polite">
    <div className="pricing-current-icon">{membership.billingPlan === "plus" ? <Sparkles size={22} /> : <Check size={22} />}</div>
    <div><span className="eyebrow">YOUR CURRENT MEMBERSHIP</span><h2>{name} is active</h2><p>Your included features are unlocked across DreamAyla. You will not be asked to subscribe again.</p></div>
    <Link className="button secondary" href="/billing">View membership</Link>
  </section>;
}
