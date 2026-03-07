import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AreaEditForm from "@/components/admin/AreaEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAreaPage({ params }: Props) {
  const { id } = await params;
  const sb = await createClient();

  const { data: area } = await sb.from("areas").select("*").eq("id", id).single();
  if (!area) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <Link href="/admin/content" style={{ color: "var(--admin-accent)" }} className="font-semibold uppercase tracking-widest hover:underline">Areas</Link>
          <span style={{ color: "var(--admin-border-strong)" }}>/</span>
          <span className="font-semibold uppercase tracking-widest" style={{ color: "var(--admin-text-subtle)" }}>{area.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--admin-text-primary)", letterSpacing: "-0.025em" }}>Edit Area</h1>
            <p className="text-sm" style={{ color: "var(--admin-text-subtle)" }}>{area.name} · {area.state}</p>
          </div>
          <Link href={`/areas/${area.slug}`} target="_blank" className="admin-btn admin-btn-secondary text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            View on site
          </Link>
        </div>
      </div>
      <AreaEditForm area={area} />
    </div>
  );
}
