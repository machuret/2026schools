import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  Eyebrow,
  Divider,
  CtaButton,
  ArrowIcon,
} from "@/components/home-variants/Primitives";

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

const COMMITMENTS = [
  { n: "01", title: "Elevate student voices", body: "Create safe spaces where students can identify and communicate their emotions without stigma." },
  { n: "02", title: "Real-time wellbeing data", body: "Move from reactive assessments to proactive, data-informed decision-making in every school." },
  { n: "03", title: "Expert-led free webinars", body: "Access professional learning from Australia's leading wellbeing researchers and practitioners." },
  { n: "04", title: "Whole-school community", body: "Bring together educators, families, and students around a shared commitment to thriving together." },
];

export default function Home1() {
  return (
    <div style={{ background: "var(--white)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />

      {/* ── Hero ── */}
      <section style={{ padding: "120px 40px 100px", maxWidth: 820, margin: "0 auto" }}>
        <Eyebrow style={{ marginBottom: 32 }}>National Check-in Week · Australia 2026</Eyebrow>
        <h1 style={{
          fontSize: "clamp(2.6rem, 6vw, 4.5rem)",
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: "var(--dark)",
          marginBottom: 32,
          fontFamily: "var(--font-display)",
        }}>
          Every student<br />
          deserves to be<br />
          <span style={{ color: "var(--primary)" }}>checked in on.</span>
        </h1>
        <p style={{
          fontSize: "1.15rem",
          color: "var(--text-mid)",
          lineHeight: 1.85,
          maxWidth: 580,
          marginBottom: 48,
        }}>
          A free initiative giving Australian school leaders the tools, data, and professional
          learning they need to support every student — before challenges become crises.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <CtaButton href="/events" background="var(--dark)" borderRadius={4} style={{ letterSpacing: "0.02em" }}>
            Register for Free Webinars
          </CtaButton>
          <a href="/issues" style={{
            display: "inline-block",
            color: "var(--dark)",
            padding: "15px 0",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            borderBottom: "2px solid var(--primary)",
          }}>
            Explore the Issues →
          </a>
        </div>
      </section>

      {/* ── Thin divider ── */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px" }}>
        <Divider />
      </div>

      <main id="main-content">

        {/* ── What is NCIW ── */}
        <section style={{ padding: "80px 40px", maxWidth: 820, margin: "0 auto" }}>
          <Eyebrow style={{ marginBottom: 24 }}>About the Initiative</Eyebrow>
          <h2 style={{
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 800, color: "var(--dark)", marginBottom: 24,
            lineHeight: 1.25, fontFamily: "var(--font-display)",
          }}>
            What is National Check-In Week?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-mid)", lineHeight: 1.85, marginBottom: 20 }}>
            National Check-In Week (NCIW) was founded with a clear mission: to ensure that{" "}
            <strong style={{ color: "var(--dark)" }}>no child falls through the gaps</strong> — regardless
            of their background, identity, or location. Australian schools are at a critical crossroads,
            yet many still lack the tools, data, and professional learning needed to act early.
          </p>
          <p style={{ fontSize: "1.05rem", color: "var(--text-mid)", lineHeight: 1.85 }}>
            NCIW 2026 is more than a campaign — it&apos;s a national movement to elevate student voices,
            challenge outdated wellbeing practices, and drive systemic, generational change.
          </p>
        </section>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px" }}>
          <Divider />
        </div>

        {/* ── 4 principles as a numbered list ── */}
        <section style={{ padding: "80px 40px", maxWidth: 820, margin: "0 auto" }}>
          <Eyebrow style={{ marginBottom: 24 }}>Four Commitments</Eyebrow>
          {COMMITMENTS.map((item) => (
            <div key={item.n} style={{
              display: "grid", gridTemplateColumns: "48px 1fr",
              gap: 24, paddingBottom: 40, marginBottom: 40,
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{
                fontSize: "0.85rem", fontWeight: 700, color: "var(--border-strong)",
                fontFamily: "var(--font-display)", paddingTop: 4,
              }}>
                {item.n}
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--dark)", marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "var(--text-mid)", lineHeight: 1.75 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "80px 40px 100px", maxWidth: 820, margin: "0 auto" }}>
          <Divider style={{ marginBottom: 80 }} />
          <Eyebrow style={{ marginBottom: 24 }}>Join the Movement</Eyebrow>
          <h2 style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900,
            color: "var(--dark)", marginBottom: 20, fontFamily: "var(--font-display)",
            lineHeight: 1.15,
          }}>
            No child should fall<br />through the gaps.
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-mid)", lineHeight: 1.8, maxWidth: 500, marginBottom: 40 }}>
            Join thousands of Australian educators taking proactive steps to support student wellbeing
            before challenges become crises. Free for every school.
          </p>
          <CtaButton href="/events" background="var(--dark)" borderRadius={4} style={{ fontSize: "1rem", letterSpacing: "0.02em" }}>
            Register for Free Webinars <ArrowIcon />
          </CtaButton>
        </section>

      </main>
      <Footer />
    </div>
  );
}
