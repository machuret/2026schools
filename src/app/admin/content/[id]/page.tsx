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
          <Link href="/admin/content" style={{ color: "#818CF8" }} className="font-semibold uppercase tracking-widest">Areas</Link>
          <span style={{ color: "#3F3F46" }}>/</span>
          <span className="font-semibold uppercase tracking-widest" style={{ color: "#71717A" }}>{area.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#FAFAFA", letterSpacing: "-0.025em" }}>Edit Area</h1>
            <p className="text-sm" style={{ color: "#71717A" }}>{area.name} · {area.state}</p>
          </div>
          <Link href={`/areas/${area.slug}`} target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "#18181B", color: "#71717A", border: "1px solid #27272A" }}>
            View on site ↗
          </Link>
        </div>
      </div>
      <AreaEditForm area={area} />
    </div>
  );
}
