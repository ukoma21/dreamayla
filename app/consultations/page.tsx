"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, HeartHandshake, LockKeyhole, Send } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";
import { useMembership } from "@/components/membership-provider";

type Message = { id: string; sender: "member" | "admin"; body: string; createdAt: string };
type Consultation = { id: string; subject: string; messages: Message[]; createdAt: string; updatedAt: string };

export default function ConsultationsPage() {
  const membership = useMembership();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [threadReply, setThreadReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        setSignedIn(Boolean(session));
        setAccessToken(session?.access_token ?? null);
        if (!session) { setAllowed(false); return; }
        const current = await membership.refreshMembership();
        if (current.status !== "ACTIVE" || current.billingPlan !== "plus") { setAllowed(false); return; }
        const response = await fetch("/api/consultations", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
        if (response.status === 402) { setAllowed(false); return; }
        if (!response.ok) throw new Error("Unable to load your consultations.");
        const data = await response.json() as { consultations: Consultation[] };
        setAllowed(true);
        setConsultations(data.consultations);
        setSelectedId(data.consultations[0]?.id ?? "");
      } catch (error) {
        setAllowed(false);
        setNotice(error instanceof Error ? error.message : "Unable to load consultations right now.");
      }
    })();
  }, [membership.billingPlan, membership.status, membership.refreshMembership]);

  useEffect(() => {
    if (!accessToken || allowed !== true) return;
    let stopped = false;
    const refreshConversations = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/consultations", { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json() as { consultations: Consultation[] };
        if (stopped) return;
        setConsultations(data.consultations);
        setSelectedId((current) => data.consultations.some((item) => item.id === current) ? current : (data.consultations[0]?.id ?? ""));
      } catch {}
    };
    const interval = window.setInterval(() => void refreshConversations(), 5000);
    const refreshVisible = () => { if (document.visibilityState === "visible") void refreshConversations(); };
    document.addEventListener("visibilitychange", refreshVisible);
    return () => { stopped = true; window.clearInterval(interval); document.removeEventListener("visibilitychange", refreshVisible); };
  }, [accessToken, allowed]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (message.trim().length < 10) return;
    setBusy(true);
    setNotice("Sending your consultation request…");
    try {
      if (!accessToken) throw new Error("Your sign-in session is still loading. Please try again in a moment.");
      const response = await fetch("/api/consultations", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ subject, message }) });
      const data = await response.json() as { consultation?: Consultation; error?: string };
      if (!response.ok || !data.consultation) throw new Error(data.error || "Unable to send your request.");
      setConsultations((current) => [data.consultation!, ...current]);
      setSelectedId(data.consultation.id);
      setSubject("");
      setMessage("");
      setNotice("Your request has been sent. A DreamAyla consultation reply will appear here.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send your request.");
    } finally {
      setBusy(false);
    }
  }

  async function sendThreadReply(event: FormEvent) {
    event.preventDefault();
    if (!selected || threadReply.trim().length < 2 || !accessToken) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/consultations/${selected.id}/reply`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ message: threadReply }) });
      const data = await response.json() as { message?: Message; error?: string };
      if (!response.ok || !data.message) throw new Error(data.error || "Unable to send your message.");
      setConsultations((current) => current.map((item) => item.id === selected.id ? { ...item, messages: [...item.messages, data.message!], updatedAt: data.message!.createdAt } : item));
      setThreadReply("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send your message.");
    } finally { setBusy(false); }
  }

  const selected = consultations.find((consultation) => consultation.id === selectedId) ?? consultations[0] ?? null;
  const replyState = (consultation: Consultation) => consultation.messages.at(-1)?.sender === "admin" ? "Reply ready" : "Waiting for reply";

  useEffect(() => {
    const pane = messagesRef.current;
    if (!pane || !selected) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [selected?.id, selected?.messages.length]);

  return <><Header /><main className="page shell consultation-page">
    <div className="pagehead"><div className="eyebrow">DREAMAYLA PREMIUM</div><h1>One-on-one dream consultation</h1><p className="sectionintro">Share the dream, symbol, or life context you want to explore. Your private request is reviewed in the DreamAyla consultation space.</p></div>
    {allowed === false ? <section className="card consultation-upgrade"><LockKeyhole size={25} /><div><span className="eyebrow">PREMIUM ACCESS</span><h2>{signedIn ? "This consultation space is included with Dreamayla Premium." : "Sign in to request a private consultation."}</h2><p className="notice">Dreamayla Premium members can send a private request and return here for a personal response.</p><Link className="button" href={signedIn ? "/pricing" : "/login?next=/consultations"}>{signedIn ? "Explore Dreamayla Premium" : "Sign in"}<ArrowRight size={16} /></Link></div></section> : <>
      <section className="card consultation-request"><div className="consultation-heading"><HeartHandshake size={25} /><div><span className="eyebrow">PRIVATE REQUEST</span><h2>What would you like to explore?</h2><p className="notice">Include the dream details that feel important and any waking-life context you want considered.</p></div></div><form onSubmit={submit}><label className="field" htmlFor="consultation-subject">A short subject <small>Optional</small></label><input id="consultation-subject" className="tool-input" value={subject} onChange={(event) => setSubject(event.target.value.slice(0, 120))} placeholder="For example: A recurring water dream" /><label className="field" htmlFor="consultation-message">Your consultation request</label><textarea id="consultation-message" className="tool-input consultation-input" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 3000))} placeholder="Describe the dream, what stayed with you, and the question you would like explored…" /><div className="tool-helper"><span>{message.length}/3000 characters</span><span><LockKeyhole size={12} /> Visible only to you and DreamAyla&apos;s consultation team</span></div><button className="button tool-submit" type="submit" disabled={busy || message.trim().length < 10}>{busy ? "Sending your request…" : "Send consultation request"}<Send size={16} /></button></form></section>
      {notice && <p className="auth-message" role="status">{notice}</p>}
      {consultations.length > 0 && <section className="consultation-history"><div className="section-label"><div><span className="eyebrow">YOUR PRIVATE CONVERSATIONS</span><h2>Consultation inbox</h2></div><p>Open one request at a time. Your 25 most recent private conversations are kept here.</p></div><div className="consultation-inbox"><aside className="card consultation-thread-list">{consultations.map((consultation) => <button type="button" className={consultation.id === selected?.id ? "active" : ""} onClick={() => setSelectedId(consultation.id)} key={consultation.id}><span className={replyState(consultation) === "Reply ready" ? "consultation-state ready" : "consultation-state"}>{replyState(consultation)}</span><b>{consultation.subject}</b><small>{new Date(consultation.updatedAt).toLocaleDateString()} · {consultation.messages.length} message{consultation.messages.length === 1 ? "" : "s"}</small></button>)}</aside><section className="card consultation-thread">{selected && <><div className="consultation-thread-head"><div><span className="eyebrow">{replyState(selected)}</span><h3>{selected.subject}</h3></div><time dateTime={selected.updatedAt}>{new Date(selected.updatedAt).toLocaleDateString()}</time></div><div className="consultation-messages" ref={messagesRef}>{selected.messages.map((item) => <div className={`consultation-message ${item.sender}`} key={item.id}><b>{item.sender === "member" ? "You" : "DreamAyla consultation team"}</b><p>{item.body}</p><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time></div>)}</div><form className="consultation-chat-composer" onSubmit={sendThreadReply}><textarea aria-label="Message DreamAyla consultation team" value={threadReply} onChange={(event) => setThreadReply(event.target.value.slice(0, 3000))} placeholder="Write a follow-up message…" /><button className="button" type="submit" disabled={busy || threadReply.trim().length < 2}>{busy ? "Sending…" : "Send"}<Send size={16} /></button></form></>}</section></div></section>}
    </>}
  </main><Footer /></>;
}
