import { createClient } from "@/lib/supabase/server";
import VaultSourcesClient from "@/components/admin/VaultSourcesClient";

export default async function VaultSourcesPage() {
  const sb = await createClient();
  const { data: sources, error } = await sb
    .from("vault_sources")
    .select("id, url, title, description, domain, category, is_approved, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="swa-page-header">
        <div>
          <h1>The Vault — Approved Sources</h1>
          <p>Pre-approved URLs that AI content generation is restricted to. OpenAI will only use these sources when creating or updating content.</p>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-error">
          Could not load sources: {error.message}. Make sure the <code>vault_sources</code> table has been created in Supabase.
        </div>
      )}

      {!error && <VaultSourcesClient initialSources={sources ?? []} />}
    </div>
  );
}
