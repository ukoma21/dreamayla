import { ArrowLeft, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { AdminConsultations } from "@/components/admin-consultations";
import { AdminGate } from "@/components/admin-gate";
import { Footer, Header } from "@/components/site-chrome";

export default function AylaConsultationsAdminPage() {
  return <><Header /><AdminGate><main className="page shell admin-page">
    <div className="pagehead admin-pagehead">
      <div className="eyebrow">ADMIN · AYLA CONSULTATIONS</div>
      <h1>Personal reply inbox</h1>
      <p className="sectionintro">Review one-to-one requests and Ayla Dream Guide questions, then continue the conversation in the same private thread.</p>
      <Link className="text-link" href="/admin"><ArrowLeft size={15} /> Back to admin console</Link>
    </div>
    <section className="admin-consultation-intro"><HeartHandshake size={22} /><div><b>Private by design</b><span>This combined inbox is visible only to the single DreamAyla owner administrator.</span></div></section>
    <AdminConsultations />
  </main></AdminGate><Footer /></>;
}
