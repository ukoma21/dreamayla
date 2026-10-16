"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";

export type DreamDetailProfile = {
  slug: string;
  title: string;
  category: string;
  quick: string;
  psych: string;
  symbol: string;
  traditional: string;
  variations: Array<[string, string, string]>;
  interpretations: string[];
  related: Array<[string, string, string]>;
};

const feelingOptions = [
  ["relief", "😌", "Relief"],
  ["fear", "😰", "Fear"],
  ["confusion", "😵‍💫", "Confusion"],
  ["curiosity", "🤔", "Curiosity"],
  ["nostalgia", "🌙", "Nostalgia"],
] as const;

export default function DreamDetailPage({ profile }: { profile: DreamDetailProfile }) {
  const [feeling, setFeeling] = useState("relief");
  const feelingLabel = feelingOptions.find(([id]) => id === feeling)?.[2] ?? "Relief";

  return <>
    <Header />
    <main className="poop-page dream-detail-page">
      <section className="poop-hero">
        <div className="shell poop-hero-inner">
          <div className="poop-breadcrumb">Dream Library <span>/</span> {profile.category}</div>
          <div className="poop-hero-copy">
            <div className="eyebrow">DREAM DICTIONARY · PERSONAL CONTEXT</div>
            <h1>Dreaming About {profile.title}:<br /><em>Meaning, symbolism &amp; context.</em></h1>
            <p>One dream image can hold several meanings. Start with the emotion, the action, and what this scene reminds you of in waking life.</p>
            <div className="poop-hero-actions"><Link className="button" href="/dream-interpreter">Interpret my dream <ArrowRight size={16} /></Link><span>Private by design · For reflection, not prediction</span></div>
          </div>
          <div className="poop-hero-orbit" aria-hidden="true"><span>emotion</span><span>context</span><span>memory</span><strong className="dream-orbit-title">{profile.title.toUpperCase()}<br /><small>dream theme</small></strong></div>
        </div>
      </section>

      <article className="shell poop-content">
        <section className="poop-quick poop-card"><div className="poop-section-kicker">QUICK ANSWER</div><h2>What can this dream mean?</h2><p>{profile.quick}</p><div className="poop-keywords"><span>{profile.category}</span><span>Personal context</span><span>Emotional tone</span><span>Several perspectives</span></div></section>

        <section className="poop-feeling-section"><div className="poop-section-heading"><div><div className="poop-section-kicker">START WITH YOUR REACTION</div><h2>This dream felt like…</h2></div><p>The same scene can feel hopeful, frightening, or neutral. Your first reaction helps set the direction.</p></div><div className="poop-emotion-grid">{feelingOptions.map(([id, emoji, label]) => <button type="button" className={feeling === id ? "poop-emotion active" : "poop-emotion"} onClick={() => setFeeling(id)} key={id}><span>{emoji}</span><b>{label}</b>{feeling === id && <Check size={15} />}</button>)}</div><div className="poop-emotion-result"><Sparkles size={18} /><p><b>{feelingLabel} changes the reading.</b> Ask what in the dream created that feeling, then connect it with one situation, relationship, or decision in your life now.</p></div></section>

        <section className="poop-perspectives"><div className="poop-section-heading"><div><div className="poop-section-kicker">MULTIPLE PERSPECTIVES</div><h2>Meaning in context</h2></div><p>The symbol is a starting point. The story and your memories give it a more useful meaning.</p></div><div className="poop-perspective-grid"><article><span className="poop-icon">01</span><h3>Possible meaning</h3><p>{profile.quick} Notice what changed, what you chose to do, and what you wanted to happen next.</p></article><article><span className="poop-icon">02</span><h3>Psychological reading</h3><p>{profile.psych}</p></article><article><span className="poop-icon">03</span><h3>Symbolic meaning</h3><p>{profile.symbol}</p></article></div></section>

        <section className="dream-traditional-card"><div><div className="poop-section-kicker">CULTURAL LENS</div><h2>Traditional interpretation</h2><p>{profile.traditional}</p></div><span className="dream-traditional-note">Cultural associations are prompts for reflection, not predictions.</span></section>

        <section className="poop-context-banner"><div><div className="poop-section-kicker">WHEN THE DREAM RETURNS</div><h2>Let the details point to one practical question.</h2><p>Write down who was there, what you did, and what felt most urgent. A personal detail is more useful than a universal definition.</p></div><Link className="button secondary" href="/dream-journal">Save this reflection <ArrowRight size={16} /></Link></section>

        <section className="poop-variations"><div className="poop-section-heading"><div><div className="poop-section-kicker">COMMON VARIATIONS</div><h2>The scene changes the meaning.</h2></div><p>Choose the version closest to your dream, then read it alongside your emotional reaction.</p></div><div className="poop-variation-grid">{profile.variations.map(([title, tag, copy], index) => <article className="poop-variation" key={title}><span className="poop-variation-number">0{index + 1}</span><div><span className="poop-variation-tag">{tag}</span><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

        <section className="poop-common"><div className="poop-section-heading"><div><div className="poop-section-kicker">COMMON INTERPRETATIONS</div><h2>Themes people often notice.</h2></div><p>These are possible lenses, not fixed definitions or predictions.</p></div><ol>{profile.interpretations.map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>

        <section className="poop-faq"><div className="poop-section-heading"><div><div className="poop-section-kicker">QUESTIONS PEOPLE ASK</div><h2>Before you make the dream mean too much.</h2></div><p>Use the questions to connect the page with your own memories and current life.</p></div><div className="poop-faq-list"><details><summary>Does this dream predict the future?<ChevronDown size={18} /></summary><p>No. Dreams are subjective experiences. This guide offers reflective perspectives, not forecasts, diagnoses, or certainty.</p></details><details><summary>Why did this symbol appear now?<ChevronDown size={18} /></summary><p>Look for a recent emotion, conversation, change, or responsibility that resembles the dream’s mood. The timing may be more useful than a fixed dictionary definition.</p></details><details><summary>What detail should I remember?<ChevronDown size={18} /></summary><p>Record the strongest feeling, the person or place involved, the action you took, and what changed immediately before waking.</p></details></div></section>

        <section className="poop-related"><div className="poop-section-heading"><div><div className="poop-section-kicker">EXPLORE A RELATED THEME</div><h2>What else might connect?</h2></div><Link className="text-link" href="/dream-library">Browse the Dream Library <ArrowRight size={15} /></Link></div><div className="poop-related-grid">{profile.related.map(([slug, title, copy]) => <Link href={`/dreams/${slug}`} className="poop-related-card" key={slug}><span>{title}</span><p>{copy}</p><ArrowRight size={16} /></Link>)}</div></section>

        <section className="poop-cta"><div className="poop-cta-icon"><Sparkles size={21} /></div><div><div className="poop-section-kicker">YOUR DREAM IS SPECIFIC TO YOU</div><h2>Get a fuller reading with your own details.</h2><p>Describe what happened, how you felt, and what is happening in your life. DreamAyla connects the story, emotion, symbols, and context into a private reflection.</p></div><Link className="button" href="/dream-interpreter">Describe my dream <ArrowRight size={16} /></Link></section>
      </article>
    </main>
    <Footer />
  </>;
}
