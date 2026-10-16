"use client";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

export function supabaseBrowser() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Authentication is not configured. Add Supabase environment variables.");
  browserClient = createClient(url, key);
  return browserClient;
}

// Supabase restores a persisted browser session asynchronously in some WebViews.
// A single short retry prevents a page transition from briefly treating a valid
// signed-in visitor as logged out before that restoration has completed.
export async function getBrowserSession(): Promise<Session | null> {
  const client = supabaseBrowser();
  const { data: { session } } = await client.auth.getSession();
  if (session) return session;
  await new Promise<void>((resolve) => window.setTimeout(resolve, 250));
  const { data: { session: retry } } = await client.auth.getSession();
  return retry;
}
