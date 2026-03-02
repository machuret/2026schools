export default function Hero() {
  const stats = [
    { num: "Suicide", suffix: "", label: "is the leading cause of death for Australians aged 15–24" },
    { num: "1", suffix: " in 7", label: "children has a diagnosable mental disorder — most go undetected" },
    { num: "72%", suffix: "", label: "of all lifetime mental health conditions begin before age 25" },
    { num: "8×", suffix: "", label: "more cost-effective to intervene early than treat a crisis later" },
  ];

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-tag">
          <span className="hero-tag-dot" />
          Australian Schools Wellbeing Monitor · 2024–25
        </div>
        <h1>
          Understanding the data<br />
          is how we prevent the<br />
          <em>next</em> tragedy
        </h1>
        <p className="hero-sub">
          Suicide. Anxiety. Self-harm. These are not school failures — they are complex challenges that schools, families and communities face together. What makes the difference is having the right data, early enough to act. This monitor exists to make that data visible.
        </p>
        <div className="hero-cta-row">
          <a href="#issues" className="hero-btn-primary">Explore the Issues</a>
          <a href="#prevention" className="hero-btn-secondary">How Data Helps →</a>
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
