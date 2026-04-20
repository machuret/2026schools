/* ═══════════════════════════════════════════════════════════════════════════
 * /api/admin/content-creator/topics/[id]
 *
 * GET    → single topic (for the brief form prefill).
 * PATCH  → approve / archive / light edits (title, angle, keywords, etc.).
 * DELETE → hard delete (use PATCH status='archived' for soft-delete instead).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/adminClient';
import { requireAdmin } from '@/lib/auth';
import { PatchTopicSchema } from '@/lib/content-creator/topics';
import type { ContentTopic } from '@/lib/content-creator/topics';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export const GET = requireAdmin(async (_req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;
  const sb = adminClient();

  const { data, error } = await sb
    .from('content_topics')
    .select('*')
    .eq('id', id)
    .single<ContentTopic>();
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ topic: data });
});

export const PATCH = requireAdmin(async (req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;

  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }); }

  const parsed = PatchTopicSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    );
  }
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }

  const sb = adminClient();

  // Guardrail: once a topic is 'used' it's terminal. Re-approving / re-editing
  // breaks the one-shot semantics. Archive is still allowed so admins can
  // hide used topics from the audit log view.
  if (parsed.data.status && parsed.data.status !== 'archived') {
    const { data: current } = await sb
      .from('content_topics')
      .select('status')
      .eq('id', id)
      .single<{ status: string }>();
    if (current?.status === 'used') {
      return NextResponse.json(
        { error: `Topic is already 'used' — cannot change status to '${parsed.data.status}'.` },
        { status: 409 },
      );
    }
  }

  const { data, error } = await sb
    .from('content_topics')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single<ContentTopic>();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? 'Update failed' },
      { status: 500 },
    );
  }
  return NextResponse.json({ topic: data });
});

export const DELETE = requireAdmin(async (_req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;
  const sb = adminClient();
  const { error } = await sb.from('content_topics').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
});
