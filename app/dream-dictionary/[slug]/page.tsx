import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { getDreamDictionaryEntry, getRelatedDreamDictionaryEntries, publishedDreamDictionaryEntries } from "@/lib/dream-dictionary";

type Props = { params: Promise<{ slug: string }> };

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamayla.com";

export function generateStaticParams() {
  return publishedDreamDictionaryEntries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getDreamDictionaryEntry(slug);
  if (!entry) return {};
  const canonical = `/dream-dictionary/${entry.slug}`;
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    keywords: [entry.keyword, `${entry.title.toLowerCase()} interpretation`, "dream symbolism", "Jungian dream perspective", "dream dictionary"],
    alternates: { canonical },
    openGraph: { type: "article", title: entry.metaTitle, description: entry.metaDescription, url: canonical },
    twitter: { card: "summary_large_image", title: entry.metaTitle, description: entry.metaDescription }
  };
}

export default async function DreamDictionaryDetailPage({ params }: Props) {
  const { slug } = await params;
  const entry = getDreamDictionaryEntry(slug);
  if (!entry) notFound();
  const related = getRelatedDreamDictionaryEntries(entry);
  const parentTopic = entry.parentTopic && entry.parentTopic !== entry.slug ? getDreamDictionaryEntry(entry.parentTopic) : undefined;
  const clusterChildren = publishedDreamDictionaryEntries.filter((item) => item.parentTopic === entry.slug && item.slug !== entry.slug);
  const pageUrl = `${baseUrl}/dream-dictionary/${entry.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Dream Dictionary", item: `${baseUrl}/dream-dictionary` },
      { "@type": "ListItem", position: 3, name: entry.title, item: pageUrl }
    ]
  };
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.h1,
    description: entry.metaDescription,
    url: pageUrl,
    dateModified: entry.updatedAt,
    isPartOf: { "@type": "WebSite", name: "DreamAyla", url: baseUrl },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.commonScenarios.map((scenario) => ({
      "@type": "Question",
      name: scenario.title,
      acceptedAnswer: { "@type": "Answer", text: scenario.copy }
    }))
  };

  return <><Header /><main className="page shell">
    <article className="report dream-dictionary-entry">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...breadcrumbSchema, "@id": `${pageUrl}#breadcrumb` }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="poop-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/dream-dictionary">Dream Dictionary</Link><span>/</span><span>{entry.title}</span></nav>
      <div className="eyebrow">SYMBOL · PSYCHE · SELF</div>
      <h1>{entry.h1}</h1>
      <p className="lead">{entry.intro}</p>
      {parentTopic && <p className="dictionary-parent-topic">Part of the <Link href={`/dream-dictionary/${parentTopic.slug}`}>{parentTopic.title}</Link> topic cluster.</p>}

      <section><div className="eyebrow">SYMBOL · ANCIENT WISDOM</div><h2>Ancient symbolism</h2>{entry.ancientSymbolism.map((paragraph) => <p className="sectionintro" key={paragraph}>{paragraph}</p>)}</section>
      <section><div className="eyebrow">PSYCHE · JUNGIAN PERSPECTIVE</div><h2>A psychological perspective</h2>{entry.jungianPerspective.map((paragraph) => <p className="sectionintro" key={paragraph}>{paragraph}</p>)}</section>
      <section><div className="eyebrow">SELF · AYLA PERSONAL INSIGHT</div><h2>What it may mean in your life</h2>{entry.personalContext.map((paragraph) => <p className="sectionintro" key={paragraph}>{paragraph}</p>)}</section>

      <section><div className="eyebrow">COMMON DREAM SCENARIOS</div><h2>The details change the reading</h2>{entry.commonScenarios.map((scenario) => <div className="faq" key={scenario.title}><h3>{scenario.title}</h3><p>{scenario.copy}</p></div>)}</section>
      <section><div className="eyebrow">PERSONAL REFLECTION</div><h2>Questions to take with you</h2><ul className="featurelist">{entry.reflectionQuestions.map((question) => <li key={question}>{question}</li>)}</ul></section>

      {clusterChildren.length > 0 && <section><div className="eyebrow">TOPIC CLUSTER</div><h2>Explore this theme in more detail</h2><div className="related-links">{clusterChildren.map((item) => <Link key={item.slug} href={`/dream-dictionary/${item.slug}`}>{item.title}<ArrowRight size={15} /></Link>)}</div></section>}
      {related.length > 0 && <section><div className="eyebrow">RELATED DREAMS</div><h2>Continue exploring</h2><div className="related-links">{related.map((item) => <Link key={item.slug} href={`/dream-dictionary/${item.slug}`}>{item.title}<ArrowRight size={15} /></Link>)}</div></section>}

      <section className="card"><Sparkles size={21} /><div><div className="eyebrow">YOUR DREAM IS MORE PERSONAL THAN A SYMBOL</div><h2>Interpret your dream with Ayla</h2><p>A snake, spider, or body of water can carry many meanings. What it means in your dream depends on what happened, how you felt, and what is unfolding in your life.</p><Link className="button" href="/dream-interpreter">Interpret My Dream with Ayla <ArrowRight size={16} /></Link></div></section>
    </article>
  </main><Footer /></>;
}
