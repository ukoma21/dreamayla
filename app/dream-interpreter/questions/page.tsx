"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer, Header } from "@/components/site-chrome";
import { getBrowserSession } from "@/lib/supabase/client";

const questions = [
  {
    question: "What feeling stayed with you most strongly?",
    options: ["Fear", "Curiosity", "Calm", "Sadness", "Excitement", "Confusion", "Relief", "Anxiety", "Anger", "Wonder"],
  },
  {
    question: "What was happening in the dream?",
    options: ["I was watching", "I was searching", "I was trying to leave", "I was talking to someone", "I was in control", "It kept changing", "I was being chased", "I felt lost", "I was helping someone", "I could not move"],
  },
  {
    question: "Does any part of life feel especially present right now?",
    options: ["Work or study", "A relationship", "Family", "A transition", "A decision", "Nothing obvious", "Health or wellbeing", "Money or security", "Identity or confidence", "Future plans"],
  },
];

export default function QuestionsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const draft = sessionStorage.getItem("dreamayla:draft") || localStorage.getItem("dreamayla:pending-draft");
    if (!draft) {
      router.replace("/dream-interpreter");
      return;
    }
    if (!sessionStorage.getItem("dreamayla:draft")) sessionStorage.setItem("dreamayla:draft", draft);
  }, [router]);

  async function createReport() {
    const rawDraft = sessionStorage.getItem("dreamayla:draft") || localStorage.getItem("dreamayla:pending-draft");
    if (!rawDraft) {
      router.replace("/dream-interpreter");
      return;
    }
    let draft: { content?: string; parsed?: Record<string, unknown> };
    try {
      draft = JSON.parse(rawDraft) as { content?: string; parsed?: Record<string, unknown> };
    } catch {
      sessionStorage.removeItem("dreamayla:draft");
      router.replace("/dream-interpreter");
      return;
    }
    if (!draft.content || !draft.parsed) {
      sessionStorage.removeItem("dreamayla:draft");
      router.replace("/dream-interpreter");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      let authorization = "";
      try {
        const session = await getBrowserSession();
        if (session) authorization = `Bearer ${session.access_token}`;
      } catch {
        // A first dream interpretation is available without an account.
      }
      const response = await fetch("/api/dream/interpret", { method: "POST", headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) }, body: JSON.stringify({ content: draft.content, parsed: draft.parsed, context: answers.filter(Boolean).join(" · ") }) });
      const data = await response.json();
      if (response.status === 402) {
        setMessage(data.error);
        setUpgrade(true);
        return;
      }
      if (!response.ok) throw new Error(data.error || "Unable to create your interpretation.");
      const storedReport = JSON.stringify({ ...draft, context: answers.filter(Boolean).join(" · "), report: data.report });
      sessionStorage.setItem("dreamayla:report", storedReport);
      localStorage.setItem("dreamayla:pending-report", storedReport);
      router.push("/dream-interpreter/result/preview");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong while preparing your dream insights.");
    } finally {
      setBusy(false);
    }
  }

  return <><Header /><main className="page shell"><div className="pagehead"><div className="eyebrow">SHARE YOUR PERSONAL CONTEXT</div><h1>Share Your Personal Context</h1><p className="sectionintro">Your emotions, experiences, and current life circumstances provide meaningful perspectives for understanding your dream symbols.</p></div><div className="formcard">{questions.map((item, index) => <section className="card" style={{ marginBottom: 14 }} key={item.question}><h3>{item.question}</h3><div className="chips">{item.options.map((option) => <button type="button" className={`mood ${answers[index] === option ? "active" : ""}`} key={option} onClick={() => setAnswers((values) => { const next = [...values]; next[index] = option; return next; })}>{option}</button>)}</div></section>)}{message && !upgrade && <p className="auth-message">{message}</p>}<div className="center"><button className="button" disabled={busy} onClick={createReport}>{busy ? "Exploring your dream insights…" : "Discover Your Dream Insights"}</button></div></div>{upgrade && <div className="upgrade-modal"><div className="upgrade-dialog"><button className="upgrade-close" onClick={() => setUpgrade(false)}>×</button><div className="eyebrow">CONTINUE WITH DREAMAYLA</div><h3>Your first dream exploration is complete.</h3><p>{message || "Create an account, then choose a monthly membership to continue receiving detailed dream interpretations."}</p><div className="upgrade-actions"><a className="button" href="/signup">Create account</a><a className="button secondary" href="/pricing">View monthly plans</a></div></div></div>}</main><Footer /></>;
}
