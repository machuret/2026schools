"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoPanel from "@/components/admin/SeoPanel";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface ImpactBox { title: string; text: string; }

interface Issue {
  id: string; rank: number; slug: string; icon: string; severity: string;
  title: string; anchor_stat: string; short_desc: string; definition: string;
  australian_data: string; mechanisms: string; impacts: ImpactBox[];
  groups: string[]; sources: string[];
  seo_title?: string; seo_desc?: string; og_image?: string;
}

const I = "w-full rounded-xl px-4 py-2.5 text-[15px] outline-none transition-all";
const IS: React.CSSProperties = { background: "#fff", border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-primary)", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
const L = "block text-xs font-semibold mb-2 uppercase tracking-wider";
const LS: React.CSSProperties = { color: "var(--admin-text-subtle)" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-4"><label className={L} style={LS}>{label}</label>{children}</div>;
}

function parseJsonArray<T>(raw: unknown, fallback: T[]): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (typeof raw === "string") { try { return JSON.parse(raw); } catch { return fallback; } }
  return fallback;
}

function ImpactCard({ impact, idx, onChange, onRemove }: {
  impact: ImpactBox; idx: number;
  onChange: (idx: number, field: keyof ImpactBox, val: string) => void;
  onRemove: (idx: number) => void;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--admin-text-faint)" }}>Impact #{idx + 1}</span>
        <button onClick={() => onRemove(idx)} className="admin-btn admin-btn-danger text-xs px-2.5 py-1">Remove</button>
      </div>
      <Field label="Title">
        <input className={I} style={IS} value={impact.title} onChange={e => onChange(idx, "title", e.target.value)} placeholder="e.g. Academic Performance" />
      </Field>
      <Field label="Description">
        <textarea rows={2} className={I} style={{ ...IS, resize: "vertical" }} value={impact.text} onChange={e => onChange(idx, "text", e.target.value)} placeholder="How this issue impacts students…" />
      </Field>
    </div>
  );
}

function TagList({ items, onAdd, onRemove, placeholder }: {
  items: string[]; onAdd: (val: string) => void; onRemove: (idx: number) => void; placeholder: string;
}) {
  const [input, setInput] = useState("");
  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault(); onAdd(input.trim()); setInput("");
    }
    if (e.key === "Backspace" && !input && items.length > 0) onRemove(items.length - 1);
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 text-[13px] px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "#fff", color: "var(--admin-text-secondary)", border: "1px solid var(--admin-border)" }}>
            {item}
            <button onClick={() => onRemove(idx)} className="ml-1" style={{ color: "var(--admin-text-subtle)" }}>×</button>
          </span>
        ))}
      </div>
      <input className={I} style={IS} value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown} placeholder={items.length === 0 ? placeholder : "Type and press Enter…"} />
    </div>
  );
}

export default function IssueEditForm({ issue }: { issue: Issue | null }) {
  const router = useRouter();
  const isNew = !issue;
  const [tab, setTab] = useState<"basic" | "content" | "impacts" | "seo">("basic");
  const [dirty, setDirty] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    rank: issue?.rank ?? 0, slug: issue?.slug ?? "", icon: issue?.icon ?? "",
    severity: issue?.severity ?? "notable", title: issue?.title ?? "",
    anchor_stat: issue?.anchor_stat ?? "", short_desc: issue?.short_desc ?? "",
    definition: issue?.definition ?? "", australian_data: issue?.australian_data ?? "",
    mechanisms: issue?.mechanisms ?? "",
    seo_title: issue?.seo_title ?? "", seo_desc: issue?.seo_desc ?? "", og_image: issue?.og_image ?? "",
  });
  const [impacts, setImpacts] = useState<ImpactBox[]>(parseJsonArray<ImpactBox>(issue?.impacts, []));
  const [groups, setGroups] = useState<string[]>(parseJsonArray<string>(issue?.groups, []));
  const [sources, setSources] = useState<string[]>(parseJsonArray<string>(issue?.sources, []));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }));
    setDirty(true); setSuccess(false);
  }

  function updateImpact(idx: number, field: keyof ImpactBox, val: string) {
    setImpacts(s => s.map((item, i) => i === idx ? { ...item, [field]: val } : item));
    setDirty(true);
  }
  function removeImpact(idx: number) { setImpacts(s => s.filter((_, i) => i !== idx)); setDirty(true); }
  function addImpact() { setImpacts(s => [...s, { title: "", text: "" }]); setDirty(true); }

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }
    setSaving(true); setError(""); setSuccess(false);
    const sb = createClient();
    const payload = {
      rank: Number(form.rank), slug: form.slug.trim(), icon: form.icon.trim(),
      severity: form.severity, title: form.title.trim(), anchor_stat: form.anchor_stat.trim(),
      short_desc: form.short_desc.trim(), definition: form.definition.trim(),
      australian_data: form.australian_data.trim(), mechanisms: form.mechanisms.trim(),
      impacts, groups, sources,
      seo_title: form.seo_title.trim(), seo_desc: form.seo_desc.trim(), og_image: form.og_image.trim(),
    };
    if (isNew) {
      const { data, error: err } = await sb.from("issues").insert(payload).select("id").single();
      if (err) { setError(err.message); } else if (data) { router.push(`/admin/issues/${data.id}`); router.refresh(); return; }
    } else {
      const { error: err } = await sb.from("issues").update(payload).eq("id", issue!.id);
      if (err) { setError(err.message); } else { setSuccess(true); setDirty(false); router.refresh(); }
    }
    setSaving(false);
  }, [form, impacts, groups, sources, isNew, issue, router]);

  async function handleDelete() {
    if (!issue) return;
    const sb = createClient();
    await sb.from("issues").delete().eq("id", issue.id);
    router.push("/admin/issues"); router.refresh();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  const TABS = [
    { id: "basic",   label: "Basic Info",     count: null },
    { id: "content", label: "Content",        count: null },
    { id: "impacts", label: "Impacts & Data", count: impacts.length },
    { id: "seo",     label: "SEO",            count: null },
  ] as const;

  return (
    <div className="max-w-4xl">
      <ConfirmModal open={showDeleteModal} title="Delete this issue?"
        message={`"${issue?.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Issue" onConfirm={handleDelete} onCancel={() => setShowDeleteModal(false)} />

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 justify-center"
            style={tab === t.id
              ? { background: "#fff", color: "var(--admin-text-primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
              : { background: "transparent", color: "var(--admin-text-subtle)" }}>
            {t.label}
            {t.count !== null && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={tab === t.id
                  ? { background: "var(--admin-accent-bg)", color: "var(--admin-accent)" }
                  : { background: "var(--admin-border)", color: "var(--admin-text-subtle)" }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Basic Info ── */}
      {tab === "basic" && (
        <div className="admin-card">
          <div className="grid grid-cols-3 gap-5 mb-1">
            <Field label="Rank"><input type="number" className={I} style={IS} value={form.rank} onChange={e => set("rank", e.target.value)} /></Field>
            <Field label="Icon (emoji)"><input className={I} style={IS} value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="😰" /></Field>
            <Field label="Severity">
              <select className={I} style={IS} value={form.severity} onChange={e => set("severity", e.target.value)}>
                <option value="critical">Critical</option><option value="high">High</option><option value="notable">Notable</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-1">
            <Field label="Slug"><input className={I} style={IS} value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="e.g. anxiety" /></Field>
            <Field label="Anchor Stat"><input className={I} style={IS} value={form.anchor_stat} onChange={e => set("anchor_stat", e.target.value)} placeholder="e.g. 1 in 7 students" /></Field>
          </div>
          <Field label="Title">
            <input className={I} style={{ ...IS, fontSize: "1rem", fontWeight: 600 }} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Anxiety Disorders" />
          </Field>
          <Field label="Short Description">
            <textarea rows={3} className={I} style={{ ...IS, resize: "vertical" }} value={form.short_desc} onChange={e => set("short_desc", e.target.value)} placeholder="Brief summary for listings and previews" />
          </Field>
        </div>
      )}

      {/* ── Tab: Content ── */}
      {tab === "content" && (
        <div className="admin-card">
          <Field label="Definition (What Is It?)">
            <textarea rows={5} className={I} style={{ ...IS, resize: "vertical" }} value={form.definition} onChange={e => set("definition", e.target.value)} placeholder="Detailed definition of this wellbeing issue…" />
          </Field>
          <Field label="Australian Data">
            <textarea rows={5} className={I} style={{ ...IS, resize: "vertical" }} value={form.australian_data} onChange={e => set("australian_data", e.target.value)} placeholder="Key Australian statistics and findings…" />
          </Field>
          <Field label="Mechanisms (How It Affects Learning)">
            <textarea rows={5} className={I} style={{ ...IS, resize: "vertical" }} value={form.mechanisms} onChange={e => set("mechanisms", e.target.value)} placeholder="Describe the pathways through which this issue impacts student learning…" />
          </Field>
        </div>
      )}

      {/* ── Tab: Impacts & Data ── */}
      {tab === "impacts" && (
        <div className="space-y-6">
          <div className="admin-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "var(--admin-text-primary)" }}>Impact Areas</h2>
                <p className="text-xs mt-1" style={{ color: "var(--admin-text-subtle)" }}>How this issue affects students</p>
              </div>
              <button onClick={addImpact} className="admin-btn admin-btn-primary text-xs">+ Add Impact</button>
            </div>
            {impacts.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ border: "2px dashed var(--admin-border)" }}>
                <p className="text-xs" style={{ color: "var(--admin-text-faint)" }}>No impacts yet — click &quot;Add Impact&quot; to add one.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {impacts.map((impact, idx) => <ImpactCard key={idx} impact={impact} idx={idx} onChange={updateImpact} onRemove={removeImpact} />)}
              </div>
            )}
          </div>

          <div className="admin-card">
            <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--admin-text-primary)" }}>Groups at Risk</h2>
            <p className="text-xs mb-4" style={{ color: "var(--admin-text-subtle)" }}>Type a group name and press Enter to add</p>
            <TagList items={groups} onAdd={val => { setGroups(g => [...g, val]); setDirty(true); }}
              onRemove={idx => { setGroups(g => g.filter((_, i) => i !== idx)); setDirty(true); }}
              placeholder="e.g. Indigenous students, Rural students…" />
          </div>

          <div className="admin-card">
            <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--admin-text-primary)" }}>Sources & Citations</h2>
            <p className="text-xs mb-4" style={{ color: "var(--admin-text-subtle)" }}>Add reference URLs or citation text — press Enter after each</p>
            <TagList items={sources} onAdd={val => { setSources(s => [...s, val]); setDirty(true); }}
              onRemove={idx => { setSources(s => s.filter((_, i) => i !== idx)); setDirty(true); }}
              placeholder="e.g. https://aihw.gov.au/reports/…" />
          </div>
        </div>
      )}

      {/* ── Tab: SEO ── */}
      {tab === "seo" && (
        <SeoPanel seoTitle={form.seo_title} seoDesc={form.seo_desc} ogImage={form.og_image}
          defaultTitle={form.title} defaultDesc={form.short_desc} onChange={(field, value) => set(field, value)} />
      )}

      {/* Actions bar */}
      <div className="mt-8">
        {error && <div className="admin-alert admin-alert-error mb-4">{error}</div>}
        {success && (
          <div className="admin-alert admin-alert-success mb-4 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Saved successfully
          </div>
        )}
        <div className="flex items-center gap-3 pt-6" style={{ borderTop: "1px solid var(--admin-border)" }}>
          <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary" style={{ minWidth: "130px", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : isNew ? "Create Issue" : "Save Changes"}
          </button>
          {dirty && !saving && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--admin-warning-light)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--admin-warning-light)" }} />
              Unsaved changes
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => router.push("/admin/issues")} className="admin-btn admin-btn-ghost">← Back</button>
            {!isNew && <button onClick={() => setShowDeleteModal(true)} className="admin-btn admin-btn-danger">Delete</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
