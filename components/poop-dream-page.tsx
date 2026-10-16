"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";

const emotions = [
  ["relief", "😌", "Relief", "The dream may be giving your mind a safe place to release pressure, resentment, or an old obligation."],
  ["embarrassment", "😳", "Embarrassment", "Something private may feel too visible, or you may be worried that other people will judge a very human part of you."],
  ["disgust", "😣", "Disgust", "Your reaction can point to a situation, habit, or conversation that feels unhealthy and needs a cleaner boundary."],
  ["anxiety", "😰", "Anxiety", "The mess may represent a problem that keeps asking for attention while you are trying to keep daily life under control."],
  ["curiosity", "🤔", "Curiosity", "A calm reaction can signal that you are ready to look honestly at what you have outgrown or need to let go of."],
] as const;

const variations = [
  ["Using a bathroom", "Privacy and release", "Finding a private bathroom may reflect an urge to process a difficult feeling away from other people. If the bathroom was unavailable or rushed, the dream may be about not having enough space to deal with what you carry."],
  ["Poop in public", "Exposure and judgment", "A public scene can bring shame, vulnerability, or fear of being found out into focus. Ask whether you are actually being judged, or whether your own standards have become unusually harsh."],
  ["Stepping in poop", "An unpleasant consequence", "Stepping in it can capture the feeling of being pulled into someone else’s problem or discovering a consequence after the fact. Notice who was nearby and whether anyone helped."],
  ["Cleaning up poop", "Responsibility and repair", "Cleaning may show that you are already taking responsibility for a messy situation. It can also suggest that you are doing emotional housekeeping for other people and need clearer limits."],
  ["An overflowing toilet", "Too much held in", "An overflow can mirror feelings, tasks, or conversations that have accumulated past your ability to contain them. The dream may be asking for a small release before the pressure grows."],
  ["Animal poop", "Instinct and everyday mess", "Animal waste can connect with ordinary responsibilities, bodily needs, and the parts of life that are not polished. Consider whether the dream felt natural, annoying, or impossible to avoid."],
];

const faqs = [
  ["Is dreaming about poop a good sign?", "It can feel unpleasant, but many people experience it as a release image. In some cultural traditions it is also associated with luck or material gain. Those associations are prompts for reflection, not guarantees."],
  ["Why do I keep having this dream?", "A recurring version can suggest that the same pressure, boundary issue, shame, or unfinished task keeps returning. Compare the setting and your emotion each time; the change between dreams may be the useful clue."],
  ["Does this dream mean I will make money?", "Some traditions connect excrement with abundance, but a dream cannot promise money or predict an event. Your personal context—security, work, debt, generosity, or self-worth—is more relevant than a fixed omen."],
  ["What should I write down after waking?", "Record what you were trying to do, who could see you, what happened to the waste, and whether you felt lighter or more exposed afterward. Those details make the interpretation personal."],
] as const;

const related = [
  ["water", "Dreaming About Water", "Emotional movement, depth, and the need for renewal."],
  ["naked-in-public", "Naked in Public", "Vulnerability, self-consciousness, and the fear of being seen."],
  ["teeth-falling-out", "Teeth Falling Out", "Communication, self-image, and a changing sense of control."],
  ["money", "Dreaming About Money", "Security, value, receiving support, and what feels worth protecting."],
] as const;

export default function PoopDreamPage() {
  const [selectedEmotion, setSelectedEmotion] = useState("relief");
  const activeEmotion = emotions.find(([id]) => id === selectedEmotion) ?? emotions[0];

  return <>
    <Header />
    <main className="poop-page">
      <section className="poop-hero">
        <div className="shell poop-hero-inner">
          <div className="poop-breadcrumb">Dream Library <span>/</span> Body &amp; boundaries</div>
          <div className="poop-hero-copy">
            <div className="eyebrow">DREAM DICTIONARY · EXPERT-REVIEWED</div>
            <h1>Dreaming About Poop:<br /><em>Meaning, symbolism &amp; context.</em></h1>
            <p>These dreams can feel awkward, but they often appear when your mind is sorting through release, privacy, embarrassment, or the wish to clear out what no longer belongs in your life.</p>
            <div className="poop-hero-actions"><Link className="button" href="/dream-interpreter">Interpret my dream <ArrowRight size={16} /></Link><span>Private by design · For reflection, not prediction</span></div>
          </div>
          <div className="poop-hero-orbit" aria-hidden="true"><span>release</span><span>boundaries</span><span>relief</span><strong>POOP<br /><small>dream theme</small></strong></div>
        </div>
      </section>

      <article className="shell poop-content">
        <section className="poop-quick poop-card"><div className="poop-section-kicker">QUICK ANSWER</div><h2>What can a poop dream mean?</h2><p>Dreaming about poop may suggest that you are trying to <strong>release pressure</strong>, deal with an uncomfortable truth, protect your privacy, or make room for a cleaner next chapter. The feeling is the deciding clue: relief points in a different direction from disgust, panic, or embarrassment.</p><div className="poop-keywords"><span>Release</span><span>Privacy</span><span>Boundaries</span><span>Material security</span></div></section>

        <section className="poop-feeling-section"><div className="poop-section-heading"><div><div className="poop-section-kicker">START WITH YOUR REACTION</div><h2>This dream felt like…</h2></div><p>There is no universal translation. Choose the closest emotional tone and use it as a starting point.</p></div><div className="poop-emotion-grid">{emotions.map(([id, emoji, label]) => <button type="button" className={selectedEmotion === id ? "poop-emotion active" : "poop-emotion"} onClick={() => setSelectedEmotion(id)} key={id}><span>{emoji}</span><b>{label}</b>{selectedEmotion === id && <Check size={15} />}</button>)}</div><div className="poop-emotion-result"><Sparkles size={18} /><p><b>{activeEmotion[2]} can change the reading.</b> {activeEmotion[3]}</p></div></section>

        <section className="poop-perspectives"><div className="poop-section-heading"><div><div className="poop-section-kicker">THREE WAYS TO READ IT</div><h2>Meaning in context</h2></div><p>The symbol is only the headline. Your body, memories, and current circumstances give it shape.</p></div><div className="poop-perspective-grid"><article><span className="poop-icon">01</span><h3>General meaning</h3><p>Something may be ready to leave your life: a grudge, a draining habit, an outdated role, or a responsibility you have outgrown. Notice whether the dream ended with relief or a new problem.</p></article><article><span className="poop-icon">02</span><h3>Emotional reading</h3><p>Relief can suggest healthy release. Shame can point to fear of exposure. Disgust may mark a boundary. Anxiety can show that too much has been held in for too long.</p></article><article><span className="poop-icon">03</span><h3>Personal context</h3><p>Work pressure, money worries, a private conversation, or caring for someone can all change the story. What in waking life currently feels messy, hidden, or overdue?</p></article></div></section>

        <section className="poop-context-banner"><div><div className="poop-section-kicker">WHEN IT COMES BACK</div><h2>A recurring dream may be asking for a smaller, kinder release.</h2><p>Instead of searching for a prediction, identify one thing you can name, clean up, delegate, or stop carrying this week.</p></div><Link className="button secondary" href="/dream-journal">Save this reflection <ArrowRight size={16} /></Link></section>

        <section className="poop-variations"><div className="poop-section-heading"><div><div className="poop-section-kicker">COMMON VARIATIONS</div><h2>The scene changes the meaning.</h2></div><p>Use the version closest to your dream, then add the emotion you felt in the moment.</p></div><div className="poop-variation-grid">{variations.map(([title, tag, copy], index) => <article className="poop-variation" key={title}><span className="poop-variation-number">0{index + 1}</span><div><span className="poop-variation-tag">{tag}</span><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

        <section className="poop-common"><div className="poop-section-heading"><div><div className="poop-section-kicker">COMMON INTERPRETATIONS</div><h2>Five themes people often notice.</h2></div><p>These are possible lenses, not fixed definitions or predictions.</p></div><ol>{["Emotional release after a period of pressure", "A wish to clear out an old habit, grudge, or obligation", "Embarrassment about something private becoming visible", "A boundary that needs to be stated more clearly", "Cultural associations with luck, money, or abundance"].map((item, index) => <li key={item}><span>{index + 1}</span><p>{item}</p></li>)}</ol></section>

        <section className="poop-faq"><div className="poop-section-heading"><div><div className="poop-section-kicker">QUESTIONS PEOPLE ASK</div><h2>Before you make the dream mean too much.</h2></div><p>Dream interpretation is subjective and intended for reflection and entertainment.</p></div><div className="poop-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>

        <section className="poop-related"><div className="poop-section-heading"><div><div className="poop-section-kicker">EXPLORE A RELATED THEME</div><h2>What else might connect?</h2></div><Link className="text-link" href="/dream-library">Browse the Dream Library <ArrowRight size={15} /></Link></div><div className="poop-related-grid">{related.map(([slug, title, copy]) => <Link href={`/dreams/${slug}`} className="poop-related-card" key={slug}><span>{title}</span><p>{copy}</p><ArrowRight size={16} /></Link>)}</div></section>

        <section className="poop-cta"><div className="poop-cta-icon"><Sparkles size={21} /></div><div><div className="poop-section-kicker">YOUR DREAM IS SPECIFIC TO YOU</div><h2>Get a fuller reading with your own details.</h2><p>Describe what happened, how you felt, and what is happening in your life. DreamAyla connects the story, emotion, symbols, and context into a private reflection.</p></div><Link className="button" href="/dream-interpreter">Describe my dream <ArrowRight size={16} /></Link></section>
      </article>
    </main>
    <Footer />
  </>;
}
