import type { MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots{
  const base="https://dreamayla.com";
  return {
    rules:{
      userAgent:"*",
      allow:"/",
      disallow:["/api/","/admin","/auth/","/billing","/dashboard","/settings","/login","/signup","/verify-email","/consultations","/dream-coach","/dream-dna","/dream-patterns","/dream-journal","/dream-interpreter/questions","/dream-interpreter/result/"],
    },
    sitemap:`${base}/sitemap.xml`,
    host:base,
  };
}
