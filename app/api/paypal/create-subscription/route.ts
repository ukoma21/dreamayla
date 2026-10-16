import { NextResponse } from "next/server";
import { z } from "zod";
import { paypalBase, paypalToken } from "@/lib/paypal";
import { matchesMonthlyPrice } from "@/lib/paypal-validation";
import { paypalPlanEnvironmentKeys, plans } from "@/lib/plans";
import { supabaseServer } from "@/lib/supabase/server";

const input=z.object({plan:z.enum(["journal","plus"])});
const planValidationCache = new Map<string, { valid: boolean; expiresAt: number }>();

async function planHasExpectedMonthlyPrice(planId: string, expectedPrice: string, access: string) {
  const cacheKey = `${planId}:${expectedPrice}`;
  const cached = planValidationCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.valid;
  const details = await fetch(`${paypalBase()}/v1/billing/plans/${encodeURIComponent(planId)}`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const planDetails = await details.json().catch(() => null);
  const valid = details.ok && matchesMonthlyPrice(planDetails || {}, expectedPrice);
  // The checkout route continues to verify both the chosen Plan ID and its
  // server-side price. A short cache only avoids repeating that same remote
  // lookup for consecutive clicks on a warm instance.
  if (details.ok) planValidationCache.set(cacheKey, { valid, expiresAt: Date.now() + 5 * 60 * 1000 });
  return valid;
}

export async function POST(request:Request){
  try{
    const token=request.headers.get("authorization")?.replace("Bearer ","");
    const supabase=supabaseServer();
    if(!token||!supabase)return NextResponse.json({error:"Please sign in before subscribing."},{status:401});
    const {data:{user}}=await supabase.auth.getUser(token);
    if(!user?.email || !user.email_confirmed_at)return NextResponse.json({error:"Please verify your email and sign in before subscribing."},{status:401});
    const {plan}=input.parse(await request.json());
    const planId=process.env[paypalPlanEnvironmentKeys[plan]];
    if(!planId || !process.env.PAYPAL_WEBHOOK_ID || !process.env.DATABASE_URL || !process.env.DIRECT_URL)return NextResponse.json({error:"Checkout is temporarily unavailable. Please try again shortly."},{status:503});
    const {prisma}=await import("@/lib/prisma");
    await prisma.user.upsert({where:{id:user.id},create:{id:user.id,email:user.email},update:{email:user.email}});
    const current=await prisma.subscription.findUnique({where:{userId:user.id}});
    if(current && ["ACTIVE","PAST_DUE","INCOMPLETE"].includes(current.status))return NextResponse.json({error:"You already have a membership to manage. Please open your billing page.",code:"ACTIVE_MEMBERSHIP",currentPlan:current.billingPlan},{status:409});
    const access=await paypalToken();
    if(!await planHasExpectedMonthlyPrice(planId, plans[plan].price, access))return NextResponse.json({error:"This membership price is being updated. Please try again shortly."},{status:503});
    const origin=new URL(process.env.NEXT_PUBLIC_APP_URL||"https://dreamayla.com").origin;
    const response=await fetch(`${paypalBase()}/v1/billing/subscriptions`,{
      method:"POST",
      signal:AbortSignal.timeout(15000),
      headers:{Authorization:`Bearer ${access}`,"Content-Type":"application/json","PayPal-Request-Id":crypto.randomUUID()},
      body:JSON.stringify({plan_id:planId,custom_id:user.id,application_context:{brand_name:"DreamAyla",locale:"en-US",shipping_preference:"NO_SHIPPING",user_action:"SUBSCRIBE_NOW",return_url:`${origin}/billing?payment=pending`,cancel_url:`${origin}/pricing?payment=cancel`}})
    });
    const data=await response.json() as {links?:Array<{rel:string;href:string}>;message?:string};
    if(!response.ok)return NextResponse.json({error:"Unable to start PayPal checkout. Please try again."},{status:502});
    const approval=data.links?.find(x=>x.rel==="approve")?.href;
    const url=approval?new URL(approval):null;
    if(!url || url.protocol!=="https:" || !["www.paypal.com","www.sandbox.paypal.com","paypal.com","sandbox.paypal.com"].includes(url.hostname))return NextResponse.json({error:"PayPal checkout is unavailable. Please try again."},{status:502});
    return NextResponse.json({approval});
  }catch(error){
    console.error("[paypal:create-subscription] failed", {
      message:error instanceof Error ? error.message : String(error),
      name:error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({error:"Unable to start PayPal checkout."},{status:400});
  }
}
