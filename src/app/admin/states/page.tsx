import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatesClient from "@/components/admin/StatesClient";

export default async function AdminStatesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let states: any[] | null = null;
  let fetchError = "";
  try {
    const sb = await createClient();
    const res = await sb
      .from("states")
      .select("id, slug, name, icon, subtitle, issues, updated_at")
      .order("name");
    states = res.data;
    if (res.error) fetchError = res.error.message;
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load states.";
  }

  return (
    <div>
      {/* Page header */}
      <div className="swa-page-header">
        <div>
          <h1>States &amp; Territories</h1>
          <p>Manage Australian states and territories with wellbeing issue tracking.</p>
        </div>
        <Link href="/admin/states/new" className="swa-btn swa-btn-primary" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New State
        </Link>
      </div>

      {fetchError && (
        <div className="admin-alert admin-alert-error" style={{ marginBottom: 24 }}>{fetchError}</div>
      )}

      <StatesClient states={states ?? []} />
    </div>
  );
}
