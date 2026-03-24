"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SeoPanel from "@/components/admin/SeoPanel";
import PageBlockEditor, { BLOCK_TYPES } from "@/components/admin/PageBlockEditor";
import type { Block, BlockType, Page } from "@/components/admin/pageEditorTypes";

function uid() { return Math.random().toString(36).slice(2, 10); }
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── PageEditor ──────────────────────────────────────────────────
export default function PageEditor({ page }: { page: Page | null }) {
  const router = useRouter();
  const isNew = !page;

  const [title,       setTitle]       = useState(page?.title ?? "");
  const [slug,        setSlug]        = useState(page?.slug ?? "");
  const [description, setDescription] = useState(page?.description ?? "");
  const [blocks,      setBlocks]      = useState<Block[]>((page?.content as Block[]) ?? []);
  const [status,      setStatus]      = useState(page?.status ?? "draft");
  const [showInMenu,  setShowInMenu]  = useState(page?.show_in_menu ?? false);
  const [metaTitle,   setMetaTitle]   = useState(page?.meta_title ?? "");
  const [metaDesc,    setMetaDesc]    = useState(page?.meta_desc ?? "");
  const [ogImage,     setOgImage]     = useState(page?.og_image ?? "");
  const [showPicker,  setShowPicker]  = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState("");
  const [activeTab,   setActiveTab]   = useState<"content" | "seo" | "settings">("content");
  const [isDirty,     setIsDirty]     = useState(false);

  function mark() { setIsDirty(true); }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (isNew) setSlug(slugify(v));
    mark();
  }

  function addBlock(type: BlockType) {
    const def = BLOCK_TYPES.find(b => b.type === type)!;
    setBlocks(b => [...b, { id: uid(), type, data: { ...def.defaults } }]);
    setShowPicker(false);
    mark();
  }

  function updateBlock(id: string, updated: Block) {
    setBlocks(b => b.map(bl => bl.id === id ? updated : bl));
    mark();
  }

  function deleteBlock(id: string) {
    setBlocks(b => b.filter(bl => bl.id !== id));
    mark();
  }

  function moveBlock(idx: number, dir: -1 | 1) {
    const next = [...blocks];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setBlocks(next);
    mark();
  }

  async function handleSave(publishNow?: boolean) {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!slug.trim())  { setError("Slug is required."); return; }
    setSaving(true); setError(""); setSuccess("");

    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      description: description.trim(),
      content: blocks,
      status: publishNow ? "published" : status,
      show_in_menu: showInMenu,
      meta_title: metaTitle.trim(),
      meta_desc: metaDesc.trim(),
      og_image: ogImage.trim(),
    };

    const sb = createClient();
    let err;

    if (isNew) {
      const res = await sb.from("pages").insert(payload).select("id").single();
      err = res.error;
      if (!err && res.data) {
        router.push(`/admin/cms/pages/${res.data.id}`);
        router.refresh();
        return;
      }
    } else {
      const res = await sb.from("pages").update(payload).eq("id", page!.id);
      err = res.error;
    }

    if (err) {
      setError(err.code === "23505" ? "A page with this slug already exists." : err.message);
    } else {
      setSuccess(publishNow ? "✓ Published" : "✓ Saved");
      if (publishNow) setStatus("published");
      setIsDirty(false);
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!page || !confirm(`Delete "${page.title}"? This cannot be undone.`)) return;
    setDeleting(true); setError("");
    const sb = createClient();
    const { error: delErr } = await sb.from("pages").delete().eq("id", page.id);
    if (delErr) { setError(delErr.message); setDeleting(false); return; }
    router.push("/admin/cms/pages");
    router.refresh();
  }

  const TABS = ["content", "seo", "settings"] as const;

  return (
    <div className="admin-page-editor">

      {/* ── Main panel ── */}
      <div className="admin-page-editor-main">

        {/* Tab bar */}
        <div className="admin-editor-tabs">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`admin-editor-tab${activeTab === t ? " active" : ""}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content tab */}
        {activeTab === "content" && (
          <div className="admin-card">
            {/* Title */}
            <div className="admin-field" style={{ marginBottom: "20px" }}>
              <label className="admin-field-label">Page Title</label>
              <input
                className="admin-title-input"
                value={title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="My New Page"
              />
            </div>

            {/* Slug */}
            <div className="admin-field" style={{ marginBottom: "20px" }}>
              <label className="admin-field-label">URL Slug</label>
              <div className="admin-slug-field">
                <span className="admin-slug-prefix">/pages/</span>
                <input
                  className="admin-slug-input"
                  value={slug}
                  onChange={e => { setSlug(slugify(e.target.value)); mark(); }}
                />
              </div>
              <p className="admin-field-hint">Full URL: <strong>/pages/{slug || "my-page"}</strong></p>
            </div>

            {/* Description */}
            <div className="admin-field" style={{ marginBottom: "28px" }}>
              <label className="admin-field-label">Short Description</label>
              <input
                value={description}
                onChange={e => { setDescription(e.target.value); mark(); }}
                placeholder="Shown in listings and link previews"
              />
            </div>

            {/* Blocks header */}
            <div className="admin-blocks-header">
              <div>
                <span className="admin-section-label" style={{ marginBottom: 0, borderBottom: "none", paddingBottom: 0 }}>Content Blocks</span>
                <span className="admin-badge admin-badge-slate" style={{ marginLeft: "8px" }}>{blocks.length}</span>
              </div>
              <button
                onClick={() => setShowPicker(p => !p)}
                className={`admin-btn admin-btn-primary admin-btn-sm${showPicker ? " active" : ""}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Block
              </button>
            </div>

            {/* Block picker */}
            {showPicker && (
              <div className="admin-block-picker">
                {BLOCK_TYPES.map(bt => (
                  <button key={bt.type} onClick={() => addBlock(bt.type)} className="admin-block-pick-btn">
                    <span className="admin-block-pick-icon">{bt.icon}</span>
                    <span className="admin-block-pick-label">{bt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Block list */}
            {blocks.length === 0 ? (
              <div className="admin-empty" style={{ marginTop: "16px" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="13" y2="15"/></svg>
                <h3>No blocks yet</h3>
                <p>Click &ldquo;Add Block&rdquo; above to start building your page.</p>
              </div>
            ) : (
              <div className="admin-blocks-list">
                {blocks.map((block, idx) => (
                  <PageBlockEditor
                    key={block.id}
                    block={block}
                    onChange={updated => updateBlock(block.id, updated)}
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={() => moveBlock(idx, -1)}
                    onMoveDown={() => moveBlock(idx, 1)}
                    isFirst={idx === 0}
                    isLast={idx === blocks.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SEO tab */}
        {activeTab === "seo" && (
          <SeoPanel
            seoTitle={metaTitle}
            seoDesc={metaDesc}
            ogImage={ogImage}
            defaultTitle={title}
            defaultDesc={description}
            onChange={(field, value) => {
              if (field === "seo_title") setMetaTitle(value);
              else if (field === "seo_desc") setMetaDesc(value);
              else setOgImage(value);
              mark();
            }}
          />
        )}

        {/* Settings tab */}
        {activeTab === "settings" && (
          <div className="admin-card">
            <h2 style={{ marginBottom: "24px" }}>Page Settings</h2>

            <div className="admin-field" style={{ marginBottom: "20px" }}>
              <label className="admin-field-label">Status</label>
              <select value={status} onChange={e => { setStatus(e.target.value); mark(); }}>
                <option value="draft">Draft — not publicly visible</option>
                <option value="published">Published — live on site</option>
              </select>
            </div>

            <div className="admin-toggle-field">
              <div>
                <div className="admin-toggle-label">Show in navigation menu</div>
                <div className="admin-toggle-hint">Adds this page as a menu item</div>
              </div>
              <button
                role="switch"
                aria-checked={showInMenu}
                onClick={() => { setShowInMenu(v => !v); mark(); }}
                className={`admin-toggle${showInMenu ? " on" : ""}`}
              >
                <span className="admin-toggle-thumb" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Publish sidebar ── */}
      <div className="admin-page-editor-sidebar">

        {/* Status card */}
        <div className="admin-card admin-publish-card">
          <div className="admin-section-label" style={{ marginBottom: "16px", borderBottom: "none", paddingBottom: 0 }}>Publish</div>

          <div className="admin-publish-status">
            <span className={`admin-status-dot${status === "published" ? " published" : ""}`} />
            <span>{status === "published" ? "Published" : "Draft"}</span>
            {isDirty && <span className="admin-unsaved-badge">Unsaved</span>}
          </div>

          {error   && <div className="admin-alert admin-alert-error">{error}</div>}
          {success && <div className="admin-alert admin-alert-success">{success}</div>}

          <div className="admin-publish-actions">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="admin-btn admin-btn-secondary"
              style={{ width: "100%" }}
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>

            {status !== "published" && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="admin-btn admin-btn-primary"
                style={{ width: "100%" }}
              >
                Publish
              </button>
            )}

            {status === "published" && !isNew && (
              <a
                href={`/pages/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-ghost"
                style={{ width: "100%" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                View Page
              </a>
            )}

            <button
              onClick={() => router.push("/admin/cms/pages")}
              className="admin-btn admin-btn-ghost"
              style={{ width: "100%" }}
            >
              ← All Pages
            </button>
          </div>
        </div>

        {/* Danger zone */}
        {!isNew && (
          <div className="admin-card admin-danger-card">
            <div className="admin-section-label" style={{ marginBottom: "12px", borderBottom: "none", paddingBottom: 0 }}>Danger Zone</div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="admin-btn admin-btn-danger"
              style={{ width: "100%" }}
            >
              {deleting ? "Deleting…" : "Delete Page"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
