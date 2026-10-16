import type { Metadata } from "next";
export const metadata:Metadata={title:"Your Private Dream Journal",description:"Save and revisit your private dreams, interpretations, emotions, and recurring symbols.",robots:{index:false,follow:false}};
export default function DreamJournalLayout({children}:{children:React.ReactNode}){return children;}
