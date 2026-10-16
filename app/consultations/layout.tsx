import type { Metadata } from "next";

export const metadata: Metadata = { title: "Private Consultations", robots: { index: false, follow: false } };

export default function ConsultationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
