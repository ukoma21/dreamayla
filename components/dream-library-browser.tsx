"use client";

import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Topic = {
  slug: string;
  title: string;
  category: "Pressure & change" | "Relationships" | "Identity & body" | "Places & journeys" | "Nature & instinct";
  summary: string;
  signal: string;
};

const topics: Topic[] = [
  { slug: "being-chased", title: "Being Chased", category: "Pressure & change", summary: "Urgency, avoidance, and the feeling that something is asking to be faced.", signal: "Pressure" },
  { slug: "car-crash", title: "A Car Crash", category: "Places & journeys", summary: "Direction, pace, and worries about a plan veering off course.", signal: "Direction" },
  { slug: "water", title: "Water", category: "Nature & instinct", summary: "Emotional weather, release, recovery, and feelings that keep moving.", signal: "Emotion" },
  { slug: "flood", title: "A Flood", category: "Nature & instinct", summary: "Rising pressure, crossed boundaries, survival, and what you try to protect.", signal: "Overwhelm" },
  { slug: "late-for-something", title: "Being Late", category: "Pressure & change", summary: "Deadlines, expectations, and a mind trying to catch up with a full life.", signal: "Expectations" },
  { slug: "trapped", title: "Feeling Trapped", category: "Pressure & change", summary: "Constraints, difficult choices, and the search for a realistic way forward.", signal: "Boundaries" },
  { slug: "falling", title: "Poop", category: "Identity & body", summary: "Release, boundaries, embarrassment, and the wish to clear out what you no longer want to carry.", signal: "Release" },
  { slug: "missing-a-train", title: "Missing a Train", category: "Places & journeys", summary: "Timing, comparison, opportunity, and the fear of being left behind.", signal: "Timing" },
  { slug: "fire", title: "Fire", category: "Nature & instinct", summary: "Intensity, anger, warmth, transformation, and what can no longer be ignored.", signal: "Intensity" },
  { slug: "spiders", title: "Spiders", category: "Nature & instinct", summary: "Unease, patience, entanglement, and the quiet work of making something.", signal: "Connection" },
  { slug: "dreaming-of-an-ex", title: "An Ex", category: "Relationships", summary: "Old attachments, repeating relationship patterns, and the self you were then.", signal: "Memory" },
  { slug: "dreaming-about-someone", title: "Someone", category: "Relationships", summary: "Why a familiar person, stranger, or recurring figure may appear—and why the dream cannot reveal their thoughts.", signal: "Connection" },
  { slug: "family", title: "Family", category: "Relationships", summary: "Belonging, inherited roles, care, conflict, and the boundaries around people closest to you.", signal: "Belonging" },
  { slug: "wedding", title: "A Wedding", category: "Relationships", summary: "Commitment, belonging, life changes, and the expectations around a new chapter.", signal: "Commitment" },
  { slug: "teeth-falling-out", title: "Teeth Falling Out", category: "Identity & body", summary: "Voice, confidence, appearance, and the fear of feeling exposed.", signal: "Self-image" },
  { slug: "naked-in-public", title: "Naked in Public", category: "Identity & body", summary: "Vulnerability, authenticity, and what it feels like to be seen too soon.", signal: "Exposure" },
  { slug: "pregnancy", title: "Pregnancy", category: "Identity & body", summary: "A plan, identity, or possibility that is slowly taking shape.", signal: "Becoming" },
  { slug: "losing-your-phone", title: "Losing Your Phone", category: "Relationships", summary: "Connection, availability, privacy, and the people you need to reach.", signal: "Contact" },
  { slug: "death", title: "Death", category: "Pressure & change", summary: "Endings, grief, emotional distance, and the beginning of a different chapter.", signal: "Transition" },
  { slug: "money", title: "Money", category: "Identity & body", summary: "Security, self-worth, choices, and what feels valuable or scarce right now.", signal: "Value" },
  { slug: "being-robbed", title: "Being Robbed", category: "Pressure & change", summary: "A fear of losing security, privacy, time, trust, or something you worked hard to protect.", signal: "Security" },
  { slug: "being-shot", title: "Being Shot", category: "Pressure & change", summary: "Sudden threat, harsh words, betrayal, or a moment that left you feeling exposed.", signal: "Impact" },
  { slug: "partner-cheating", title: "A Partner Cheating", category: "Relationships", summary: "Trust, comparison, distance, and the need for reassurance—not proof of an actual betrayal.", signal: "Trust" },
  { slug: "being-lost", title: "Being Lost", category: "Places & journeys", summary: "Unclear direction, unfamiliar choices, and the search for a place that feels like yours.", signal: "Direction" },
  { slug: "drowning", title: "Drowning", category: "Nature & instinct", summary: "Overwhelm, emotional pressure, and the need for air, support, or a boundary.", signal: "Capacity" },
  { slug: "earthquake", title: "An Earthquake", category: "Nature & instinct", summary: "A shaken foundation, sudden change, or a life situation that no longer feels stable.", signal: "Stability" },
  { slug: "tornado", title: "A Tornado", category: "Nature & instinct", summary: "Fast-moving stress, conflict, or the feeling that events are spinning beyond your control.", signal: "Urgency" },
  { slug: "prison", title: "Prison", category: "Pressure & change", summary: "Restriction, consequences, a stuck routine, or a wish to reclaim choice.", signal: "Freedom" },
  { slug: "baby", title: "A Baby", category: "Identity & body", summary: "Vulnerability, care, new responsibility, and something in your life that needs attention.", signal: "Care" },
  { slug: "losing-hair", title: "Losing Hair", category: "Identity & body", summary: "Self-image, ageing, control, and the fear that a visible part of you is changing.", signal: "Identity" },
  { slug: "unable-to-scream", title: "Unable to Scream", category: "Identity & body", summary: "A blocked voice, unspoken need, or the feeling that help cannot hear you yet.", signal: "Expression" },
];

const categories = ["All", "Pressure & change", "Relationships", "Identity & body", "Places & journeys", "Nature & instinct"] as const;

export function DreamLibraryBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const visibleTopics = useMemo(() => {
    const term = query.trim().toLowerCase();
    return topics.filter((topic) => (category === "All" || topic.category === category) && (!term || `${topic.title} ${topic.category} ${topic.summary}`.toLowerCase().includes(term)));
  }, [category, query]);

  return <section className="library-browser shell" aria-labelledby="library-browser-title">
    <div className="library-browser-head">
      <div>
        <span className="eyebrow">BROWSE THE COLLECTION</span>
        <h2 id="library-browser-title">Find the scene you remember.</h2>
        <p>Every guide opens into a fuller reading with several perspectives, practical reflection questions, and common variations of the dream.</p>
      </div>
      <span className="topic-count">{visibleTopics.length} detailed guides</span>
    </div>
    <div className="library-browser-controls">
      <label className="library-search" aria-label="Search dream guides"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a dream, feeling, or situation" /></label>
      <div className="library-filters" aria-label="Filter dream guides"><SlidersHorizontal size={16}/>{categories.map((item) => <button type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>
    </div>
    <div className="library-topic-grid">
      {visibleTopics.map((topic, index) => <Link href={topic.slug === "flood" || topic.slug === "unable-to-scream" || topic.slug === "losing-hair" || topic.slug === "being-robbed" || topic.slug === "tornado" || topic.slug === "earthquake" || topic.slug === "money" || topic.slug === "family" || topic.slug === "late-for-something" || topic.slug === "dreaming-about-someone" ? `/dream-dictionary/${topic.slug}` : `/dreams/${topic.slug}`} className="library-topic" key={topic.slug}>
        <div className="library-topic-top"><span>GUIDE {String(index + 1).padStart(2, "0")}</span><span>{topic.category}</span></div>
        <h3>{topic.title}</h3>
        <p>{topic.summary}</p>
        <div className="library-topic-bottom"><b>{topic.signal}</b><span>Read full guide <ArrowRight size={15}/></span></div>
      </Link>)}
    </div>
    {!visibleTopics.length && <div className="library-empty"><h3>No guide matches that search yet.</h3><p>Try a broad word such as “change”, “water”, “relationship”, or “pressure”.</p></div>}
  </section>;
}
