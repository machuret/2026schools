/* ═══════════════════════════════════════════════════════════════════════════
 * /api/admin/content-creator
 *
 * GET  → list drafts, filterable by status and content_type.
 * POST → kick off stage 1 (generate_ideas). Creates N rows with status='idea'.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/adminClient';
import { requireAdmin } from '@/lib/auth';
import { create as createLimiter } from '@/lib/rateLimit';
import { GenerateIdeasSchema } from '@/lib/content-creator/schemas';

export const runtime = 'nodejs';

// Shared rate-limit bucket for every expensive AI stage on this feature.
// Ideas + generate + verify all share the 30/hour budget because they all
// hit the edge function and cost real $$.
export const contentCreatorAILimiter = createLimiter('content-creator-ai', {
  limit: 30,
  windowSeconds: 60 * 60,
});

// Hard ceiling for edge-fn round trips. Edge fn itself caps at ~60s; we add
// ~25s headroom before giving up so the client sees a clean 504 rather than
// a hung request.
const EDGE_FN_TIMEOUT_MS = 85_000;

/* ─── GET — list ─────────────────────────────────────────────────────────── */

export const GET = requireAdmin(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status       = searchParams.get('status');
  const content_type = searchParams.get('content_type');
  const limit        = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 200);

  const sb = adminClient();
  let q = sb
    .from('content_drafts')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (status)       q = q.eq('status', status);
  if (content_type) q = q.eq('content_type', content_type);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ drafts: data ?? [] });
});

/* ─── POST — generate ideas via edge function ─────────────────────────────── */

export const POST = requireAdmin(async (req: NextRequest) => {
  const limited = contentCreatorAILimiter.check(req);
  if (limited) return limited;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = GenerateIdeasSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const edgeRes = await callEdge({ stage: 'generate_ideas', ...parsed.data });
  return NextResponse.json(edgeRes.body, { status: edgeRes.status });
});

/* ─── Shared edge-function proxy used by POST and the action routes ──────── */

/**
 * Forward a payload to the `content-creator` Supabase Edge Function.
 *
 * Handles three failure modes cleanly:
 *   • env vars missing             → 500 with specific message
 *   • fetch aborts past timeout    → 504 so the client can show a retry CTA
 *   • edge fn returns non-JSON     → 502 with a preview of the body
 */
export async function callEdge(payload: Record<string, unknown>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return { status: 500, body: { error: 'Supabase env vars missing.' } };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EDGE_FN_TIMEOUT_MS);

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/content-creator`, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        Authorization:   `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const raw = await res.text();
    let data: unknown;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return {
        status: 502,
        body: { error: 'Edge fn returned non-JSON.', preview: raw.slice(0, 300) },
      };
    }
    return { status: res.ok ? 200 : res.status, body: data };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        status: 504,
        body: { error: `Edge function timed out after ${EDGE_FN_TIMEOUT_MS / 1000}s.` },
      };
    }
    return {
      status: 500,
      body: { error: err instanceof Error ? err.message : 'Edge fn fetch failed.' },
    };
  } finally {
    clearTimeout(timer);
  }
}
