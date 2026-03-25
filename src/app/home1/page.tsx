import Nav from "@/components/Nav";
import NewsTicker from "@/components/NewsTicker";
import IntroSection from "@/components/IntroSection";
import StatTicker from "@/components/StatTicker";
import MapSection from "@/components/MapSection";
import IssuesSection from "@/components/IssuesSection";
import LifeSkillsSection from "@/components/LifeSkillsSection";
import ResearchSection from "@/components/ResearchSection";
import DataSection from "@/components/DataSection";
import PartnersCarousel from "@/components/PartnersCarousel";
import MovementSection from "@/components/MovementSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export const metadata = {
  title: "National Check-in Week 2026 — Minimal",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Minimal",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home1",
  },
};

const STATS = [
  { num: "Suicide", label: "leading cause of death, Australians aged 15–24" },
  { num: "1 in 7",  label: "children has a diagnosable mental disorder — most go undetected" },
  { num: "72%",     label: "of lifetime mental health conditions begin before age 25" },
  { num: "8×",      label: "more cost-effective to intervene early than treat a crisis" },
];

export default function Home1() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <NewsTicker />

      {/* ── Hero: Clean / Light ── */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "96px 48px 72px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 32,
          }}>
            <span style={{ display: "inline-block", width: 24, height: 2, background: "var(--primary)" }} />
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "var(--primary)",
            }}>
              National Check-in Week · Australia 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "var(--dark)", marginBottom: 28, maxWidth: 780,
          }}>
            Every student deserves<br />to be{" "}
            <span style={{ color: "var(--primary)" }}>checked in on.</span>
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem", lineHeight: 1.85,
            color: "var(--text-mid)", maxWidth: 580, marginBottom: 40,
          }}>
            National Check-in Week is a <strong style={{ color: "var(--dark)", fontWeight: 700 }}>FREE</strong> initiative
            giving Australian school leaders the tools, data, and professional learning they need
            to support every student — before challenges become crises.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/events" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--dark)", color: "#fff",
              fontWeight: 700, fontSize: "0.88rem",
              padding: "14px 32px", textDecoration: "none",
              letterSpacing: "0.02em",
            }}>
              Register for Free Webinars →
            </a>
            <a href="/issues" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center",
              color: "var(--dark)", fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", borderBottom: "2px solid var(--primary)", paddingBottom: 2,
            }}>
              Explore the Issues
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: "28px 36px",
              borderRight: i < 3 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 900, color: "var(--dark)", lineHeight: 1, marginBottom: 8,
              }}>
                {s.num}
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.55, margin: 0 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <main id="main-content">
        <IntroSection />
        <StatTicker />
        <MapSection />
        <IssuesSection />
        <LifeSkillsSection />
        <ResearchSection />
        <DataSection />
        <PartnersCarousel />
        <MovementSection />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
