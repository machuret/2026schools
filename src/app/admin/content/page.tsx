import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminContentPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let areas: any[] | null = null;
  let fetchError = "";
  try {
    const sb = await createClient();
    const res = await sb
      .from("areas")
      .select("id, slug, name, state, type, issues, updated_at")
      .order("state")
      .order("name");
    areas = res.data;
    if (res.error) fetchError = res.error.message;
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load areas.";
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#FAFAFA", letterSpacing: "-0.025em" }}>Areas</h1>
          <p className="text-[15px]" style={{ color: "#71717A" }}>
            {areas?.length ?? 0} cities, regions and LGAs with wellbeing reports.
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="text-sm font-semibold px-4 py-2.5 rounded-xl"
          style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)", color: "#FFFFFF" }}
        >
          + New Area
        </Link>
      </div>

      {fetchError && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ background: "#450A0A30", color: "#FCA5A5", border: "1px solid #7F1D1D50" }}>
          {fetchError}
        </div>
      )}

      {(!areas || areas.length === 0) && !fetchError ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: "#18181B", border: "1px solid #27272A" }}>
          <div className="text-3xl mb-3">🗺️</div>
          <p className="text-sm font-medium mb-1" style={{ color: "#D4D4D8" }}>No areas yet</p>
          <p className="text-xs mb-4" style={{ color: "#52525B" }}>Create your first area, city or LGA.</p>
          <Link href="/admin/content/new" className="text-sm font-semibold px-4 py-2.5 rounded-xl inline-block"
            style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)", color: "#FFFFFF" }}>
            Create an area
          </Link>
        </div>
      ) : areas && areas.length > 0 ? (
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #27272A" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#18181B", borderBottom: "1px solid #27272A" }}>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Area</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider hidden md:table-cell" style={{ color: "#71717A" }}>State</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Type</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Issues</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider" style={{ color: "#71717A" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(areas ?? []).map((area, idx) => {
              const issueCount = Array.isArray(area.issues) ? area.issues.length : 0;
              const typeLabel = area.type === "city" ? "City" : area.type === "lga" ? "LGA" : "Region";
              const typeColor = area.type === "city" ? "#FCD34D" : area.type === "lga" ? "#C4B5FD" : "#93C5FD";
              const typeBg = area.type === "city" ? "#451A0320" : area.type === "lga" ? "#2E1065" : "#1E3A5F20";
              return (
                <tr
                  key={area.id}
                  style={{
                    background: idx % 2 === 0 ? "#09090B" : "#18181B",
                    borderBottom: "1px solid #27272A",
                  }}
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium" style={{ color: "#FAFAFA" }}>{area.name}</span>
                    <div className="text-xs mt-0.5" style={{ color: "#52525B" }}>/areas/{area.slug}</div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-xs" style={{ color: "#A1A1AA" }}>
                    {area.state}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: typeBg, color: typeColor }}
                    >
                      {typeLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: "#6366F115", color: "#A5B4FC" }}
                    >
                      {issueCount}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/areas/${area.slug}`}
                        target="_blank"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#18181B", color: "#71717A", border: "1px solid #27272A" }}
                      >
                        View ↗
                      </Link>
                      <Link
                        href={`/admin/content/${area.id}`}
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
