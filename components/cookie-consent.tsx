"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "rejected";

const storageKey = "dreamayla_cookie_choice";
const openEvent = "dreamayla:open-cookie-settings";

declare global {
  interface Window {
    beTracker?: { t: (options: { hash: string }) => void };
  }
}

function loadMetricool() {
  if (document.querySelector('script[data-dreamayla-metricool="true"]')) return;
  const script = document.createElement("script");
  script.src = "https://tracker.metricool.com/resources/be.js";
  script.async = true;
  script.dataset.dreamaylaMetricool = "true";
  script.onload = () => window.beTracker?.t({ hash: "165876f9df16cd334c0314de0708db79" });
  document.head.appendChild(script);
}

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey) as ConsentChoice | null;
    if (saved === "accepted" || saved === "rejected") setChoice(saved);
    else setShow(true);
    const reopen = () => setShow(true);
    window.addEventListener(openEvent, reopen);
    return () => window.removeEventListener(openEvent, reopen);
  }, []);

  useEffect(() => {
    if (choice === "accepted") loadMetricool();
  }, [choice]);

  const save = (next: ConsentChoice) => {
    const previous = choice;
    window.localStorage.setItem(storageKey, next);
    setChoice(next);
    setShow(false);
    if (previous === "accepted" && next === "rejected") window.location.reload();
  };

  return <>
    {choice === "accepted" && <SpeedInsights />}
    {show && <aside className="cookie-consent" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="cookie-consent-copy">
        <strong id="cookie-title">Your privacy choices</strong>
        <p>DreamAyla uses essential storage for sign-in, language, and free-report access. Optional analytics help us understand site performance. Optional analytics stay off unless you accept them.</p>
        <Link href="/cookie-policy">Read our Cookie Policy</Link>
      </div>
      <div className="cookie-consent-actions">
        <button type="button" className="button secondary" onClick={() => save("rejected")}>Reject optional</button>
        <button type="button" className="button" onClick={() => save("accepted")}>Accept optional</button>
      </div>
    </aside>}
  </>;
}

export function CookieSettingsButton() {
  return <button type="button" className="footer-cookie-button" onClick={() => window.dispatchEvent(new Event(openEvent))}>Cookie settings</button>;
}
