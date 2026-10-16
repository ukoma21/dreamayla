import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request:Request){
  const token=request.headers.get("authorization")?.replace("Bearer ","");const supabase=supabaseServer();
  if(!token||!supabase)return NextResponse.json({error:"Sign in required"},{status:401});
  const {data:{user}}=await supabase.auth.getUser(token);if(!user)return NextResponse.json({error:"Sign in required"},{status:401});
  try{
    const {prisma}=await import("@/lib/prisma");
    const [subscription,payments,membershipEvents]=await Promise.all([
      prisma.subscription.findUnique({where:{userId:user.id}}),
      prisma.payment.findMany({where:{userId:user.id},orderBy:{createdAt:"desc"},take:12}),
      prisma.creditTransaction.findMany({where:{userId:user.id,type:{in:["MEMBERSHIP_CANCELED","REFUND_GUARANTEE_USED"]}},orderBy:{createdAt:"desc"},take:12,select:{id:true,type:true,createdAt:true,metadata:true}}),
    ]);
    const refundGuaranteeUsed=membershipEvents.some(event=>event.type==="REFUND_GUARANTEE_USED")||payments.some(payment=>["REFUND_PENDING","REFUNDED"].includes(payment.status));
    return NextResponse.json({subscription,payments,membershipEvents,refundGuaranteeUsed});
  }catch{return NextResponse.json({error:"Your billing details are temporarily unavailable. Please try again shortly."},{status:503});}
}
