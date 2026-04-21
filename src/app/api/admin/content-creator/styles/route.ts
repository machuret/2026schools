/* ═══════════════════════════════════════════════════════════════════════════
 * /api/admin/content-creator/styles
 *
 * GET  → list styles (all by default; `?active_only=true` for the brief UI)
 * POST → create a new writing style
 *
 * No AI calls here — this is plain CRUD. Not sharing the content-creator
 * rate limiter on purpose; the limiter is for expensive edge-fn calls.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/adminClient';
import { requireAdmin, verifyAdminAuth } from '@/lib/auth';
import { CreateStyleSchema } from '@/lib/content-creator/styles';
import {
  ok, pgError, parseJsonBody, validate,
} from '@/lib/content-creator/api-helpers';

export const runtime = 'nodejs';

export const GET = requireAdmin(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get('active_only') === 'true';

  let q = adminClient()
    .from('content_writing_styles')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('title',      { ascending: true });

  if (activeOnly) q = q.eq('is_active', true);

  const { data, error } = await q;
  if (error) return pgError(error);
  return ok({ styles: data ?? [] });
});

export const POST = requireAdmin(async (req: NextRequest) => {
  const body = await parseJsonBody(req);
  if (body instanceof NextResponse) return body;

  const input = validate(CreateStyleSchema, body);
  if (input instanceof NextResponse) return input;

  // verifyAdminAuth was already called inside requireAdmin, but it doesn't
  // pass the user through — rerun to attribute created_by. Cheap (one
  // cached session lookup) so we don't bother refactoring the wrapper.
  const user = await verifyAdminAuth(req);

  const { data, error } = await adminClient()
    .from('content_writing_styles')
    .insert({
      title:       input.title,
      description: input.description ?? null,
      prompt:      input.prompt,
      is_active:   input.is_active ?? true,
      sort_order:  input.sort_order ?? 0,
      created_by:  user?.id ?? null,
    })
    .select()
    .single();

  // pgError maps 23505 → 409 automatically, matching the previous
  // manual unique-violation handling.
  if (error) return pgError(error);
  return ok({ style: data }, 201);
});
