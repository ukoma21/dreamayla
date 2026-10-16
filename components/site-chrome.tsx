"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";

const navigation = [
  ["Explore", "/tools"],
  ["How it Works", "/how-it-works"],
  ["Pricing", "/pricing"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = usePathname();
  const { t } = useLocale();

  useEffect(() => {
    let cancelled = false;
    const readAccount = async () => {
      try {
        const session = await getBrowserSession();
        if (cancelled) return;
        setSignedIn(Boolean(session));
        if (!session) { setIsAdmin(false); return; }
        const response = await fetch("/api/admin/session", { headers: { Authorization: "Bearer " + session.access_token } });
        const data = await response.json() as { isAdmin?: boolean };
        if (cancelled) return;
        setIsAdmin(Boolean(data.isAdmin));
      } catch {
        if (cancelled) return;
        setSignedIn(false);
        setIsAdmin(false);
      }
    };
    void readAccount();
    const { data: { subscription } } = supabaseBrowser().auth.onAuthStateChange(() => void readAccount());
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const accountLinks = isAdmin ? [...navigation, ["Admin", "/admin"] as const] : navigation;
  const ctaHref = signedIn ? "/dashboard" : "/login";
  const ctaLabel = signedIn ? "My dashboard" : t("start");
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabaseBrowser().auth.signOut();
    } finally {
      setSignedIn(false);
      setIsAdmin(false);
      window.location.assign("/");
    }
  };

  return <header className="site-header">
    <nav className="nav shell">
      <Link className="brand" href="/"><img className="brand-logo" src="/dreamayla-brand.svg" alt="DreamAyla" /></Link>
      <div className="desktop-links">
        <div className="desktop-nav-links">
          <div className="nav-dropdown">
            <Link href="/dream-dictionary" className={`nav-dropdown-trigger ${isActive("/dream-library") || isActive("/dream-dictionary") || isActive("/common-dreams") ? "nav-active" : ""}`}>Dream Dictionary <span aria-hidden="true">⌄</span></Link>
            <div className="nav-dropdown-panel"><div className="nav-dropdown-menu"><Link href="/dream-library" className={isActive("/dream-library") ? "nav-active" : ""}>Dream Library</Link><Link href="/common-dreams" className={isActive("/common-dreams") ? "nav-active" : ""}>Common Dreams</Link></div></div>
          </div>
          {accountLinks.map(([label, href]) => <Link href={href} key={href} className={isActive(href) ? "nav-active" : ""}>{label}</Link>)}
        </div>
        <div className="account-dropdown">
          <Link className="button nav-cta" href={ctaHref}>{ctaLabel}</Link>
          {signedIn && <div className="account-dropdown-panel"><div className="account-dropdown-menu"><button className="nav-signout" type="button" disabled={signingOut} onClick={() => void signOut()}>{signingOut ? "Signing out…" : "Sign out"}</button></div></div>}
        </div>
      </div>
      <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
    </nav>
    {open && <div className="mobile-menu shell"><Link href="/dream-dictionary" className={isActive("/dream-dictionary") ? "mobile-nav-active" : ""} onClick={() => setOpen(false)}>Dream Dictionary</Link><Link href="/dream-library" className={`mobile-subnav ${isActive("/dream-library") ? "mobile-nav-active" : ""}`} onClick={() => setOpen(false)}>Dream Library</Link><Link href="/common-dreams" className={`mobile-subnav ${isActive("/common-dreams") ? "mobile-nav-active" : ""}`} onClick={() => setOpen(false)}>Common Dreams</Link>{accountLinks.map(([label, href]) => <Link href={href} className={isActive(href) ? "mobile-nav-active" : ""} onClick={() => setOpen(false)} key={href}>{label}</Link>)}<Link className="button" href={ctaHref} onClick={() => setOpen(false)}>{ctaLabel}</Link>{signedIn && <button className="nav-signout mobile-signout" type="button" disabled={signingOut} onClick={() => void signOut()}>{signingOut ? "Signing out…" : "Sign out"}</button>}</div>}
  </header>;
}

export function Footer() {
  return <footer className="footer">
    <div className="shell footer-invitation"><div><span><Sparkles size={14} /> SYMBOL · PSYCHE · SELF</span><h2>Begin with the detail that stayed.</h2><p>Your first complete interpretation through the DreamAyla Method is free.</p></div><Link href="/dream-interpreter" className="button footer-invitation-cta">Interpret My Dream <ArrowRight size={16} /></Link></div>
    <div className="shell footer-main"><div className="footer-brand"><Link className="brand" href="/"><img className="brand-logo" src="/dreamayla-brand.svg" alt="DreamAyla" /></Link><p>Where ancient symbolic wisdom, Jungian-inspired psychology, and your inner world meet.</p><span>Private by design · First complete reading free</span></div><div className="footer-column"><b>Explore</b><Link href="/dream-interpreter">Dream Interpretation</Link><Link href="/dream-dictionary">Dream Dictionary</Link><Link href="/dream-library">Dream Library</Link><Link href="/common-dreams">Common Dreams</Link></div><div className="footer-column"><b>Your practice</b><Link href="/dream-journal">Dream Journal</Link><Link href="/dream-patterns">Dream Patterns</Link><Link href="/dream-dna">Dream DNA</Link><Link href="/dream-coach">Ayla Dream Guide</Link></div><div className="footer-column"><b>More from DreamAyla</b><Link href="/tools">Meaningful Names</Link><Link href="/pricing">Membership</Link><Link href="/about">Our Method</Link><Link href="/privacy">Privacy</Link></div></div>
    <div className="shell footer-bottom"><span>© {new Date().getFullYear()} DreamAyla</span><span>Dream interpretation is for reflection and entertainment, not prediction or diagnosis.</span></div>
  </footer>;
}
