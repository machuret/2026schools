import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContentPage() {
  const sb = await createClient();
  const { data: areas } = await sb
    .from("areas")
    .select("id, slug, name, state, type, issues, updated_at")
    .order("state")
    .order("name");

  const count = areas?.length ?? 0;

  return (
    <div>
      {/* Page header — button inside the header, not floating */}
      <div className="swa-page-header">
        <div>
          <h1>Areas</h1>
          <p>{count} cities, regions and LGAs with wellbeing reports.</p>
        </div>
        <Link href="/admin/content/new" className="swa-btn swa-btn-primary" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New Area
        </Link>
      </div>

      {/* Table card with horizontal scroll to prevent clipping */}
      <div className="swa-card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="swa-table" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Area</th>
              <th>State</th>
              <th>Type</th>
              <th>Issues</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(areas ?? []).map((area) => {
              const issueCount = Array.isArray(area.issues) ? area.issues.length : 0;
              const typeLabel = area.type === "city" ? "City" : area.type === "lga" ? "LGA" : "Region";
              const typeBadge = area.type === "city" ? "swa-badge--warning"
                : area.type === "lga" ? "swa-badge--primary" : "swa-badge--info";
              return (
                <tr key={area.id}>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{area.name}</span>
                    <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>/areas/{area.slug}</div>
                  </td>
                  <td>{area.state}</td>
                  <td>
                    <span className={`swa-badge ${typeBadge}`}>{typeLabel}</span>
                  </td>
                  <td>
                    <span className="swa-badge swa-badge--info">{issueCount}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      <Link
                        href={`/areas/${area.slug}`}
                        target="_blank"
                        style={{
                          fontSize: 12, fontWeight: 600, padding: '5px 10px',
                          borderRadius: 'var(--radius-sm)', textDecoration: 'none',
                          border: '1px solid var(--color-border)', color: 'var(--color-text-muted)',
                          background: 'var(--color-card)',
                        }}
                      >
                        View ↗
                      </Link>
                      <Link
                        href={`/admin/content/${area.id}`}
                        className="swa-btn swa-btn-primary"
                        style={{ fontSize: 12, padding: '5px 12px', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
