import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Brain, ChartNoAxesCombined, Check, ChevronRight, Compass, Heart, LockKeyhole, MessageCircleHeart, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { DreamForm } from "@/components/dream-form";
import { Footer, Header } from "@/components/site-chrome";
import { getDreamDictionaryEntry } from "@/lib/dream-dictionary";

export const metadata: Metadata = {
  title: "Dream Interpretation: What Does My Dream Mean?",
  description: "Explore what your dream may mean with a private dream interpretation shaped by symbolism, Jungian-inspired psychology, and your personal context.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dream Interpretation: What Does My Dream Mean? | DreamAyla",
    description: "Explore what your dream may mean through symbolism, Jungian-inspired psychology, and personal context.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Interpretation: What Does My Dream Mean? | DreamAyla",
    description: "A private, personalized way to explore what your dream could mean.",
  },
};

const symbols = ["Being Chased", "Falling", "Missing a Train", "Death", "Teeth Falling Out", "Dreaming of an Ex", "Flying", "Naked in Public", "Fire", "Trapped"];
function symbolHref(symbol: string) {
  const slug = symbol.toLowerCase().replaceAll(" ", "-");
  return getDreamDictionaryEntry(slug) ? `/dream-dictionary/${slug}` : `/dreams/${slug}`;
}
const process = [
  ["01", "Remember the dream", "Describe the images, people, emotions, and details that stayed with you after waking."],
  ["02", "Bring in your world", "Your memories, relationships, and present circumstances give every symbol a personal context."],
  ["03", "See through three lenses", "Explore the dream through ancient symbolism, Jungian-inspired psychology, and Ayla Personal Insight."],
  ["04", "Follow the deeper thread", "Save dreams privately and notice the symbols, emotions, and life themes that return over time."],
];
const faqs = [
  ["Is this a prediction service?", "No. DreamAyla offers thoughtful perspectives for reflection. It does not predict events or diagnose medical or mental-health conditions."],
  ["Can I try it before creating an account?", "Yes. Your first complete DreamAyla report is available without an account. Create one when you want to save and revisit it."],
  ["Why does DreamAyla ask follow-up questions?", "A dream symbol has no universal definition. Emotion, relationships, and the story around the symbol can substantially change a useful interpretation."],
  ["Are my dreams private?", "Yes. Your Dream Journal is private. DreamAyla is not a social feed and never publishes your dream entries."],
];

export default function Home() {
  const baseUrl = "https://dreamayla.com";
  const pageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: "Dream Interpretation: What Does My Dream Mean?",
        description: metadata.description,
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: ["Dream interpretation", "Dream meaning", "Dream symbolism", "Jungian psychology"],
        primaryImageOfPage: { "@type": "ImageObject", url: `${baseUrl}/opengraph-image` },
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/#faq`,
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
  return <><Header /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
    <section className="home-hero"><div className="shell hero-layout"><div className="hero-main">
      <div className="hero-pill"><Sparkles size={14} /> DREAM INTERPRETATION · THE DREAMAYLA THREE-LENS METHOD</div>
      <h1>What Does Your Dream Mean?<br /><em>Begin with your inner world.</em></h1>
      <p>Explore dream meaning through ancient symbolism, Jungian-inspired psychology, and insight shaped by your own life.</p>
      <DreamForm compact />
      <div className="hero-footnotes"><span><Check size={15} /> First full report free</span><span><Check size={15} /> No account needed</span><span><LockKeyhole size={15} /> Private by design</span></div>
    </div><aside className="hero-report-preview"><div className="report-paperclip" aria-hidden="true" />
      <div className="preview-top"><span className="preview-orb" /><span>PERSONAL DREAM READING</span><span>08:12 AM</span></div>
      <div className="preview-title"><span>OVERALL THEME</span><h2>A transition asking<br />for more trust.</h2><p>Your dream may be holding both curiosity about change and a wish for steadier ground.</p></div>
      <div className="preview-metrics"><div><span>Curiosity</span><b>76%</b><i><em style={{ width: "76%" }} /></i></div><div><span>Uncertainty</span><b>62%</b><i><em style={{ width: "62%" }} /></i></div><div><span>Hope</span><b>48%</b><i><em style={{ width: "48%" }} /></i></div></div>
      <div className="preview-tags"><span>unfamiliar city</span><span>old friend</span><span>rain</span></div>
      <div className="preview-note"><MessageCircleHeart size={17} /><p>“What feels new, but not fully safe yet?”</p></div>
      <div className="preview-footer"><span>Symbol · Psyche · Self</span><span>read in layers ↗</span></div>
    </aside></div></section>
    <section className="trust-band"><div className="shell"><span>Ancient symbolism, thoughtfully translated</span><i /><span>Jungian-inspired, never diagnostic</span><i /><span>Personal to your lived experience</span><i /><span>Private by design</span></div></section>
    <section className="section shell intro-section"><div className="section-kicker"><span>ANCIENT SYMBOLS · MODERN PSYCHOLOGY · YOUR STORY</span><p>Dreams hold more than a single answer.</p></div><div className="intro-grid"><h2>A dream is not a code to crack. It is a conversation with your deeper self.</h2><div><p>DreamAyla brings the symbolic imagination of ancient traditions into conversation with Jungian-inspired psychology and the life only you have lived.</p><Link href="/how-it-works" className="text-link">Discover the DreamAyla Method <ArrowRight size={16} /></Link></div></div><div className="method-grid"><article><Heart /><h3>Symbol</h3><p>Ancient stories and cultural traditions open more than one possible meaning.</p></article><article><ScanSearch /><h3>Psyche</h3><p>Jungian-inspired perspectives explore archetypes, emotion, and the unconscious.</p></article><article><Compass /><h3>Self</h3><p>Ayla connects the dream with your memories, relationships, and present life.</p></article><article><ShieldCheck /><h3>Grounded</h3><p>Reflection without fear, prediction, diagnosis, or one-size-fits-all answers.</p></article></div></section>
    <section className="report-experience"><div className="shell report-experience-grid"><div className="report-content"><div className="eyebrow">THE DREAMAYLA THREE-LENS METHOD</div><h2>Three lenses. One dream.<br /><em>A meaning that becomes yours.</em></h2><p>Your reading moves from shared symbolic traditions to the psychology of the dream, then returns to the most important place: your own life.</p><div className="report-list"><div><span>01</span><div><b>Symbol · Ancient Wisdom</b><p>Cultural motifs and timeless symbols offer a rich starting language.</p></div></div><div><span>02</span><div><b>Psyche · Jungian Perspective</b><p>Archetypes, emotion, and inner tensions reveal another layer of the story.</p></div></div><div><span>03</span><div><b>Self · Ayla Personal Insight</b><p>Your context turns a familiar symbol into a reflection that belongs to you.</p></div></div></div><Link href="/dream-interpreter" className="button">Begin My Interpretation <ArrowRight size={16} /></Link></div><div className="report-stack"><div className="stack-back" /><article className="analysis-card"><div className="analysis-card-head"><span className="badge">YOUR DREAM MAP</span><span className="card-dots">•••</span></div><h3>Symbols that stand out</h3><div className="symbol-row"><span className="symbol-icon">≈</span><div><b>Rain at night</b><p>Release, intensity, or a change in emotional weather.</p></div><ChevronRight size={17} /></div><div className="symbol-row"><span className="symbol-icon">⌂</span><div><b>An unfamiliar house</b><p>A new inner landscape or an uncertain situation.</p></div><ChevronRight size={17} /></div><div className="symbol-row"><span className="symbol-icon">◌</span><div><b>A person from the past</b><p>A memory, quality, or question that may feel present again.</p></div><ChevronRight size={17} /></div><div className="analysis-insight"><Sparkles size={17} /><p>The emotion around a symbol often matters more than the symbol itself.</p></div></article></div></div></section>
    <section className="section shell"><div className="split-head"><div><div className="eyebrow">A PRIVATE PRACTICE, NOT A ONE-OFF ANSWER</div><h2>Give your dreams a place to go.</h2></div><p className="sectionintro">A report can be useful today. A private record becomes more useful over time.</p></div><div className="journey-grid"><article className="journal-card"><div className="product-card-label"><BookOpen size={17} /> DREAM JOURNAL</div><h3>Remember what changes.</h3><p>Revisit original dreams, reports, feelings, and the questions you wanted to keep.</p><div className="journal-lines"><span><i /> Dreamed of a flooded station <b>Today</b></span><span><i /> Dinner with an old friend <b>May 18</b></span><span><i /> Walking above the city <b>May 12</b></span></div><Link href="/dream-journal">Explore the Journal <ArrowRight size={15} /></Link></article><article className="pattern-card"><div className="product-card-label"><ChartNoAxesCombined size={17} /> DREAM PATTERNS</div><h3>See what keeps returning.</h3><p>When you have enough saved dreams, DreamAyla highlights recurring symbols, emotional tones, people, and situations.</p><div className="pattern-bars"><span><b>Water</b><i><em style={{ width: "88%" }} /></i><small>5x</small></span><span><b>Change</b><i><em style={{ width: "71%" }} /></i><small>4x</small></span><span><b>Curiosity</b><i><em style={{ width: "56%" }} /></i><small>3x</small></span></div><Link href="/dream-patterns">Explore Patterns <ArrowRight size={15} /></Link></article><article className="dna-card"><div className="product-card-label"><Brain size={17} /> DREAM DNA</div><h3>Your evolving dream language.</h3><p>A premium overview of the themes and emotional movements your dream life returns to most often.</p><div className="dna-orbit"><span>Change</span><span>Freedom</span><span>Connection</span><strong>Dream<br />DNA</strong></div><Link href="/dream-dna">Discover Dream DNA <ArrowRight size={15} /></Link></article></div></section>
    <section className="process-section"><div className="shell"><div className="center"><div className="eyebrow">HOW IT WORKS</div><h2>From a remembered image to a deeper understanding.</h2><p className="sectionintro">The DreamAyla Method keeps every interpretation connected to the dreamer, not just the symbol.</p></div><div className="process-grid">{process.map(([number, title, copy]) => <article key={number}><span>{number}</span><div className="process-line" /><div className="process-sketch" aria-hidden="true"><i /><i /><i /></div><h3>{title}</h3><p>{copy}</p><small>{number === "01" ? "Fragments become a story" : number === "02" ? "Context changes the reading" : number === "03" ? "Symbol · Psyche · Self" : "Patterns take shape over time"}</small></article>)}</div><div className="center"><Link className="button secondary" href="/how-it-works">Explore the DreamAyla Method <ArrowRight size={16} /></Link></div></div></section>
    <section className="dictionary-section shell"><div className="dictionary-copy-home"><div className="eyebrow">DREAM DICTIONARY</div><h2>Start with the image.<br /><em>Stay for the context.</em></h2><p>Explore original, carefully written guides for common dream symbols. Each one gives you practical prompts—not an absolute answer.</p><Link className="button secondary" href="/dream-dictionary">Browse Dream Dictionary <ArrowRight size={16} /></Link></div><div className="symbol-cloud">{symbols.map((symbol, index) => <Link key={symbol} className={"symbol-cloud-item cloud-" + index} href={symbolHref(symbol)}><span>{symbol}</span><small>Explore meaning <ArrowRight size={12} /></small></Link>)}</div></section>
    <section className="membership-prompt"><div className="shell membership-inner"><div><span className="eyebrow">DREAMAYLA PREMIUM</span><h2>One dream can illuminate a moment.<br />A pattern can reveal a chapter.</h2><p>Continue your practice with deeper readings, a private journal, and personal insights that grow with your dream history.</p></div><div className="membership-actions"><Link className="button" href="/pricing">Explore memberships <ArrowRight size={16} /></Link><span>Plans from $8.90/month · Three-day guarantee</span></div></div></section>
    <section className="section shell faq-home"><div><div className="eyebrow">COMMON QUESTIONS</div><h2>Thoughtful by design.</h2><p className="sectionintro">Before you start, here is what DreamAyla does—and what it does not claim to do.</p></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="final-home-cta"><div className="shell"><div className="eyebrow">YOUR INNER WORLD HAS ITS OWN LANGUAGE</div><h2>Begin with what stayed<br />when you woke up.</h2><p>A single image may be the beginning of a deeper conversation.</p><Link className="button" href="/dream-interpreter">Interpret My Dream <ArrowRight size={16} /></Link><small>First complete reading free · No account required</small></div></section>
  </main><Footer /></>;
}
