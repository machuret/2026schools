"use client";

/* ═══════════════════════════════════════════════════════════════════════════
 * /admin/content-creator/new — create a brief and kick off stage 1.
 *
 * Thin orchestrator after the Apr 2026 refactor. UI pieces live in:
 *   _components/BriefForm.tsx              — the form itself
 *   _components/SourceTopicBanner.tsx      — "Pre-filled from topic" strip
 *   _components/ApprovedTopicsSidebar.tsx  — right-hand topic chooser
 *   _components/form-primitives.tsx        — Field + inputStyle
 *
 * Submitting calls the `generate_ideas` edge fn which pulls vault context,
 * asks OpenAI for N ideas, and inserts them as `status='idea'` rows.
 * Success → redirect back to /admin/content-creator where the new rows
 * appear ready for approval.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { generateIdeas, createGeoDraft } from "@/lib/content-creator/client";
import { adminFetch } from "@/lib/adminFetch";
import {
  getTopic, listTopics, type ContentTopic,
} from "@/lib/content-creator/topics";
import { listStyles, type WritingStyle } from "@/lib/content-creator/styles";
import {
  BriefForm,
  type BriefFormValues,
  type AreaOption,
  type IssueOption,
} from "./_components/BriefForm";
import { SourceTopicBanner }      from "./_components/SourceTopicBanner";
import { ApprovedTopicsSidebar }  from "./_components/ApprovedTopicsSidebar";

export default function NewBriefPage() {
  // useSearchParams requires a Suspense boundary in Next 14+ static/prerender
  // paths. Wrapping the whole inner component keeps the build happy.
  return (
    <Suspense fallback={<div style={{ padding: 40, color: '#9CA3AF' }}>Loading…</div>}>
      <NewBriefPageInner />
    </Suspense>
  );
}

function NewBriefPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<BriefFormValues>({
    contentType: 'social',
    platform:    'linkedin',
    topic:       '',
    tone:        '',
    audience:    '',
    keywords:    '',
    vaultCat:    '',
    count:       5,
    styleId:     '',
    areaSlug:    '',
    issueSlug:   '',
  });

  // GEO dropdown data — loaded lazily (only when the admin switches to
  // GEO) to keep the /new page snappy for the common non-GEO case.
  const [areas,  setAreas]  = useState<AreaOption[]>([]);
  const [issues, setIssues] = useState<IssueOption[]>([]);

  const updateForm = useCallback(
    <K extends keyof BriefFormValues>(key: K, v: BriefFormValues[K]) => {
      setForm((prev) => ({ ...prev, [key]: v }));
    },
    [],
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Topic-driven state.
  const [sourceTopic,    setSourceTopic]    = useState<ContentTopic | null>(null);
  const [approvedTopics, setApprovedTopics] = useState<ContentTopic[]>([]);
  const [styles,         setStyles]         = useState<WritingStyle[]>([]);

  /** Pre-fill every brief field from a topic. Used both by ?topic_id= deep
   *  links and by clicking a card in the sidebar. */
  const applyTopic = useCallback((t: ContentTopic) => {
    setSourceTopic(t);
    setForm((prev) => ({
      ...prev,
      topic:    t.title,
      tone:     t.suggested_tone     ?? prev.tone,
      audience: t.suggested_audience ?? prev.audience,
      keywords: (t.suggested_keywords ?? []).length > 0
        ? (t.suggested_keywords ?? []).join(', ')
        : prev.keywords,
      vaultCat: t.vault_category ?? prev.vaultCat,
    }));
  }, []);

  // Deep-link prefill: /admin/content-creator/new?topic_id=…
  useEffect(() => {
    const id = searchParams.get('topic_id');
    if (!id) return;
    getTopic(id).then(applyTopic).catch((e) => {
      setError(`Could not load topic: ${e instanceof Error ? e.message : String(e)}`);
    });
  }, [searchParams, applyTopic]);

  // Sidebar: approved topics. Non-critical — swallow errors so the form stays usable.
  useEffect(() => {
    listTopics({ status: 'approved', limit: 30 })
      .then(setApprovedTopics)
      .catch(() => { /* sidebar is non-critical */ });
  }, []);

  // Writing styles dropdown. Also non-critical.
  useEffect(() => {
    listStyles({ active_only: true })
      .then(setStyles)
      .catch(() => { /* non-critical */ });
  }, []);

  // GEO data. Only fires when the admin switches to GEO; both fetches
  // are idempotent so repeated switches are cheap.
  useEffect(() => {
    if (form.contentType !== 'geo') return;
    if (areas.length === 0) {
      adminFetch('/api/admin/areas')
        .then((r) => r.json())
        .then((d: { areas?: AreaOption[] }) => setAreas(
          (d.areas ?? []).map((a) => ({ slug: a.slug, name: a.name, state: a.state }))
        ))
        .catch(() => { /* non-critical — form stays usable */ });
    }
    if (issues.length === 0) {
      // /api/admin/issues returns a flat array (see /admin/issues/page.tsx
      // which reads it as `issues`). The server shape is the same as the
      // fields IssueOption expects.
      adminFetch('/api/admin/issues')
        .then((r) => r.json())
        .then((d: IssueOption[] | { issues?: IssueOption[] }) => {
          const list = Array.isArray(d) ? d : (d.issues ?? []);
          setIssues(list.map((i) => ({ slug: i.slug, title: i.title, severity: i.severity })));
        })
        .catch(() => { /* non-critical */ });
    }
  }, [form.contentType, areas.length, issues.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      // GEO goes through its own stage-0 endpoint. Single draft, no ideas
      // stage — we redirect straight to the detail page so the admin can
      // click Generate.
      if (form.contentType === 'geo') {
        if (!form.areaSlug || !form.issueSlug) {
          setError('Please pick both an area and an issue.');
          setSubmitting(false);
          return;
        }
        const draft = await createGeoDraft({
          area_slug:  form.areaSlug,
          issue_slug: form.issueSlug,
          brief: {
            tone:          form.tone.trim()     || undefined,
            audience:      form.audience.trim() || undefined,
            style_id:      form.styleId || undefined,
            length_preset: 'standard',
          },
        });
        router.push(`/admin/content-creator/${draft.id}`);
        return;
      }

      const result = await generateIdeas({
        content_type: form.contentType,
        platform:     form.contentType === 'social' ? form.platform : undefined,
        brief: {
          topic:          form.topic.trim(),
          tone:           form.tone.trim()     || undefined,
          audience:       form.audience.trim() || undefined,
          keywords:       form.keywords.split(',').map((s) => s.trim()).filter(Boolean),
          vault_category: form.vaultCat.trim() || undefined,
          // Backend flips this topic to 'used' post-success.
          source_topic_id: sourceTopic?.id,
          // Empty string → undefined so the Zod .uuid() doesn't reject it.
          style_id:        form.styleId || undefined,
        },
        count: form.count,
      });
      if (result.length === 0) {
        setError("No ideas returned. Try a broader topic or remove the vault category filter.");
        setSubmitting(false);
        return;
      }
      router.push('/admin/content-creator');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  }

  const showSidebar = approvedTopics.length > 0;

  return (
    <div>
      <div className="swa-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Link
              href="/admin/content-creator"
              style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}
            >
              ← Back to Content Creator
            </Link>
          </div>
          <h1 className="swa-page-title">New Brief</h1>
          <p className="swa-page-subtitle">
            Fill in the brief. We’ll generate {form.count} ideas using the Vault
            as the source of truth, then you approve the ones worth turning into
            full content.
          </p>
        </div>
      </div>

      {error && <div className="swa-alert swa-alert--error" style={{ marginBottom: 20 }}>{error}</div>}

      {sourceTopic && (
        <SourceTopicBanner
          topic={sourceTopic}
          onUnlink={() => setSourceTopic(null)}
        />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: showSidebar ? '1fr 280px' : '1fr',
        gap: 24,
        alignItems: 'flex-start',
      }}>
        <BriefForm
          value={form}
          onChange={updateForm}
          styles={styles}
          areas={areas}
          issues={issues}
          submitting={submitting}
          onSubmit={onSubmit}
        />

        {showSidebar && (
          <ApprovedTopicsSidebar
            topics={approvedTopics}
            activeId={sourceTopic?.id ?? null}
            onPick={applyTopic}
          />
        )}
      </div>
    </div>
  );
}
