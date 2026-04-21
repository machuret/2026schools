"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * StyleRow — single row in the styles list.
 *
 * Row shows: title, retired badge (if !is_active), sort index, optional
 * description, and a 140-char preview of the prompt. Actions on the right
 * are Retire/Reactivate (always), Edit, Delete. All of them are presented
 * as buttons driven by the parent — no local mutation here.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { WritingStyle } from "@/lib/content-creator/styles";

export interface StyleRowProps {
  style:           WritingStyle;
  onEdit:          () => void;
  onDelete:        () => void;
  onToggleActive:  () => void;
}

export function StyleRow({ style, onEdit, onDelete, onToggleActive }: StyleRowProps) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12,
      width: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 600, color: '#1E1040', fontSize: 15 }}>
            {style.title}
          </span>
          {!style.is_active && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 3,
              background: '#F3F4F6', color: '#6B7280',
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              Retired
            </span>
          )}
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>#{style.sort_order}</span>
        </div>

        {style.description && (
          <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 4 }}>
            {style.description}
          </div>
        )}

        <div style={{
          fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          <em>prompt:</em> {style.prompt.slice(0, 140)}{style.prompt.length > 140 ? '…' : ''}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
        <button
          onClick={onToggleActive}
          className="swa-btn"
          style={{ fontSize: 12, padding: '6px 10px', flexShrink: 0, whiteSpace: 'nowrap' }}
          title={style.is_active
            ? 'Hide from brief dropdown'
            : 'Make available to the brief dropdown'}
        >
          {style.is_active ? 'Retire' : 'Reactivate'}
        </button>
        <button onClick={onEdit} className="swa-icon-btn" title="Edit">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
        </button>
        <button
          onClick={onDelete}
          className="swa-icon-btn"
          title="Delete permanently"
          style={{ color: '#EF4444' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
        </button>
      </div>
    </div>
  );
}
