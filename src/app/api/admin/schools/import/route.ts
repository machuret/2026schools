import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function toNum(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function toInt(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const vals = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim(); });
    return row;
  });
}

const BATCH = 500;

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });

  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const text = await file.text();
  const records = parseCSV(text);
  if (records.length === 0) return NextResponse.json({ error: 'CSV has no data rows' }, { status: 400 });

  const rows = records.map((r) => ({
    calendar_year:                toInt(r['Calendar Year']),
    acara_sml_id:                 toInt(r['ACARA SML ID']),
    school_name:                  r['School Name'] ?? '',
    suburb:                       r['Suburb'] || null,
    state:                        r['State'] || null,
    postcode:                     r['Postcode'] || null,
    school_sector:                r['School Sector'] || null,
    school_type:                  r['School Type'] || null,
    school_url:                   r['School URL'] || null,
    governing_body:               r['Governing Body'] || null,
    governing_body_url:           r['Governing Body URL'] || null,
    year_range:                   r['Year Range'] || null,
    geolocation:                  r['Geolocation'] || null,
    icsea:                        toInt(r['ICSEA']),
    icsea_percentile:             toInt(r['ICSEA Percentile']),
    bottom_sea_quarter_pct:       toNum(r['Bottom SEA Quarter (%)']),
    lower_middle_sea_quarter_pct: toNum(r['Lower Middle SEA Quarter (%)']),
    upper_middle_sea_quarter_pct: toNum(r['Upper Middle SEA Quarter (%)']),
    top_sea_quarter_pct:          toNum(r['Top SEA Quarter (%)']),
    teaching_staff:               toInt(r['Teaching Staff']),
    fte_teaching_staff:           toNum(r['Full Time Equivalent Teaching Staff']),
    non_teaching_staff:           toInt(r['Non-Teaching Staff']),
    fte_non_teaching_staff:       toNum(r['Full Time Equivalent Non-Teaching Staff']),
    total_enrolments:             toInt(r['Total Enrolments']),
    girls_enrolments:             toInt(r['Girls Enrolments']),
    boys_enrolments:              toInt(r['Boys Enrolments']),
    fte_enrolments:               toNum(r['Full Time Equivalent Enrolments']),
    indigenous_enrolments_pct:    toNum(r['Indigenous Enrolments (%)']),
    lbote_yes_pct:                toNum(r['Language Background Other Than English - Yes (%)']),
    lbote_no_pct:                 toNum(r['Language Background Other Than English - No (%)']),
    lbote_not_stated_pct:         toNum(r['Language Background Other Than English - Not Stated (%)']),
  }));

  const sb = adminClient();
  let inserted = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    const { error } = await sb
      .from('school_profiles')
      .upsert(batch, { onConflict: 'acara_sml_id' });
    if (error) {
      errors.push(`Batch ${i}–${i + batch.length}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  return NextResponse.json({
    total: records.length,
    inserted,
    errors: errors.length > 0 ? errors : undefined,
  });
}
