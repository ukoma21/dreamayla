import { NextResponse } from "next/server";import { adminFromRequest } from "@/lib/admin";
export async function GET(request:Request){
  if(!await adminFromRequest(request))return NextResponse.json({error:"Forbidden"},{status:403});
  try{
    const {prisma}=await import("@/lib/prisma");
    const since=new Date();since.setHours(0,0,0,0);
    const [users,dreams,dreamsToday,premium]=await Promise.all([prisma.user.count(),prisma.dream.count(),prisma.dream.count({where:{createdAt:{gte:since}}}),prisma.subscription.count({where:{status:"ACTIVE",plan:{in:["PREMIUM","ANNUAL"]}}})]);
    return NextResponse.json({users,dreams,dreamsToday,premium,aiCallsToday:dreamsToday});
  }catch{return NextResponse.json({users:0,dreams:0,dreamsToday:0,premium:0,aiCallsToday:0,dataSourceUnavailable:true});}
}
