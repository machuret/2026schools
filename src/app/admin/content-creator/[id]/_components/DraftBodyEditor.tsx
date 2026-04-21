"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * DraftBodyEditor — the big editing surface.
 *
 * Renders, in order:
 *   1. Title input (long-form only — social posts have no title).
 *   2. Body textarea (row count adapts to content_type).
 *   3. Char counter with turn-red-over-limit behaviour.
 *   4. Stage-specific action row:
 *        idea / approved_idea → Generate
 *        draft / rejected     → Save + Verify
 *        verified             → Copy / Download / Edit (demotes)
 *        generating / verifying → <DraftSpinner />
 *        stuck                → <StuckBanner />
 *
 * The `isEditable` flag is computed in the parent because it's status-
 * derived and we want the parent hook to own all status logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { ContentDraft } from "@/lib/content-creator/types";
import { PLATFORM_CONFIG } from "@/lib/content-creator/platforms";
import { DraftSpinner } from "./DraftSpinner";

export interface DraftBodyEditorProps {
  draft:        ContentDraft;
  title:        string;
  body:         string;
  onTitleChange: (t: string) => void;
  onBodyChange:  (b: string) => void;
  isEditable:   boolean;
  inFlight:     boolean;
  busy:         null | 'generate' | 'verify' | 'save';
  stuck:        boolean;
  stuckAfterSeconds: number;

  onGenerate:   () => void;
  onSave:       () => void;
  onVerify:     () => void;
  onCopy:       () => void;
  onDownload:   () => void;
  onRetryStuck: () => void;
}

export function DraftBodyEditor(props: DraftBodyEditorProps) {
  const {
    draft, title, body, onTitleChange, onBodyChange,
    isEditable, inFlight, busy, stuck, stuckAfterSeconds,
    onGenerate, onSave, onVerify, onCopy, onDownload, onRetryStuck,
  } = props;

  const charLimit = draft.content_type === 'social' && draft.platform
    ? PLATFORM_CONFIG[draft.platform]?.maxChars
    : undefined;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      {draft.content_type !== 'social' && (
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={!isEditable || inFlight}
          placeholder="Title"
          style={{
            fontSize: 22,
            fontWeight: 700,
            padding: '10px 12px',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            color: '#1E1040',
          }}
        />
      )}

      <textarea
        value={body}
        onChange={(e) => onBodyChange(e.target.value)}
        disabled={!isEditable || inFlight}
        rows={draft.content_type === 'social' ? 6 : 18}
        placeholder={
          draft.status === 'idea'
            ? 'This is the idea summary. Approve + Generate to produce full content.'
            : 'Write / edit the body here. Every claim must be backed by a Vault entry.'
        }
        style={{
          padding: '12px 14px',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: 'inherit',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: 180,
        }}
      />

      {charLimit && (
        <div style={{ fontSize: 12, color: body.length > charLimit ? '#B91C1C' : '#6B7280' }}>
          {body.length} / {charLimit} chars
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {(draft.status === 'idea' || draft.status === 'approved_idea') && (
          <button onClick={onGenerate} disabled={inFlight} className="swa-btn swa-btn--primary">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
            {busy === 'generate' ? 'Generating…' : 'Generate content'}
          </button>
        )}

        {(draft.status === 'draft' || draft.status === 'rejected') && (
          <>
            <button onClick={onSave} disabled={inFlight} className="swa-btn">
              {busy === 'save' ? 'Saving…' : 'Save'}
            </button>
            <button onClick={onVerify} disabled={inFlight} className="swa-btn swa-btn--primary">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>fact_check</span>
              {busy === 'verify' ? 'Verifying…' : 'Verify against Vault'}
            </button>
          </>
        )}

        {draft.status === 'verified' && (
          <>
            <button onClick={onCopy} className="swa-btn swa-btn--primary">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>content_copy</span>
              Copy
            </button>
            <button onClick={onDownload} className="swa-btn">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span>
              Download .md
            </button>
            <button onClick={onSave} className="swa-btn">
              Edit (demotes to draft)
            </button>
          </>
        )}

        {draft.status === 'generating' && !stuck && <DraftSpinner label="Writing draft…" />}
        {draft.status === 'verifying'  && !stuck && <DraftSpinner label="Checking claims against Vault…" />}

        {stuck && (
          <div style={{
            width: '100%', padding: 12, background: '#FEF2F2',
            borderRadius: 8, color: '#991B1B', fontSize: 13,
          }}>
            <strong>Still processing after {stuckAfterSeconds}s.</strong> The AI call may have stalled.
            <button
              onClick={onRetryStuck}
              className="swa-btn"
              style={{ marginLeft: 8 }}
            >
              Check again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
