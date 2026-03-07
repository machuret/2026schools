import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IssueEditForm from "@/components/admin/IssueEditForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditIssuePage({ params }: Props) {
  const { id } = await params;
  const sb = await createClient();

  const { data: issue } = await sb.from("issues").select("*").eq("id", id).single();
  if (!issue) notFound();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <Link href="/admin/issues" style={{ color: "#818CF8" }} className="font-semibold uppercase tracking-widest">Issues</Link>
          <span style={{ color: "#3F3F46" }}>/</span>
          <span className="font-semibold uppercase tracking-widest" style={{ color: "#71717A" }}>{issue.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#FAFAFA", letterSpacing: "-0.025em" }}>Edit Issue</h1>
            <p className="text-sm" style={{ color: "#71717A" }}>{issue.icon} {issue.title}</p>
          </div>
          <Link href={`/issues/${issue.slug}`} target="_blank"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "#18181B", color: "#71717A", border: "1px solid #27272A" }}>
            View on site ↗
          </Link>
        </div>
      </div>
      <IssueEditForm issue={issue} />
    </div>
  );
}
