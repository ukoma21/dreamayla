"use client";

import Link from "next/link";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export function PasswordResetRequestForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const redirect = new URL("/auth/callback", window.location.origin);
      redirect.searchParams.set("next", "/reset-password");
      const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, { redirectTo: redirect.toString() });
      if (error) throw error;
      setMessage("If an account uses this email address, a password reset link is on its way. Open it in this browser to choose a new password.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not send a reset link right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="card formcard auth-form" onSubmit={submit}>
    <div className="eyebrow">ACCOUNT RECOVERY</div>
    <h1>Reset your password</h1>
    <p className="notice">Enter the email address connected to your DreamAyla account. We will send a secure link to set a new password.</p>
    <label className="field" htmlFor="reset-email">Email address</label>
    <input id="reset-email" className="input" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
    <div className="auth-actions"><button className="button" disabled={busy} type="submit">{busy ? "Sending link…" : "Send reset link"}</button></div>
    {message && <p className="auth-message" role="status">{message}</p>}
    <p className="notice auth-switch"><Link href="/login">Back to sign in</Link></p>
  </form>;
}
