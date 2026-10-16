import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Baby Name Meaning, Name Analysis & Personal Insight Tools",
  description:"Explore baby name meanings, cultural symbolism, linguistic beauty, traditional naming principles, birth chart themes, and personal insight tools.",
  keywords:["baby name meanings","baby name analysis","baby name ideas","name meaning","meaningful baby names","birth chart","personal insight tools"],
  alternates:{canonical:"/tools"},
  openGraph:{title:"Baby Name Meaning & Personal Insight Tools | DreamAyla",description:"Explore meaningful names, cultural symbolism, naming traditions, and personal insight tools.",url:"/tools",type:"website"},
};

export default function ToolsLayout({children}:{children:React.ReactNode}){return children;}
