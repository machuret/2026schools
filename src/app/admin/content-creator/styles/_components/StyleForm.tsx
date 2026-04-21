"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * StyleForm — inline create/edit form for a writing style.
 *
 * Self-contained state: local `form` is seeded from `initial` when editing
 * and from defaults when creating. Submission delegates to `onSubmit`,
 * which is how the parent list decides whether this is a create vs. patch.
 *
 * We coerce empty `description` to `null` before submit so the DB gets a
 * tidy NULL rather than an empty string — matches the Zod schema's
 * nullable-string expectation.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import type {
  WritingStyle, CreateStyleInput,
} from "@/lib/content-creator/styles";
import { Field, inputStyle } from "./form-primitives";

export interface StyleFormProps {
  /** Header label — lets the parent show "New" vs "Edit". */
  title:     string;
  /** When present, the form is in edit mode — seeds state + changes the CTA. */
  initial?:  WritingStyle;
  onSubmit:  (input: CreateStyleInput) => Promise<void>;
  onCancel:  () => void;
}

export function StyleForm({ title, initial, onSubmit, onCancel }: StyleFormProps) {
  const [form, setForm] = useState<CreateStyleInput>({
    title:       initial?.title       ?? '',
    description: initial?.description ?? '',
    prompt:      initial?.prompt      ?? '',
    is_active:   initial?.is_active   ?? true,
    sort_order:  initial?.sort_order  ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      await onSubmit({
        ...form,
        // Empty description → null for cleanliness in the DB.
        description: form.description?.trim() ? form.description.trim() : null,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      style={{
        background: '#fff', border: '2px solid #C4B5FD', borderRadius: 12,
        padding: 18, marginBottom: 16,
      }}
    >
      <h2 style={{
        fontSize: 14, fontWeight: 700, color: '#1E1040',
        margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {title}
      </h2>

      {error && <div className="swa-alert swa-alert--error" style={{ marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Field label="Title" hint="Short, unique. Shown in the brief dropdown.">
          <input
            required
            maxLength={120}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Storytelling"
            style={inputStyle}
          />
        </Field>
        <Field label="Sort order" hint="Lower numbers sort first.">
          <input
            type="number"
            min={0}
            max={10000}
            value={form.sort_order ?? 0}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="Description" hint="Free-text note for your team (not sent to the AI).">
        <input
          maxLength={400}
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="e.g. Narrative-led. Use for case studies, launch posts."
          style={inputStyle}
        />
      </Field>

      <Field
        label="Prompt"
        hint={`This text is prepended to the system message sent to OpenAI and Anthropic. Write in the second person — "You write in …".`}
      >
        <textarea
          required
          minLength={10}
          maxLength={4000}
          rows={8}
          value={form.prompt}
          onChange={(e) => setForm({ ...form, prompt: e.target.value })}
          placeholder={`You write in a story-telling voice. Open with a concrete scene…`}
          style={{
            ...inputStyle,
            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
            fontSize: 13,
          }}
        />
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
          {form.prompt.length}/4000
        </div>
      </Field>

      <label style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 13, marginBottom: 16,
      }}>
        <input
          type="checkbox"
          checked={form.is_active ?? true}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
        />
        <span>Active — appears in the brief dropdown.</span>
      </label>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="swa-btn" disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="swa-btn swa-btn--primary" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Create style'}
        </button>
      </div>
    </form>
  );
}
