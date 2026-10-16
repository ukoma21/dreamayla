"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing your secure sign-in…");

  useEffect(() => {
    void (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const requestedNext = params.get("next");
      const next = requestedNext && /^\/(?![\\/])/.test(requestedNext) ? requestedNext : "/dashboard";
      const providerError = params.get("error_description") || params.get("error");
      if (providerError) {
        setMessage("This confirmation link could not be completed. Please request a new one or sign in again.");
        return;
      }
      const supabase = supabaseBrowser();
      let accessToken = "";
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error || !data.session) {
          setMessage(error?.message || "This confirmation link is incomplete or has expired. Please request a new verification email.");
          return;
        }
        accessToken = data.session.access_token;
      } else if (params.get("token_hash")) {
        // Supports Supabase email templates that use a token-hash confirmation
        // link as well as the newer PKCE `code` URL format.
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: params.get("token_hash")!,
          type: params.get("type") === "recovery" ? "recovery" : "signup",
        });
        if (error || !data.session) {
          setMessage(error?.message || "This confirmation link is incomplete or has expired. Please request a new verification email.");
          return;
        }
        accessToken = data.session.access_token;
      } else {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          setMessage(error?.message || "This confirmation link is incomplete or has expired. Please request a new verification email.");
          return;
        }
        accessToken = data.session.access_token;
      }
      // Account setup does not need to delay the confirmation redirect. Using
      // keepalive lets the request finish after this tab changes page.
      void fetch("/api/account/ensure", { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, keepalive: true });
      window.location.replace(next);
    })();
  }, []);

  return <main className="page shell auth-callback"><div className="card"><div className="eyebrow">DREAMAYLA ACCOUNT</div><h1>{message}</h1><p className="notice">This page securely completes Google sign-in and email confirmation.</p></div></main>;
}
