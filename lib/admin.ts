import { supabaseServer } from "@/lib/supabase/server";
// DreamAyla has one owner-level administrator. Keep this intentionally singular:
// customer accounts can never gain admin access through an email list accident.
const configuredOwner = process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS || "";
const ownerAdminEmail = configuredOwner.split(/[;,\s]+/, 1)[0].trim().toLowerCase();

export async function adminFromRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  const supabase = supabaseServer();
  if (!token || !supabase) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user?.email?.toLowerCase() === ownerAdminEmail ? user : null;
}
