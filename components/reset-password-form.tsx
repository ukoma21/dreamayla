"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getBrowserSession().then((session) => setReady(Boolean(session))).catch(() => setReady(false));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setMessage("Choose a password with at least 8 characters.");
    if (password !== confirmPassword) return setMessage("The two passwords do not match.");
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabaseBrowser().auth.updateUser({ password });
      if (error) throw error;
      await supabaseBrowser().auth.signOut();
      window.location.assign("/login?reset=1");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "This reset link is no longer valid. Request a new one and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="card formcard auth-form" onSubmit={submit}>
    <div className="eyebrow">ACCOUNT RECOVERY</div>
    <h1>Choose a new password</h1>
    <p className="notice">{ready ? "Set a new password for your DreamAyla account." : "Open the password reset link from your email to continue."}</p>
    <label className="field" htmlFor="new-password">New password</label>
    <input id="new-password" className="input" required minLength={8} disabled={!ready || busy} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
    <label className="field" htmlFor="confirm-password">Confirm new password</label>
    <input id="confirm-password" className="input" required minLength={8} disabled={!ready || busy} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your new password" />
    <div className="auth-actions"><button className="button" disabled={!ready || busy} type="submit">{busy ? "Updating password…" : "Save new password"}</button></div>
    {message && <p className="auth-message" role="status">{message}</p>}
    {!ready && <p className="notice auth-switch"><Link href="/forgot-password">Request a new reset link</Link></p>}
  </form>;
}
