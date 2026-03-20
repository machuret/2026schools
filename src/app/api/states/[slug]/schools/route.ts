import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { STATE_CODES, MAX_SCHOOL_ROWS, SchoolRow, countBy, avgPct } from "@/lib/schoolUtils";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const stateCode = STATE_CODES[slug];
  if (!stateCode) {
    return NextResponse.json({ error: "Unknown state slug" }, { status: 404 });
  }

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: raw, error } = await sb
    .from("school_profiles")
    .select(
      "school_sector, school_type, geolocation, icsea, " +
      "total_enrolments, indigenous_enrolments_pct, lbote_yes_pct, " +
      "bottom_sea_quarter_pct"
    )
    .eq("state", stateCode)
    .limit(MAX_SCHOOL_ROWS);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const data = (raw ?? []) as unknown as SchoolRow[];

  if (data.length === 0) {
    return NextResponse.json({ empty: true }, { status: 200 });
  }

  const total_schools    = data.length;
  const total_enrolments = data.reduce((s, r) => s + (r.total_enrolments ?? 0), 0);

  const icseaRows = data.filter((r) => r.icsea != null);
  const avg_icsea = icseaRows.length > 0
    ? Math.round(icseaRows.reduce((s, r) => s + r.icsea!, 0) / icseaRows.length)
    : null;

  const sectors    = countBy(data, "school_sector");
  const types      = countBy(data, "school_type");
  const geolocation = countBy(data, "geolocation");

  const indigenous_avg_pct     = avgPct(data, "indigenous_enrolments_pct");
  const lbote_avg_pct          = avgPct(data, "lbote_yes_pct");
  const bottom_quarter_avg_pct = avgPct(data, "bottom_sea_quarter_pct");

  return NextResponse.json(
    {
      state_code: stateCode,
      total_schools,
      total_enrolments,
      avg_icsea,
      sectors,
      types,
      geolocation,
      indigenous_avg_pct,
      lbote_avg_pct,
      bottom_quarter_avg_pct,
    },
    {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    }
  );
}
