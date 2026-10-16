"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { HeartHandshake, MessageCircleHeart, Send } from "lucide-react";
import { getBrowserSession } from "@/lib/supabase/client";

type Message = { id: string; sender: "member" | "admin" | "ayla"; body: string; createdAt: string };
type Consultation = { id: string; email: string; kind: "consultation" | "coach"; subject: string; messages: Message[]; createdAt: string; updatedAt: string };
type Filter = "all" | Consultation["kind"];

export function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const latestActivityRef = useRef("");

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) throw new Error("Please sign in with the administrator account.");
        setAccessToken(session.access_token);
        const response = await fetch("/api/admin/consultations", { headers: { Authorization: `Bearer ${session.access_token}` } });
        const data = await response.json() as { consultations?: Consultation[]; error?: string };
        if (!response.ok) throw new Error(data.error || "Unable to load consultations.");
        setConsultations(data.consultations ?? []);
        setSelectedId(data.consultations?.[0]?.id ?? "");
        latestActivityRef.current = data.consultations?.[0]?.updatedAt ?? "";
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Unable to load consultations.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    let stopped = false;
    const refreshInbox = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/admin/consultations", { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
        const data = await response.json() as { consultations?: Consultation[] };
        if (!response.ok || stopped) return;
        const next = data.consultations ?? [];
        const newest = next[0];
        const hasNewMemberMessage = Boolean(newest && newest.updatedAt > latestActivityRef.current && newest.messages.at(-1)?.sender === "member");
        setConsultations(next);
        if (hasNewMemberMessage) setSelectedId(newest.id);
        if (newest?.updatedAt) latestActivityRef.current = newest.updatedAt;
      } catch {}
    };
    const interval = window.setInterval(() => void refreshInbox(), 5000);
    const refreshVisible = () => { if (document.visibilityState === "visible") void refreshInbox(); };
    document.addEventListener("visibilitychange", refreshVisible);
    return () => { stopped = true; window.clearInterval(interval); document.removeEventListener("visibilitychange", refreshVisible); };
  }, [accessToken]);

  const filtered = useMemo(() => filter === "all" ? consultations : consultations.filter((item) => item.kind === filter), [consultations, filter]);
  const selected = useMemo(() => filtered.find((consultation) => consultation.id === selectedId) ?? filtered[0] ?? null, [filtered, selectedId]);

  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id);
  }, [selected, selectedId]);

  useEffect(() => {
    const pane = messagesRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [selectedId, selected?.messages.length]);

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!selected || reply.trim().length < 2) return;
    setBusy(true);
    setNotice("Sending your reply…");
    try {
      if (!accessToken) throw new Error("Your sign-in session is still loading. Please try again in a moment.");
      const response = await fetch(`/api/admin/consultations/${selected.id}/reply`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ message: reply }) });
      const data = await response.json() as { message?: Message; error?: string };
      if (!response.ok || !data.message) throw new Error(data.error || "Unable to send reply.");
      setConsultations((current) => current.map((consultation) => consultation.id === selected.id ? { ...consultation, messages: [...consultation.messages, data.message!], updatedAt: data.message!.createdAt } : consultation));
      setReply("");
      setNotice("Reply sent. The member can now read it in their private conversation.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to send reply.");
    } finally {
      setBusy(false);
    }
  }

  const counts = { all: consultations.length, consultation: consultations.filter((item) => item.kind === "consultation").length, coach: consultations.filter((item) => item.kind === "coach").length };

  return <section className="admin-consultations">
    <div className="admin-section-heading"><div><span className="eyebrow">PRIVATE MEMBER CONVERSATIONS</span><h2>Consultation and Ayla inbox</h2></div><p>Read one-to-one requests and questions asked through Ayla Dream Guide in one protected workspace.</p></div>
    <div className="admin-consultation-filters" aria-label="Conversation type">{(["all", "consultation", "coach"] as const).map((value) => <button type="button" className={filter === value ? "active" : ""} onClick={() => setFilter(value)} key={value}>{value === "all" ? "All" : value === "consultation" ? "One-to-one" : "Ayla Guide"}<span>{counts[value]}</span></button>)}</div>
    {notice && <div className="card admin-metrics-message">{notice}</div>}
    <div className="admin-consultation-layout">
      <aside className="card admin-consultation-list">{filtered.length ? filtered.map((consultation) => <button type="button" className={consultation.id === selected?.id ? "active" : ""} onClick={() => setSelectedId(consultation.id)} key={consultation.id}><span className={`consultation-kind ${consultation.kind}`}>{consultation.kind === "coach" ? "Ayla Guide" : "One-to-one"}</span><b>{consultation.email}</b><span>{consultation.subject}</span><small>{new Date(consultation.updatedAt).toLocaleDateString()} · {consultation.messages.length} messages</small></button>) : <p className="notice">No conversations in this category yet.</p>}</aside>
      <section className="card admin-consultation-thread">{selected ? <><div className="panel-head"><div><span className="eyebrow">{selected.kind === "coach" ? "AYLA DREAM GUIDE" : selected.email}</span><h3>{selected.subject}</h3><small>{selected.email}</small></div>{selected.kind === "coach" ? <MessageCircleHeart size={20} /> : <HeartHandshake size={20} />}</div><div className="consultation-messages" ref={messagesRef}>{selected.messages.map((message) => <div className={`consultation-message ${message.sender}`} key={message.id}><b>{message.sender === "member" ? selected.email : message.sender === "ayla" ? "Ayla" : "You"}</b><p>{message.body}</p><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time></div>)}</div><form className="admin-chat-composer" onSubmit={sendReply}><textarea id="admin-consultation-reply" aria-label="Reply to member" value={reply} onChange={(event) => setReply(event.target.value.slice(0, 3000))} placeholder="Write your reply…" /><button className="button" type="submit" disabled={busy || reply.trim().length < 2}>{busy ? "Sending…" : "Send"}<Send size={16} /></button></form></> : <div className="consultation-empty"><HeartHandshake size={22} /><p>Select a conversation to read it and reply.</p></div>}</section>
    </div>
  </section>;
}
