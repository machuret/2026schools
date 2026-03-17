"use client";

import { useEffect, useState } from "react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const grouped: Record<string, Faq[]> = {};
  faqs.forEach((f) => {
    const cat = f.category || "General";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  });
  const categories = Object.keys(grouped);

  return (
    <>
      {/* Hero */}
      <div className="page-hero page-hero--centered">
        <div className="page-hero__inner">
          <div className="hero-tag">❓ Help Centre</div>
          <h1 className="page-hero__title">
            Frequently Asked Questions
          </h1>
          <p className="page-hero__subtitle">
            Find answers to common questions about Schools Wellbeing Australia
          </p>
        </div>
      </div>

      <main className="inner-content">
        {loading && (
          <div className="empty-state empty-state--loading">Loading...</div>
        )}

        {!loading && faqs.length === 0 && (
          <div className="empty-state">
            <p>FAQs will appear here once added.</p>
          </div>
        )}

        {!loading && categories.map((cat) => (
          <div key={cat} className="faq-category">
            {categories.length > 1 && (
              <h2 className="faq-category__heading">{cat}</h2>
            )}
            <div className="faq-list">
              {grouped[cat].map((f) => {
                const isOpen = openId === f.id;
                return (
                  <div key={f.id} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                    <button
                      onClick={() => setOpenId(isOpen ? null : f.id)}
                      className="faq-item__trigger"
                      aria-expanded={isOpen}
                      aria-controls={`faq-body-${f.id}`}
                    >
                      <span>{f.question}</span>
                      <span className={`faq-item__icon ${isOpen ? "faq-item__icon--open" : ""}`} aria-hidden="true">+</span>
                    </button>
                    {isOpen && (
                      <div className="faq-item__body" id={`faq-body-${f.id}`} role="region" aria-labelledby={`faq-trigger-${f.id}`}>{f.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>

    </>
  );
}
