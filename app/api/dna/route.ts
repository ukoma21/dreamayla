import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request:Request){
  const token=request.headers.get("authorization")?.replace("Bearer ","");
  const supabase=supabaseServer();
  if(!token||!supabase)return NextResponse.json({error:"Sign in to view your Dream DNA."},{status:401});
  const {data:{user}}=await supabase.auth.getUser(token);
  if(!user)return NextResponse.json({error:"Sign in to view your Dream DNA."},{status:401});
  try{
    const {prisma}=await import("@/lib/prisma");
    const subscription=await prisma.subscription.findUnique({where:{userId:user.id},select:{plan:true,status:true}});
    if(!subscription||subscription.status!=="ACTIVE"||!(["PREMIUM","ANNUAL"] as string[]).includes(subscription.plan))return NextResponse.json({error:"Dream DNA is included with Dreamayla Premium.",code:"UPGRADE_REQUIRED"},{status:402});
    const dreams=await prisma.dream.findMany({where:{userId:user.id},select:{emotions:{select:{name:true,score:true}},symbols:{select:{name:true}},parserData:true},take:100});
    const emotionMap=new Map<string,{total:number;count:number}>(); const symbolMap=new Map<string,number>();
    for(const dream of dreams){for(const emotion of dream.emotions){const current=emotionMap.get(emotion.name)||{total:0,count:0};current.total+=emotion.score;current.count+=1;emotionMap.set(emotion.name,current)}for(const symbol of dream.symbols){symbolMap.set(symbol.name,(symbolMap.get(symbol.name)||0)+1)}}
    const emotions=[...emotionMap.entries()].map(([name,value])=>({name,score:Math.min(99,Math.max(1,Math.round(value.total/value.count))),frequency:value.count})).sort((a,b)=>b.score-a.score).slice(0,8);
    const topSymbol=[...symbolMap.entries()].sort((a,b)=>b[1]-a[1])[0];
    return NextResponse.json({dreamCount:dreams.length,emotions,mostRecurringSymbol:topSymbol?{name:topSymbol[0],frequency:topSymbol[1]}:null});
  }catch{return NextResponse.json({error:"Dream DNA is not available until the journal database is connected."},{status:503});}
}
