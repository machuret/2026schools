import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  Eyebrow,
  CtaButton,
  GhostButton,
  StatCard,
  ArrowIcon,
} from "@/components/home-variants/Primitives";

export const metadata = {
  title: "National Check-in Week 2026 — Data Forward",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Data Forward",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home4",
  },
};

const KEY_METRICS = [
  { num: "~580K",  label: "Children aged 4–17 with diagnosable mental disorder", source: "Young Minds Matter, 2013–14" },
  { num: "72%",    label: "Lifetime mental health conditions begin before age 25",  source: "Beyond Blue / AIHW" },
  { num: "8×",     label: "More cost-effective: early intervention vs crisis",      source: "Productivity Commission, 2020" },
  { num: "57%",    label: "Avg attendance: very remote schools vs 93% city",        source: "RoGS 2026" },
  { num: "1 in 5", label: "Young Australians felt lonely most or all of the time",  source: "Mission Australia, 2024" },
  { num: "38%",    label: "Experienced cyberbullying in the past 12 months",         source: "eSafety Commissioner, 2024" },
] as const;

type Severity = "Critical" | "High" | "Notable";

const ISSUES_TABLE: Array<{
  rank: number;
  slug: string;
  icon: string;
  title: string;
  severity: Severity;
  stat: string;
}> = [
  { rank: 1, slug: "anxiety-depression",    icon: "😰", title: "Anxiety & Depression",               severity: "Critical", stat: "13.9% of children 4–17" },
  { rank: 2, slug: "self-harm-suicidality", icon: "🆘", title: "Self-Harm & Suicidality",            severity: "Critical", stat: "AIHW Atlas — PHN/SA3 level" },
  { rank: 3, slug: "distress-loneliness",   icon: "💔", title: "Psychological Distress & Loneliness",severity: "Critical", stat: "1 in 5 feel lonely always" },
  { rank: 4, slug: "bullying",              icon: "👊", title: "Bullying at School",                 severity: "Critical", stat: "46,000+ incidents QLD 2023" },
  { rank: 5, slug: "cyberbullying",         icon: "📱", title: "Cyberbullying",                      severity: "High",     stat: "38% of young Australians" },
];

const SEVERITY_COLOR: Record<Severity, string> = {
  Critical: "var(--red)",
  High:     "var(--amber)",
  Notable:  "var(--green)",
};

/** Dashboard-dark palette — intentionally off-token for this showcase variant */
const DASH_BG   = "#1e2533";
const DASH_BORDER = "#2e3547";

export default function Home4() {
  return (
    <div style={{ background: "var(--gray-50)", color: DASH_BG, fontFamily: "var(--font-body)" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />

      {/* ── Top bar ── */}
      <div style={{
        background: DASH_BG,
        borderBottom: `1px solid ${DASH_BORDER}`,
        padding: "10px 40px",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { num: "15", label: "Documented Issues" },
              { num: "2026", label: "Program Year" },
              { num: "FREE", label: "For All Schools" },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{
                  fontSize: "0.95rem", fontWeight: 800,
                  color: "var(--primary)", fontFamily: "var(--font-display)",
                }}>{t.num}</span>
                <span style={{ fontSize: "0.72rem", color: "#7a8499", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.72rem", color: "var(--text-light)",
          }}>
            <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
            Data updated · National sources
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section style={{
        background: DASH_BG,
        padding: "80px 40px 72px",
        borderBottom: "3px solid var(--primary)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center" }}>
          <div>
            <Eyebrow style={{ marginBottom: 20 }}>National Check-in Week · Australia 2026</Eyebrow>
            <h1 style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 900, color: "#fff",
              fontFamily: "var(--font-display)",
              lineHeight: 1.1, letterSpacing: "-0.02em",
              marginBottom: 24,
            }}>
              Student wellbeing data<br />
              <span style={{ color: "var(--primary)" }}>for every Australian school.</span>
            </h1>
            <p style={{
              fontSize: "1.05rem", color: "#9aa5be",
              lineHeight: 1.8, maxWidth: 540, marginBottom: 36,
            }}>
              A free, evidence-based initiative giving school leaders real-time wellbeing data,
              professional learning, and early-intervention tools — before challenges become crises.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <CtaButton href="/events" borderRadius={6} style={{ fontSize: "0.9rem", padding: "14px 28px" }}>
                Register Free <ArrowIcon size={14} />
              </CtaButton>
              <GhostButton
                href="/issues"
                color="#c0c8d8"
                borderColor="rgba(255,255,255,0.2)"
                borderRadius={6}
                style={{ background: "rgba(255,255,255,0.07)", fontSize: "0.9rem", padding: "14px 28px" }}
              >
                View Issue Database →
              </GhostButton>
            </div>
          </div>

          {/* Quick-ref panel */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12, padding: "28px",
            minWidth: 260,
          }}>
            <Eyebrow color="var(--text-light)" style={{
              marginBottom: 16, paddingBottom: 12,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>Quick Reference</Eyebrow>
            {[
              { label: "Program type", val: "FREE national initiative" },
              { label: "Target", val: "Australian K–12 schools" },
              { label: "Data sources", val: "AIHW, RoGS, Mission Aus." },
              { label: "Issues tracked", val: "15 documented wellbeing" },
              { label: "Webinars", val: "Expert-led, no cost" },
            ].map((r) => (
              <div key={r.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontSize: "0.8rem",
              }}>
                <span style={{ color: "var(--text-light)" }}>{r.label}</span>
                <span style={{ color: "#e2e8f0", fontWeight: 600, textAlign: "right", maxWidth: 160 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="main-content">

        {/* ── Key Metrics grid ── */}
        <section style={{ padding: "48px 40px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 24, flexWrap: "wrap", gap: 8,
          }}>
            <Eyebrow color="var(--text-light)">Key Metrics — Australian Student Wellbeing</Eyebrow>
            <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>
              Sources: AIHW · RoGS 2026 · Mission Australia · eSafety Commissioner
            </span>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 1, background: "var(--border)", borderRadius: 12, overflow: "hidden",
            border: "1px solid var(--border)",
          }}>
            {KEY_METRICS.map((m) => (
              <StatCard
                key={m.label}
                num={m.num}
                label={m.label}
                source={m.source}
                background="var(--white)"
                border="none"
                style={{ borderRadius: 0, boxShadow: "none", padding: "24px" }}
              />
            ))}
          </div>
        </section>

        {/* ── Issues table ── */}
        <section style={{ padding: "0 40px 56px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 16, flexWrap: "wrap", gap: 8,
          }}>
            <Eyebrow color="var(--text-light)">Issue Database — Top 5 by Severity</Eyebrow>
            <a href="/issues" style={{
              fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)",
              textDecoration: "none",
            }}>
              View all 15 →
            </a>
          </div>

          <div style={{
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: 12, overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "40px 40px 1fr 160px 1fr",
              gap: 0, padding: "10px 20px",
              background: "var(--gray-50)",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.65rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.1em",
              color: "var(--text-light)",
            }}>
              <div>#</div>
              <div />
              <div>Issue</div>
              <div>Severity</div>
              <div>Anchor Stat</div>
            </div>
            {ISSUES_TABLE.map((issue, i) => (
              <a key={issue.rank} href={`/issues/${issue.slug}`} style={{
                display: "grid",
                gridTemplateColumns: "40px 40px 1fr 160px 1fr",
                gap: 0, padding: "14px 20px",
                borderBottom: i < ISSUES_TABLE.length - 1 ? "1px solid var(--border)" : "none",
                textDecoration: "none", color: "inherit",
                transition: "background 0.15s",
              }}>
                <div style={{
                  fontSize: "0.75rem", fontWeight: 700,
                  color: "var(--text-light)", display: "flex", alignItems: "center",
                }}>
                  {issue.rank}
                </div>
                <div aria-hidden="true" style={{ fontSize: "1.2rem", display: "flex", alignItems: "center" }}>
                  {issue.icon}
                </div>
                <div style={{
                  fontSize: "0.88rem", fontWeight: 700,
                  color: DASH_BG, display: "flex", alignItems: "center",
                }}>
                  {issue.title}
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700,
                    color: SEVERITY_COLOR[issue.severity],
                    background: `${SEVERITY_COLOR[issue.severity]}18`,
                    padding: "3px 10px", borderRadius: 100,
                  }}>
                    {issue.severity}
                  </span>
                </div>
                <div style={{
                  fontSize: "0.8rem", color: "var(--text-mid)",
                  display: "flex", alignItems: "center",
                }}>
                  {issue.stat}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── About the data ── */}
        <section style={{
          padding: "48px 40px 56px",
          background: "var(--white)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48 }}>
            <div>
              <Eyebrow color="var(--text-light)" style={{ marginBottom: 12 }}>Methodology</Eyebrow>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: DASH_BG, marginBottom: 12 }}>
                How This Site Uses Data
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.75 }}>
                A mixed-model approach: national anchors for comparability, plus region-specific
                datasets where they exist. Data gaps are disclosed, not hidden. Sources include
                AIHW, RoGS 2026, Mission Australia Youth Survey, and eSafety Commissioner.
              </p>
            </div>
            <div>
              <Eyebrow color="var(--text-light)" style={{ marginBottom: 12 }}>About the Initiative</Eyebrow>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: DASH_BG, marginBottom: 12 }}>
                National Check-In Week 2026
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-mid)", lineHeight: 1.75 }}>
                A free, evidence-based initiative founded to ensure no child falls through the gaps —
                regardless of background, identity, or location. All webinars, tools, and resources
                are free for every Australian school and family.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA bar ── */}
        <section style={{ padding: "48px 40px", background: DASH_BG }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 24,
          }}>
            <div>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                Register your school for free
              </h2>
              <p style={{ fontSize: "0.88rem", color: "var(--text-light)", margin: 0 }}>
                Free webinars · Real-time data tools · No cost to any school
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <CtaButton href="/events" borderRadius={6} style={{ fontSize: "0.9rem", padding: "14px 32px" }}>
                Register Free →
              </CtaButton>
              <GhostButton
                href="/about"
                color="#c0c8d8"
                borderColor="rgba(255,255,255,0.2)"
                borderRadius={6}
                style={{ background: "rgba(255,255,255,0.07)", fontSize: "0.9rem", padding: "14px 32px" }}
              >
                About NCIW
              </GhostButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
