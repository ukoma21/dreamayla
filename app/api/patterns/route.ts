import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request:Request){
  const token=request.headers.get("authorization")?.replace("Bearer ","");
  const supabase=supabaseServer();
  if(!token||!supabase)return NextResponse.json({error:"Sign in to view your dream patterns."},{status:401});
  const {data:{user}}=await supabase.auth.getUser(token);
  if(!user)return NextResponse.json({error:"Sign in to view your dream patterns."},{status:401});
  try{
    const {prisma}=await import("@/lib/prisma");
    const patterns=await prisma.dreamPattern.findMany({where:{userId:user.id},orderBy:[{frequency:"desc"},{score:"desc"}],take:30});
    return NextResponse.json({patterns,minimumDreams:5});
  }catch{return NextResponse.json({patterns:[],minimumDreams:5,dataSourceUnavailable:true});}
}
