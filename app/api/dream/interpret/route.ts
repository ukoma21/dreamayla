import { NextRequest,NextResponse } from "next/server";
import { z } from "zod";
import { interpretDream } from "@/lib/ai";
import { supabaseServer } from "@/lib/supabase/server";

const schema=z.object({content:z.string().min(10).max(5000),parsed:z.record(z.any()),context:z.string().max(1000).default("")});

export async function POST(request:NextRequest){
  try{
    const input=schema.parse(await request.json());
    const token=request.headers.get("authorization")?.replace("Bearer ","");
    let signedIn=false;let paid=false;
    const supabase=supabaseServer();
    if(token&&supabase){const {data:{user}}=await supabase.auth.getUser(token);if(user){signedIn=true;try{const {prisma}=await import("@/lib/prisma");const sub=await prisma.subscription.findUnique({where:{userId:user.id}});paid=Boolean(sub&&sub.status==="ACTIVE"&&["PREMIUM","ANNUAL"].includes(sub.plan));}catch{paid=false;}}}
    // A first report is available to guests and newly signed-in free users. The
    // cookie keeps this local entitlement consistent across the interpreter flow.
    // Paid members bypass the free-report gate entirely.
    const freeReportUsed=request.cookies.get("dreamayla_free_report_used")?.value==="1";
    if(!paid&&freeReportUsed){
      return NextResponse.json({
        error:signedIn?"Your free DreamAyla report has been used. Choose a plan to continue.":"Your free DreamAyla report has been used. Create an account and choose a plan to continue.",
        code:signedIn?"UPGRADE_REQUIRED":"SIGNUP_REQUIRED"
      },{status:402});
    }
    const report=await interpretDream(input as Parameters<typeof interpretDream>[0]);
    const response=NextResponse.json({report});
    if(!paid)response.cookies.set("dreamayla_free_report_used","1",{httpOnly:true,sameSite:"lax",maxAge:60*60*24*365,path:"/"});
    return response;
  }catch{return NextResponse.json({error:"Something went wrong while creating your dream report. Please try again."},{status:400});}
}
