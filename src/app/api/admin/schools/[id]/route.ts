import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/adminClient';

export const runtime = 'edge';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const sb = adminClient();
  const { data, error } = await sb
    .from('school_profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    // PGRST116 = "no rows returned" — genuine 404
    const status = error.code === 'PGRST116' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  // Remove read-only / generated fields
  delete body.id;
  delete body.created_at;

  const sb = adminClient();
  const { data, error } = await sb
    .from('school_profiles')
    .update(body)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const sb = adminClient();
  const { error } = await sb.from('school_profiles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
