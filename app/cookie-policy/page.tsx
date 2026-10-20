import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "@/components/cookie-consent";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Understand how DreamAyla uses essential storage and optional analytics, and manage your privacy choice.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return <><Header /><main className="page shell report legal-page">
    <div className="pagehead"><span className="eyebrow">YOUR PRIVACY CHOICES</span><h1>Cookie Policy</h1><p className="sectionintro">This policy explains the browser storage and similar technologies used on DreamAyla.</p><p className="legal-updated">Last updated: October 20, 2026</p></div>
    <div className="legal-grid">
      <section className="card"><h2>Essential storage</h2><p>DreamAyla uses essential browser storage and authentication technologies to keep you signed in, remember language and service choices, protect account routes, and manage access to features such as the free report. These functions are necessary for the service you request and cannot be disabled through our optional-cookie control.</p></section>
      <section className="card"><h2>Optional analytics</h2><p>If you accept optional cookies, DreamAyla loads Metricool audience analytics and Vercel Speed Insights. These services help us understand site visits, device and browser patterns, and page performance. They may process technical information such as IP address, browser, device, page URL, and timing data. They are not loaded through DreamAyla’s consent component before acceptance.</p></section>
      <section className="card"><h2>Advertising technology</h2><p>DreamAyla does not currently display Google AdSense advertising and does not currently load AdSense advertising cookies. If advertising is introduced, we will update this policy and our consent controls before enabling applicable advertising storage. Advertising providers may use cookies, web beacons, IP addresses, or similar technologies to serve, limit, and measure ads, subject to the choices and disclosures presented at that time.</p></section>
      <section className="card"><h2>Your choice</h2><p>You can accept or reject optional analytics in the banner. You can reopen the choice at any time with the button below or “Cookie settings” in the site footer. If you change an accepted choice to rejected, the page reloads to stop optional tools; you can also clear site data in your browser.</p><div className="cookie-policy-action"><CookieSettingsButton /></div></section>
      <section className="card"><h2>Browser controls</h2><p>Most browsers let you view, block, or delete cookies and site data. Blocking essential storage may prevent sign-in or other requested features from working correctly. Browser settings vary, so consult your browser’s help documentation.</p></section>
      <section className="card"><h2>Questions</h2><p>For questions about DreamAyla’s use of cookies or similar technologies, email <a href="mailto:linra612@gmail.com">linra612@gmail.com</a>. Also see our <Link href="/privacy">Privacy Policy</Link> for broader information about data processing.</p></section>
    </div>
  </main><Footer /></>;
}
