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
  title: "National Check-in Week 2026 — Impact",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Impact",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home4",
  },
};

const STATS = [
  { num: "Suicide", label: "leading cause of death, Australians aged 15–24" },
  { num: "1 in 7",  label: "children has a diagnosable mental disorder — most go undetected" },
  { num: "72%",     label: "of lifetime mental health conditions begin before age 25" },
  { num: "8×",      label: "more cost-effective to intervene early than treat a crisis" },
];

export default function Home4() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <NewsTicker />

      {/* ── Hero: Impact / Navy ── */}
      <section style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a1f2e 100%)", position: "relative", overflow: "hidden" }}>

        {/* Gradient mesh */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 15% 85%, rgba(41,184,232,0.22) 0%, transparent 50%), radial-gradient(ellipse at 85% 15%, rgba(229,0,126,0.16) 0%, transparent 50%)",
        }} />

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "96px 48px 72px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(41,184,232,0.12)", border: "1px solid rgba(41,184,232,0.3)",
            borderRadius: 6, padding: "6px 14px", marginBottom: 32,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#29B8E8", display: "inline-block" }} aria-hidden="true" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#29B8E8" }}>
              National Check-in Week · Australia 2026
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#fff", marginBottom: 28, maxWidth: 780,
          }}>
            Every student deserves<br />to be{" "}
            <span style={{
              background: "linear-gradient(90deg, #29B8E8, #E5007E)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              checked in on.
            </span>
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.05rem", lineHeight: 1.85,
            color: "rgba(255,255,255,0.55)", maxWidth: 580, marginBottom: 40,
          }}>
            National Check-in Week is a <strong style={{ color: "#fff", fontWeight: 700 }}>FREE</strong> initiative
            giving Australian school leaders the tools, data, and professional learning they need
            to support every student — before challenges become crises.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
            <a href="/events" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #29B8E8, #E5007E)",
              color: "#fff", fontWeight: 700, fontSize: "0.88rem",
              padding: "14px 32px", borderRadius: 8,
              textDecoration: "none", letterSpacing: "0.02em",
              boxShadow: "0 8px 28px rgba(41,184,232,0.35)",
            }}>
              Register for Free Webinars →
            </a>
            <a href="/issues" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.88rem",
              padding: "14px 32px", borderRadius: 8, textDecoration: "none",
            }}>
              Explore the Issues
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", position: "relative" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: "28px 36px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 8,
              }}>
                {s.num}
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.55, margin: 0 }}>
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
