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
  title: "National Check-in Week 2026 — Editorial",
  description:
    "National Check-In Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
  openGraph: {
    title: "National Check-in Week 2026 — Editorial",
    description: "A free initiative giving Australian school leaders the tools, data, and professional learning they need to support every student.",
    url: "https://2026schools.vercel.app/home2",
  },
};

const STATS = [
  { num: "Suicide", label: "leading cause of death, Australians aged 15–24" },
  { num: "1 in 7",  label: "children has a diagnosable mental disorder — most go undetected" },
  { num: "72%",     label: "of lifetime mental health conditions begin before age 25" },
  { num: "8×",      label: "more cost-effective to intervene early than treat a crisis" },
];

const TOPICS = ["Anxiety & Depression", "Self-Harm", "Bullying", "Cyberbullying", "Loneliness", "Attendance Gaps", "Trauma", "Substance Use"];

export default function Home2() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <NewsTicker />

      {/* ── Hero: Editorial / Dark ── */}
      <section style={{ background: "#0a0a0a", color: "#fff" }}>

        {/* Masthead strip */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "10px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 800 }}>
            National Check-in Week · Australia 2026
          </span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontWeight: 800 }}>
            Free for Every School
          </span>
        </div>

        {/* Hero body */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 72px" }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
            background: "var(--primary)", padding: "5px 14px",
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff" }}>
              National Emergency · Student Wellbeing Crisis
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
            <span style={{ color: "var(--primary)" }}>checked in on.</span>
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
              background: "#fff", color: "#0a0a0a",
              fontWeight: 700, fontSize: "0.88rem",
              padding: "14px 32px", textDecoration: "none",
              letterSpacing: "0.02em",
            }}>
              Register for Free Webinars →
            </a>
            <a href="/issues" style={{
              fontFamily: "var(--font-body)",
              display: "inline-flex", alignItems: "center",
              color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.88rem",
              textDecoration: "none", borderBottom: "2px solid var(--primary)", paddingBottom: 2,
            }}>
              Explore the Issues
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
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

        {/* Topics strip */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", overflow: "hidden" }}>
          {TOPICS.map((item, i) => (
            <div key={item} style={{
              flex: "0 0 auto", padding: "10px 24px",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "var(--font-body)",
              fontSize: "0.62rem", fontWeight: 700,
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: i === 0 ? "var(--primary)" : "rgba(255,255,255,0.25)",
              whiteSpace: "nowrap",
            }}>
              {item}
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
