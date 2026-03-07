import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const SEVERITY_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: "#450A0A30", color: "#FCA5A5", label: "Critical" },
  high:     { bg: "#451A0330", color: "#FCD34D", label: "High" },
  notable:  { bg: "#052E1630", color: "#86EFAC", label: "Notable" },
};

export default async function AdminIssuesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let issues: any[] | null = null;
  let fetchError = "";
  try {
    const sb = await createClient();
    const res = await sb
      .from("issues")
      .select("id, rank, slug, icon, title, severity, anchor_stat, updated_at")
      .order("rank");
    issues = res.data;
    if (res.error) fetchError = res.error.message;
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load issues.";
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#FAFAFA", letterSpacing: "-0.025em" }}>Issues</h1>
          <p className="text-[15px]" style={{ color: "#71717A" }}>
            {issues?.length ?? 0} wellbeing issues tracked across Australian schools.
          </p>
        </div>
        <Link
          href="/admin/issues/new"
          className="text-sm font-semibold px-4 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)", color: "#FFFFFF" }}
        >
          + New Issue
        </Link>
      </div>

      {fetchError && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#450A0A30", color: "#FCA5A5", border: "1px solid #7F1D1D50" }}>
          {fetchError}
        </div>
      )}

      {(!issues || issues.length === 0) && !fetchError ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: "#18181B", border: "1px solid #27272A" }}>
          <div className="text-3xl mb-3">⚠️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "#D4D4D8" }}>No issues yet</p>
          <p className="text-xs mb-4" style={{ color: "#52525B" }}>Create your first wellbeing issue.</p>
          <Link href="/admin/issues/new" className="text-sm font-semibold px-4 py-2.5 rounded-xl inline-block"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)", color: "#FFFFFF" }}>
            Create an issue
          </Link>
        </div>
      ) : issues && issues.length > 0 ? (
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #27272A" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#18181B", borderBottom: "1px solid #27272A" }}>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A", width: "48px" }}>#</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Issue</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Severity</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#71717A" }}>Anchor Stat</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(issues ?? []).map((issue, idx) => {
              const sev = SEVERITY_STYLE[issue.severity] ?? SEVERITY_STYLE.notable;
              return (
                <tr
                  key={issue.id}
                  style={{
                    background: idx % 2 === 0 ? "#09090B" : "#18181B",
                    borderBottom: "1px solid #27272A",
                  }}
                >
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#52525B" }}>{issue.rank}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span>{issue.icon}</span>
                      <span className="font-medium" style={{ color: "#FAFAFA" }}>{issue.title}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#52525B" }}>/issues/{issue.slug}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: sev.bg, color: sev.color }}
                    >
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs" style={{ color: "#A1A1AA", maxWidth: "260px" }}>
                    <div className="truncate">{issue.anchor_stat}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/issues/${issue.slug}`}
                        target="_blank"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#18181B", color: "#71717A", border: "1px solid #27272A" }}
                      >
                        View ↗
                      </Link>
                      <Link
                        href={`/admin/issues/${issue.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#27272A", color: "#D4D4D8" }}
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
      ) : null}
    </div>
  );
}
