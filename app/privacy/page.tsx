import { Check, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";
export const metadata: Metadata = { title: "Privacy: Your Dream Journal Is Private", description: "See how DreamAyla keeps saved dream entries private, account-based, and separate from public content.", alternates: { canonical: "/privacy" } };

const commitments = [
  [EyeOff, "Your dream text is not public", "Saved dreams are tied to your account and are not listed in a public feed or shared dream collection."],
  [LockKeyhole, "Access is account-based", "Private routes verify the signed-in user before returning journals, reports, billing, or pattern data."],
  [ShieldCheck, "We keep the product focused", "Analytics should measure product use without sending the full text of your private dream to third-party tracking."],
] as const;

const checklist = ["Dreams and reports are private by default", "You can choose what to save after a reflection", "Payment details are handled by the payment provider", "Dream interpretation is not medical or psychological diagnosis"];

export default function Privacy() {
  return <><Header /><main className="page shell privacy-page">
    <section className="privacy-hero"><div className="eyebrow">YOUR SPACE, YOUR CHOICE</div><h1>Privacy that lets you think freely.</h1><p className="lead">Dreams can be personal. DreamAyla is designed to keep your stories inside your account while giving you control over what you save and revisit.</p><div className="privacy-updated">Last updated · September 2026</div></section>
    <section className="privacy-commitments"><div className="section-heading"><span className="eyebrow">OUR COMMITMENTS</span><h2>Clear boundaries for intimate content.</h2></div><div className="privacy-card-grid">{commitments.map(([Icon, title, copy]) => <article className="card privacy-card" key={title}><div className="privacy-icon"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="privacy-details card"><div><span className="eyebrow">AT A GLANCE</span><h2>What this means for you</h2><p>We use the information needed to provide your account, dream reports, membership access, and support. Please do not enter information you would not want used to provide your selected interpretation service.</p></div><ul>{checklist.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul></section>
    <section className="privacy-note"><h2>A note about interpretation</h2><p>Dream interpretations are offered as perspectives for reflection. They can be incomplete or wrong, and they should not be used as medical, mental-health, legal, or financial advice. If a dream leaves you distressed, consider speaking with a qualified professional you trust.</p></section>
  </main><Footer /></>;
}
