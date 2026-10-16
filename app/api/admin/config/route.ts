import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin";

const checks = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_SERVICE_ROLE_KEY", "DATABASE_URL", "DIRECT_URL", "DEEPSEEK_API_KEY", "OPENAI_API_KEY", "PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "PAYPAL_WEBHOOK_ID", "PAYPAL_JOURNAL_PLAN_ID", "PAYPAL_PLUS_PLAN_ID", "ADMIN_EMAIL"];

export async function GET(request: Request) {
  if (!await adminFromRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ checks: Object.fromEntries(checks.map((name) => [name, name === "ADMIN_EMAIL" ? Boolean(process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS) : Boolean(process.env[name])])) });
}
