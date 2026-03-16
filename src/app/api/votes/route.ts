import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// POST /api/votes
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { entity_type, entity_slug, vote, feedback, contact } = body;

  if (!entity_slug || !vote) {
    return NextResponse.json({ error: "entity_slug and vote are required" }, { status: 400 });
  }
  if (!["up", "down"].includes(vote)) {
    return NextResponse.json({ error: "vote must be 'up' or 'down'" }, { status: 400 });
  }

  // Hash IP for privacy — we store it only to detect obvious spam
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || "unknown";
  const ip_hash = createHash("sha256").update(ip + entity_slug).digest("hex").slice(0, 16);

  const sb = anonClient();

  const { error } = await sb.from("data_votes").insert({
    entity_type: entity_type ?? "issue",
    entity_slug,
    vote,
    feedback: feedback?.trim() || null,
    contact: contact?.trim() || null,
    ip_hash,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// GET /api/votes?slug=school-belonging&type=issue
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const type = req.nextUrl.searchParams.get("type") ?? "issue";
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const sb = anonClient();
  const { data, error } = await sb
    .from("data_vote_counts")
    .select("up_count,down_count,total")
    .eq("entity_slug", slug)
    .eq("entity_type", type)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    up: Number(data?.up_count ?? 0),
    down: Number(data?.down_count ?? 0),
    total: Number(data?.total ?? 0),
  });
}
