"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, LockKeyhole, MessageCircleHeart } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";
import { useMembership } from "@/components/membership-provider";

type CoachMessage = { id: string; sender: "member" | "admin" | "ayla"; body: string; createdAt: string };

export default function DreamCoachPage() {
  const membership = useMembership();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [hasAylaAccess, setHasAylaAccess] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        setSignedIn(Boolean(session));
        setAccessToken(session?.access_token ?? null);
        if (!session) { setHasAylaAccess(false); return; }
        const current = await membership.refreshMembership();
        const allowed = current.status === "ACTIVE" && current.billingPlan === "plus";
        setHasAylaAccess(allowed);
        if (allowed) {
          const historyResponse = await fetch("/api/coach", { headers: { Authorization: `Bearer ${session.access_token}` } });
          const history = await historyResponse.json() as { messages?: CoachMessage[] };
          if (historyResponse.ok) setMessages(history.messages ?? []);
        }
      } catch {
        setSignedIn(false);
        setHasAylaAccess(false);
      }
    })();
  }, [membership.billingPlan, membership.status, membership.refreshMembership]);

  useEffect(() => {
    const pane = messagesRef.current;
    if (pane) pane.scrollTop = pane.scrollHeight;
  }, [messages.length]);

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (message.trim().length < 2) return;
    setBusy(true);
    setProgress("Ayla is reading your question…");
    setError("");
    try {
      if (!accessToken) throw new Error("Your sign-in session is still loading. Please try again in a moment.");
      const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ message }) });
      const data = await response.json() as { messages?: CoachMessage[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Ayla is unavailable right now.");
      setMessages(data.messages ?? []);
      setMessage("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Ayla is unavailable right now. Please try again.");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  return <><Header /><main className="page shell">
    <div className="pagehead"><div className="eyebrow">DREAMAYLA PREMIUM</div><h1>Meet Ayla, your personal dream guide.</h1><p className="sectionintro">Your personal dream guide, combining symbolic wisdom, psychological perspectives, and your unique dream history.</p></div>
    <section className="card formcard coach-workspace">
      <div className="tool-heading"><div className="tool-icon-wrap"><MessageCircleHeart size={25} /></div><div><div className="eyebrow">GROUNDED IN YOUR JOURNAL</div><h2>What would you like to understand?</h2><p className="notice">Try “Why do I keep dreaming about water?” or “Have my dreams changed recently?”</p></div></div>
      {hasAylaAccess ? <><div className="coach-conversation"><div className="consultation-messages" ref={messagesRef}>{messages.length ? messages.map((item) => <div className={`consultation-message ${item.sender}`} key={item.id}><b>{item.sender === "member" ? "You" : item.sender === "admin" ? "DreamAyla consultation team" : "Ayla"}</b><p>{item.body}</p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div>) : <div className="coach-empty">Your questions and Ayla&apos;s reflections will stay together here.</div>}</div></div><form onSubmit={ask}><label className="field" htmlFor="coach-question">Your question for Ayla</label><textarea id="coach-question" className="tool-input" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 1000))} placeholder="Ask about a recurring symbol, person, emotion, or situation…" /><div className="tool-helper"><span>{message.length}/1000 characters</span><span><LockKeyhole size={12} /> Only your saved dreams are used</span></div><button className="button tool-submit" type="submit" disabled={busy || message.trim().length < 2}>{busy ? "Exploring your patterns…" : "Ask Ayla"}<ArrowRight size={16} /></button>{progress && <p className="auth-message" role="status">{progress}</p>}</form></> : <div className="card" style={{ marginTop: 18 }}><span className="eyebrow">DREAMAYLA PREMIUM ACCESS</span><h3>Open a private conversation with Ayla.</h3><p className="notice">Ayla Dream Guide is available to Dreamayla Premium members and is grounded in the dreams you have chosen to save.</p><Link className="button" href={signedIn === false ? "/login" : "/pricing"}>{signedIn === false ? "Sign in to continue" : "Unlock Dreamayla Premium"}<ArrowRight size={16} /></Link></div>}
      {signedIn === false && <p className="notice" style={{ marginTop: 18 }}>Sign in to connect this conversation to your private dream history. <Link href="/login" className="text-link">Sign in <ArrowRight size={14} /></Link></p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </section>
    <section className="grid two" style={{ marginTop: 24 }}><article className="card"><span className="eyebrow">START WITH A QUESTION</span><h3>Look for what repeats</h3><p>Ask about a symbol, emotion, person, or place that appears more than once.</p></article><article className="card"><span className="eyebrow">ONE-ON-ONE CONSULTATION</span><h3>Request a personal reply</h3><p>For a question you would like a person to review, send a private consultation request and return for the response.</p>{hasAylaAccess ? <Link className="text-link" href="/consultations">Request consultation <ArrowRight size={14} /></Link> : <Link className="text-link" href={signedIn === false ? "/login?next=/consultations" : "/pricing"}>{signedIn === false ? "Sign in to continue" : "Explore Premium access"} <ArrowRight size={14} /></Link>}</article></section>
  </main><Footer /></>;
}
