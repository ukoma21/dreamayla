import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "The DreamAyla Three-Lens Method",
  description: "See how DreamAyla explores every dream through ancient symbolism, Jungian-inspired psychology, and personal insight.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  ["01", "Remember the dream", "Describe the dream as it unfolded—the images, people, emotions, and details that remained with you after waking."],
  ["02", "Add the life around it", "Share the memories, relationships, and present circumstances that may give the dream its personal context."],
  ["03", "Read it through three lenses", "Explore Symbol through ancient wisdom, Psyche through Jungian-inspired psychology, and Self through Ayla Personal Insight."],
  ["04", "Follow the pattern", "Save dreams privately and notice how symbols, emotions, people, and life themes evolve over time."],
];

export default function How() {
  return <><Header /><main className="page shell">
    <div className="pagehead"><div className="eyebrow">SYMBOL · PSYCHE · SELF</div><h1>Three lenses.<br />One deeply personal reading.</h1><p className="sectionintro">The DreamAyla Method brings ancient symbolic wisdom, Jungian-inspired psychology, and your lived experience into one grounded exploration.</p></div>
    <section className="report">{steps.map(([number, title, copy]) => <article className="card" style={{ marginBottom: 14 }} key={number}><span className="number">STEP {number}</span><h2 style={{ margin: "10px 0" }}>{title}</h2><p>{copy}</p></article>)}</section>
    <section className="section center"><h2>Your dream is the beginning of the conversation.</h2><Link className="button" href="/dream-interpreter">Begin My Interpretation</Link></section>
  </main><Footer /></>;
}
