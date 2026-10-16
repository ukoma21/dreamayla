import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BookOpen,
  BrainCircuit,
  CreditCard,
  Database,
  FileText,
  LibraryBig,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminConfig } from "@/components/admin-config";
import { AdminGate } from "@/components/admin-gate";
import { AdminOrders } from "@/components/admin-orders";

type Operation = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  action: string;
};

const operations: Operation[] = [
  {
    icon: MessageCircleHeart,
    title: "Ayla consultations",
    description: "Open the private inbox to read each member's question and send a personal reply.",
    href: "/admin/ayla-consultations",
    action: "Open consultation inbox",
  },
  {
    icon: UsersRound,
    title: "Member experience",
    description: "Review the space members use to find saved dreams, plan status, and useful next steps.",
    href: "/dashboard",
    action: "Open member dashboard",
  },
  {
    icon: CreditCard,
    title: "Billing & renewals",
    description: "Check the customer billing view for plan status, renewals, receipts, and membership actions.",
    href: "/billing",
    action: "Open billing area",
  },
  {
    icon: BadgeDollarSign,
    title: "Membership plans",
    description: "Review the public plan comparison and the upgrade journey before a member starts checkout.",
    href: "/pricing",
    action: "Review plans",
  },
  {
    icon: Sparkles,
    title: "Interpretation experience",
    description: "Follow the first-report flow and make sure the personal interpretation entry point remains clear.",
    href: "/dream-interpreter",
    action: "Open interpreter",
  },
];

const contentAreas: Operation[] = [
  {
    icon: LibraryBig,
    title: "Dream Library",
    description: "Original long-form guides and themed reading paths for discoverability and search traffic.",
    href: "/dream-library",
    action: "Review library",
  },
  {
    icon: BookOpen,
    title: "Common Dreams",
    description: "Browse the shared-dream collection, grouped by the questions people return to most.",
    href: "/common-dreams",
    action: "Review common dreams",
  },
  {
    icon: FileText,
    title: "Dream Dictionary",
    description: "Inspect symbol pages, internal links, and the SEO-focused starting point for each topic.",
    href: "/dream-dictionary",
    action: "Open dictionary",
  },
  {
    icon: WandSparkles,
    title: "Reflection Tools",
    description: "Check the guided reflection surface used alongside dream reports and discovery content.",
    href: "/tools",
    action: "Open tools",
  },
];

function OperationCard({ operation, compact = false }: { operation: Operation; compact?: boolean }) {
  const Icon = operation.icon;
  return <Link className={compact ? "admin-content-card" : "admin-operation-card"} href={operation.href}>
    <div className="admin-operation-icon"><Icon size={compact ? 19 : 21} /></div>
    <div>
      <h3>{operation.title}</h3>
      <p>{operation.description}</p>
    </div>
    <span>{operation.action} <ArrowRight size={15} /></span>
  </Link>;
}

export default function AdminPage() {
  return <>
    <Header />
    <AdminGate><main className="page shell admin-page">
      <div className="pagehead admin-pagehead">
        <div className="eyebrow">ADMIN CONSOLE</div>
        <h1>DreamAyla operations</h1>
        <p className="sectionintro">A protected operational overview for membership, dream activity, interpretation activity, content surfaces, and deployment readiness.</p>
      </div>

      <section className="admin-command">
        <div>
          <span className="eyebrow">SYSTEM STATUS</span>
          <h2>Keep the experience reliable from first report to renewal.</h2>
          <p>Private dream text is never displayed in this console. Metrics are aggregated and access is restricted to the single owner administrator account.</p>
        </div>
        <div className="admin-status">
          <span><i /> Authentication</span>
          <span><i /> Interpretation service</span>
          <span><i /> Payment setup</span>
        </div>
      </section>

      <section className="admin-section-heading"><div><span className="eyebrow">LIVE OVERVIEW</span><h2>Daily operating signals</h2></div><p>Use these totals to monitor growth and ensure account flows are connected.</p></section>
      <AdminDashboard />

      <AdminOrders />

      <section className="admin-section-heading"><div><span className="eyebrow">MEMBERSHIP OPERATIONS</span><h2>Review the customer journey.</h2></div><p>Open the same surfaces a member sees—from their dashboard through billing and renewal.</p></section>
      <section className="admin-operation-grid">
        {operations.map((operation) => <OperationCard operation={operation} key={operation.title} />)}
      </section>

      <section className="admin-section-heading"><div><span className="eyebrow">CONTENT & DISCOVERY</span><h2>Keep public learning spaces useful.</h2></div><p>Review guides and discovery pages without exposing any private account data.</p></section>
      <section className="admin-content-grid">
        {contentAreas.map((operation) => <OperationCard operation={operation} compact key={operation.title} />)}
      </section>

      <section className="admin-workbench">
        <div className="card">
          <span className="eyebrow">DEPLOYMENT CHECKLIST</span>
          <h2>Before accepting live members</h2>
          <ul>
            <li>Confirm the production domain and Supabase redirect URL.</li>
            <li>Apply the database migration and verify saved dreams.</li>
            <li>Add live PayPal credentials and a public HTTPS webhook.</li>
            <li>Confirm the owner administrator email is set for the deployment.</li>
          </ul>
        </div>
        <div className="card">
          <span className="eyebrow">CUSTOMER FLOW</span>
          <h2>Review essential routes</h2>
          <div className="admin-quick-links">
            <Link href="/signup">Sign-up flow <ArrowRight size={14} /></Link>
            <Link href="/login">Sign-in flow <ArrowRight size={14} /></Link>
            <Link href="/billing">Billing & renewal <ArrowRight size={14} /></Link>
            <Link href="/dashboard">Member dashboard <ArrowRight size={14} /></Link>
            <Link href="/dream-journal">Dream journal <ArrowRight size={14} /></Link>
            <Link href="/dream-coach">Dream coach <ArrowRight size={14} /></Link>
            <Link href="/admin/ayla-consultations">Ayla consultations <ArrowRight size={14} /></Link>
          </div>
          <p className="notice">Settings with secrets remain environment-only and are never entered or exposed through the browser.</p>
        </div>
      </section>

      <AdminConfig />
      <section className="admin-security"><ShieldCheck size={18} /><p>Administrator access is granted only to the one signed-in owner email stored in <code>ADMIN_EMAIL</code>. Customer accounts always remain in the member dashboard.</p></section>
    </main></AdminGate>
    <Footer />
  </>;
}
