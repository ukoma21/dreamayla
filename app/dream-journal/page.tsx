"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";

type Dream = { id: string; title: string | null; mood: string | null; summary: string | null; createdAt: string };

export default function DreamJournalPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [message, setMessage] = useState("Loading your private journal…");

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) {
          setMessage("Create an account or sign in to view your private journal.");
          return;
        }
        const response = await fetch("/api/dreams", { headers: { Authorization: "Bearer " + session.access_token } });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setDreams(data.dreams);
        setMessage(data.dataSourceUnavailable ? "Connect your database to activate saving." : "");
      } catch {
        setMessage("Your journal is not connected yet. Complete your account and database setup to activate it.");
      }
    })();
  }, []);

  return <><Header /><main className="page shell">
    <div className="pagehead"><div className="eyebrow">PRIVATE DREAM JOURNAL</div><h1>Dreams are not only memories.</h1><p className="sectionintro">They are symbols, emotions, and stories waiting to be explored. Record your dreams and discover recurring themes, hidden patterns, and meaningful connections throughout your personal journey.</p></div>
    <div className="center" style={{ marginBottom: 24 }}><Link className="button" href="/dream-interpreter">Explore a new dream</Link></div>
    {message && <div className="card center"><p className="notice">{message}</p>{message.includes("account") && <Link className="button secondary" href="/login">Sign in</Link>}</div>}
    <section className="report">{dreams.map((dream) => <Link className="card journal-entry" href={"/dream-journal/" + dream.id} key={dream.id}><div><span className="eyebrow">{new Date(dream.createdAt).toLocaleDateString()} · {dream.mood || "REFLECTIVE"}</span><h2>{dream.title || "Untitled dream"}</h2><p>{dream.summary || "Open your saved interpretation and personal context."}</p></div><span className="journal-arrow">Open →</span></Link>)}</section>
  </main><Footer /></>;
}
