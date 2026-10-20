import type { Metadata } from "next";
import { Footer, Header } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Editorial Policy and DreamAyla Method",
  description: "How DreamAyla researches, writes, reviews, corrects, and updates dream interpretation content.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  return <><Header /><main className="page shell report legal-page">
    <div className="pagehead"><span className="eyebrow">HOW WE CREATE CONTENT</span><h1>Editorial Policy</h1><p className="sectionintro">DreamAyla treats dream meaning as an invitation to reflection, not a fixed answer. Our public content is designed to be useful, original, transparent, and safe.</p><p className="legal-updated">Last updated: October 20, 2026</p></div>
    <div className="legal-grid">
      <section className="card"><h2>The Three-Lens Method</h2><p>Our guides balance three perspectives: cultural and ancient symbolic traditions, Jungian-inspired psychology, and personal insight grounded in the dreamer’s own feelings and circumstances. No single lens is presented as the universal meaning of a dream.</p></section>
      <section className="card"><h2>Research and originality</h2><p>Each public guide is prepared to answer a distinct search intent and provide independent value. We compare symbolic traditions, psychological frameworks, recurring scenarios, and reflective questions. We do not publish pages that merely swap keywords into the same template.</p></section>
      <section className="card"><h2>Human review and AI assistance</h2><p>AI tools may assist with research organization, drafting, editing, or language clarity. Public content is reviewed for relevance, readability, internal consistency, unsafe claims, and alignment with DreamAyla’s method before publication. AI output is not treated as a source of fact by itself.</p></section>
      <section className="card"><h2>Sources and uncertainty</h2><p>Where a factual or historical claim benefits from a source, we aim to use reliable primary or established references. Symbolic interpretations can differ between cultures and individuals, so we describe them as perspectives rather than facts about a person’s future, health, or relationships.</p></section>
      <section className="card"><h2>Health and safety boundaries</h2><p>DreamAyla does not diagnose, treat, or predict medical or mental-health conditions. We do not claim to read another person’s mind, guarantee an outcome, or replace qualified professional advice. Content involving distress is framed with care and encourages appropriate professional support when needed.</p></section>
      <section className="card"><h2>Corrections and updates</h2><p>We update pages when wording is unclear, links break, information becomes outdated, or reader and search data reveal a better way to answer the question. To report a possible error, email <a href="mailto:linra612@gmail.com">linra612@gmail.com</a> with the page URL and a brief explanation.</p></section>
      <section className="card"><h2>Advertising and independence</h2><p>Advertising or partnerships do not determine the symbolic meaning presented in an article. Sponsored material, if introduced, will be identified. DreamAyla does not sell rankings, buy links, exchange links, or accept payment to make a particular interpretation appear true.</p></section>
      <section className="card"><h2>Reader responsibility</h2><p>Dream interpretation is subjective. Readers should keep what feels useful, question what does not, and make important health, legal, financial, or safety decisions using qualified sources—not a dream guide.</p></section>
    </div>
  </main><Footer /></>;
}
