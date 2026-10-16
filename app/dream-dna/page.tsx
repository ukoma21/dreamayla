"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BrainCircuit, LockKeyhole } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";

type Profile = { dreamCount: number; emotions: Array<{ name: string; score: number }>; mostRecurringSymbol: { name: string; frequency: number } | null };

export default function DreamDNA() {
  const [data, setData] = useState<Profile | null>(null);
  const [message, setMessage] = useState("Loading your dream profile…");
  const [upgrade, setUpgrade] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const session = await getBrowserSession();
        if (!session) { setMessage("Sign in to explore your Dream DNA."); return; }
        const response = await fetch("/api/dna", { headers: { Authorization: "Bearer " + session.access_token } });
        const payload = await response.json();
        if (response.status === 402) { setUpgrade(true); setMessage(payload.error || "Dream DNA is available with Dreamayla Premium."); return; }
        if (!response.ok) throw new Error(payload.error);
        setData(payload);
        setMessage("");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Dream DNA is not available yet.");
      }
    })();
  }, []);

  return <><Header /><main className="page shell"><div className="pagehead"><div className="eyebrow">PREMIUM DREAM DNA</div><h1>Your changing dream language.</h1><p className="sectionintro">A long-view profile of the emotions and symbols that most often shape your saved dream history.</p></div>
    {upgrade ? <section className="card formcard center"><LockKeyhole size={28} className="icon" /><h2>Dream DNA is part of Dreamayla Premium.</h2><p className="notice">{message}</p><Link className="button" href="/pricing">Explore membership <ArrowRight size={16} /></Link></section> : <section className="card formcard"><div className="tool-heading"><div className="tool-icon-wrap"><BrainCircuit size={24} /></div><div><div className="eyebrow">YOUR PROFILE</div><h2>{data ? data.dreamCount + " dreams shaping your profile" : "Build your profile over time"}</h2><p className="notice">{message || "These scores are reflective signals, not diagnoses or fixed traits."}</p></div></div>{data && <><div className="pattern-bars" style={{ marginTop: 25 }}>{data.emotions.map((emotion) => <div key={emotion.name}><div className="metricline"><span>{emotion.name}</span><b>{emotion.score}%</b></div><div className="bar"><span style={{ width: emotion.score + "%" }} /></div></div>)}</div><div className="card" style={{ marginTop: 24, background: "#fbf5ff" }}><span className="eyebrow">MOST RECURRING SYMBOL</span><h3>{data.mostRecurringSymbol?.name || "Not enough data yet"}</h3><p className="notice">{data.mostRecurringSymbol ? "Appeared in " + data.mostRecurringSymbol.frequency + " saved dream" + (data.mostRecurringSymbol.frequency === 1 ? "" : "s") + "." : "Save more dreams and DreamAyla will surface a recurring symbol."}</p></div></>}</section>}
    <section className="center" style={{ marginTop: 28 }}><Link className="text-link" href="/dream-journal">Return to your journal <ArrowRight size={15} /></Link></section>
  </main><Footer /></>;
}
