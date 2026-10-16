"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";

type Dream = { title: string | null; rawContent: string; mood: string | null; createdAt: string; symbols: { id: string; name: string }[]; report: Record<string, unknown> | null };

export default function DreamDetailPage() {
  const params = useParams<{ id: string }>(); const [dream, setDream] = useState<Dream | null>(null); const [message, setMessage] = useState("Loading your saved dream…");
  useEffect(() => { (async () => { try { const session = await getBrowserSession(); if (!session) { setMessage("Sign in to view this private dream."); return; } const response = await fetch(`/api/dreams/${params.id}`, { headers: { Authorization: `Bearer ${session.access_token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setDream(data.dream); setMessage(""); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to open this dream."); } })(); }, [params.id]);
  const report = dream?.report as { overall_theme?: { title?: string; description?: string }; key_insights?: string[]; reflection_questions?: string[] } | null;
  return <><Header /><main className="page shell report">{message && <div className="card center"><p className="notice">{message}</p></div>}{dream && <><div className="pagehead"><div className="eyebrow">SAVED DREAM · {new Date(dream.createdAt).toLocaleDateString()}</div><h1>{dream.title || "Untitled dream"}</h1><p className="notice">Mood: {dream.mood || "Reflective"}</p></div><section className="card"><h2>Original dream</h2><p>{dream.rawContent}</p></section>{report?.overall_theme && <section className="card"><span className="eyebrow">OVERALL THEME</span><h2>{report.overall_theme.title}</h2><p>{report.overall_theme.description}</p></section>}<section className="card"><h2>Symbols</h2><div className="chips">{dream.symbols.map(symbol => <span className="chip" key={symbol.id}>{symbol.name}</span>)}</div></section>{report?.key_insights && <section className="card"><h2>Key insights</h2><ul>{report.key_insights.map(insight => <li key={insight}>{insight}</li>)}</ul></section>}{report?.reflection_questions && <section className="card"><h2>Reflection questions</h2><ul>{report.reflection_questions.map(question => <li key={question}>{question}</li>)}</ul></section>}</>}</main><Footer /></>;
}
