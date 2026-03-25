import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CountdownTimer from "@/components/CountdownTimer";

export const metadata = {
  title: "National Check-in Week 2026 — Student Wellbeing: A National Priority",
  description:
    "Join Australia's leading student wellbeing event. Free webinars, expert panels, data, and resources for every school.",
  openGraph: {
    title: "National Check-in Week 2026",
    description: "Free webinars, expert panels, and wellbeing resources for Australian schools.",
    url: "https://2026schools.vercel.app/home1",
  },
};

/* ── Data ─────────────────────────────────────────────────────── */

const IMPACT = [
  { num: "15",    unit: "Million Students", desc: "Supported across Australian schools through the initiative", color: "#29B8E8" },
  { num: "1 in 7", unit: "Australian Children", desc: "Have a diagnosable mental disorder — most go undetected", color: "#1a1a2e" },
  { num: "38%",   unit: "of Children",      desc: "Experienced bullying at school in the past 12 months", color: "#29B8E8" },
  { num: "24%",   unit: "of Children",      desc: "Supporting children across every state and territory", color: "#29B8E8" },
];

const WHY = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29B8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    ),
    title: "Growing Challenges",
    body: "Schools face increasing student anxiety, depression, and behavioural challenges without access to actionable data.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29B8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    ),
    title: "Elevated Impact Needed",
    body: "Systemic investment in understanding and addressing wellbeing creates measurable, lasting change for communities.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29B8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
    ),
    title: "Year of the Data",
    body: "The 15 Million Student Check-In Report delivers first-of-its-kind national data to inform policy and practice.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#29B8E8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    ),
    title: "Student Voice at the Centre",
    body: "Ensuring that young Australians' lived experiences shape the programs, resources, and policies that affect them.",
  },
];

const STEPS = [
  { n: "01", title: "Online Checking", body: "Join Australia's leading student wellbeing event, National Check-In Week, bringing data, experts, and activities to your community." },
  { n: "02", title: "Check In Review", body: "Data allows for a comprehensive look at student wellbeing to understand current challenges and explore evidence-informed strategies." },
  { n: "03", title: "Registration", body: "Register for the free webinars and activities at nationalcheckinweek.com to access all National Check-In Week features." },
  { n: "04", title: "Administration", body: "Register for all activities and resources to access and share at nationalcheckinweek.com/participation." },
];

const SPEAKERS = [
  { name: "Andrew Smith",    role: "Student Wellbeing Expert",         initials: "AS", bg: "#DBEAFE" },
  { name: "Sally Webster",   role: "Education Leader & Advocate",      initials: "SW", bg: "#FCE7F3" },
  { name: "Dianne Giblin",   role: "National Program Director",        initials: "DG", bg: "#D1FAE5" },
  { name: "Dr Mark Williams",role: "Wellbeing Research Lead",          initials: "MW", bg: "#FEF3C7" },
  { name: "Gemma McLean",    role: "Child & Youth Psychologist",       initials: "GM", bg: "#EDE9FE" },
  { name: "Kate Xavier",     role: "School Community Consultant",      initials: "KX", bg: "#DBEAFE" },
  { name: "Gayle Walters",   role: "Education Policy Advisor",         initials: "GW", bg: "#FCE7F3" },
  { name: "Nikki Bonus",     role: "Early Intervention Specialist",    initials: "NB", bg: "#D1FAE5" },
  { name: "Corrie Ackland",  role: "Curriculum & Wellbeing Lead",      initials: "CA", bg: "#FEF3C7" },
  { name: "Dr Phil Lambert", role: "Principal & Education Leader",     initials: "PL", bg: "#EDE9FE" },
  { name: "Sarah Garnett",   role: "Mental Health Advocate",           initials: "SG", bg: "#DBEAFE" },
  { name: "Gavin McCormack", role: "Wellbeing & Learning Expert",      initials: "GM", bg: "#FCE7F3" },
];

/* ── Shared inline style helpers ─────────────────────────────── */
const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.65rem", fontWeight: 800,
  letterSpacing: "0.2em", textTransform: "uppercase",
  color: "#29B8E8", textAlign: "center",
  display: "block", marginBottom: 12,
};
const sectionH2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
  fontWeight: 900, color: "#1a1a2e",
  letterSpacing: "-0.02em", lineHeight: 1.2,
  textAlign: "center", marginBottom: 48,
};

/* ── Page ─────────────────────────────────────────────────────── */
export default function Home1() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "72px 48px 64px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center",
        }}>

          {/* Left */}
          <div>
            <span style={{
              display: "inline-block",
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem", fontWeight: 800,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#29B8E8",
              border: "1.5px solid #29B8E8",
              borderRadius: 999, padding: "5px 16px",
              marginBottom: 28,
            }}>
              Free National Initiative · Australia 2026
            </span>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 4.5vw, 3.4rem)",
              fontWeight: 900, lineHeight: 1.15,
              letterSpacing: "-0.025em",
              color: "#1a1a2e", marginBottom: 20,
            }}>
              Student Wellbeing:<br />
              <span style={{ color: "#29B8E8" }}>A National Priority.</span>
            </h1>

            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem", lineHeight: 1.8,
              color: "#4B5563", marginBottom: 28, maxWidth: 480,
            }}>
              Join Australia&rsquo;s leading student wellbeing event. National Check-In Week brings
              together data, experts, and schools to drive real, systemic change.
            </p>

            <a href="/events" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#29B8E8", color: "#fff",
              fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem",
              padding: "13px 28px", borderRadius: 6,
              textDecoration: "none", marginBottom: 32,
              boxShadow: "0 4px 14px rgba(41,184,232,0.35)",
            }}>
              Register Now
            </a>

            <div style={{ marginBottom: 16 }}>
              <CountdownTimer />
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem", color: "#9CA3AF", fontWeight: 600,
              letterSpacing: "0.04em",
            }}>
              25th National Check-In Week · 25–29 May 2026
            </p>
          </div>

          {/* Right — hero visual */}
          <div style={{
            background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 40%, #E0F2FE 100%)",
            borderRadius: 20,
            minHeight: 400,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div aria-hidden="true" style={{
              position: "absolute", top: "10%", right: "10%",
              width: 240, height: 240, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(41,184,232,0.18) 0%, transparent 70%)",
            }} />
            <div style={{ textAlign: "center", padding: 40, position: "relative" }}>
              <div style={{
                width: 96, height: 96, borderRadius: "50%",
                background: "#29B8E8", margin: "0 auto 16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem", fontWeight: 800,
                color: "#1a1a2e", marginBottom: 6,
              }}>
                Supporting Every Student
              </p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#6B7280", lineHeight: 1.6, maxWidth: 220 }}>
                Educators, students &amp; families united for wellbeing
              </p>
            </div>
          </div>
        </div>
      </section>

      <main id="main-content">

        {/* ══════════════════════════════════
            IMPACT
        ══════════════════════════════════ */}
        <section style={{ background: "#fff", padding: "80px 48px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span style={sectionLabel}>IMPACT</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid #E5E7EB" }}>
              {IMPACT.map((s, i) => (
                <div key={s.unit} style={{
                  padding: "40px 32px",
                  borderRight: i < 3 ? "1px solid #E5E7EB" : "none",
                  textAlign: "center",
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 900, lineHeight: 1,
                    color: s.color, marginBottom: 8,
                  }}>
                    {s.num}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.82rem", fontWeight: 800,
                    color: "#1a1a2e", marginBottom: 8,
                  }}>
                    {s.unit}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#6B7280", lineHeight: 1.55, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            WHY THIS MATTERS
        ══════════════════════════════════ */}
        <section style={{ background: "#F9FAFB", padding: "80px 48px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span style={sectionLabel}>WHY THIS MATTERS</span>
            <h2 style={sectionH2}>Understanding the challenge — and the opportunity.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              {WHY.map((w) => (
                <div key={w.title} style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: "28px 28px",
                  display: "flex", gap: 20, alignItems: "flex-start",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                    background: "#EFF6FF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {w.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "0.95rem", fontWeight: 800,
                      color: "#1a1a2e", marginBottom: 8,
                    }}>
                      {w.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.7, margin: 0 }}>
                      {w.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            HOW TO PARTICIPATE
        ══════════════════════════════════ */}
        <section style={{ background: "#fff", padding: "80px 48px", borderTop: "1px solid #F3F4F6" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span style={sectionLabel}>HOW TO PARTICIPATE</span>
            <h2 style={sectionH2}>Four simple steps to get involved.</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>

              {/* Left — Steps */}
              <div>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem", fontWeight: 700, color: "#1a1a2e",
                  marginBottom: 28,
                }}>
                  How to Participate
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {STEPS.map((step) => (
                    <div key={step.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: "#EFF6FF", border: "2px solid #29B8E8",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.65rem", fontWeight: 900, color: "#29B8E8",
                      }}>
                        {step.n}
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.88rem", fontWeight: 700,
                          color: "#1a1a2e", marginBottom: 4,
                        }}>
                          Step {step.n.replace("0", "")}: {step.title}
                        </p>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#6B7280", lineHeight: 1.6, margin: 0 }}>
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Registration form */}
              <div style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 16, padding: "36px 32px",
              }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem", fontWeight: 700, color: "#1a1a2e",
                  marginBottom: 24,
                }}>
                  Register Form
                </p>
                <form action="/api/register" method="POST" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {["First Name", "Last Name"].map((label) => (
                      <div key={label}>
                        <label style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                          {label}
                        </label>
                        <input
                          name={label.toLowerCase().replace(" ", "_")}
                          placeholder={label}
                          style={{
                            width: "100%", padding: "10px 14px", boxSizing: "border-box",
                            border: "1px solid #D1D5DB", borderRadius: 8,
                            fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1a1a2e",
                            outline: "none", background: "#fff",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {[
                    { label: "Email", name: "email", type: "email", placeholder: "Email" },
                    { label: "Phone", name: "phone", type: "tel",   placeholder: "Phone" },
                    { label: "Role",  name: "role",  type: "text",  placeholder: "Role" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                        {f.label}
                      </label>
                      <input
                        name={f.name} type={f.type} placeholder={f.placeholder}
                        style={{
                          width: "100%", padding: "10px 14px", boxSizing: "border-box",
                          border: "1px solid #D1D5DB", borderRadius: 8,
                          fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1a1a2e",
                          outline: "none", background: "#fff",
                        }}
                      />
                    </div>
                  ))}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "#9CA3AF", lineHeight: 1.6, margin: 0 }}>
                    By registering, you agree to our{" "}
                    <a href="/privacy" style={{ color: "#29B8E8", textDecoration: "none" }}>Privacy Policy</a>
                    {" "}and{" "}
                    <a href="/terms" style={{ color: "#29B8E8", textDecoration: "none" }}>Terms of Use</a>.
                  </p>
                  <button type="submit" style={{
                    background: "#29B8E8", color: "#fff",
                    fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.9rem",
                    padding: "13px 24px", borderRadius: 8, border: "none",
                    cursor: "pointer", letterSpacing: "0.01em",
                  }}>
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FEATURED SPEAKERS
        ══════════════════════════════════ */}
        <section style={{ background: "#F9FAFB", padding: "80px 48px", borderTop: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <span style={sectionLabel}>FEATURED SPEAKERS</span>
            <h2 style={sectionH2}>Australia&rsquo;s leading voices in student wellbeing.</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
              {SPEAKERS.map((s) => (
                <div key={s.name} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 88, height: 88, borderRadius: "50%",
                    background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 14px",
                    border: "3px solid #fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem", fontWeight: 800, color: "#1a1a2e",
                    }}>
                      {s.initials}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem", fontWeight: 800,
                    color: "#1a1a2e", marginBottom: 4,
                  }}>
                    {s.name}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.73rem", color: "#6B7280",
                    lineHeight: 1.5, margin: 0,
                  }}>
                    {s.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
