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
  title: "National Check-in Week 2026 — Aurora",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Aurora",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home3",
  },
};

const STATS = [
  { num: "1 in 7",  label: "children has a diagnosable mental disorder" },
  { num: "72%",     label: "of conditions begin before age 25" },
  { num: "8×",      label: "early intervention vs crisis cost" },
  { num: "1 in 5",  label: "young Australians felt lonely always" },
];


export default function Home3() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <NewsTicker />

      {/* ── Hero: Aurora / Dark ── */}
      <div style={{ background: "#07060f", position: "relative", overflow: "hidden" }}>

        {/* Aurora orbs */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(41,184,232,0.18) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "10%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(229,0,126,0.14) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 65%)", filter: "blur(50px)" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "96px 48px 72px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(41,184,232,0.1)", border: "1px solid rgba(41,184,232,0.25)",
            borderRadius: 100, padding: "6px 18px", marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} aria-hidden="true" />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--primary)" }}>
              Australia 2026 · Free National Initiative
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#fff", marginBottom: 28, maxWidth: 780,
          }}>
            Every student deserves to be{" "}
            <span style={{
              background: "linear-gradient(135deg, #29B8E8 0%, #8B5CF6 50%, #E5007E 100%)",
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
            color: "rgba(232,230,240,0.55)", maxWidth: 580, marginBottom: 40,
          }}>
            National Check-in Week is a <strong style={{ color: "#fff", fontWeight: 700 }}>FREE</strong> initiative
            giving Australian school leaders the tools, data, and professional learning they need
            to support every student — before challenges become crises.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center", marginBottom: 64 }}>
            <a href="/events" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #29B8E8 0%, #8B5CF6 100%)",
              color: "#fff", fontWeight: 700, fontSize: "0.88rem",
              padding: "14px 32px", borderRadius: 100,
              textDecoration: "none", letterSpacing: "0.02em",
              boxShadow: "0 0 36px rgba(41,184,232,0.3)",
            }}>
              Register for Free Webinars →
            </a>
            <a href="/issues" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.88rem",
              padding: "14px 32px", borderRadius: 100, textDecoration: "none",
            }}>
              Explore the Issues
            </a>
          </div>

          {/* Stats — glass cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "24px 20px", backdropFilter: "blur(20px)",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 900, color: "#fff", lineHeight: 1, marginBottom: 8,
                }}>
                  {s.num}
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(232,230,240,0.45)", lineHeight: 1.55, margin: 0 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

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
