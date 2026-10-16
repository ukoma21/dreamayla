import { NextResponse } from "next/server";
import { paypalBase, paypalToken } from "@/lib/paypal";
import { webhookSubscriptionId } from "@/lib/paypal-validation";

type PayPalEvent={event_type?:string;resource?:{id?:string;sale_id?:string;custom_id?:string;plan_id?:string;status?:string;billing_info?:{last_payment?:{time?:string;amount?:{total?:string;currency?:string;value?:string;currency_code?:string}};next_billing_time?:string};amount?:{total?:string;currency?:string;value?:string;currency_code?:string};billing_agreement_id?:string}};
const base=paypalBase;
const planName=(paypalPlanId?:string)=>paypalPlanId===process.env.PAYPAL_PLUS_PLAN_ID?"plus":"journal";
const planKind=()=>"PREMIUM" as const;

export async function POST(request:Request){
  try{
    const event=await request.json() as PayPalEvent;
    const webhookId=process.env.PAYPAL_WEBHOOK_ID;
    if(!webhookId)return new NextResponse("Webhook not configured",{status:503});
    if(!process.env.DATABASE_URL || !process.env.DIRECT_URL)return new NextResponse("Billing storage unavailable",{status:503});
    if(!["paypal-auth-algo","paypal-cert-url","paypal-transmission-id","paypal-transmission-sig","paypal-transmission-time"].every(header=>request.headers.has(header)))return new NextResponse("Invalid webhook",{status:400});
    const access=await paypalToken();
    const verify=await fetch(`${base()}/v1/notifications/verify-webhook-signature`,{method:"POST",headers:{Authorization:`Bearer ${access}`,"Content-Type":"application/json"},body:JSON.stringify({auth_algo:request.headers.get("paypal-auth-algo"),cert_url:request.headers.get("paypal-cert-url"),transmission_id:request.headers.get("paypal-transmission-id"),transmission_sig:request.headers.get("paypal-transmission-sig"),transmission_time:request.headers.get("paypal-transmission-time"),webhook_id:webhookId,webhook_event:event})});
    if(!verify.ok)return new NextResponse("Verification temporarily unavailable",{status:503});
    const verified=await verify.json() as {verification_status?:string};
    if(verified.verification_status!=="SUCCESS")return new NextResponse("Invalid webhook",{status:400});
    const {prisma}=await import("@/lib/prisma");
    const resource=event.resource||{};
    const subscriptionId=webhookSubscriptionId(event);
    const start=resource.billing_info?.last_payment?.time?new Date(resource.billing_info.last_payment.time):undefined;
    const end=resource.billing_info?.next_billing_time?new Date(resource.billing_info.next_billing_time):undefined;
    if(["BILLING.SUBSCRIPTION.CREATED","BILLING.SUBSCRIPTION.ACTIVATED"].includes(event.event_type||"")&&resource.custom_id&&resource.id){
      if(!resource.plan_id || ![process.env.PAYPAL_JOURNAL_PLAN_ID,process.env.PAYPAL_PLUS_PLAN_ID].includes(resource.plan_id))return NextResponse.json({received:true});
      // Approval alone is not a receipt. PAYMENT.SALE.COMPLETED activates access.
      const existing=await prisma.subscription.findUnique({where:{userId:resource.custom_id}});
      if(existing?.paypalSubscriptionId===resource.id)return NextResponse.json({received:true});
      if(existing && ["ACTIVE","PAST_DUE","INCOMPLETE"].includes(existing.status))return new NextResponse("Membership reconciliation required",{status:503});
      await prisma.subscription.upsert({where:{userId:resource.custom_id},create:{userId:resource.custom_id,plan:planKind(),billingPlan:planName(resource.plan_id),status:"INCOMPLETE",paypalSubscriptionId:resource.id,currentPeriodStart:start,currentPeriodEnd:end},update:{plan:planKind(),billingPlan:planName(resource.plan_id),status:"INCOMPLETE",paypalSubscriptionId:resource.id,currentPeriodStart:start,currentPeriodEnd:end,cancelAtPeriodEnd:false}});
    }
    if(["PAYMENT.SALE.COMPLETED","PAYMENT.SALE.REFUNDED","PAYMENT.SALE.REVERSED"].includes(event.event_type||"")&&subscriptionId){
      const subscription=await prisma.subscription.findUnique({where:{paypalSubscriptionId:subscriptionId}});
      // A refund event has its own resource id. sale_id points back to the
      // original recurring payment, which is the receipt we must update.
      const saleId=event.event_type==="PAYMENT.SALE.REFUNDED"?(resource.sale_id||resource.id):resource.id;
      // PayPal can deliver payment before activation. Request a retry instead
      // of acknowledging and silently losing the receipt.
      if(!subscription || !saleId)return new NextResponse("Waiting for subscription record",{status:503});
      const paymentAmount=resource.amount||resource.billing_info?.last_payment?.amount;
      const amount=Math.round(Number(paymentAmount?.total||paymentAmount?.value)*100);
      const currency=paymentAmount?.currency||paymentAmount?.currency_code;
      if(!Number.isSafeInteger(amount)||amount<0||!currency)return new NextResponse("Invalid payment amount",{status:400});
      const status=event.event_type==="PAYMENT.SALE.COMPLETED"?"COMPLETED":event.event_type==="PAYMENT.SALE.REFUNDED"?"REFUNDED":"REVERSED";
      const previous=await prisma.payment.findUnique({where:{paypalPaymentId:saleId}});
      if(status==="COMPLETED" && previous && previous.status!=="COMPLETED")return NextResponse.json({received:true});
      // Read the current state so a delayed payment cannot reopen a cancelled plan.
      const detail=await fetch(`${base()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,{headers:{Authorization:`Bearer ${access}`},signal:AbortSignal.timeout(15000),cache:"no-store"});
      if(!detail.ok)return new NextResponse("Membership verification unavailable",{status:503});
      const current=await detail.json() as NonNullable<PayPalEvent["resource"]>;
      await prisma.$transaction(async tx=>{
        await tx.payment.upsert({where:{paypalPaymentId:saleId},create:{userId:subscription.userId,paypalPaymentId:saleId,amount,currency,status},update:{status,amount,currency}});
        if(status==="COMPLETED" && current.status==="ACTIVE")await tx.subscription.update({where:{id:subscription.id},data:{status:"ACTIVE",currentPeriodStart:current.billing_info?.last_payment?.time?new Date(current.billing_info.last_payment.time):undefined,currentPeriodEnd:current.billing_info?.next_billing_time?new Date(current.billing_info.next_billing_time):undefined,cancelAtPeriodEnd:false}});
        if(status==="REFUNDED")await tx.subscription.update({where:{id:subscription.id},data:{status:"CANCELED",cancelAtPeriodEnd:false}});
      });
    }
    if(["BILLING.SUBSCRIPTION.CANCELLED","BILLING.SUBSCRIPTION.SUSPENDED","BILLING.SUBSCRIPTION.EXPIRED","BILLING.SUBSCRIPTION.PAYMENT.FAILED"].includes(event.event_type||"")&&resource.id){await prisma.subscription.updateMany({where:{paypalSubscriptionId:resource.id},data:{status:event.event_type==="BILLING.SUBSCRIPTION.CANCELLED"?"CANCELED":"PAST_DUE",cancelAtPeriodEnd:event.event_type==="BILLING.SUBSCRIPTION.CANCELLED"}})}
    return NextResponse.json({received:true});
  }catch{return new NextResponse("Webhook processing temporarily unavailable",{status:503})}
}
