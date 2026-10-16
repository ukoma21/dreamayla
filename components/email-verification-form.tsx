"use client";

import Link from "next/link";
import { ArrowUpRight, MailCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";

function emailConfirmationRedirect() {
  const next = new URLSearchParams(window.location.search).get("next");
  const path = next && /^\/(?![\\/])/.test(next) ? next : "/dashboard";
  const redirect = new URL("/auth/callback", window.location.origin);
  redirect.searchParams.set("next", path);
  return redirect.toString();
}

export function EmailVerificationForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("email");
    if (fromQuery) setEmail(fromQuery);
  }, []);

  useEffect(() => {
    let redirected = false;
    const next = new URLSearchParams(window.location.search).get("next");
    const destination = next && /^\/(?![\\/])/.test(next) ? next : "/dashboard";
    const completeInThisTab = async () => {
      if (redirected) return;
      const session = await getBrowserSession();
      if (!session) return;
      redirected = true;
      void fetch("/api/account/ensure", { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` }, keepalive: true });
      window.location.replace(destination);
    };
    void completeInThisTab();
    const { data: { subscription } } = supabaseBrowser().auth.onAuthStateChange((_event, session) => {
      if (session) void completeInThisTab();
    });
    const onFocus = () => { void completeInThisTab(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    const interval = window.setInterval(() => { void completeInThisTab(); }, 1500);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      window.clearInterval(interval);
    };
  }, []);

  async function resend() {
    if (!email) {
      setMessage("Enter your email address before requesting a new verification email.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabaseBrowser().auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: emailConfirmationRedirect() },
      });
      if (error) throw error;
      setMessage("A fresh verification email is on its way. Check spam or promotions folders too.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to resend the verification email.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="card formcard auth-form verification-form">
    <MailCheck className="verification-icon" size={27} aria-hidden="true" />
    <div className="eyebrow">VERIFY YOUR EMAIL</div>
    <h1>Check your inbox.</h1>
    <p className="notice">We sent a secure verification link to <b>{email || "your email address"}</b>. Open the email and select <b>Confirm your account</b>; we will sign you in and return you to the page where you started.</p>
    <div className="verification-next"><MailCheck size={19} /><span>1. Open the message from DreamAyla<br />2. Select the confirmation link<br />3. Continue where you left off</span></div>
    <label className="field" htmlFor="verification-email">Wrong email address?</label>
    <input id="verification-email" className="input" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
    <div className="auth-actions">
      <button className="button secondary" disabled={busy} type="button" onClick={resend}><RefreshCw size={16} />{busy ? "Sending…" : "Resend verification email"}</button>
      <Link className="text-link verification-login" href="/login">Already verified? Sign in <ArrowUpRight size={15} /></Link>
    </div>
    {message && <p className="auth-message" role="status">{message}</p>}
  </section>;
}
