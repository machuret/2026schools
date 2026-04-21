"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * BriefForm — the main form for the New Brief page.
 *
 * Controlled component: every field is driven by the `value` object and
 * `onChange` callback from the parent, which keeps state-heavy logic
 * (topic prefilling, submit handling) in the page and this component
 * purely presentational.
 *
 * Platform dropdown is only rendered for `contentType === 'social'` —
 * blog / newsletter don't have a platform selector.
 * ═══════════════════════════════════════════════════════════════════════════ */

import Link from "next/link";
import {
  SOCIAL_PLATFORMS, PLATFORM_CONFIG,
} from "@/lib/content-creator/platforms";
import type { ContentType, SocialPlatform } from "@/lib/content-creator/types";
import type { WritingStyle } from "@/lib/content-creator/styles";
import { Field, inputStyle } from "./form-primitives";

export interface BriefFormValues {
  contentType: ContentType;
  platform:    SocialPlatform;
  topic:       string;
  tone:        string;
  audience:    string;
  keywords:    string;   // comma-separated
  vaultCat:    string;
  count:       number;
  styleId:     string;   // "" = no style
}

export interface BriefFormProps {
  value:      BriefFormValues;
  onChange:   <K extends keyof BriefFormValues>(key: K, v: BriefFormValues[K]) => void;
  styles:     WritingStyle[];
  submitting: boolean;
  onSubmit:   (e: React.FormEvent) => void;
}

export function BriefForm({ value, onChange, styles, submitting, onSubmit }: BriefFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {/* Content type + platform */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Content type" required>
          <select
            value={value.contentType}
            onChange={(e) => onChange('contentType', e.target.value as ContentType)}
            style={inputStyle}
          >
            <option value="social">Social post</option>
            <option value="blog">Blog post</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </Field>
        {value.contentType === 'social' && (
          <Field label="Platform" required>
            <select
              value={value.platform}
              onChange={(e) => onChange('platform', e.target.value as SocialPlatform)}
              style={inputStyle}
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {PLATFORM_CONFIG[p].label} · {PLATFORM_CONFIG[p].maxChars}ch
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      {/* Topic */}
      <Field label="Topic" required hint="One sentence describing what this content should be about.">
        <input
          value={value.topic}
          onChange={(e) => onChange('topic', e.target.value)}
          placeholder="e.g. Why check-ins catch student mental-health issues early"
          style={inputStyle}
          required
          minLength={3}
          maxLength={500}
        />
      </Field>

      {/* Tone + audience */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Tone (optional)">
          <input
            value={value.tone}
            onChange={(e) => onChange('tone', e.target.value)}
            placeholder="evidence-based, warm, direct…"
            style={inputStyle}
          />
        </Field>
        <Field label="Audience (optional)">
          <input
            value={value.audience}
            onChange={(e) => onChange('audience', e.target.value)}
            placeholder="school principals, parents…"
            style={inputStyle}
          />
        </Field>
      </div>

      {/* Writing style — prepended to system message in both ideas and
          generate stages. Catalogue managed on /admin/content-creator/styles. */}
      <Field
        label="Writing style (optional)"
        hint={styles.length === 0
          ? 'No styles yet — create some at Content Creator → Styles.'
          : 'Prepends a style prompt to the AI system message. Leave on "Default" to keep the house voice.'}
      >
        <select
          value={value.styleId}
          onChange={(e) => onChange('styleId', e.target.value)}
          style={inputStyle}
          disabled={styles.length === 0}
        >
          <option value="">Default (no style)</option>
          {styles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}{s.description ? ` — ${s.description}` : ''}
            </option>
          ))}
        </select>
      </Field>

      {/* Keywords + category */}
      <Field
        label="Keywords (optional)"
        hint="Comma-separated. Used for vault keyword matching and in the prompt."
      >
        <input
          value={value.keywords}
          onChange={(e) => onChange('keywords', e.target.value)}
          placeholder="wellbeing, early intervention, secondary school"
          style={inputStyle}
        />
      </Field>
      <Field
        label="Vault category (optional)"
        hint="Narrows the vault RAG to a single category. Leave blank to search everything."
      >
        <input
          value={value.vaultCat}
          onChange={(e) => onChange('vaultCat', e.target.value)}
          placeholder="mental-health / statistics / research"
          style={inputStyle}
        />
      </Field>

      {/* Count */}
      <Field label="How many ideas?">
        <input
          type="number"
          min={1}
          max={10}
          value={value.count}
          onChange={(e) => onChange(
            'count',
            Math.max(1, Math.min(10, parseInt(e.target.value || '5', 10))),
          )}
          style={{ ...inputStyle, maxWidth: 120 }}
        />
      </Field>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <Link href="/admin/content-creator" className="swa-btn">Cancel</Link>
        <button
          type="submit"
          className="swa-btn swa-btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Generating ideas…' : 'Generate ideas'}
        </button>
      </div>
    </form>
  );
}
