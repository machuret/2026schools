import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING';
  checks.SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'MISSING';

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    checks.getUser = error ? `error: ${error.message}` : `ok, user: ${data.user?.email ?? 'null'}`;
  } catch (e) {
    checks.getUser = `threw: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json(checks);
}
