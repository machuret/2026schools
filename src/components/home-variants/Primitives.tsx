import React from "react";

/* ─────────────────────────────────────────────
   Shared primitives for /home1–/home4 variants.
   All style values reference CSS design tokens
   from tokens.css wherever possible.
───────────────────────────────────────────── */

/** Full-width section wrapper with a centred max-width inner */
export function SectionWrap({
  children,
  maxWidth = 1100,
  py = 80,
  px = 40,
  background,
  style,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  py?: number;
  px?: number;
  background?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={{
        padding: `${py}px ${px}px`,
        background,
        ...style,
      }}
    >
      <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

/** Uppercase eyebrow label — uses --primary token */
export function Eyebrow({
  children,
  color = "var(--primary)",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        marginBottom: 14,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Thin horizontal rule divider */
export function Divider({
  color = "var(--border)",
  style,
}: {
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={{ height: 1, background: color, margin: "0", ...style }}
    />
  );
}

/** Solid CTA button */
export function CtaButton({
  href,
  children,
  background = "var(--primary)",
  color = "#fff",
  borderRadius = 8,
  style,
}: {
  href: string;
  children: React.ReactNode;
  background?: string;
  color?: string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background,
        color,
        padding: "15px 30px",
        borderRadius,
        fontWeight: 700,
        fontSize: "0.95rem",
        textDecoration: "none",
        ...style,
      }}
    >
      {children}
    </a>
  );
}

/** Ghost / outline CTA button */
export function GhostButton({
  href,
  children,
  borderColor = "var(--border)",
  color = "var(--dark)",
  borderRadius = 8,
  style,
}: {
  href: string;
  children: React.ReactNode;
  borderColor?: string;
  color?: string;
  borderRadius?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "transparent",
        color,
        padding: "15px 30px",
        borderRadius,
        fontWeight: 600,
        fontSize: "0.95rem",
        textDecoration: "none",
        border: `1.5px solid ${borderColor}`,
        ...style,
      }}
    >
      {children}
    </a>
  );
}

/** A single key-stat display: big number + label */
export function StatCard({
  num,
  label,
  source,
  numColor = "var(--primary)",
  background = "var(--white)",
  border = "1px solid var(--border)",
  style,
}: {
  num: string;
  label: string;
  source?: string;
  numColor?: string;
  background?: string;
  border?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background,
        border,
        borderRadius: "var(--radius-md)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: "var(--shadow-card)",
        ...style,
      }}
    >
      <div
        style={{
          fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 900,
          color: numColor,
          fontFamily: "var(--font-display)",
          lineHeight: 1,
        }}
      >
        {num}
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", lineHeight: 1.55, margin: 0 }}>
        {label}
      </p>
      {source && (
        <span style={{ fontSize: "0.68rem", color: "var(--text-light)", marginTop: 4 }}>
          {source}
        </span>
      )}
    </div>
  );
}

/** Arrow icon used in CTA buttons */
export function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
