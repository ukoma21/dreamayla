import { NextResponse } from "next/server";
import { adminFromRequest } from "@/lib/admin";

export async function GET(request: Request) {
  const admin = await adminFromRequest(request);
  return NextResponse.json({
    authenticated: Boolean(request.headers.get("authorization")),
    isAdmin: Boolean(admin),
    email: admin?.email ?? null,
  });
}
