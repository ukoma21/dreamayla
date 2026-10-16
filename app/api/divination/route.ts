import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase/server";
const schema=z.object({type:z.enum(["bazi","name","naming"]),input:z.string().min(3).max(2000)});
const labels={bazi:"a gentle birth-chart reflection",name:"a name and personality reflection",naming:"creative name suggestions"};
export async function POST(request:NextRequest){try{
  const {type,input}=schema.parse(await request.json());
  const token=request.headers.get("authorization")?.replace("Bearer ",""); const supabase=supabaseServer(); let paid=false; let signedIn=false;
  if(token&&supabase){const {data:{user}}=await supabase.auth.getUser(token);if(user){signedIn=true;try{const {prisma}=await import("@/lib/prisma");const sub=await prisma.subscription.findUnique({where:{userId:user.id}});paid=Boolean(sub&&sub.status==="ACTIVE"&&["PREMIUM","ANNUAL"].includes(sub.plan));}catch{paid=false}}}
  // The complimentary entitlement is shared across the Dream Interpreter and Studio Tools.
  // Paid members bypass it once their membership is available in the billing database.
  const used=request.cookies.get("dreamayla_free_report_used")?.value==="1";
  if(!paid&&used)return NextResponse.json({error:signedIn?"Your complimentary DreamAyla experience is complete. Choose a plan to continue.":"Your complimentary DreamAyla experience is complete. Create an account, then choose a plan to continue.",code:signedIn?"UPGRADE_REQUIRED":"SIGNUP_REQUIRED"},{status:402});
  const key=process.env.DEEPSEEK_API_KEY||process.env.OPENAI_API_KEY;
  if(!key){const result=NextResponse.json({answer:`This is a local preview of ${labels[type]}. Detailed reflections will be available once this service is configured.`});if(!paid)result.cookies.set("dreamayla_free_report_used","1",{httpOnly:true,sameSite:"lax",maxAge:60*60*24*365,path:"/"});return result}
  const ai=new OpenAI({apiKey:key,baseURL:process.env.DEEPSEEK_API_KEY?"https://api.deepseek.com":"https://api.openai.com/v1"});
  const response=await ai.chat.completions.create({model:process.env.DEEPSEEK_API_KEY?"deepseek-chat":"gpt-4o-mini",temperature:.65,messages:[{role:"system",content:`You are DreamAyla's ${labels[type]} assistant. Return a comprehensive English answer in this exact order: 1) Best answer first with a clear meaning and whether it may feel positive, challenging, or mixed; 2) a balanced good-signs and caution-signs section; 3) line-by-line and important-word analysis of the user's details; 4) practical reflection and next steps; 5) questions to consider. Use clear headings, bold important terms with **double asterisks**, and rich detail. Never claim certainty, predict the future, frighten the user, or make medical, legal, or financial diagnoses. Frame symbolism as reflection, not fact.`},{role:"user",content:input}]});
  const result=NextResponse.json({answer:response.choices[0].message.content||"No reflection is available right now."});if(!paid)result.cookies.set("dreamayla_free_report_used","1",{httpOnly:true,sameSite:"lax",maxAge:60*60*24*365,path:"/"});return result;
}catch{return NextResponse.json({error:"Unable to create this reflection. Please try again."},{status:400})}}
