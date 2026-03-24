"use client";

import React, { useState } from "react";
import type { Block, BlockType } from "@/components/admin/pageEditorTypes";

export const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactElement; defaults: Record<string, string> }[] = [
  { type: "heading",   label: "Heading",    icon: <span className="font-black text-sm">H</span>, defaults: { text: "New Heading", level: "h2" } },
  { type: "paragraph", label: "Paragraph",  icon: <span className="font-black text-sm">¶</span>, defaults: { text: "Write your content here…" } },
  { type: "image",     label: "Image",      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>, defaults: { src: "", alt: "", caption: "" } },
  { type: "cta",       label: "CTA Button", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="10" rx="5"/><path d="M15 12h4M17 10l2 2-2 2"/></svg>, defaults: { label: "Learn More", href: "/", style: "primary" } },
  { type: "callout",   label: "Callout",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, defaults: { text: "", style: "info" } },
  { type: "two-col",   label: "2 Columns",  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>, defaults: { left: "", right: "" } },
  { type: "divider",   label: "Divider",    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>, defaults: {} },
  { type: "html",      label: "Raw HTML",   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>, defaults: { html: "" } },
];

interface BlockEditorProps {
  block: Block;
  onChange: (b: Block) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function PageBlockEditor({ block, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: BlockEditorProps) {
  const [open, setOpen] = useState(true);

  function set(key: string, val: string) {
    onChange({ ...block, data: { ...block.data, [key]: val } });
  }

  const meta = BLOCK_TYPES.find(b => b.type === block.type)!;

  return (
    <div className="admin-block-editor">
      {/* Block toolbar */}
      <div className="admin-block-toolbar">
        <div className="admin-block-drag" aria-hidden="true">
          <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
            <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
            <circle cx="3" cy="8" r="1.5"/><circle cx="9" cy="8" r="1.5"/>
            <circle cx="3" cy="13" r="1.5"/><circle cx="9" cy="13" r="1.5"/>
          </svg>
        </div>
        <button className="admin-block-toggle" onClick={() => setOpen(o => !o)} aria-label={open ? "Collapse block" : "Expand block"}>
          <span className="admin-block-icon">{meta.icon}</span>
          <span className="admin-block-label">{meta.label}</span>
          <svg className={`admin-block-chevron${open ? " open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div className="admin-block-actions">
          <button onClick={onMoveUp}   disabled={isFirst} className="admin-icon-btn" aria-label="Move up">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button onClick={onMoveDown} disabled={isLast}  className="admin-icon-btn" aria-label="Move down">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <button onClick={onDelete} className="admin-icon-btn admin-icon-btn-danger" aria-label="Delete block">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Block fields */}
      {open && (
        <div className="admin-block-body">
          {block.type === "heading" && (
            <div className="grid grid-cols-[100px_1fr] gap-4">
              <div className="admin-field">
                <label className="admin-field-label">Level</label>
                <select value={block.data.level} onChange={e => set("level", e.target.value)}>
                  {["h1","h2","h3","h4"].map(h => <option key={h} value={h}>{h.toUpperCase()}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Text</label>
                <input value={block.data.text} onChange={e => set("text", e.target.value)} placeholder="Heading text…" />
              </div>
            </div>
          )}

          {block.type === "paragraph" && (
            <div className="admin-field">
              <label className="admin-field-label">Content</label>
              <textarea rows={5} value={block.data.text} onChange={e => set("text", e.target.value)} placeholder="Write your paragraph…" />
            </div>
          )}

          {block.type === "image" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-field col-span-2">
                <label className="admin-field-label">Image URL</label>
                <input value={block.data.src} onChange={e => set("src", e.target.value)} placeholder="https://…" />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Alt Text</label>
                <input value={block.data.alt} onChange={e => set("alt", e.target.value)} placeholder="Describe the image…" />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Caption <span className="admin-field-optional">(optional)</span></label>
                <input value={block.data.caption} onChange={e => set("caption", e.target.value)} />
              </div>
            </div>
          )}

          {block.type === "cta" && (
            <div className="grid grid-cols-3 gap-4">
              <div className="admin-field col-span-2">
                <label className="admin-field-label">Button Label</label>
                <input value={block.data.label} onChange={e => set("label", e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Style</label>
                <select value={block.data.style} onChange={e => set("style", e.target.value)}>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
              <div className="admin-field col-span-3">
                <label className="admin-field-label">URL</label>
                <input value={block.data.href} onChange={e => set("href", e.target.value)} placeholder="/ or https://…" />
              </div>
            </div>
          )}

          {block.type === "callout" && (
            <div className="grid grid-cols-[160px_1fr] gap-4">
              <div className="admin-field">
                <label className="admin-field-label">Style</label>
                <select value={block.data.style} onChange={e => set("style", e.target.value)}>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="danger">Danger</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Content</label>
                <textarea rows={3} value={block.data.text} onChange={e => set("text", e.target.value)} />
              </div>
            </div>
          )}

          {block.type === "two-col" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-field">
                <label className="admin-field-label">Left Column</label>
                <textarea rows={6} value={block.data.left} onChange={e => set("left", e.target.value)} />
              </div>
              <div className="admin-field">
                <label className="admin-field-label">Right Column</label>
                <textarea rows={6} value={block.data.right} onChange={e => set("right", e.target.value)} />
              </div>
            </div>
          )}

          {block.type === "divider" && (
            <div className="admin-block-divider-preview"><hr /></div>
          )}

          {block.type === "html" && (
            <div className="admin-field">
              <label className="admin-field-label">Raw HTML</label>
              <textarea rows={7} className="admin-code-field" value={block.data.html} onChange={e => set("html", e.target.value)} placeholder="<div>Custom HTML…</div>" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
