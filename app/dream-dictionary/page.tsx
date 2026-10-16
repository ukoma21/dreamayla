import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Heart, Sparkles } from "lucide-react";
import { DictionarySearch } from "@/components/dictionary-search";
import { Footer, Header } from "@/components/site-chrome";
import { getDreamDictionaryEntry, publishedDreamDictionaryEntries } from "@/lib/dream-dictionary";
export const metadata: Metadata = { title: "Dream Dictionary: What Do Dreams Mean?", description: "Search common dream symbols and explore what dreams may mean through cultural symbolism, psychological perspectives, emotion, and personal context.", keywords:["dream dictionary","dream symbols","dream meanings","dream symbol meaning","what dreams mean","online dream dictionary"], alternates: { canonical: "/dream-dictionary" }, openGraph: { title: "Dream Dictionary: What Do Dreams Mean? | DreamAyla", description: "Explore common dream symbols through cultural meaning, emotion, psychology, and personal context.", url: "/dream-dictionary" } };

const groups: Array<[string, string[]]> = [["A–F", ["Baby", "Being Chased", "Being Lost", "Being Robbed", "Being Shot", "Black Snake", "Car Crash", "Cheating", "Death", "Dreaming About Someone", "Dreaming of an Ex", "Drowning", "Earthquake", "Falling", "Family", "Fire", "Flood", "Flying"]], ["H–M", ["House", "Late for Something", "Losing Hair", "Losing Your Phone", "Missing a Train", "Money", "Naked in Public"]], ["P–Z", ["Pregnancy", "School", "Snakes", "Snake Bite", "Snake in House", "Spiders", "Teeth Falling Out", "Tornado", "Trapped", "Unable to Scream", "Water", "Wedding"]]];

function dreamHref(title: string) {
  const legacySlug = title.toLowerCase().replaceAll(" ", "-");
  const slug = legacySlug === "snakes" ? "snake" : legacySlug === "spiders" ? "spider" : legacySlug;
  return getDreamDictionaryEntry(slug) ? `/dream-dictionary/${slug}` : `/dreams/${legacySlug}`;
}

export default function Dictionary() {
  const baseUrl = "https://dreamayla.com";
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Dream Dictionary",
    description: metadata.description,
    url: `${baseUrl}/dream-dictionary`,
    isPartOf: { "@type": "WebSite", name: "DreamAyla", url: baseUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publishedDreamDictionaryEntries.length,
      itemListElement: publishedDreamDictionaryEntries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: entry.title,
        url: `${baseUrl}/dream-dictionary/${entry.slug}`
      }))
    }
  };
  return <><Header /><main className="dictionary-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} /><section className="dictionary-hero"><div className="shell"><div className="eyebrow">THE SYMBOL LENS · DREAM DICTIONARY</div><h1>What do dreams mean?<br /><em>Begin with the symbol.</em></h1><p className="lead">Enter through an image, object, person, or scene. Discover its cultural echoes—then look closer at the emotion and life context that make the dream uniquely yours.</p><DictionarySearch /></div></section><section className="shell dictionary-intro"><div className="dictionary-copy"><div className="eyebrow">SYMBOLS ARE SHARED · MEANING IS LIVED</div><h2>Begin with the symbol.<br />Continue with the dreamer.</h2><p>A symbol can carry centuries of stories without having one universal definition. DreamAyla treats tradition as a doorway: your reaction, memories, and present life decide which possibilities feel worth exploring.</p><div className="mini-points"><span><Heart size={17} /> Ancient echoes</span><span><Compass size={17} /> Emotional tone</span><span><Sparkles size={17} /> Personal context</span></div></div></section><section className="shell featured-dreams"><div className="section-label"><div><div className="eyebrow">SYMBOLS PEOPLE RETURN TO</div><h2>Begin with what stayed with you.</h2></div><p>Open a familiar scene, then read beyond its most obvious meaning.</p></div><div className="featured-grid">{[["Teeth Falling Out", "Voice, confidence, and visible change", "Teeth falling out dreams can bring communication, self-image, vulnerability, and loss of control into focus."], ["Water", "Emotion, movement, and renewal", "Water can bring calm, depth, uncertainty, or overwhelm into focus. Its state and your response shape the reading."], ["Flying", "Freedom, perspective, and possibility", "Flying can raise questions about release, confidence, effort, and what you are moving toward."]].map(([title, sub, copy], i) => <Link className={`featured-card featured-${i}`} href={dreamHref(title)} key={title}><span className="featured-number">0{i + 1}</span><h3>{title}</h3><strong>{sub}</strong><p>{copy}</p><span className="read-more">Explore the symbol <ArrowRight size={15} /></span></Link>)}</div></section><section className="shell dictionary-groups"><div className="section-label"><div><div className="eyebrow">THE SYMBOL INDEX</div><h2>Browse the images of the inner world.</h2></div><span className="library-count">{publishedDreamDictionaryEntries.length} detailed guides</span></div>{groups.map(([letter, words]) => <div className="letter-row" key={letter}><div className="letter-mark">{letter}</div><div className="letter-words">{words.map(w => <Link href={dreamHref(w)} key={w}>{w}<ArrowRight size={14} /></Link>)}</div></div>)}</section><section className="shell dictionary-cta"><div><div className="eyebrow">WHEN THE SYMBOL IS ONLY THE BEGINNING</div><h2>Your full dream holds the deeper meaning.</h2><p>Bring DreamAyla the complete scene and explore it through Symbol, Psyche, and Self—not a one-word definition.</p></div><Link className="button" href="/dream-interpreter">Interpret my full dream <ArrowRight size={16} /></Link></section></main><Footer /></>;
}
