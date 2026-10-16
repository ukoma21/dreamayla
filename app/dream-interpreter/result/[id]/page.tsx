"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer, Header } from "@/components/site-chrome";
import type { ParsedDream } from "@/lib/ai";
import { getBrowserSession } from "@/lib/supabase/client";

type Report = {
  overall_theme: { title: string; description: string; confidence: number };
  emotions: Array<{ name: string; score: number }>;
  symbols: Array<{ name: string; meaning: string }>;
  psychological_perspective: string;
  symbolic_perspective: string;
  traditional_perspective: string;
  personal_context: string;
  key_insights: string[];
  reflection_questions: string[];
};
type StoredReport = { title?: string; content: string; mood?: string; parsed: ParsedDream; context: string; report?: Report };

export default function ResultPage() {
  const [stored, setStored] = useState<StoredReport | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("dreamayla:report") || localStorage.getItem("dreamayla:pending-report");
    if (raw) {
      try {
        const data = JSON.parse(raw) as StoredReport;
        if (data.report) {
          setStored(data);
          sessionStorage.setItem("dreamayla:report", raw);
        }
      } catch {
        localStorage.removeItem("dreamayla:pending-report");
      }
    }
    setReady(true);
  }, []);

  async function saveDream() {
    if (!stored?.report) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const session = await getBrowserSession();
      if (!session) {
        location.assign("/signup?next=/dream-interpreter/result/preview");
        return;
      }
      const response = await fetch("/api/dreams", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify(stored) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      localStorage.removeItem("dreamayla:pending-report");
      localStorage.removeItem("dreamayla:pending-draft");
      setSaveMessage("Saved to your private Dream Journal.");
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : "Unable to save this dream.");
    } finally {
      setSaving(false);
    }
  }

  const report = stored?.report;
  if (!ready) return <><Header /><main className="page shell center"><h1>Exploring your dream…</h1><p className="notice">Discovering symbols · Understanding emotions · Connecting context</p></main><Footer /></>;
  if (!report) return <><Header /><main className="page shell center"><h1>Your dream interpretation is not here yet.</h1><p className="notice">Begin a new dream journey whenever you are ready.</p><Link className="button" href="/dream-interpreter">Explore a dream</Link></main><Footer /></>;

  return <><Header /><main className="page shell report">
    <div className="pagehead"><div className="eyebrow">YOUR DREAM · THREE LENSES</div><h1>{report.overall_theme.title}</h1><p className="notice">Ancient symbolism, Jungian-inspired psychology, and Ayla Personal Insight—offered for reflection, never prediction or diagnosis.</p></div>

    <section className="card"><span className="eyebrow">YOUR DREAM AT A GLANCE</span><h2>{report.overall_theme.title}</h2><p>{report.overall_theme.description}</p></section>

    <section><h2>Dream Symbolism</h2><p className="sectionintro">Explore the symbolic meanings connected to the images, people, places, and events within your dream.</p><section className="grid">{report.symbols.map((symbol) => <article className="card" key={symbol.name}><h3>{symbol.name}</h3><p>{symbol.meaning}</p></article>)}</section></section>

    <section><h2>Emotional Patterns</h2><p className="sectionintro">Notice the emotional currents that shaped the atmosphere of your dream.</p><section className="card">{report.emotions.map((emotion) => <div className="metric" key={emotion.name}><div className="metricline"><span>{emotion.name}</span><span>{emotion.score}%</span></div><div className="bar"><span style={{ width: `${emotion.score}%` }} /></div></div>)}</section></section>

    <section><div className="eyebrow">LENS I · SYMBOL</div><h2>Ancient Wisdom</h2><p className="sectionintro">See how symbolic traditions and cultural imagination have held themes like these across time.</p><section className="card"><p>{report.traditional_perspective}</p></section></section>

    <section><div className="eyebrow">LENS II · PSYCHE</div><h2>Jungian-Inspired Perspective</h2><p className="sectionintro">Explore how archetypes, emotional tension, and the unconscious may add another layer to the dream.</p><section className="card"><p>{report.psychological_perspective}</p></section></section>

    <section><div className="eyebrow">LENS III · SELF</div><h2>Ayla Personal Insight</h2><p className="sectionintro">Bring the symbols back to your memories, relationships, emotions, and the life you are living now.</p><section className="card"><p>{report.personal_context}</p><p>{report.symbolic_perspective}</p></section></section>

    <section><h2>What to Carry Forward</h2><p className="sectionintro">Ayla brings the three lenses together into reflections you can revisit beyond this one dream.</p><section className="card"><ul>{report.key_insights.map((insight) => <li key={insight}>{insight}</li>)}</ul><h3>Questions to carry with you</h3><ul>{report.reflection_questions.map((question) => <li key={question}>{question}</li>)}</ul></section></section>

    <div className="center" style={{ marginTop: 32 }}><button className="button" disabled={saving} onClick={saveDream}>{saving ? "Saving…" : "Save this dream"}</button> <Link className="button secondary" href="/pricing">Explore membership</Link>{saveMessage && <p className="auth-message">{saveMessage}</p>}</div>
  </main><Footer /></>;
}
