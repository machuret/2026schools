"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WORDS = ["wellbeing", "resilience", "belonging", "engagement", "readiness"];

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber(n => (n === WORDS.length - 1 ? 0 : n + 1));
    }, 2200);
    return () => clearTimeout(id);
  }, [titleNumber]);

  const stats = [
    { num: "Suicide", suffix: "", label: "is the leading cause of death for Australians aged 15–24" },
    { num: "1 in 7", suffix: "", label: "children has a diagnosable mental disorder — most go undetected" },
    { num: "72%", suffix: "", label: "of all lifetime mental health conditions begin before age 25" },
    { num: "8×", suffix: "", label: "more cost-effective to intervene early than treat a crisis later" },
  ];

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          National Check-in Week · Australia 2026
        </div>

        <h1>
          Every student deserves to be
          <br />
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              height: "1.2em",
              overflow: "hidden",
              verticalAlign: "bottom",
              width: "clamp(180px, 50vw, 420px)",
            }}
          >
            &nbsp;
            {WORDS.map((word, index) => (
              <motion.span
                key={index}
                style={{
                  position: "absolute",
                  fontStyle: "italic",
                  color: "var(--teal)",
                }}
                initial={{ opacity: 0, y: 80 }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : { y: titleNumber > index ? -80 : 80, opacity: 0 }
                }
              >
                {word}
              </motion.span>
            ))}
          </span>
          <br />
          checked in on
        </h1>

        <p className="hero-sub">
          National Check-in Week is a FREE initiative giving Australian school leaders the tools, data, and professional learning they need to support every student — before challenges become crises.
        </p>

        <div className="hero-cta-row">
          <a href="#about" className="hero-btn-primary">Register for Free Webinars</a>
          <a href="#issues" className="hero-btn-secondary">Explore the Issues →</a>
        </div>

        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat-num">
                {s.num}<span>{s.suffix}</span>
              </div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
