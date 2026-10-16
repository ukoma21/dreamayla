export const locales=["en"] as const;
export type Locale=(typeof locales)[number];
export const labels:Record<Locale,string>={en:"English"};
export const translations:Record<Locale,Record<string,string>>={
  en:{dictionary:"Dream Dictionary",how:"How it Works",pricing:"Pricing",login:"Log in",start:"Get Started",badge:"SYMBOL · PSYCHE · SELF",hero:"Where ancient wisdom meets your inner world.",lead:"Explore your dreams through ancient symbolism, Jungian-inspired psychology, and insight shaped by your life.",placeholder:"Describe your dream…",interpret:"Interpret My Dream",analyzing:"Reading the symbols…",private:"Private by design · First complete reading free",language:"Language",first:"First reading",free:"free",questions:"guided reflections",journal:"private journal",what:"What did you dream about?",context:"Tell us everything you remember. The more context you share, the more personal the three-lens interpretation can become.",title:"Dream title",optional:"optional",description:"Dream description",mood:"Mood"}
};
