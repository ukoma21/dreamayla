import type { Metadata } from "next";
import Link from "next/link";
import { DreamForm } from "@/components/dream-form";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "AI Dream Interpreter: Interpret My Dream",
  description: "Use DreamAyla's private AI dream interpreter to explore dream meaning through symbolism, Jungian-inspired psychology, emotions, and personal context.",
  keywords: ["AI dream interpreter", "dream interpreter", "interpret my dream", "dream interpretation", "dream meaning", "dream analysis", "dream symbolism", "Jungian dream analysis", "free dream interpretation"],
  alternates: { canonical: "/dream-interpreter" },
  openGraph: {
    title: "AI Dream Interpreter & Dream Analysis | DreamAyla",
    description: "Explore the symbols, emotions, and personal context within your dream through three thoughtful lenses.",
    url: "/dream-interpreter",
  },
};

export default function Interpreter() {
  const baseUrl = "https://dreamayla.com";
  const interpreterSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "DreamAyla AI Dream Interpreter",
        url: `${baseUrl}/dream-interpreter`,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web",
        description: metadata.description,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "First complete dream interpretation free" },
        featureList: ["Personalized dream interpretation", "Dream symbolism", "Jungian-inspired reflection", "Private dream analysis"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Dream Interpretation", item: baseUrl },
          { "@type": "ListItem", position: 2, name: "AI Dream Interpreter", item: `${baseUrl}/dream-interpreter` },
        ],
      },
    ],
  };
  return <><Header /><main className="page shell"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(interpreterSchema) }} /><div className="pagehead"><div className="eyebrow">AI DREAM INTERPRETER · THE DREAMAYLA THREE-LENS METHOD</div><h1>Interpret my dream.<br />Begin with what happened.</h1><p className="sectionintro">Describe what happened, how it felt, and what stayed with you. DreamAyla's AI dream interpreter explores possible meaning through ancient symbolism, Jungian-inspired psychology, and the context of your own life.</p></div><DreamForm /><nav className="statline" aria-label="Explore dream meaning resources"><Link href="/">Dream interpretation overview</Link><Link href="/dream-dictionary">Browse the Dream Dictionary</Link><Link href="/how-it-works">How DreamAyla works</Link></nav></main><Footer /></>;
}
