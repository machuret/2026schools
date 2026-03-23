import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  Eyebrow,
  CtaButton,
  GhostButton,
  StatCard,
} from "@/components/home-variants/Primitives";

export const metadata = {
  title: "National Check-in Week 2026 — Community",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Community",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home3",
  },
};

const PILLARS = [
  { icon: "🎙️", title: "Elevate Student Voices",    body: "Create safe spaces where every student can identify, communicate, and learn to manage their emotions." },
  { icon: "📊", title: "Real-Time Wellbeing Data",   body: "Move from reactive guesswork to proactive, data-informed decision-making across your whole school." },
  { icon: "🎓", title: "Expert-Led Free Webinars",   body: "Access professional learning from Australia's leading wellbeing researchers and practitioners at no cost." },
  { icon: "🤝", title: "Whole-School Resources",     body: "Curated tools for educators, students, and families — building community-wide resilience together." },
] as const;

const HERO_STATS = [
  { num: "1 in 7", text: "children has a diagnosable mental disorder" },
  { num: "72%",   text: "of mental health conditions start before age 25" },
  { num: "8×",    text: "more effective: early intervention vs late-stage" },
  { num: "1 in 5",text: "young Australians felt lonely most of the time" },
] as const;

const TRUST_ITEMS = [
  { num: "FREE",  label: "for every Australian school" },
  { num: "2026",  label: "national movement in action" },
  { num: "15",    label: "documented wellbeing issues addressed" },
  { num: "1000s", label: "of educators already registered" },
] as const;

/** Warm off-white palette — intentionally off-token for this showcase variant */
const WARM_BG    = "#FFFBF5";
const WARM_BORDER = "#f0e8dc";
const WARM_TEXT   = "#6b5e4e";
const WARM_MUTED  = "#7a6a5a";

export default function Home3() {
  return (
    <div style={{ background: WARM_BG, color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />

      {/* ── Hero ── */}
      <section style={{ padding: "80px 40px 72px", maxWidth: 1100, margin: "0 auto" }}>
        {/* grid collapses to single col on narrow viewports via minmax */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#FFF3E0", border: "1px solid #FFCC80",
              borderRadius: 100, padding: "6px 16px",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "#E65100",
              marginBottom: 28,
            }}>
              <span aria-hidden="true">🌏</span> Australia 2026 · Free Initiative
            </div>

            <h1 style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
              fontWeight: 900, lineHeight: 1.15,
              color: "#1a1a1a",
              marginBottom: 24,
              fontFamily: "var(--font-display)",
            }}>
              Supporting every student,{" "}
              <span style={{
                background: "linear-gradient(135deg, var(--primary) 0%, #0ea5e9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                together.
              </span>
            </h1>

            <p style={{
              fontSize: "1.05rem", color: "#6b5e4e",
              lineHeight: 1.85, marginBottom: 36,
            }}>
              National Check-In Week is a free initiative giving Australian school leaders the tools,
              data, and professional learning they need to ensure no child falls through the gaps.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <CtaButton href="/events" borderRadius={50} style={{ fontSize: "0.92rem", padding: "15px 28px" }}>
                Register Free →
              </CtaButton>
              <GhostButton href="/about" borderColor={WARM_BORDER} color="var(--text)" borderRadius={50} style={{ background: "var(--white)", fontSize: "0.92rem", padding: "15px 28px" }}>
                Learn More
              </GhostButton>
            </div>
          </div>

          {/* Right: warm stats card */}
          <div style={{
            background: "var(--white)",
            borderRadius: 24,
            padding: "40px 36px",
            boxShadow: "var(--shadow-card)",
            border: `1px solid ${WARM_BORDER}`,
          }}>
            <Eyebrow color="#b07a5a" style={{ marginBottom: 24 }}>The Reality for Australian Schools</Eyebrow>
            {HERO_STATS.map((s) => (
              <div key={s.text} style={{
                display: "flex", alignItems: "center", gap: 16,
                paddingBottom: 16, marginBottom: 16,
                borderBottom: `1px solid ${WARM_BORDER}`,
              }}>
                <div style={{
                  minWidth: 72, fontSize: "1.4rem",
                  fontWeight: 900, color: "var(--primary)",
                  fontFamily: "var(--font-display)",
                }}>
                  {s.num}
                </div>
                <p style={{ fontSize: "0.88rem", color: WARM_MUTED, lineHeight: 1.55, margin: 0 }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main id="main-content">

        {/* ── Pillars ── */}
        <section style={{ padding: "72px 40px", background: "var(--white)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <Eyebrow style={{ marginBottom: 12 }}>How It Works</Eyebrow>
              <h2 style={{
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900,
                color: "#1a1a1a", fontFamily: "var(--font-display)",
              }}>
                Four pillars of the initiative
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
              {PILLARS.map((p) => (
                <div key={p.title} style={{
                  background: WARM_BG,
                  border: `1.5px solid ${WARM_BORDER}`,
                  borderRadius: 20,
                  padding: "32px 28px",
                }}>
                  <div style={{
                    width: 56, height: 56,
                    background: "linear-gradient(135deg, #FFF3E0 0%, #E0F4FD 100%)",
                    borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem", marginBottom: 20,
                  }}>
                    {p.icon}
                  </div>
                  <h3 style={{
                    fontSize: "1rem", fontWeight: 800,
                    color: "var(--dark)", marginBottom: 10,
                  }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: WARM_MUTED, lineHeight: 1.7 }}>
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trust numbers ── */}
        <section style={{ padding: "64px 40px", background: WARM_BG }}>
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 2, background: WARM_BORDER, borderRadius: 20, overflow: "hidden",
          }}>
            {TRUST_ITEMS.map((t) => (
              <StatCard
                key={t.label}
                num={t.num}
                label={t.label}
                numColor="var(--accent)"
                background="var(--white)"
                border="none"
                style={{ borderRadius: 0, boxShadow: "none", padding: "36px 28px", textAlign: "center" }}
              />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          padding: "80px 40px 100px",
          background: "linear-gradient(135deg, #E0F7FA 0%, #FFF3E0 100%)",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <div aria-hidden="true" style={{ fontSize: "2rem", marginBottom: 20 }}>💙</div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
              fontWeight: 900, color: "var(--dark)",
              fontFamily: "var(--font-display)",
              lineHeight: 1.2, marginBottom: 20,
            }}>
              No child should fall<br />through the gaps.
            </h2>
            <p style={{
              fontSize: "1.05rem", color: WARM_TEXT,
              lineHeight: 1.8, marginBottom: 40,
            }}>
              Join thousands of Australian educators taking proactive steps to support student
              wellbeing. National Check-In Week is free for every school and family.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <CtaButton
                href="/events"
                borderRadius={50}
                style={{ fontSize: "1rem", padding: "18px 40px", boxShadow: "0 8px 24px rgba(41,184,232,0.3)" }}
              >
                Register Your School Free
              </CtaButton>
              <GhostButton
                href="/issues"
                borderColor={WARM_BORDER}
                color="var(--text)"
                borderRadius={50}
                style={{ background: "var(--white)", fontSize: "1rem", padding: "18px 40px" }}
              >
                Explore the Issues →
              </GhostButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
