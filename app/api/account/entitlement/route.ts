import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request:Request){
  const token=request.headers.get("authorization")?.replace("Bearer ","");
  const supabase=supabaseServer();
  if(!token||!supabase)return NextResponse.json({signedIn:false,allowed:false,reason:"sign_in"},{status:401});
  const {data:{user}}=await supabase.auth.getUser(token);
  if(!user)return NextResponse.json({signedIn:false,allowed:false,reason:"sign_in"},{status:401});
  try{const {prisma}=await import("@/lib/prisma");const subscription=await prisma.subscription.findUnique({where:{userId:user.id}});const allowed=Boolean(subscription&&subscription.status==="ACTIVE"&&["PREMIUM","ANNUAL"].includes(subscription.plan));return NextResponse.json({signedIn:true,allowed,plan:subscription?.plan??"FREE",billingPlan:subscription?.billingPlan??null,status:subscription?.status??"INACTIVE"});}
  catch{return NextResponse.json({signedIn:true,allowed:false,reason:"billing_unavailable"});}
}
