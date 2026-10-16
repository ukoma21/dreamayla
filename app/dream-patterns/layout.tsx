import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Recurring Dream Patterns, Symbols & Emotions",
  description:"Explore recurring symbols, emotions, people, places, and themes across your private dream journal.",
  alternates:{canonical:"/dream-patterns"},
};

export default function DreamPatternsLayout({children}:{children:React.ReactNode}){return children;}
