import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title:"Terms of Use and Membership",
  description:"Read the DreamAyla terms for dream interpretation, memberships, PayPal billing, cancellation, and the three-day satisfaction guarantee.",
  alternates:{canonical:"/terms"},
};

export default function Terms() {
  return <><Header /><main className="page shell report terms-page">
    <div className="pagehead"><span className="eyebrow">DREAMAYLA TERMS</span><h1>Terms for a thoughtful practice</h1><p className="sectionintro">Dreamayla is a space for personal reflection through dream symbolism and psychological perspectives. It is not a medical, mental-health, legal, financial, or future-prediction service.</p></div>
    <div className="terms-grid">
      <section className="card"><h2>Membership and billing</h2><p>Paid memberships renew through PayPal until you cancel. Your billing page shows the plan, renewal information, and payment receipts connected to your account.</p></section>
      <section className="card"><h2>Three-day satisfaction guarantee</h2><p>For a new membership, each account may request one full refund within three days of the first successful membership payment if the experience is not right for you. A successful refund request immediately ends membership access and cancels renewal. PayPal may take additional time to finalize the refund in your payment account.</p></section>
      <section className="card"><h2>After the guarantee period</h2><p>After three days, you may still cancel future renewal from your billing page at any time. Payments made after the three-day guarantee window are not refundable.</p></section>
      <section className="card"><h2>Using Dreamayla</h2><p>Please use your account responsibly and keep your sign-in details private. Dream interpretations are subjective prompts for reflection, not diagnoses, treatment, or professional advice.</p></section>
    </div>
  </main><Footer /></>;
}
