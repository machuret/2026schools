'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ambassador {
  id: string;
  name: string;
  title?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  slug: string;
  sortOrder: number;
  active: boolean;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

type FormData = {
  name: string; title: string; bio: string; photoUrl: string;
  slug: string; sortOrder: number; active: boolean;
  linkedinUrl: string; websiteUrl: string;
};

const emptyForm: FormData = {
  name: '', title: '', bio: '', photoUrl: '', slug: '', sortOrder: 0,
  active: true, linkedinUrl: '', websiteUrl: '',
};

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function AmbassadorForm({ initial, onSave, onCancel, saving }: {
  initial: FormData; onSave: (d: FormData) => void; onCancel: () => void; saving: boolean;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [autoSlug, setAutoSlug] = useState(!initial.name);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: keyof FormData, v: string | number | boolean) =>
    setForm(p => { const n = { ...p, [k]: v }; if (k === 'name' && autoSlug) n.slug = slugify(v as string); return n; });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadErr(null);
    try {
      const fd = new window.FormData();
      fd.append('file', file);
      fd.append('folder', 'ambassadors');
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Upload failed');
      set('photoUrl', d.url);
    } catch (err) { setUploadErr(err instanceof Error ? err.message : 'Upload failed'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Row 1: Name + Title */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="swa-form-label">Full Name *</label>
          <input className="swa-form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Dr. Jane Smith" />
        </div>
        <div>
          <label className="swa-form-label">Title / Role</label>
          <input className="swa-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Clinical Psychologist" />
        </div>
      </div>

      {/* Row 2: Photo upload + Slug */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="swa-form-label">Photo</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-border)', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {form.photoUrl ? (
                <Image src={form.photoUrl} alt="Preview" width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--color-text-faint)' }}>person</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="swa-btn" style={{ fontSize: 12, padding: '6px 12px', background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-body)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{uploading ? 'hourglass_empty' : 'upload'}</span>
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              {form.photoUrl && (
                <button type="button" onClick={() => set('photoUrl', '')} style={{ fontSize: 11, color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Remove photo</button>
              )}
              {uploadErr && <span style={{ fontSize: 11, color: 'var(--color-error)' }}>{uploadErr}</span>}
              <input className="swa-form-input" value={form.photoUrl} onChange={e => set('photoUrl', e.target.value)} placeholder="Or paste URL..." style={{ fontSize: 11, padding: '4px 8px' }} />
            </div>
          </div>
        </div>
        <div>
          <label className="swa-form-label">URL Slug * {autoSlug && <span style={{ color: 'var(--color-text-faint)', fontWeight: 400 }}>(auto)</span>}</label>
          <input className="swa-form-input" value={form.slug} onChange={e => { setAutoSlug(false); set('slug', e.target.value); }} placeholder="jane-smith" />
          <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>/ambassadors/{form.slug || '...'}</span>
        </div>
      </div>

      {/* Row 3: Bio (full width, tall) */}
      <div>
        <label className="swa-form-label">Bio</label>
        <textarea className="swa-form-textarea" rows={8} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Write a detailed bio..." />
      </div>

      {/* Row 4: LinkedIn + Website */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="swa-form-label">LinkedIn URL</label>
          <input className="swa-form-input" value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="swa-form-label">Website URL</label>
          <input className="swa-form-input" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)} placeholder="https://..." />
        </div>
      </div>

      {/* Row 5: Sort Order + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label className="swa-form-label">Sort Order</label>
          <input type="number" className="swa-form-input" value={form.sortOrder} onChange={e => set('sortOrder', parseInt(e.target.value) || 0)} />
          <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>Lower = first</span>
        </div>
        <div>
          <label className="swa-form-label">Status</label>
          <button type="button" onClick={() => set('active', !form.active)}
            className={`swa-toggle ${form.active ? 'on' : ''}`} style={{ marginRight: 8 }} />
          <span style={{ fontSize: 13, color: form.active ? 'var(--color-success)' : 'var(--color-text-faint)', fontWeight: 500 }}>
            {form.active ? 'Active' : 'Hidden'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
        <button onClick={() => onSave(form)} disabled={saving || uploading || !form.name || !form.slug}
          className="swa-btn swa-btn-primary" style={{ opacity: saving || !form.name || !form.slug ? 0.5 : 1 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{saving ? 'hourglass_empty' : 'save'}</span>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} className="swa-btn" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-body)' }}>Cancel</button>
      </div>
    </div>
  );
}

export default function AdminAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/ambassadors?all=true');
      const d = await res.json();
      setAmbassadors(d.ambassadors ?? []);
    } catch { setError('Failed to load'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCreate = async (form: FormData) => {
    setCreating(true); setError(null);
    try {
      const res = await fetch('/api/admin/ambassadors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Create failed');
      setAmbassadors(prev => [d.ambassador, ...prev]);
      setShowCreate(false);
    } catch (err) { setError(err instanceof Error ? err.message : 'Create failed'); }
    finally { setCreating(false); }
  };

  const handleUpdate = async (id: string, patch: Partial<Ambassador> | FormData, closeOnDone = true) => {
    setSavingId(id); setError(null);
    try {
      const res = await fetch(`/api/admin/ambassadors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Update failed');
      setAmbassadors(prev => prev.map(a => a.id === id ? d.ambassador : a));
      if (closeOnDone) setEditId(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Update failed'); }
    finally { setSavingId(null); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/ambassadors/${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Delete failed'); }
      setAmbassadors(prev => prev.filter(a => a.id !== id));
      if (editId === id) setEditId(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Delete failed'); }
  };

  const toggleActive = async (a: Ambassador) => {
    await handleUpdate(a.id, { active: !a.active }, false);
  };

  const renderRow = (a: Ambassador) => (
    <div key={a.id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', opacity: a.active ? 1 : 0.5, borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-primary-light)', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {a.photoUrl ? (
            <Image src={a.photoUrl} alt={a.name} width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} unoptimized />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: 14 }}>{a.name}</div>
          {a.title && <div style={{ fontSize: 12, color: 'var(--color-text-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>}
        </div>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)', flexShrink: 0 }}>{a.slug}</span>
        <span className="swa-badge swa-badge--primary" style={{ flexShrink: 0 }}>#{a.sortOrder}</span>
        <button onClick={() => toggleActive(a)} className={`swa-badge ${a.active ? 'swa-badge--success' : ''}`}
          style={{ cursor: 'pointer', border: 'none', flexShrink: 0, background: a.active ? undefined : 'rgba(156,163,175,0.1)', color: a.active ? undefined : 'var(--color-text-faint)' }}>
          {a.active ? 'Active' : 'Hidden'}
        </button>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button onClick={() => setEditId(editId === a.id ? null : a.id)}
            className="swa-btn-ghost" title="Edit"
            style={{ padding: 4, color: editId === a.id ? 'var(--color-primary)' : undefined }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{editId === a.id ? 'close' : 'edit'}</span>
          </button>
          <Link href={`/ambassadors/${a.slug}`} className="swa-btn-ghost" title="View" style={{ padding: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>
          </Link>
          <button onClick={() => handleDelete(a.id, a.name)} className="swa-btn-ghost" title="Delete" style={{ padding: 4, color: 'var(--color-error)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
          </button>
        </div>
      </div>
      {editId === a.id && (
        <div style={{ padding: '16px 20px', background: 'var(--color-primary-pale)', borderBottom: '2px solid var(--color-primary-light)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
            Editing: {a.name}
          </div>
          <AmbassadorForm
            key={a.id + a.updatedAt}
            initial={{ name: a.name, title: a.title ?? '', bio: a.bio ?? '', photoUrl: a.photoUrl ?? '', slug: a.slug, sortOrder: a.sortOrder, active: a.active, linkedinUrl: a.linkedinUrl ?? '', websiteUrl: a.websiteUrl ?? '' }}
            onSave={d => handleUpdate(a.id, d)}
            onCancel={() => setEditId(null)}
            saving={savingId === a.id}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="swa-page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Ambassadors</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-faint)', margin: '2px 0 0' }}>Manage ambassador profiles</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/ambassadors" className="swa-btn" style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text-body)', textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span> View Page
          </Link>
          <button onClick={() => { setShowCreate(true); setEditId(null); }} className="swa-btn swa-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span> Add Ambassador
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      {showCreate && (
        <div className="swa-card" style={{ marginBottom: 20, borderColor: 'var(--color-primary-light)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--color-text-primary)' }}>New Ambassador</div>
          <AmbassadorForm initial={emptyForm} onSave={handleCreate} onCancel={() => setShowCreate(false)} saving={creating} />
        </div>
      )}

      {loading && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-text-faint)' }}>Loading...</div>}

      {!loading && ambassadors.length === 0 && !showCreate && (
        <div className="swa-card" style={{ textAlign: 'center', padding: 48 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--color-text-faint)', display: 'block', marginBottom: 8 }}>diversity_3</span>
          <p style={{ color: 'var(--color-text-faint)', margin: 0 }}>No ambassadors yet. Click &quot;Add Ambassador&quot; to create one.</p>
        </div>
      )}

      {!loading && ambassadors.length > 0 && (
        <div className="swa-card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-faint)' }}>
            <div style={{ width: 40, flexShrink: 0 }}></div>
            <div style={{ flex: 1 }}>Ambassador</div>
            <span style={{ width: 120, flexShrink: 0 }}>Slug</span>
            <span style={{ width: 50, flexShrink: 0, textAlign: 'center' }}>Order</span>
            <span style={{ width: 60, flexShrink: 0 }}>Status</span>
            <span style={{ width: 88, flexShrink: 0, textAlign: 'right' }}>Actions</span>
          </div>
          {ambassadors.map(a => renderRow(a))}
        </div>
      )}

      {!loading && ambassadors.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-faint)' }}>
          <span>{ambassadors.length} total</span>
          <span>{ambassadors.filter(a => a.active).length} active</span>
          <span>{ambassadors.filter(a => !a.active).length} hidden</span>
        </div>
      )}
    </>
  );
}
