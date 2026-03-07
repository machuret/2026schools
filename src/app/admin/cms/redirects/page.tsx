import { createClient } from "@/lib/supabase/server";
import RedirectsClient from "@/components/admin/RedirectsClient";

export const dynamic = "force-dynamic";

export default async function RedirectsPage() {
  const sb = await createClient();
  const { data, error } = await sb
    .from("redirects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: "#E6EDF3" }}>Redirect Manager</h1>
        <p className="text-sm" style={{ color: "#6E7681" }}>
          Manage 301/302 redirects. These are served by the middleware and take effect immediately — no redeploy needed.
        </p>
      </div>

      {/* Info banner */}
      <div className="rounded-lg px-4 py-3 mb-6 flex items-start gap-3" style={{ background: "#1C2A3A", border: "1px solid #1E3A5F" }}>
        <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58A6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div className="text-xs" style={{ color: "#8B949E" }}>
          <strong style={{ color: "#58A6FF" }}>How it works:</strong> The Next.js middleware checks every incoming request against active redirects in this table.
          Use <strong style={{ color: "#C9D1D9" }}>301</strong> for permanent moves (search engines transfer link equity) and <strong style={{ color: "#C9D1D9" }}>302</strong> for temporary ones.
          Pausing a redirect keeps it in the database but disables it without deleting it.
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: "#3D1515", color: "#F87171", border: "1px solid #7F1D1D" }}>
          Could not load redirects: {error.message}
        </div>
      )}

      <RedirectsClient initial={data ?? []} />
    </div>
  );
}
