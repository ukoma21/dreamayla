import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Contact DreamAyla",
  description: "Contact DreamAyla for account, privacy, billing, editorial correction, or partnership questions.",
  alternates: { canonical: "/contact" },
};

const reasons = [
  ["Account and privacy", "Questions about your account, saved content, access, correction, or deletion."],
  ["Billing support", "Questions about membership, cancellation, a receipt, or an eligible refund request."],
  ["Editorial corrections", "Report an error, unclear claim, broken link, or accessibility issue in our public content."],
  ["Partnerships", "Relevant editorial, research, or brand partnership enquiries. We do not buy or exchange links."],
] as const;

export default function ContactPage() {
  return <><Header /><main className="page shell report legal-page">
    <div className="pagehead"><span className="eyebrow">CONTACT DREAMAYLA</span><h1>How can we help?</h1><p className="sectionintro">Email us with enough context to identify the issue, but do not include passwords, full payment details, or unnecessary sensitive information.</p></div>
    <section className="card contact-primary"><span className="eyebrow">EMAIL</span><h2><a href="mailto:linra612@gmail.com">linra612@gmail.com</a></h2><p>We review messages about DreamAyla accounts, billing, privacy, content, and relevant partnerships.</p></section>
    <div className="terms-grid">{reasons.map(([title, copy]) => <section className="card" key={title}><h2>{title}</h2><p>{copy}</p></section>)}</div>
    <section className="legal-note"><h2>Important safety note</h2><p>DreamAyla is not an emergency, medical, or mental-health service. If you or someone else may be in immediate danger, contact local emergency services or an appropriate qualified professional.</p></section>
  </main><Footer /></>;
}
