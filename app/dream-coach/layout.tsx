import type { Metadata } from "next";

export const metadata: Metadata = {
  title:"Ayla Dream Guide — Personal Dream Reflection",
  description:"Explore private conversations about your saved dream history, recurring symbols, emotions, and personal dream patterns with Ayla Dream Guide.",
  alternates:{canonical:"/dream-coach"},
};

export default function DreamCoachLayout({children}:{children:React.ReactNode}){return children;}
