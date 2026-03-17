import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const sb = await createClient();
  const { data, error } = await sb.from("site_settings").select("key, value");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
  return NextResponse.json(map);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as Record<string, string>;
  const sb = adminClient();
  const updates = Object.entries(body).map(([key, value]) =>
    sb.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() })
  );
  const results = await Promise.all(updates);
  const err = results.find(r => r.error);
  if (err?.error) return NextResponse.json({ error: err.error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
