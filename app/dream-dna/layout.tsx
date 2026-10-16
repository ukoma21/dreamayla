import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Dream DNA — Recurring Dream Symbols & Patterns",
  description:"Discover recurring dream symbols, emotional themes, and long-term patterns across your private dream history.",
  alternates:{canonical:"/dream-dna"},
};

export default function DreamDnaLayout({children}:{children:React.ReactNode}){return children;}
