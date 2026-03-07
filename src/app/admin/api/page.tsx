import { createClient } from "@/lib/supabase/server";
import ApiKeysClient from "@/components/admin/ApiKeysClient";

export default async function AdminApiPage() {
  const sb = await createClient();
  const { data: keys } = await sb
    .from("api_keys")
    .select("id, label, provider, key_value, is_active, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>API Management</h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-text-subtle)" }}>Add or remove API keys used for AI content generation and other integrations.</p>
        </div>
      </div>
      <ApiKeysClient initialKeys={keys ?? []} />
    </div>
  );
}
