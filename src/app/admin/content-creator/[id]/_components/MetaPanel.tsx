"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * MetaPanel — provenance / ai_metadata sidebar card.
 *
 * Surfaces the things an admin needs to debug a run:
 *   - which models produced this draft
 *   - total tokens
 *   - vault refs count
 *   - created / updated timestamps
 *   - drift_warnings from the improve/verify passes
 *   - last_error + last_error_stage when an edge fn threw
 *
 * The `ai_metadata` column is loosely-typed JSON on the DB side, so we
 * widen-then-narrow (`as unknown as Record<string, unknown>`) to pick
 * out fields the TS AIMetadata type doesn't yet enumerate. When we add
 * a field to AIMetadata we can drop the cast.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { ContentDraft } from "@/lib/content-creator/types";

export function MetaPanel({ draft }: { draft: ContentDraft }) {
  const m = draft.ai_metadata ?? {};
  const metaUnknown = m as unknown as Record<string, unknown>;

  const driftWarnings = Array.isArray(metaUnknown.drift_warnings)
    ? (metaUnknown.drift_warnings as string[])
    : [];
  const lastError = typeof metaUnknown.last_error === 'string'
    ? (metaUnknown.last_error as string)
    : null;
  const lastErrorStage = typeof metaUnknown.last_error_stage === 'string'
    ? (metaUnknown.last_error_stage as string)
    : null;

  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
      padding: 16, fontSize: 12, color: '#6B7280',
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1E1040', marginBottom: 10 }}>
        Provenance
      </h3>

      <dl style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr',
        gap: '4px 10px', margin: 0,
      }}>
        <dt>OpenAI</dt>     <dd>{m.openai_model ?? '—'}</dd>
        <dt>Anthropic</dt>  <dd>{m.anthropic_model ?? '—'}</dd>
        <dt>Tokens</dt>     <dd>{m.tokens?.total ?? '—'}</dd>
        <dt>Vault refs</dt> <dd>{(draft.vault_refs ?? []).length}</dd>
        <dt>Created</dt>    <dd>{new Date(draft.created_at).toLocaleString()}</dd>
        <dt>Updated</dt>    <dd>{new Date(draft.updated_at).toLocaleString()}</dd>
      </dl>

      {driftWarnings.length > 0 && (
        <div style={{
          marginTop: 12, padding: 8,
          background: '#FFFBEB', borderLeft: '3px solid #F59E0B', borderRadius: 4,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#B45309',
            marginBottom: 4, textTransform: 'uppercase',
          }}>
            Drift warnings ({driftWarnings.length})
          </div>
          {driftWarnings.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: '#78350F', marginTop: 2 }}>• {w}</div>
          ))}
        </div>
      )}

      {lastError && (
        <div style={{
          marginTop: 12, padding: 8,
          background: '#FEF2F2', borderLeft: '3px solid #EF4444', borderRadius: 4,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#B91C1C',
            marginBottom: 4, textTransform: 'uppercase',
          }}>
            Last error{lastErrorStage ? ` (${lastErrorStage})` : ''}
          </div>
          <div style={{ fontSize: 12, color: '#991B1B' }}>{lastError}</div>
        </div>
      )}
    </div>
  );
}
