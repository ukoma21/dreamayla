import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, Compass, Heart, MapPinned, Sparkles, UsersRound } from "lucide-react";
import { DictionarySearch } from "@/components/dictionary-search";
import { Footer, Header } from "@/components/site-chrome";
import { getDreamDictionaryEntry } from "@/lib/dream-dictionary";

export const metadata: Metadata = {
  title: "24 Common Dreams and Their Meanings",
  description: "What do common dreams mean? Explore 24 familiar themes—including being chased, falling, teeth, water, animals, and relationships—without fixed answers.",
  keywords:["common dreams and their meanings","most common dreams and what they mean","common recurring dreams","common dreams list","dreaming about falling","dreaming about being chased","teeth falling out dream","dream meaning"],
  alternates: { canonical: "/common-dreams" },
  openGraph: { title: "24 Common Dreams and Their Meanings | DreamAyla", description: "Explore familiar dream themes, what they may reflect, and why your feeling and waking-life context matter more than a fixed answer.", url: "/common-dreams", type: "website" },
};

type DreamLink = [string, string, string];
type Category = [string, string, string, typeof BookOpen, DreamLink[]];

const categories: Category[] = [
  ["animals", "Animals", "Animal symbols can bring instinct, boundaries, fear, loyalty, and hidden energy into focus.", UsersRound, [
    ["snakes", "Snakes", "Change, alertness, and a tension you may be watching closely."],
    ["spiders", "Spiders", "Patience, tangled connections, and what keeps returning."],
    ["dogs", "Dogs", "Trust, protection, companionship, and the need for loyalty."],
    ["cats", "Cats", "Independence, intuition, curiosity, and personal space."],
  ]],
  ["nature", "Nature & elements", "Water, fire, air, and weather often give an emotional state a vivid landscape.", Compass, [
    ["water", "Water", "Emotional movement, depth, renewal, and the feeling of being carried."],
    ["fire", "Fire", "Intensity, anger, transformation, release, and what cannot be ignored."],
    ["flying", "Flying", "Freedom, ambition, perspective, and the wish to move beyond limits."],
    ["drowning", "Drowning", "Overwhelm, pressure, and the need for air or support."],
  ]],
  ["relationships", "People & relationships", "People in dreams can represent a relationship, a memory, a quality, or a part of yourself.", Heart, [
    ["dreaming-of-an-ex", "An ex", "Old feelings, familiar patterns, closure, or a past version of you."],
    ["partner-cheating", "A partner cheating", "Reassurance, comparison, trust, and emotional distance—not proof of betrayal."],
    ["wedding", "A wedding", "Commitment, belonging, readiness, and a new chapter coming together."],
    ["family", "Family", "Care, expectations, history, and the role you play around people close to you."],
  ]],
  ["situations", "Situations & emotions", "The action in a dream often matters more than the headline symbol.", MapPinned, [
    ["being-chased", "Being chased", "Pressure, avoidance, boundaries, and the wish to feel safe."],
    ["falling", "Falling", "Uncertainty, loss of control, transition, and finding your footing again."],
    ["missing-a-train", "Missing a train", "Timing, comparison, readiness, and a path you may or may not want."],
    ["being-lost", "Being lost", "Direction, unfamiliar choices, and the search for a place that feels like yours."],
  ]],
  ["body", "Body & identity", "Body dreams can make confidence, vulnerability, self-image, and change feel immediate.", Sparkles, [
    ["teeth-falling-out", "Teeth falling out", "Communication, confidence, visible change, and fear of judgment."],
    ["naked-in-public", "Naked in public", "Exposure, honesty, self-consciousness, and the need for privacy."],
    ["losing-hair", "Losing hair", "Identity, control, ageing, confidence, and a change you cannot hide."],
    ["pregnancy", "Pregnancy", "A plan, identity, responsibility, or possibility developing over time."],
  ]],
  ["objects", "Objects & places", "Familiar objects and locations can hold memories, routines, responsibilities, and personal history.", BookOpen, [
    ["money", "Money", "Value, security, opportunity, effort, and the fear of not having enough."],
    ["losing-your-phone", "Losing your phone", "Connection, privacy, access, communication, and being unreachable."],
    ["house", "A house", "Home, inner life, safety, change, and rooms you may not know yet."],
    ["school", "School", "Evaluation, preparation, old expectations, and learning under pressure."],
  ]],
];

const questions = [
  ["What are the most common dreams?", "Frequently reported themes include being chased, falling, teeth falling out, flying, water, missing transport, being late, public exposure, and dreams about relationships. A familiar scene still needs your emotion and waking-life context to become personally useful."],
  ["What do common dreams mean?", "Common dreams can picture shared human concerns such as safety, control, belonging, change, visibility, and connection. The most useful meaning depends on what happened, how you felt, and what the scene resembles in your life now."],
  ["What is a dream dictionary?", "A dream dictionary is a starting point for exploring recurring symbols and situations. It offers possible associations, not one fixed answer."],
  ["Why can the same dream mean different things?", "The emotion, action, memory, relationships, and current circumstances around a dream can change the most useful interpretation."],
  ["Are common dreams universal?", "Many themes appear across cultures, but their meaning is not universal. Personal memories, cultural background, current stressors, and the dream's emotional tone can change the reading."],
  ["Can common dreams predict the future?", "No. Dreams are subjective experiences for reflection. They do not reliably predict events or diagnose mental or physical health conditions."],
  ["How do I get a more personal reading?", "Start with a guide, then describe the whole scene in DreamAyla's interpreter. Your own context gives the symbol a more specific direction."],
];

const popularDreams: Array<[string, string]> = [
  ["being-chased", "Being chased"],
  ["falling", "Falling"],
  ["teeth-falling-out", "Teeth falling out"],
  ["water", "Water"],
  ["dreaming-about-someone", "Dreaming about someone"],
  ["missing-a-train", "Missing a train"],
];

function dreamGuideHref(slug: string) {
  const dictionarySlug = slug === "snakes" ? "snake" : slug === "spiders" ? "spider" : slug === "partner-cheating" ? "cheating" : slug;
  return getDreamDictionaryEntry(dictionarySlug) ? `/dream-dictionary/${dictionarySlug}` : `/dreams/${slug}`;
}

export default function SharedDreamsPage() {
  const baseUrl = "https://dreamayla.com";
  const commonDreamsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Common Dreams and Their Meanings",
        description: metadata.description,
        url: `${baseUrl}/common-dreams`,
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: categories.flatMap(([, , , , dreams]) => dreams).map(([slug, label], index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: label,
            url: `${baseUrl}${dreamGuideHref(slug)}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: questions.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "DreamAyla", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "Common Dreams and Their Meanings", item: `${baseUrl}/common-dreams` },
        ],
      },
    ],
  };
  return <><Header /><main className="common-dictionary-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(commonDreamsSchema) }} />
    <section className="common-dictionary-hero"><div className="shell"><div className="common-breadcrumb"><Link href="/">DreamAyla</Link><span>/</span><span>Common Dreams</span></div><div className="common-dictionary-heading"><span className="eyebrow">24 COMMON DREAMS · POSSIBLE MEANINGS</span><h1>24 Common Dreams<br /><em>and Their Meanings</em></h1><p>Common dreams often picture shared human concerns—safety, control, belonging, change, visibility, and connection. Their meaning depends on what happened, how you felt, and what is changing in your waking life.</p><DictionarySearch /><nav className="common-popular-links" aria-label="Popular common dream meanings"><span>Popular meanings</span>{popularDreams.map(([slug, label]) => <Link href={`/dream-dictionary/${slug}`} key={slug}>{label}</Link>)}</nav></div></div></section>
    <section className="shell common-dictionary-intro"><div className="common-intro-copy"><span className="eyebrow">HUMAN PATTERNS · PERSONAL STORIES</span><h2>What do common dreams mean?</h2><p>A common dream can point toward a shared concern—pressure, vulnerability, freedom, loss, renewal, or connection—without carrying one universal message. Begin with the scene below, then use your emotion, memories, and waking-life circumstances to test which possibility fits.</p></div><div className="common-intro-panels"><article><BookOpen size={20}/><h3>The collective pattern</h3><p>Discover the symbolic and archetypal themes people have recognized across time.</p></article><article><Heart size={20}/><h3>Your personal version</h3><p>Notice how your emotion, history, and present circumstances transform the dream.</p></article></div></section>
    <section className="shell common-dictionary-browse"><div className="common-browse-head"><div><span className="eyebrow">ARCHETYPES IN EVERYDAY DREAMS</span><h2>Find the human theme beneath the scene.</h2></div><span className="common-count">24 original guides</span></div><nav className="common-category-nav" aria-label="Dream guide categories">{categories.map(([id,title])=><a href={`#${id}`} key={id}>{title}<ArrowRight size={14}/></a>)}</nav><div className="common-category-grid">{categories.map(([id,title,description,Icon,dreams])=><section className="common-category-card" id={id} key={id}><div className="common-category-top"><Icon size={22}/><span>{String(dreams.length).padStart(2,"0")} GUIDES</span></div><h3>{title}</h3><p>{description}</p><div className="common-dream-links">{dreams.map(([slug,label,copy])=><Link href={dreamGuideHref(slug)} key={slug}><span><b>{label}</b><small>{copy}</small></span><ArrowRight size={16}/></Link>)}</div></section>)}</div></section>
    <section className="common-dictionary-note"><div className="shell"><div><span className="eyebrow">A COMMON IMAGE IS NEVER A COMMON ANSWER</span><h2>The difference lives in the details.</h2><p>Was the water calm or rising? Did falling feel terrifying or freeing? Were you escaping—or choosing to stay? That is where a shared archetype becomes your story.</p></div><Link className="button" href="/dream-interpreter">Interpret my version <ArrowRight size={16}/></Link></div></section>
    <section className="shell common-dictionary-faq"><div className="common-faq-intro"><span className="eyebrow">REFLECTION WITHOUT CERTAINTY</span><h2>Keep the reading open and grounded.</h2><p>Common dreams can reveal questions worth exploring. They are not predictions, diagnoses, or proof that one interpretation must be true.</p></div><div className="common-faq-list">{questions.map(([question,answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
    <section className="shell common-dictionary-cta"><div><span className="eyebrow">FROM SHARED ARCHETYPE TO PERSONAL INSIGHT</span><h2>Move beyond the common dream.</h2><p>Describe your complete version and DreamAyla will connect the scene, emotion, symbolic pattern, and waking-life context through three personal lenses.</p></div><div><Link className="button" href="/dream-interpreter">Begin my interpretation <ArrowRight size={16}/></Link><Link className="text-link" href="/dream-journal">Build my dream history <ArrowRight size={15}/></Link></div></section>
  </main><Footer /></>;
}
