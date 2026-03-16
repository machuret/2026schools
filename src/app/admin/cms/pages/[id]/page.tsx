import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageEditor from "@/components/admin/PageEditor";

interface Props { params: Promise<{ id: string }> }

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const sb = await createClient();
  const { data: page } = await sb.from("pages").select("*").eq("id", id).single();
  if (!page) notFound();

  return (
    <div>
      <div className="swa-page-header">
        <div>
          <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginBottom: 4 }}>
            <a href="/admin/cms/pages" style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none" }}>CMS Pages</a>
            {" / "}Edit
          </div>
          <h1 className="swa-page-title">{page.title}</h1>
          <p className="swa-page-subtitle">/{page.slug}</p>
        </div>
      </div>
      <PageEditor page={page} />
    </div>
  );
}
