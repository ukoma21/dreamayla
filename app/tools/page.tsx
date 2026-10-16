"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, Compass, UserRound } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";

const tools = [
  { id: "bazi", title: "Birth Chart", icon: Compass, desc: "Explore personal themes through symbolic traditions and self-reflection.", prompt: "Share your birth date, time, and place." },
  { id: "name", title: "Baby Name Analysis", icon: UserRound, desc: "Explore meaningful names through cultural symbolism, linguistic beauty, and traditional naming wisdom.", prompt: "Enter the name you would like to explore." },
  { id: "naming", title: "Baby Name Ideas", icon: BookOpen, desc: "Discover thoughtful name ideas shaped around the meaning, language, and style you value.", prompt: "Tell us the language, style, and meaning you want." },
] as const;

type ToolId = (typeof tools)[number]["id"];

function ReflectionCopy({ value }: { value: string }) {
  return <>{value.split("\n").filter(Boolean).map((line, index) => {
    const title = line.replace(/^#{1,4}\s*/, "").trim();
    if (/^#{1,4}\s/.test(line)) return <h3 key={`${title}-${index}`}>{title}</h3>;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return <p key={`${line}-${index}`}>{parts.map((part, partIndex) => part.startsWith("**") && part.endsWith("**") ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : part)}</p>;
  })}</>;
}

export default function Tools() {
  const [active, setActive] = useState<ToolId>("bazi");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const tool = tools.find((item) => item.id === active) ?? tools[0];
  const ActiveIcon = tool.icon;

  async function ask() {
    if (input.trim().length < 3) return;
    setBusy(true);
    setResult("");
    setUpgrade(false);
    try {
      let accessToken: string | undefined;
      try {
        const session = await getBrowserSession();
        accessToken = session?.access_token;
      } catch {
        // A guest can still use their one complimentary DreamAyla experience.
      }
      const response = await fetch("/api/divination", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
        body: JSON.stringify({ type: active, input }),
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (response.status === 402) {
        setUpgradeMessage(data.error || "Your complimentary DreamAyla experience has been used.");
        setUpgrade(true);
        return;
      }
      setResult(data.answer || data.error || "Unable to create a reflection.");
    } catch {
      setResult("Unable to create this reflection right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <Header />
    <main className="page shell tools-page">
      <div className="tools-hero"><div className="eyebrow">DREAMAYLA PERSONAL INSIGHT TOOLS</div><h1>Make space for a<br /><em>different perspective.</em></h1><p>Thoughtful explorations for personal reflection, meaningful names, and the questions that stay with you.</p><div className="tools-trust"><span>Private by design</span><span>Personalized perspective</span><span>First experience free</span></div></div>
      <div className="tools-layout"><aside className="tool-tabs"><div className="tool-tabs-label">CHOOSE A TOPIC</div>{tools.map(({ id, title, icon: Icon }) => <button type="button" className={active === id ? "active" : ""} onClick={() => { setActive(id); setResult(""); setUpgrade(false); }} key={id}><Icon size={18} /><span>{title}</span><ArrowRight size={14} /></button>)}</aside><div className="tool-content"><section className="tool-panel"><div className="tool-heading"><div className="tool-icon-wrap"><ActiveIcon size={25} /></div><div><div className="tool-kicker">NOW EXPLORING</div><h2>{tool.title}</h2><p>{tool.desc}</p></div></div><label className="field">Your details</label><textarea className="tool-input" value={input} onChange={(event) => setInput(event.target.value.slice(0, 2000))} placeholder={tool.prompt} /><div className="tool-helper"><span>{input.length}/2000 characters</span><span>Your first DreamAyla exploration is complimentary.</span></div><button type="button" className="button tool-submit" disabled={busy || input.trim().length < 3} onClick={ask}>{busy ? "Preparing your reflection…" : "Begin reflection"}<ArrowRight size={16} /></button>{busy && <div className="tool-loading"><span className="loading-dot" />Reading your context…</div>}{result && <div className="tool-result"><span className="eyebrow">YOUR REFLECTION</span><ReflectionCopy value={result} /></div>}</section><p className="tool-disclaimer">DreamAyla tools are subjective and intended for reflection and entertainment. They do not predict the future or diagnose health conditions.</p></div></div>
    </main>
    {upgrade && <div className="upgrade-modal" role="dialog" aria-modal="true" aria-label="Continue with DreamAyla"><div className="upgrade-dialog"><button type="button" className="upgrade-close" aria-label="Close" onClick={() => setUpgrade(false)}>×</button><div className="eyebrow">CONTINUE WITH DREAMAYLA</div><h3>Your complimentary experience is complete.</h3><p>{upgradeMessage} Create an account to keep your membership, billing, and renewal details in one private place.</p><div className="upgrade-actions"><Link className="button" href="/signup">Create account</Link><Link className="button secondary" href="/pricing">View memberships</Link></div></div></div>}
    <Footer />
  </>;
}
