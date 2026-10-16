"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { getBrowserSession } from "@/lib/supabase/client";

const minimumDreamLength = 10;
const moods = ["Fearful", "Calm", "Happy", "Sad", "Confused", "Excited", "Nostalgic", "Other"];

export function DreamForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { t } = useLocale();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [upgrade, setUpgrade] = useState(false);

  async function submit() {
    const content = text.trim();
    if (content.length < minimumDreamLength) {
      setError(`Add ${minimumDreamLength - content.length} more characters to begin your interpretation. The more detail you share, the more personally DreamAyla can explore its symbols, emotional tone, and life context.`);
      return;
    }
    setBusy(true);
    setError("");
    setUpgrade(false);
    try {
      let authorization = "";
      try {
        const session = await getBrowserSession();
        if (session) authorization = `Bearer ${session.access_token}`;
      } catch {
        // Guests can use one complete report without an account.
      }
      const response = await fetch("/api/dream/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authorization ? { Authorization: authorization } : {}) },
        body: JSON.stringify({ title, content, mood }),
      });
      const data = await response.json() as { parsed?: unknown; error?: string };
      if (response.status === 402) {
        setError(data.error || "Your complimentary DreamAyla experience is complete.");
        setUpgrade(true);
        return;
      }
      if (!response.ok || !data.parsed) throw new Error(data.error || "Unable to read this dream.");
      const draft = JSON.stringify({ title, content, mood, parsed: data.parsed });
      sessionStorage.setItem("dreamayla:draft", draft);
      // Email confirmation commonly opens a fresh tab. Retain only the pending
      // report locally so the user can return to this exact flow afterwards.
      localStorage.setItem("dreamayla:pending-draft", draft);
      router.push("/dream-interpreter/questions");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to begin your dream exploration. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className={compact ? "dreambox" : "card formcard"} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
    {!compact && <>
      <label className="field" htmlFor="dream-title">{t("title")} <span className="notice">({t("optional")})</span></label>
      <input id="dream-title" className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A night at the old house" />
      <label className="field" htmlFor="dream-content">Tell the dream as you remember it</label>
    </>}
    <textarea id="dream-content" aria-label={compact ? "Describe your dream" : undefined} value={text} onChange={(event) => setText(event.target.value.slice(0, 5000))} placeholder={t("placeholder")} />
    <div className="boxfoot"><span>{text.length}/5000 · {minimumDreamLength} characters minimum · Detail makes each lens more personal</span><button type="submit" className="button" disabled={busy || text.trim().length < minimumDreamLength}>{busy ? t("analyzing") : t("interpret")}</button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    {upgrade && <div className="form-upgrade"><b>Continue your dream practice</b><span>Create an account, then choose a membership for more three-lens interpretations and a private dream history.</span><div><Link className="button" href="/signup">Create account</Link><Link className="text-link" href="/pricing">View memberships</Link></div></div>}
    {!compact && <><label className="field">{t("mood")}</label><div className="moods">{moods.map((value) => <button type="button" className={`mood ${mood === value ? "active" : ""}`} key={value} onClick={() => setMood(value)}>{value}</button>)}</div></>}
  </form>;
}
