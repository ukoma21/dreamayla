import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DreamAyla — Ancient Wisdom for Your Inner World",
    short_name: "DreamAyla",
    description: "Symbol. Psyche. Self. A private dream practice through ancient wisdom, Jungian-inspired psychology, and personal insight.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffcff",
    theme_color: "#5f2da1",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
