import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./library-pages.css";
import "./ui-overrides.css";
import "./poop-page.css";
import { LocaleProvider } from "@/components/locale-provider";
import { MembershipProvider } from "@/components/membership-provider";
import { CookieConsent } from "@/components/cookie-consent";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dreamayla.com";
export const metadata: Metadata = {
  metadataBase:new URL(appUrl),
  applicationName:"DreamAyla",
  title:{default:"DreamAyla — Dream Interpretation, Meaning & Symbolism",template:"%s | DreamAyla"},
  description:"Explore dream meanings with private, personalized dream interpretation through ancient symbolism, Jungian-inspired psychology, and personal insight.",
  keywords:["dream interpretation","dream interpreter","dream meaning","dream analysis","what does my dream mean","online dream interpretation","dream symbolism","dream symbols","dream dictionary","common dreams","recurring dreams","dream psychology","Jungian dream analysis","personal insight","self discovery","dream journal","baby name meanings","baby name analysis","name analysis"],
  authors:[{name:"DreamAyla",url:"/about"}],
  creator:"DreamAyla",
  publisher:"DreamAyla",
  category:"Dream interpretation and personal insight",
  manifest:"/manifest.webmanifest",
  robots:{index:true,follow:true,googleBot:{index:true,follow:true,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}},
  icons:{icon:[{url:"/icon.svg",type:"image/svg+xml"}],apple:[{url:"/icon.svg",type:"image/svg+xml"}],shortcut:["/icon.svg"]},
  openGraph:{type:"website",siteName:"DreamAyla",locale:"en_US",url:"/",title:"DreamAyla — Dream Interpretation, Meaning & Symbolism",description:"A private dream interpretation experience through ancient symbolism, Jungian-inspired psychology, and personal insight."},
  twitter:{card:"summary_large_image",title:"DreamAyla — Dream Interpretation, Meaning & Symbolism",description:"Explore dream symbols, psychology, and personal meaning through the DreamAyla Three-Lens Method."}
};

// Declare the viewport explicitly. This keeps the responsive breakpoints tied
// to the actual device width rather than a desktop-sized virtual viewport.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbf8ff",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  const schema={"@context":"https://schema.org","@graph":[
    {"@type":"Organization","@id":`${appUrl}/#organization`,name:"DreamAyla",url:appUrl,logo:`${appUrl}/icon.svg`,description:"A private dream practice bringing together ancient symbolism, Jungian-inspired psychology, and personal insight."},
    {"@type":"WebSite","@id":`${appUrl}/#website`,name:"DreamAyla",url:appUrl,inLanguage:"en",publisher:{"@id":`${appUrl}/#organization`},description:"Dream interpretation, dream meanings, symbolism, Jungian-inspired psychology, and personal insight through the DreamAyla Three-Lens Method."}
  ]};
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><LocaleProvider initialLocale="en"><MembershipProvider>{children}</MembershipProvider></LocaleProvider><CookieConsent /></body></html>;
}
