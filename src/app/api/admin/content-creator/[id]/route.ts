/* ═══════════════════════════════════════════════════════════════════════════
 * /api/admin/content-creator/[id]
 *
 * GET    → fetch one draft
 * PATCH  → manual edits (title / body)
 * DELETE → soft-delete (status = 'archived')
 * ═══════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/adminClient';
import { requireAdmin } from '@/lib/auth';
import { ContentDraftPatchSchema } from '@/lib/content-creator/schemas';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export const GET = requireAdmin(async (_req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;
  const sb = adminClient();
  const { data, error } = await sb
    .from('content_drafts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
  return NextResponse.json({ draft: data });
});

export const PATCH = requireAdmin(async (req: NextRequest, ctx?: Ctx) => {
  const { id } = await ctx!.params;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = ContentDraftPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const sb = adminClient();

  // Fetch current to enforce title rules per content_type.
  const { data: current, error: loadErr } = await sb
    .from('content_drafts')
    .select('id, content_type, status')
    .eq('id', id)
    .single();
  if (loadErr) {
    return NextResponse.json({ error: loadErr.message }, { status: 404 });
  }

  // Guard: cannot edit while the edge fn is mid-flight.
  if (current.status === 'generating' || current.status === 'verifying') {
    return NextResponse.json(
      { error: `Cannot edit while status = ${current.status}` },
      { status: 409 },
    );
  }

  const patch: Record<string, unknown> = {};
  if ('title' in parsed.data) {
    if (current.content_type === 'social' && parsed.data.title != null) {
      return NextResponse.json(
        { error: 'Social posts cannot have a title.' },
        { status: 400 },
      );
    }
    if (current.content_type !== 'social' && (!parsed.data.title || parsed.data.title.trim() === '')) {
      return NextResponse.json(
        { error: `${current.content_type} posts require a title.` },
        { status: 400 },
      );
    }
    patch.title = parsed.data.title;
  }
  if ('body' in parsed.data) patch.body = parsed.data.body;

  // Editing a verified draft demotes it back to 'draft' so it must be re-verified.
  // Clear the stale verification verdict at the same time — otherwise the UI
  // would still show green "Verified" badges for content that has drifted.
  if (current.status === 'verified' && (patch.body !== undefined || patch.title !== undefined)) {
    patch.status = 'draft';
    patch.verification = {};
  }

  const { data, error } = await sb
    .from('content_drafts')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ draft: data });
});

/**
 * DELETE /api/admin/content-creator/[id]?hard=true
 *
 * Two modes:
 *   - default  → soft archive (status = 'archived'). Reversible.
 *   - ?hard=true → permanent row removal. Refused while the edge fn is in
 *     flight (`generating` / `verifying`) so we don't orphan a running
 *     AI chain that then tries to update a ghost row.
 *
 * Both modes also null out the `used_in_draft_id` reference on the source
 * topic (if any) so a topic that had this as its only draft can be reused.
 */
export const DELETE = requireAdmin(async (req: NextRequest, ctx?: Ctx) => {
  const { id }       = await ctx!.params;
  const { searchParams } = new URL(req.url);
  const hard         = searchParams.get('hard') === 'true';
  const sb           = adminClient();

  if (hard) {
    // Guard: refuse hard-delete while AI is mid-flight — we can't undo
    // a Supabase function call once it's billing.
    const { data: current, error: loadErr } = await sb
      .from('content_drafts')
      .select('id, status')
      .eq('id', id)
      .single();
    if (loadErr) return NextResponse.json({ error: loadErr.message }, { status: 404 });
    if (current.status === 'generating' || current.status === 'verifying') {
      return NextResponse.json(
        { error: `Cannot delete while status = ${current.status}. Wait for the current stage to finish, then try again.` },
        { status: 409 },
      );
    }

    // Clear any source-topic pointer before removing the row, so the
    // topic can be reused for another brief.
    await sb
      .from('content_topics')
      .update({ used_in_draft_id: null, status: 'approved' })
      .eq('used_in_draft_id', id);

    const { error } = await sb.from('content_drafts').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, hard: true });
  }

  // Soft delete = archive. Reversible via a manual status flip in SQL.
  const { error } = await sb
    .from('content_drafts')
    .update({ status: 'archived' })
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, hard: false });
});
