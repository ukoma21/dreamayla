"use client";
import { useRef, useState } from "react";
import { getBrowserSession } from "@/lib/supabase/client";
import { useMembership } from "@/components/membership-provider";

export function SubscribeButton({plan,label}:{plan:"journal"|"plus";label:string}) {
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const submitting=useRef(false);
  const membership=useMembership();
  const isActive=membership.status==="ACTIVE";
  const isCurrent=isActive&&membership.billingPlan===plan;
  const isIncluded=isActive&&membership.billingPlan==="plus"&&plan==="journal";
  async function checkout() {
    if(submitting.current)return;
    submitting.current=true;setBusy(true);setError("");
    try {
      const session=await getBrowserSession();
      if(!session){location.href="/login?next=/pricing";return;}
      const response=await fetch("/api/paypal/create-subscription",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({plan})});
      const data=await response.json() as {approval?:string;error?:string;code?:string};
      if(response.status===409&&data.code==="ACTIVE_MEMBERSHIP"){await membership.refreshMembership();location.href="/billing";return;}
      if(!response.ok||!data.approval)throw new Error(data.error||"Unable to start checkout.");
      location.href=data.approval;
    } catch(error) {
      setError(error instanceof Error?error.message:"Unable to start checkout.");
    } finally {submitting.current=false;setBusy(false);}
  }
  if(isCurrent)return <><button className="button current-plan-button" disabled>Current plan</button><a className="text-link plan-manage-link" href="/billing">View membership details →</a></>;
  if(isIncluded)return <><button className="button current-plan-button" disabled>Included with Premium</button><a className="text-link plan-manage-link" href="/billing">View membership details →</a></>;
  if(isActive)return <><a className="button" href="/billing">Manage current membership</a><span className="plan-action-note">Your {membership.billingPlan === "plus" ? "Dreamayla Premium" : "Dream Journal"} membership is active.</span></>;
  return <><button className="button" onClick={checkout} disabled={busy||membership.loading} aria-busy={busy}>{busy?"Opening PayPal…":membership.loading?"Checking membership…":label}</button>{error&&<p role="alert" className="auth-message">{error}</p>}</>;
}
