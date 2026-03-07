import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StateEditForm from "@/components/admin/StateEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStatePage({ params }: Props) {
  const { id } = await params;
  const sb = await createClient();

  const { data: state } = await sb.from("states").select("*").eq("id", id).single();
  if (!state) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <Link href="/admin/states" style={{ color: "#818CF8" }} className="font-semibold uppercase tracking-widest">States</Link>
          <span style={{ color: "#3F3F46" }}>/</span>
          <span className="font-semibold uppercase tracking-widest" style={{ color: "#71717A" }}>{state.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#FAFAFA", letterSpacing: "-0.025em" }}>Edit State</h1>
            <p className="text-sm" style={{ color: "#71717A" }}>{state.icon} {state.name}</p>
          </div>
          <Link href={`/states/${state.slug}`} target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "#18181B", color: "#71717A", border: "1px solid #27272A" }}>
            View on site ↗
          </Link>
        </div>
      </div>
      <StateEditForm state={state} />
    </div>
  );
}
