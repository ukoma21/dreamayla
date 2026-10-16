"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CreditCard,
  FileText,
  LibraryBig,
  MessageSquare,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession, supabaseBrowser } from "@/lib/supabase/client";
import { useMembership } from "@/components/membership-provider";

type DashboardData = {
  dreamCount: number;
  commonEmotion: string;
  dataSourceUnavailable?: boolean;
  subscription: { plan: string; status: string; billingPlan?: string | null; currentPeriodEnd?: string | null } | null;
  patterns: { id: string; name: string; frequency: number }[];
  recentDreams: {
    id: string;
    title: string | null;
    mood: string | null;
    summary: string | null;
    createdAt: string;
  }[];
};

const practiceLinks = [
  {
    href: "/dream-journal",
    title: "Dream Journal",
    description: "Revisit every saved report and add a new dream.",
    icon: BookOpen,
    tone: "journal",
  },
  {
    href: "/dream-patterns",
    title: "Dream Patterns",
    description: "Notice recurring themes, emotions, and symbols.",
    icon: BarChart3,
    tone: "patterns",
  },
  {
    href: "/dream-dna",
    title: "Dream DNA",
    description: "See the long-term signature your dreams are creating.",
    icon: BrainCircuit,
    tone: "dna",
  },
  {
    href: "/dream-coach",
    title: "Ayla Dream Guide",
    description: "Personal dream guidance shaped by your saved dream history.",
    icon: MessageSquare,
    tone: "coach",
  },
] as const;

const discoveryLinks = [
  {
    href: "/dream-library",
    title: "Dream Library",
    description: "Read detailed guides for common scenes and symbols.",
    icon: LibraryBig,
  },
  {
    href: "/common-dreams",
    title: "Common Dreams",
    description: "Compare the questions beneath familiar dream experiences.",
    icon: Sparkles,
  },
  {
    href: "/dream-dictionary",
    title: "Dream Dictionary",
    description: "Browse a concise starting point for individual symbols.",
    icon: FileText,
  },
  {
    href: "/tools",
    title: "Reflection Tools",
    description: "Try guided prompts for a different perspective.",
    icon: WandSparkles,
  },
] as const;

function RenewalCopy({ subscription }: { subscription: DashboardData["subscription"] }) {
  if (!subscription) return <>Your first report is free. Choose a membership when you are ready to keep exploring.</>;
  if (subscription.currentPeriodEnd) {
    return <>Your {subscription.plan.toLowerCase()} plan is active and renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.</>;
  }
  return <>Your {subscription.plan.toLowerCase()} plan is {subscription.status.toLowerCase()}. Open billing to view renewal and receipt details.</>;
}

export default function DashboardPage() {
  const membershipState = useMembership();
  const [data, setData] = useState<DashboardData | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Loading your private dream space…");

  useEffect(() => {
    void (async () => {
      try {
        const supabase = supabaseBrowser();
        const session = await getBrowserSession();
        if (!session) {
          setMessage("Sign in to see your journal, membership, and dream patterns.");
          return;
        }
        setEmail(session.user.email ?? "");
        const response = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!response.ok) throw new Error();
        const dashboard = (await response.json()) as DashboardData;
        setData(dashboard);
        setMessage(
          dashboard.dataSourceUnavailable
            ? "Your account is ready. Connect the database to begin saving journal entries."
            : "",
        );
      } catch {
        setMessage("Your account services are not connected yet. Complete the Supabase and database setup to activate this area.");
      }
    })();
  }, []);

  const subscription = membershipState.status === "ACTIVE" ? {
    ...(data?.subscription ?? {}),
    plan: membershipState.billingPlan === "plus" ? "Dreamayla Premium" : "Dream Journal",
    billingPlan: membershipState.billingPlan,
    status: membershipState.status,
  } as DashboardData["subscription"] : data?.subscription ?? null;
  const hasAylaAccess = subscription?.status === "ACTIVE" && subscription?.billingPlan === "plus";

  return <>
    <Header />
    <main className="page shell dashboard-page">
      <div className="pagehead dashboard-head">
        <div>
          <div className="eyebrow">YOUR PRIVATE SPACE</div>
          <h1>Your dream journey</h1>
          <p className="sectionintro">
            {email ? `Welcome back, ${email}.` : "A calmer way to notice what your dreams return to over time."}
          </p>
        </div>
        <Link className="button dashboard-new-dream" href="/dream-interpreter">
          Interpret a dream <ArrowRight size={16} />
        </Link>
      </div>

      {message && <div className="card dashboard-message">{message} {!email && <Link href="/login">Sign in</Link>}</div>}

      <section className="dashboard-stats" aria-label="Dream account overview">
        <article className="card stat-card"><BookOpen size={19} /><span>Dreams recorded</span><strong>{data?.dreamCount ?? "—"}</strong></article>
        <article className="card stat-card"><Sparkles size={19} /><span>Common emotion</span><strong>{data?.commonEmotion ?? "—"}</strong></article>
        <article className="card stat-card"><BarChart3 size={19} /><span>Recurring patterns</span><strong>{data?.patterns.length ?? "—"}</strong></article>
        <article className="card stat-card"><BrainCircuit size={19} /><span>Membership</span><strong>{subscription?.plan ?? "Free"}</strong></article>
      </section>

      <section className="dashboard-membership card">
        <div className="membership-copy">
          <span className="eyebrow">MEMBERSHIP & BILLING</span>
          <h2>{subscription?.status === "ACTIVE" ? "Your membership is active" : "Continue your dream practice"}</h2>
          <p><RenewalCopy subscription={subscription} /></p>
        </div>
        <div className="membership-actions">
          {hasAylaAccess && <Link className="button" href="/dream-coach" prefetch><MessageSquare size={16} /> Open Ayla Dream Guide</Link>}
          {hasAylaAccess && <Link className="button secondary" href="/consultations" prefetch>Request one-on-one consultation</Link>}
          <Link className="button secondary" href="/billing"><CreditCard size={16} /> Billing & renewal</Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card dashboard-panel">
          <div className="panel-head"><div><span className="eyebrow">JOURNAL</span><h2>Recent dreams</h2></div><Link href="/dream-journal">View journal</Link></div>
          {data?.recentDreams.length ? data.recentDreams.map((dream) => <Link className="recent-dream" href={`/dream-journal/${dream.id}`} key={dream.id}><div><b>{dream.title || "Untitled dream"}</b><small>{new Date(dream.createdAt).toLocaleDateString()} · {dream.mood || "Reflective"}</small></div><span>{dream.summary || "Open interpretation"}</span></Link>) : <p className="notice">Your saved dream reports will appear here.</p>}
        </div>
        <div className="card dashboard-panel">
          <div className="panel-head"><div><span className="eyebrow">PATTERNS</span><h2>What keeps returning</h2></div><Link href="/dream-patterns">Explore</Link></div>
          {data?.patterns.length ? data.patterns.map((pattern) => <div className="pattern-row" key={pattern.id}><span>{pattern.name}</span><b>{pattern.frequency} times</b></div>) : <p className="notice">After you save several dreams, recurring themes and symbols will begin to appear here.</p>}
        </div>
      </section>

      <section className="dashboard-section-heading">
        <div><span className="eyebrow">YOUR PRACTICE</span><h2>Keep each part of your dream life close.</h2></div>
        <p>Every space is private to your account, with easy paths back to your saved context.</p>
      </section>
      <section className="dashboard-action-grid" aria-label="Dream practice areas">
        {practiceLinks.map(({ href, title, description, icon: Icon, tone }) => <Link className={`dashboard-action-card dashboard-action-${tone}`} href={href} key={href}>
          <div className="dashboard-action-icon"><Icon size={20} /></div>
          <h3>{title}</h3><p>{description}</p><span>Open {title} <ArrowRight size={15} /></span>
        </Link>)}
      </section>

      <section className="dashboard-discover card">
        <div className="dashboard-discover-intro"><span className="eyebrow">EXPLORE BEYOND YOUR JOURNAL</span><h2>Find a useful starting point.</h2><p>Use a guide when you want to understand a scene before bringing the whole story into a personal report.</p></div>
        <div className="dashboard-discover-links">
          {discoveryLinks.map(({ href, title, description, icon: Icon }) => <Link href={href} key={href}><Icon size={18} /><div><b>{title}</b><small>{description}</small></div><ArrowRight size={15} /></Link>)}
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
