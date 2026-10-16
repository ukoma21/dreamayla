import { ArrowRight, BrainCircuit, HeartHandshake, LockKeyhole, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";
export const metadata: Metadata = { title: "About the DreamAyla Method", description: "Discover how DreamAyla brings ancient symbolism, Jungian-inspired psychology, and personal insight together in a private dream practice.", alternates: { canonical: "/about" } };

const principles = [
  { icon: BrainCircuit, title: "Symbol · Ancient Wisdom", copy: "Cultural stories and symbolic traditions offer a language for exploring images that have moved through human imagination for centuries." },
  { icon: HeartHandshake, title: "Psyche · Jungian Perspective", copy: "Archetypes, emotions, and inner tensions offer possibilities for reflection—not a diagnosis, prediction, or fixed answer." },
  { icon: LockKeyhole, title: "Self · Ayla Personal Insight", copy: "Your memories, relationships, and present life make the reading personal. Your private dream history helps deeper patterns come into view." },
];

export default function About() {
  return <><Header /><main className="page shell about-page">
    <section className="about-hero">
      <div className="eyebrow">ABOUT DREAMAYLA</div>
      <h1>Dreams are ancient.<br />Their meaning is personal.</h1>
      <p className="lead">DreamAyla is a private dream practice where symbolic wisdom, Jungian-inspired psychology, and your lived experience meet.</p>
      <div className="about-hero-actions"><Link className="button" href="/dream-interpreter">Interpret my dream <ArrowRight size={16} /></Link><Link className="text-link" href="/how-it-works">Discover our method <ArrowRight size={15} /></Link></div>
    </section>
    <section className="about-story card"><div><span className="eyebrow">WHY DREAMAYLA IS DIFFERENT</span><h2>We do not reduce a dream to a definition.</h2></div><div><p>A dream can hold an emotion, a memory, a relationship, and a life transition at the same time. The same symbol can mean something entirely different in another person&apos;s story.</p><p>The DreamAyla Three-Lens Method respects that complexity—beginning with shared symbolic traditions, looking through a Jungian-inspired psychological lens, and returning the meaning to your own life.</p></div></section>
    <section className="about-principles"><div className="section-heading"><span className="eyebrow">THE THREE-LENS METHOD</span><h2>Symbol. Psyche. Self.</h2></div><div className="about-principle-grid">{principles.map(({ icon: Icon, title, copy }) => <article className="card about-principle" key={title}><div className="about-icon"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
    <section className="about-steps"><div><span className="eyebrow">A SMALL PRACTICE</span><h2>Notice. Remember. Revisit.</h2></div><div className="about-step-list"><div><b>01</b><span><strong>Describe what happened</strong><small>Keep the details that still feel vivid.</small></span></div><div><b>02</b><span><strong>Explore the emotional tone</strong><small>Consider how the dream felt, not only what appeared.</small></span></div><div><b>03</b><span><strong>See what changes over time</strong><small>Patterns become clearer when you can return to them.</small></span></div></div></section>
    <section className="about-cta card"><div><Sparkles size={22} /><span className="eyebrow">BEGIN YOUR PRACTICE</span><h2>Bring one dream into focus.</h2></div><Link className="button" href="/dream-interpreter">Interpret my dream <ArrowRight size={16} /></Link></section>
  </main><Footer /></>;
}
