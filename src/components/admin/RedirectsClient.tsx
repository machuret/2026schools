"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  note: string;
  created_at: string;
}

const INPUT = "w-full rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500";
const IS = { background: "#0D1117", border: "1px solid #30363D", color: "#C9D1D9" };
const LABEL = "block text-xs font-semibold mb-1.5 uppercase tracking-wide";
const LS = { color: "#6E7681" };

const EMPTY: Omit<Redirect, "id" | "created_at"> = {
  from_path: "",
  to_path: "",
  status_code: 301,
  is_active: true,
  note: "",
};

export default function RedirectsClient({ initial }: { initial: Redirect[] }) {
  const [redirects, setRedirects] = useState<Redirect[]>(initial);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filtered = useMemo(() =>
    redirects.filter(r =>
      r.from_path.toLowerCase().includes(search.toLowerCase()) ||
      r.to_path.toLowerCase().includes(search.toLowerCase()) ||
      r.note.toLowerCase().includes(search.toLowerCase())
    ), [redirects, search]);

  function startEdit(r: Redirect) {
    setEditId(r.id);
    setForm({ from_path: r.from_path, to_path: r.to_path, status_code: r.status_code, is_active: r.is_active, note: r.note });
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ ...EMPTY });
    setError("");
  }

  function setField(key: keyof typeof EMPTY, value: string | number | boolean) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.from_path.trim() || !form.to_path.trim()) {
      setError("From path and To path are required.");
      return;
    }
    if (!form.from_path.startsWith("/")) {
      setError("From path must start with /");
      return;
    }
    if (!form.to_path.startsWith("/") && !form.to_path.startsWith("http")) {
      setError("To path must start with / or http");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    const sb = createClient();

    const payload = {
      from_path: form.from_path.trim(),
      to_path: form.to_path.trim(),
      status_code: Number(form.status_code),
      is_active: form.is_active,
      note: form.note.trim(),
    };

    if (editId) {
      const { error: err } = await sb.from("redirects").update(payload).eq("id", editId);
      if (err) {
        setError(err.message);
      } else {
        setRedirects(rs => rs.map(r => r.id === editId ? { ...r, ...payload } : r));
        setSuccess("Redirect updated.");
        cancelEdit();
      }
    } else {
      const { data, error: err } = await sb.from("redirects").insert(payload).select().single();
      if (err) {
        setError(err.message.includes("unique") ? `A redirect from "${payload.from_path}" already exists.` : err.message);
      } else {
        setRedirects(rs => [data, ...rs]);
        setForm({ ...EMPTY });
        setSuccess("Redirect added.");
      }
    }
    setSaving(false);
  }

  async function handleDelete(id: string, fromPath: string) {
    if (!confirm(`Delete redirect from "${fromPath}"?`)) return;
    const sb = createClient();
    const { error: err } = await sb.from("redirects").delete().eq("id", id);
    if (err) { setError(err.message); return; }
    setRedirects(rs => rs.filter(r => r.id !== id));
    if (editId === id) cancelEdit();
  }

  async function toggleActive(r: Redirect) {
    const sb = createClient();
    const { error: err } = await sb.from("redirects").update({ is_active: !r.is_active }).eq("id", r.id);
    if (err) { setError(err.message); return; }
    setRedirects(rs => rs.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x));
  }

  return (
    <div className="flex gap-6">
      {/* Left: list */}
      <div className="flex-1 min-w-0">
        {/* Search */}
        <div className="mb-4">
          <input
            className={INPUT} style={IS}
            placeholder="Search redirects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Feedback */}
        {error && <div className="mb-3 px-4 py-2 rounded-lg text-sm" style={{ background: "#3D1515", color: "#F87171", border: "1px solid #7F1D1D" }}>{error}</div>}
        {success && <div className="mb-3 px-4 py-2 rounded-lg text-sm" style={{ background: "#0D2D1A", color: "#6EE7B7", border: "1px solid #166534" }}>{success}</div>}

        {/* Table */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #21262D" }}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: "#161B22", borderBottom: "1px solid #21262D" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6E7681" }}>From</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6E7681" }}>To</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6E7681" }}>Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "#6E7681" }}>Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "#484F58" }}>
                    {search ? "No redirects match your search." : "No redirects yet. Add one using the form →"}
                  </td>
                </tr>
              )}
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #21262D", background: editId === r.id ? "#1C2430" : "transparent" }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "#58A6FF", maxWidth: "200px" }}>
                    <div className="truncate">{r.from_path}</div>
                    {r.note && <div className="text-xs mt-0.5 truncate" style={{ color: "#484F58" }}>{r.note}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs truncate" style={{ color: "#C9D1D9", maxWidth: "200px" }}>
                    <div className="truncate">{r.to_path}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{
                      background: r.status_code === 301 ? "#1C2A3A" : "#2D1A0E",
                      color: r.status_code === 301 ? "#58A6FF" : "#F0883E"
                    }}>{r.status_code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(r)} className="text-xs px-2 py-0.5 rounded font-semibold" style={{
                      background: r.is_active ? "#0D2D1A" : "#21262D",
                      color: r.is_active ? "#6EE7B7" : "#6E7681",
                      border: `1px solid ${r.is_active ? "#166534" : "#30363D"}`
                    }}>
                      {r.is_active ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => startEdit(r)} className="text-xs px-3 py-1 rounded" style={{ background: "#21262D", color: "#C9D1D9" }}>Edit</button>
                      <button onClick={() => handleDelete(r.id, r.from_path)} className="text-xs px-3 py-1 rounded" style={{ background: "#3D1515", color: "#F87171" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs" style={{ color: "#484F58" }}>
          {redirects.length} redirect{redirects.length !== 1 ? "s" : ""} total · {redirects.filter(r => r.is_active).length} active
        </div>
      </div>

      {/* Right: add / edit form */}
      <div className="w-72 flex-shrink-0">
        <div className="rounded-xl p-5 sticky top-6" style={{ background: "#161B22", border: "1px solid #21262D" }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: "#E6EDF3" }}>
            {editId ? "Edit Redirect" : "Add Redirect"}
          </h2>

          <div className="mb-4">
            <label className={LABEL} style={LS}>From Path</label>
            <input className={INPUT} style={IS} value={form.from_path} onChange={e => setField("from_path", e.target.value)} placeholder="/old-page-slug" />
            <div className="text-xs mt-1" style={{ color: "#484F58" }}>Must start with /</div>
          </div>

          <div className="mb-4">
            <label className={LABEL} style={LS}>To Path / URL</label>
            <input className={INPUT} style={IS} value={form.to_path} onChange={e => setField("to_path", e.target.value)} placeholder="/new-page-slug" />
            <div className="text-xs mt-1" style={{ color: "#484F58" }}>Start with / or https://</div>
          </div>

          <div className="mb-4">
            <label className={LABEL} style={LS}>Status Code</label>
            <select className={INPUT} style={IS} value={form.status_code} onChange={e => setField("status_code", Number(e.target.value))}>
              <option value={301}>301 — Permanent</option>
              <option value={302}>302 — Temporary</option>
            </select>
          </div>

          <div className="mb-4">
            <label className={LABEL} style={LS}>Note (optional)</label>
            <input className={INPUT} style={IS} value={form.note} onChange={e => setField("note", e.target.value)} placeholder="Why this redirect exists" />
          </div>

          <div className="mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setField("is_active", e.target.checked)}
                className="w-4 h-4 rounded" style={{ accentColor: "#238636" }} />
              <span className="text-sm" style={{ color: "#C9D1D9" }}>Active</span>
            </label>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="w-full text-sm font-semibold py-2 rounded-lg mb-2"
            style={{ background: saving ? "#21262D" : "#238636", color: "#fff", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : editId ? "Update Redirect" : "Add Redirect"}
          </button>

          {editId && (
            <button onClick={cancelEdit} className="w-full text-sm py-2 rounded-lg" style={{ background: "#21262D", color: "#6E7681" }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
