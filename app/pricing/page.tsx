import { Check, Heart, LockKeyhole, ShieldCheck, Sparkles, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
import { SubscribeButton } from "@/components/subscribe-button";
import { PricingMembershipStatus } from "@/components/pricing-membership-status";
import { plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Dreamayla Membership — A Deeper Dream Practice",
  description: "Continue your private dream practice with ancient symbolism, Jungian-inspired perspectives, Ayla Personal Insight, and long-term pattern discovery.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Dreamayla Membership — Symbol, Psyche & Self | DreamAyla",
    description: "A premium dream practice through ancient wisdom, Jungian-inspired psychology, and personal insight.",
    url: "/pricing",
  },
};

const free = [
  "One complete dream interpretation",
  "Explore meaningful dream symbols",
  "Ancient symbolic wisdom perspective",
  "Jungian-inspired psychological perspective",
  "Personal reflection insights",
];

const assurances = [
  [ShieldCheck, "Secure payment", "Protected checkout through PayPal."],
  [LockKeyhole, "Private by design", "Your dream history stays in your account."],
  [Heart, "Three-day guarantee", "One full refund is available per account within three days of the first payment."],
  [Star, "Guided by your history", "Your saved dreams make every report richer."],
] as const;

const planCopy = {
  journal: {
    subtitle: "Build Your Private Dream Practice",
    description: "Keep the dreams that matter and uncover the symbols, emotions, and life themes that return over time.",
  },
  plus: {
    subtitle: "The Complete Dreamayla Experience",
    description: "Go beyond individual readings with deeper three-lens interpretations, Ayla guidance, and long-term insight into your inner world.",
  },
} as const;

export default function Pricing() {
  return <><Header /><main className="page shell pricing-page">
    <div className="pagehead">
      <div className="eyebrow">A PRIVATE PRACTICE FOR YOUR INNER WORLD</div>
      <h1>Choose how deeply<br />you want to listen.</h1>
      <p className="sectionintro">Begin with one meaningful reading or build a lasting practice around the symbols, emotions, and patterns your dreams keep returning to.</p>
    </div>

    <PricingMembershipStatus />

    <section className="pricing-assurances" aria-label="Membership assurances">
      {assurances.map(([Icon, title, copy]) => <article className="pricing-assurance" key={title}><Icon size={30} /><h3>{title}</h3><p>{copy}</p></article>)}
    </section>

    <section className="grid pricing-grid">
      <article className="card pricing-card">
        <div className="plan-card-head"><div><span className="plan-kicker">A MEANINGFUL FIRST LOOK</span><h3>First Dream</h3></div></div>
        <h2 className="price">Free</h2>
        <p>Experience the DreamAyla Three-Lens Method with one complete personal interpretation.</p>
        <ul className="featurelist">{free.map((item) => <li key={item}><Check size={15} className="icon" />{item}</li>)}</ul>
        <div className="plan-actions"><Link className="button" href="/dream-interpreter">Interpret My Dream</Link></div>
      </article>

      {(Object.entries(plans) as [keyof typeof plans, typeof plans[keyof typeof plans]][]).map(([key, plan]) => <article className={`card pricing-card ${key === "journal" ? "highlight" : "premium-card"}`} key={key}>
        <div className="plan-card-head">
          <div><span className="plan-kicker">{planCopy[key].subtitle}</span><h3>{plan.name}</h3></div>
          {key === "journal" && <span className="badge plan-badge">MOST CHOSEN</span>}
        </div>
        <h2 className="price">{plan.price}</h2>
        <p>Per month · {plan.reports}</p>
        <p className="plan-summary">{planCopy[key].description}</p>
        {key === "plus" && <div className="premium-service"><Sparkles size={16} /><div><b>Ayla Dream Guide</b><span>Your personal dream guide, combining symbolic traditions, psychological insights, and your unique dream journey.</span></div></div>}
        <ul className="featurelist">{plan.features.map((item) => <li key={item}><Check size={15} className="icon" />{item}</li>)}</ul>
        <div className="plan-actions"><SubscribeButton plan={key} label={key === "plus" ? "Unlock Dreamayla Premium" : "Start Dream Journal"} /></div>
      </article>)}
    </section>

    <section className="pricing-closer">
      <div className="eyebrow">YOUR DREAMS BECOME MORE MEANINGFUL TOGETHER</div>
      <h2>One dream can illuminate a moment.<br /><em>Your history can reveal the pattern.</em></h2>
      <p>Dream Journal preserves the symbols and turning points that matter. Dreamayla Premium brings them together through unlimited three-lens readings, Ayla Dream Guide, and access to personal consultation.</p>
      <Link className="button" href="/dream-interpreter"><Sparkles size={16} /> Interpret My Dream</Link>
      <div className="pricing-closer-meta"><span><Heart size={15} /> Three-day full refund guarantee</span><span><LockKeyhole size={15} /> Secure PayPal checkout</span><span><Sparkles size={15} /> Instant access after confirmation</span></div>
      <small>By subscribing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</small>
    </section>

    <section className="section report">
      <div className="card"><h3>How membership works</h3><p>Sign in before subscribing. PayPal handles checkout securely. Once payment is confirmed, your account receives the reports, personal insight services, and features included in your membership. Billing and renewal information remain available in your account.</p></div>
      <div className="faq"><h3>One-on-One Dream Consultation</h3><p>Dreamayla Premium includes access to request a personalized exploration of the dreams and inner experiences that matter most to you. Consultation availability and follow-up are managed through your membership.</p></div>
      <div className="faq"><h3>Can I cancel?</h3><p>Yes. You can manage your plan and renewal through your PayPal subscription and your DreamAyla billing page.</p></div>
      <div className="faq"><h3>What is the three-day guarantee?</h3><p>If your first membership is not the right fit, your account may request one full refund within three days of the first successful payment. A refund immediately ends membership access and cancels renewal. After three days, you can still cancel future renewal at any time, but prior payments are not refundable.</p></div>
    </section>
  </main><Footer /></>;
}
