import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sources & References — National Check-in Week",
  description:
    "Every data claim on this site is backed by a published source. Browse our full reference repository and hold us accountable.",
};

export const revalidate = 60;

const CATEGORY_LABEL: Record<string, string> = {
  "mental-health":  "Mental Health",
  "attendance":     "Attendance & Engagement",
  "bullying":       "Bullying & Cyberbullying",
  "sleep":          "Sleep & Screens",
  "discrimination": "Discrimination & Inequality",
  "policy":         "Policy & Governance",
  "general":        "General",
  "other":          "Other",
};

interface Source {
  id: string;
  title: string;
  url: string | null;
  publisher: string;
  year: string;
  category: string;
  entity_type: string;
  entity_slug: string;
  verified: boolean;
}

export default async function SourcesPage() {
  let sources: Source[] = [];
  let fetchError = "";

  try {
    const sb = await createClient();
    const { data, error } = await sb
      .from("site_sources")
      .select("id,title,url,publisher,year,category,entity_type,entity_slug,verified")
      .order("category")
      .order("year", { ascending: false });
    if (error) fetchError = error.message;
    sources = data ?? [];
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Failed to load sources.";
  }

  // Group by category
  const grouped: Record<string, Source[]> = {};
  for (const src of sources) {
    const cat = src.category ?? "general";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(src);
  }
  const categories = Object.keys(grouped).sort();

  return (
    <>
      <div className="page-hero page-hero--centered">
        <div className="page-hero__inner" style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <div className="section-tag" style={{ margin: "0 auto 16px" }}>
            Transparency · Accountability
          </div>
          <h1 className="page-hero__title" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>
            Sources &amp; References
          </h1>
          <p className="page-hero__subtitle" style={{ margin: "0 auto" }}>
            Every data claim on this site is backed by a published, verifiable source.
            This page is our public accountability register. If you think a source is inaccurate or outdated,
            use the feedback tool on the relevant data section.
          </p>
        </div>
      </div>

      <main id="main-content" className="inner-content">

        {/* ACCOUNTABILITY NOTE */}
        <div className="prevention-bridge" style={{ marginBottom: 40 }}>
          <div className="eyebrow-tag">Our commitment</div>
          <h3 className="prevention-bridge__heading">We cite everything. Challenge us if we got it wrong.</h3>
          <div className="prevention-bridge__body">
            <p>
              Every statistic, claim, and data point on this site is drawn from government reports,
              peer-reviewed research, or publicly available institutional data. Verified sources are
              marked <strong style={{ color: "var(--green)" }}>✓ Verified</strong>.
              If you believe a source is inaccurate, outdated, or misrepresented — use the{" "}
              <strong>thumbs down</strong> feedback on any data section to tell us.
            </p>
          </div>
        </div>

        {fetchError && (
          <div style={{
            background: "var(--red-bg)", border: "1px solid var(--red)", borderRadius: 8,
            padding: "16px 20px", marginBottom: 32, color: "var(--red)", fontSize: "0.9rem"
          }}>
            {fetchError}
          </div>
        )}

        {sources.length === 0 && !fetchError && (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-light)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>📚</div>
            <p>Sources are being added. Check back soon.</p>
          </div>
        )}

        {/* GROUPED BY CATEGORY */}
        {categories.map((cat) => (
          <section key={cat} style={{ marginBottom: 48 }}>
            <h2 className="section-heading section-heading--md">
              {CATEGORY_LABEL[cat] ?? cat}
              <span style={{
                fontSize: "0.75rem", fontWeight: 600, color: "var(--text-light)",
                background: "var(--gray-100)", borderRadius: 100, padding: "2px 10px",
                marginLeft: 10, verticalAlign: "middle"
              }}>
                {grouped[cat].length}
              </span>
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {grouped[cat].map((src) => (
                <div key={src.id} className="source-item">
                  <span className={`source-num${src.verified ? " source-num--verified" : ""}`}>
                    {src.verified ? "✓" : "·"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className="source-title">
                      {src.url ? (
                        <a href={src.url} target="_blank" rel="noopener noreferrer">{src.title}</a>
                      ) : src.title}
                      {src.verified && <span className="source-verified">VERIFIED</span>}
                    </div>
                    <div className="source-meta">
                      {src.publisher}{src.publisher && src.year ? " · " : ""}{src.year}
                      {src.entity_slug && (
                        <span style={{ marginLeft: 8, color: "var(--teal)", fontSize: "0.75rem" }}>
                          {src.entity_type === "issue" ? (
                            <a href={`/issues/${src.entity_slug}`} style={{ color: "var(--teal)" }}>
                              → Issue: {src.entity_slug}
                            </a>
                          ) : src.entity_slug}
                        </span>
                      )}
                      {src.url && (
                        <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                          ↗ View source
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

      </main>
    </>
  );
}
