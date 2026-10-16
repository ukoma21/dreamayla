"use client";

import Link from "next/link";
import { Chrome } from "lucide-react";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleAvailable, setGoogleAvailable] = useState<boolean | null>(null);
  const signup = mode === "signup";

  useEffect(() => {
    if (signup) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirmed") === "1") setMessage("Your email is confirmed. Sign in to continue to your dashboard.");
    if (params.get("reset") === "1") setMessage("Your password has been updated. Sign in to continue.");
  }, [signup]);

  useEffect(() => {
    void (async () => {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return setGoogleAvailable(false);
        const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } });
        const settings = await response.json() as { external?: { google?: boolean } };
        setGoogleAvailable(Boolean(settings.external?.google));
      } catch {
        setGoogleAvailable(false);
      }
    })();
  }, []);

  function requestedNext() {
    const next = new URLSearchParams(window.location.search).get("next");
    return next && /^\/(?![\\/])/.test(next) ? next : "/dashboard";
  }

  function emailConfirmationRedirect() {
    const redirect = new URL("/auth/callback", window.location.origin);
    redirect.searchParams.set("next", requestedNext());
    return redirect.toString();
  }

  async function finishSession(accessToken: string) {
    // Do not hold the user on the sign-in screen for a database upsert. The
    // request is kept alive while the destination begins loading.
    void fetch("/api/account/ensure", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, keepalive: true });
    window.location.replace(requestedNext());
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const supabase = supabaseBrowser();
      const result = signup
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: emailConfirmationRedirect() } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) {
        window.location.assign(`/verify-email?email=${encodeURIComponent(email)}&next=${encodeURIComponent(requestedNext())}`);
        return;
      }
      if (result.data.session) await finishSession(result.data.session.access_token);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function continueWithGoogle() {
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabaseBrowser().auth.signInWithOAuth({ provider: "google", options: { redirectTo: emailConfirmationRedirect() } });
      if (error) throw error;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Google sign-in is not available yet.");
      setBusy(false);
    }
  }

  return <form className="card formcard auth-form" onSubmit={submit}>
    <div className="eyebrow">{signup ? "CREATE YOUR PRIVATE SPACE" : "WELCOME BACK"}</div>
    <h1>{signup ? "Begin your DreamAyla account" : "Continue your dream journey"}</h1>
    <p className="notice">{signup ? "Use an email address you can open now. We will send one secure verification link before activating your account." : "Sign in to view saved dreams, membership status, billing, and renewal details."}</p>
    {googleAvailable && <><button className="button google-button" disabled={busy} type="button" onClick={continueWithGoogle}><Chrome size={17} /> Continue with Google</button><div className="auth-divider"><span>or use email</span></div></>}
    <label className="field">Email address</label><input className="input" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
    <label className="field">Password</label><input className="input" required minLength={8} autoComplete={signup ? "new-password" : "current-password"} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
    <div className="auth-actions"><button className="button" disabled={busy} type="submit">{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button></div>
    {message && <p className="auth-message" role="status">{message}</p>}
    {signup && <p className="notice" style={{ marginTop: 16 }}>After signup, open the secure verification link in your email. It will return you to the page you were using.</p>}
    <p className="notice auth-switch">{signup ? <Link href="/login">Already have an account? Sign in</Link> : <><Link href="/forgot-password">Forgot your password?</Link><br />New to DreamAyla? <Link href="/signup">Create an account</Link></>}</p>
  </form>;
}
