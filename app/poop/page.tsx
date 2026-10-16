import type { Metadata } from "next";
import PoopDreamPage from "@/components/poop-dream-page";

export const metadata: Metadata = {
  title: "Dreaming About Poop: Meaning, Symbolism & Context",
  description: "Explore dreams about poop through release, privacy, boundaries, cultural symbolism, and your personal emotional context.",
  alternates: { canonical: "/dreams/falling" },
};

export default function PoopPage() {
  return <PoopDreamPage />;
}
