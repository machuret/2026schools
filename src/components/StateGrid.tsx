"use client";
import { useState } from "react";
import Link from "next/link";

const STATES = [
  {
    name: "New South Wales",
    abbr: "NSW",
    slug: "new-south-wales",
    severity: "high" as const,
    population: "8.3M",
    topIssue: "Cyberbullying & Anxiety",
    stat: "53% cyberbullied",
    issues: 5,
    color: "#D97706",
  },
  {
    name: "Victoria",
    abbr: "VIC",
    slug: "victoria",
    severity: "high" as const,
    population: "6.7M",
    topIssue: "Depression & Loneliness",
    stat: "1 in 5 teens in distress",
    issues: 4,
    color: "#D97706",
  },
  {
    name: "Queensland",
    abbr: "QLD",
    slug: "queensland",
    severity: "critical" as const,
    population: "5.4M",
    topIssue: "Bullying in Schools",
    stat: "46,000+ incidents (2023)",
    issues: 5,
    color: "#DC2626",
  },
  {
    name: "Western Australia",
    abbr: "WA",
    slug: "western-australia",
    severity: "critical" as const,
    population: "2.9M",
    topIssue: "Remote Attendance Crisis",
    stat: "~57% remote attendance",
    issues: 4,
    color: "#DC2626",
  },
  {
    name: "South Australia",
    abbr: "SA",
    slug: "south-australia",
    severity: "high" as const,
    population: "1.8M",
    topIssue: "Distress & Loneliness",
    stat: "1 in 5 SA teens",
    issues: 4,
    color: "#D97706",
  },
  {
    name: "Tasmania",
    abbr: "TAS",
    slug: "tasmania",
    severity: "high" as const,
    population: "571K",
    topIssue: "Socioeconomic Disadvantage",
    stat: "Lowest SEIFA nationally",
    issues: 4,
    color: "#D97706",
  },
  {
    name: "Northern Territory",
    abbr: "NT",
    slug: "northern-territory",
    severity: "critical" as const,
    population: "251K",
    topIssue: "Attendance & Self-Harm",
    stat: "50–60% remote attendance",
    issues: 4,
    color: "#DC2626",
  },
  {
    name: "Australian Capital Territory",
    abbr: "ACT",
    slug: "australian-capital-territory",
    severity: "notable" as const,
    population: "470K",
    topIssue: "Academic Anxiety",
    stat: "Highest self-reported in Aus.",
    issues: 4,
    color: "#059669",
  },
];

const SEVERITY_LABEL: Record<string, string> = {
  critical: "Critical",
  high: "Elevated",
  notable: "Notable",
};

const SEVERITY_BG: Record<string, string> = {
  critical: "rgba(220,38,38,0.08)",
  high: "rgba(217,119,6,0.08)",
  notable: "rgba(5,150,105,0.08)",
};

const SEVERITY_BORDER: Record<string, string> = {
  critical: "rgba(220,38,38,0.25)",
  high: "rgba(217,119,6,0.25)",
  notable: "rgba(5,150,105,0.25)",
};

/* Risk bar widths (out of 100) — represents composite concern level */
const RISK_SCORE: Record<string, number> = {
  "new-south-wales": 72,
  "victoria": 68,
  "queensland": 85,
  "western-australia": 90,
  "south-australia": 65,
  "tasmania": 70,
  "northern-territory": 97,
  "australian-capital-territory": 55,
};

export default function StateGrid() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { sev: "critical", label: "Critical concern", color: "#DC2626", bg: "#FEE2E2" },
          { sev: "high",     label: "Elevated concern", color: "#D97706", bg: "#FEF3C7" },
          { sev: "notable",  label: "Notable concern",  color: "#059669", bg: "#D1FAE5" },
        ].map(l => (
          <div key={l.sev} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-mid)", fontWeight: 500 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* State cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
        marginBottom: "40px",
      }}>
        {STATES.map(s => {
          const isHovered = hovered === s.slug;
          const score = RISK_SCORE[s.slug];
          return (
            <Link
              key={s.slug}
              href={`/states/${s.slug}`}
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHovered(s.slug)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                background: isHovered ? SEVERITY_BG[s.severity] : "#FFFFFF",
                border: `1.5px solid ${isHovered ? s.color : "var(--border)"}`,
                borderLeft: `5px solid ${s.color}`,
                borderRadius: "10px",
                padding: "20px 22px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                transform: isHovered ? "translateY(-2px)" : "none",
                boxShadow: isHovered
                  ? `0 8px 24px ${SEVERITY_BORDER[s.severity]}`
                  : "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{
                      fontSize: "1.5rem", fontWeight: 800, color: s.color,
                      fontFamily: "var(--font-inter, Inter), sans-serif", lineHeight: 1,
                    }}>
                      {s.abbr}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginTop: "3px", fontWeight: 500 }}>
                      {s.name}
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.08em", padding: "3px 10px", borderRadius: "100px",
                    background: SEVERITY_BG[s.severity],
                    color: s.color,
                    border: `1px solid ${SEVERITY_BORDER[s.severity]}`,
                  }}>
                    {SEVERITY_LABEL[s.severity]}
                  </span>
                </div>

                {/* Top issue */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>
                    Top concern
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--navy)" }}>
                    {s.topIssue}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: s.color, fontWeight: 600, marginTop: "2px" }}>
                    {s.stat}
                  </div>
                </div>

                {/* Risk bar */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-light)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Concern level
                    </span>
                    <span style={{ fontSize: "0.68rem", color: s.color, fontWeight: 700 }}>
                      {score}/100
                    </span>
                  </div>
                  <div style={{
                    height: "6px", background: "#F1F5F9", borderRadius: "100px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${score}%`,
                      background: s.color,
                      borderRadius: "100px",
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                    {s.issues} priority issues · pop. {s.population}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: s.color, fontWeight: 700 }}>
                    {isHovered ? "View →" : "Explore →"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Comparative bar chart */}
      <div style={{
        background: "#FFFFFF",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "28px 32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-light)", marginBottom: "20px" }}>
          Composite wellbeing concern score by state / territory
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[...STATES].sort((a, b) => RISK_SCORE[b.slug] - RISK_SCORE[a.slug]).map(s => (
            <Link
              key={`bar-${s.slug}`}
              href={`/states/${s.slug}`}
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div style={{
                width: "40px", fontSize: "0.75rem", fontWeight: 700,
                color: s.color, textAlign: "right", flexShrink: 0,
              }}>
                {s.abbr}
              </div>
              <div style={{ flex: 1, height: "28px", background: "#F8FAFC", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${RISK_SCORE[s.slug]}%`,
                  background: `linear-gradient(90deg, ${s.color}cc, ${s.color})`,
                  borderRadius: "6px",
                  display: "flex", alignItems: "center", paddingLeft: "10px",
                  transition: "width 0.6s ease",
                }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>
                    {s.topIssue}
                  </span>
                </div>
              </div>
              <div style={{ width: "36px", fontSize: "0.75rem", fontWeight: 800, color: s.color, textAlign: "left", flexShrink: 0 }}>
                {RISK_SCORE[s.slug]}
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: "16px", fontSize: "0.75rem", color: "var(--text-light)", lineHeight: 1.6 }}>
          Composite score based on severity of documented issues, coverage in national data sources (AIHW, Mission Australia, RoGS 2026), and prevalence rates. Click any bar to explore state detail.
        </div>
      </div>
    </div>
  );
}
