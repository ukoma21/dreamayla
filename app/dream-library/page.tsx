import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookMarked, Clock3, Layers3, Sparkles } from "lucide-react";
import { DreamLibraryBrowser } from "@/components/dream-library-browser";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Dream Interpretation Library: Symbols, Psychology & Meaning",
  description: "Browse in-depth dream interpretation guides covering common dream meanings, symbols, archetypes, emotions, recurring dreams, and Jungian-inspired psychology.",
  keywords:["dream interpretation library","dream meaning guides","dream symbols and meanings","dream psychology","recurring dream meanings","Jungian dream interpretation"],
  alternates: { canonical: "/dream-library" },
  openGraph:{title:"Dream Interpretation Library | DreamAyla",description:"In-depth guides to dream symbols, recurring themes, psychology, and personal meaning.",url:"/dream-library",type:"website"},
};

const featured = [
  ["being-chased", "Being Chased", "When a dream feels urgent", "A guide to the pursuer, the setting, escape, and what the pressure might be asking you to notice."],
  ["teeth-falling-out", "Teeth Falling Out", "When confidence feels tender", "Explore communication, self-image, transition, and why the details of the teeth change the reading."],
  ["water", "Water", "When feelings keep moving", "A fuller look at clear water, storms, deep water, and the emotional atmosphere of the dream."],
  ["partner-cheating", "A Partner Cheating", "When trust feels tender", "Explore reassurance, comparison, emotional distance, and why this dream is not evidence of a real betrayal."],
];

const readingPaths = [
  ["01", "Pressure & change", "Falling, being chased, missing a train, and feeling trapped can carry questions about pace, responsibility, uncertainty, or a new chapter.", ["Falling", "Being Chased", "Missing a Train"], ["falling", "being-chased", "missing-a-train"]],
  ["02", "People & belonging", "An ex, a wedding, a childhood house, or a lost phone can lead back to connection, history, and how close you want to be.", ["Dreaming of an Ex", "A Wedding", "Losing Your Phone"], ["dreaming-of-an-ex", "wedding", "losing-your-phone"]],
  ["03", "Instinct & emotion", "Water, fire, drowning, and spiders can make a feeling visible when it is hard to name during the day.", ["Water", "Fire", "Drowning"], ["water", "fire", "drowning"]],
  ["04", "Body & identity", "Teeth, hair, babies, and public exposure can bring confidence, care, vulnerability, and change into one vivid scene.", ["Teeth Falling Out", "Losing Hair", "A Baby"], ["teeth-falling-out", "losing-hair", "baby"]],
];

export default function DreamLibraryPage() {
  return <><Header /><main className="library-page">
    <section className="library-hero"><div className="shell"><div><span className="eyebrow">THE DREAMAYLA LIBRARY</span><h1>A field guide<br /><em>to the inner world.</em></h1><p>A curated collection of deep dream studies—connecting symbolic traditions, psychological perspectives, and the details that turn a shared image into a personal reflection.</p><div className="library-hero-actions"><Link className="button" href="#browse-guides">Enter the library <ArrowRight size={16} /></Link><Link className="text-link" href="/dream-interpreter">Interpret my full dream <ArrowRight size={16} /></Link></div></div><aside className="library-hero-card"><BookMarked size={22}/><span>READ BEYOND THE OBVIOUS</span><h2>Follow the symbol into its deeper layers.</h2><p>Each study moves through emotional context, symbolic tradition, psychological perspective, variations, and questions for your own life.</p><div><span>28 curated dream studies</span><span>6 thematic paths</span></div></aside></div></section>
    <section className="shell library-featured"><div className="section-label"><div><span className="eyebrow">ESSENTIAL DREAM STUDIES</span><h2>Begin with the dreams that echo across lives.</h2></div><p>Each guide offers depth and possibility without reducing the dream to a verdict.</p></div><div className="library-featured-grid">{featured.map(([slug, title, label, copy], index) => <Link href={`/dreams/${slug}`} className={`library-featured-card library-featured-${index}`} key={slug}><span>{label}</span><h3>{title}</h3><p>{copy}</p><b>Read the dream study <ArrowRight size={15}/></b></Link>)}</div></section>
    <section className="shell library-collections"><div className="section-label"><div><span className="eyebrow">CURATED READING PATHS</span><h2>Follow the question beneath the image.</h2></div><p>Move across connected dreams to see how one human theme can appear in many symbolic forms.</p></div><div className="library-card-grid">{readingPaths.map(([number, title, description, labels, slugs], index) => <article className={`library-path path-${index}`} key={title as string}><span className="path-number">{number}</span><h3>{title}</h3><p>{description}</p><div className="path-links">{(slugs as string[]).map((slug, linkIndex) => <Link href={`/dreams/${slug}`} key={slug}>{(labels as string[])[linkIndex]} <ArrowRight size={13}/></Link>)}</div></article>)}</div></section>
    <div id="browse-guides"><DreamLibraryBrowser /></div>
    <section className="library-feature"><div className="shell"><div className="feature-copy"><span className="eyebrow">A LIBRARY BUILT FOR DEPTH</span><h2>The most useful reading stays close to the dreamer.</h2><p>DreamAyla studies the details that transform a familiar symbol: who was there, what changed, how the scene felt, and why it may be arriving now.</p><Link className="text-link" href="/how-it-works">Discover the Three-Lens Method <ArrowRight size={16}/></Link></div><div className="library-methods"><div><Sparkles/><b>Symbol</b><span>What ancient or cultural echoes appear?</span></div><div><Layers3/><b>Psyche</b><span>What inner tension or archetype is moving?</span></div><div><Clock3/><b>Self</b><span>What may be asking for attention now?</span></div></div></div></section>
    <section className="shell library-reading"><div className="library-reading-card"><div><span className="eyebrow">FROM READING TO PERSONAL INSIGHT</span><h2>No library can contain your exact dream.</h2><p>Describe the full setting, people, emotion, and waking-life context. DreamAyla will bring the pieces together through Symbol, Psyche, and Self.</p></div><Link className="button" href="/dream-interpreter">Begin my interpretation <ArrowRight size={16}/></Link></div></section>
  </main><Footer /></>;
}
