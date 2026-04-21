"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * useDraftDetail — all data + state + side-effects for the /[id] page.
 *
 * This used to live inline in page.tsx. Extracted so the page component is
 * a thin orchestrator and the business logic is independently testable
 * (no JSX, no DOM — easy to mock).
 *
 * Behaviour preserved verbatim from the pre-refactor page:
 *   - Fetch on mount + on id change.
 *   - Poll every 3s while status is 'generating' | 'verifying'.
 *   - Cap the poll loop at MAX_POLLS so a stalled edge fn can't trap the
 *     UI in an infinite refresh; flip `stuck=true` and expose a retry.
 *   - Auto-approve before generate when the row is still an idea.
 *   - Save-before-verify so the verifier sees the on-screen edits.
 *   - Copy / download emit plain-text + markdown-formatted bodies.
 *
 * "Copied to clipboard" is reused as the success path through the same
 * `error` slot the page already renders — we deliberately keep the
 * single-message UX rather than introducing a toast system for one line.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getDraft,
  patchDraft,
  generateDraft,
  verifyDraft,
  archiveDraft,
  deleteDraft,
  approveIdea,
  unapproveIdea,
} from "@/lib/content-creator/client";
import type { ContentDraft } from "@/lib/content-creator/types";

/** Max poll ticks before we declare the row stuck. 30 × 3s = 90s, which
 *  gives 3× headroom over the edge fn's ~60s max runtime. */
const MAX_POLLS = 30;
const POLL_INTERVAL_MS = 3000;

export type DraftBusy = null | 'generate' | 'verify' | 'save';

export interface UseDraftDetail {
  /** Loaded draft, or null while fetching / if not found. */
  draft:     ContentDraft | null;
  loading:   boolean;
  /** Which action (if any) is currently running. Mutually exclusive. */
  busy:      DraftBusy;
  /** Error string OR the "Copied to clipboard" success message. */
  error:     string;
  /** True when polling has exceeded MAX_POLLS — shows the recovery CTA. */
  stuck:     boolean;
  /** How long we waited before declaring stuck, in seconds — for the UI. */
  stuckAfterSeconds: number;

  /** Local editable title. Empty string when draft.title is null. */
  title:     string;
  setTitle:  (t: string) => void;
  body:      string;
  setBody:   (b: string) => void;

  refresh:      () => Promise<void>;
  doGenerate:   () => Promise<void>;
  doSave:       () => Promise<void>;
  doVerify:     () => Promise<void>;
  doArchive:    () => Promise<void>;
  doDelete:     () => Promise<void>;
  doUnapprove:  () => Promise<void>;
  copyBody:     () => Promise<void>;
  downloadMd:   () => void;
  /** Dismiss the stuck banner and run another refresh. */
  retryFromStuck: () => void;
}

export function useDraftDetail(id: string): UseDraftDetail {
  const router = useRouter();

  const [draft,   setDraft]   = useState<ContentDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState<DraftBusy>(null);
  const [error,   setError]   = useState("");
  const [stuck,   setStuck]   = useState(false);

  // Local editable copies so the textarea doesn't jank on every poll.
  const [title, setTitle] = useState<string>("");
  const [body,  setBody]  = useState<string>("");

  const pollRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  /* ─── Core fetch ──────────────────────────────────────────────────────── */

  const refresh = useCallback(async () => {
    try {
      const d = await getDraft(id);
      setDraft(d);
      setTitle(d.title ?? "");
      // body is TEXT NOT NULL DEFAULT '' but defend against partial rows
      // the page previously crashed on.
      setBody(typeof d.body === 'string' ? d.body : "");
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  /* ─── Auto-poll while a stage is in flight ────────────────────────────── */

  useEffect(() => {
    if (!draft) return;
    const inFlight = draft.status === 'generating' || draft.status === 'verifying';

    if (inFlight && !pollRef.current) {
      pollCountRef.current = 0;
      setStuck(false);
      pollRef.current = setInterval(() => {
        pollCountRef.current += 1;
        if (pollCountRef.current > MAX_POLLS) {
          // Stop polling and surface a recovery CTA.
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setStuck(true);
          return;
        }
        refresh();
      }, POLL_INTERVAL_MS);
    }

    if (!inFlight && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
      pollCountRef.current = 0;
    }

    return () => {
      if (pollRef.current && !inFlight) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [draft, refresh]);

  /* ─── Actions ─────────────────────────────────────────────────────────── */

  const doGenerate = useCallback(async () => {
    if (!draft) return;
    setBusy('generate'); setError("");
    try {
      // "idea → approved_idea → generating" jump: the API layer returns
      // 409 if you skip steps, so approve first when needed.
      if (draft.status === 'idea') {
        await approveIdea(draft.id);
      }
      await generateDraft(draft.id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [draft, refresh]);

  const doSave = useCallback(async () => {
    if (!draft) return;
    setBusy('save'); setError("");
    try {
      const patch: { title?: string | null; body?: string } = { body };
      if (draft.content_type !== 'social') patch.title = title;
      await patchDraft(draft.id, patch);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [draft, title, body, refresh]);

  const doVerify = useCallback(async () => {
    if (!draft) return;
    setBusy('verify'); setError("");
    try {
      // Save any unsaved edits first so the verifier sees what's on-screen.
      await patchDraft(draft.id, {
        body,
        title: draft.content_type === 'social' ? null : title,
      });
      await verifyDraft(draft.id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }, [draft, title, body, refresh]);

  const doArchive = useCallback(async () => {
    if (!draft) return;
    if (!confirm("Archive this draft? You can find it later under Archived.")) return;
    try {
      await archiveDraft(draft.id);
      router.push('/admin/content-creator');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [draft, router]);

  const doDelete = useCallback(async () => {
    if (!draft) return;
    if (!confirm(
      "Delete this draft permanently?\n\n" +
      "This cannot be undone. If you just want to hide it, use Archive instead.",
    )) return;
    try {
      await deleteDraft(draft.id);
      router.push('/admin/content-creator');
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [draft, router]);

  const doUnapprove = useCallback(async () => {
    if (!draft) return;
    try {
      const updated = await unapproveIdea(draft.id);
      setDraft(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [draft]);

  const copyBody = useCallback(async () => {
    if (!draft) return;
    const safeBody = typeof draft.body === 'string' ? draft.body : '';
    const text = draft.content_type === 'social'
      ? safeBody
      : `# ${draft.title ?? ''}\n\n${safeBody}`;
    await navigator.clipboard.writeText(text);
    // Minimal feedback via the existing error slot — no toast library yet.
    setError("Copied to clipboard");
    setTimeout(() => setError(""), 1500);
  }, [draft]);

  const downloadMd = useCallback(() => {
    if (!draft) return;
    const safeBody = typeof draft.body === 'string' ? draft.body : '';
    const text = draft.content_type === 'social'
      ? safeBody
      : `# ${draft.title ?? ''}\n\n${safeBody}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.content_type}-${draft.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [draft]);

  const retryFromStuck = useCallback(() => {
    setStuck(false);
    refresh();
  }, [refresh]);

  return {
    draft, loading, busy, error, stuck,
    stuckAfterSeconds: (MAX_POLLS * POLL_INTERVAL_MS) / 1000,
    title, setTitle, body, setBody,
    refresh,
    doGenerate, doSave, doVerify, doArchive, doDelete, doUnapprove,
    copyBody, downloadMd,
    retryFromStuck,
  };
}
