import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createClient as staticClient } from "@supabase/supabase-js";
import BadgePill from "@/components/events/BadgePill";
import EventBodyRenderer from "@/components/events/EventBodyRenderer";
import {
  FORMAT_LABEL, FORMAT_BADGE, STATUS_BADGE,
  formatDateLong, formatDateShort,
  type EventRecord,
} from "@/lib/events";

export const revalidate = 60;

export async function generateStaticParams() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  const sb = staticClient(url, anon);
  const { data } = await sb.from("events").select("slug").eq("published", true);
  return (data ?? []).map((e: { slug: string }) => ({ slug: e.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return {};
  const sb = staticClient(url, anon);
  const { data } = await sb
    .from("events")
    .select("title,tagline,seo_title,seo_desc,feature_image")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) return {};

  const title = data.seo_title || data.title;
  const description = data.seo_desc || data.tagline;

  return {
    title: `${title} — National Check-in Week`,
    description,
    openGraph: {
      title,
      description,
      images: data.feature_image ? [{ url: data.feature_image }] : [],
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createClient();

  const { data } = await sb
    .from("events")
    .select("*, event_speakers(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) notFound();
  const event = data as EventRecord;

  const speakers = [...(event.event_speakers ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const isPast = event.status === "past";
  const isLive = event.status === "live";
  const fmtBadge = FORMAT_BADGE[event.format] ?? { bg: "#F9FAFB", color: "#374151" };
  const stsBadge = STATUS_BADGE[event.status] ?? { bg: "#F9FAFB", color: "#374151" };

  const FORMAT_ICON: Record<string, string> = {
    webinar: "💻", "in-person": "📍", hybrid: "🔀",
    workshop: "🛠️", conference: "🎤",
  };

  return (
    <>
      {/* ── HERO ── */}
      <div className="page-hero" style={{ paddingBottom: 0 }}>
        <div className="page-hero__inner" style={{ maxWidth: 1000, margin: "0 auto" }}>

          {/* Breadcrumb */}
          <div className="page-hero__breadcrumb">
            <Link href="/events">Events</Link> / {event.title}
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <BadgePill {...fmtBadge} label={FORMAT_LABEL[event.format] ?? event.format} />
            {isLive  && <BadgePill bg="#FEF2F2" color="#DC2626" label="● Live now" />}
            {isPast  && <BadgePill bg="#F3F4F6" color="#6B7280" label="Past event" />}
            {!isPast && !isLive && <BadgePill {...stsBadge} label={event.status} />}
            {event.is_free && <BadgePill bg="#F0FDF4" color="#16A34A" label="Free" />}
          </div>

          <h1 className="page-hero__title">{event.title}</h1>
          {event.tagline && (
            <p className="page-hero__subtitle" style={{ maxWidth: 740 }}>{event.tagline}</p>
          )}

          {/* Meta bar */}
          {(event.event_date || event.event_time || event.format) && (
            <div className="event-hero-meta">
              {event.event_date && (
                <div className="event-hero-meta__item">
                  <span className="event-hero-meta__icon">📅</span>
                  <span>{formatDateLong(event.event_date)}</span>
                </div>
              )}
              {event.event_time && (
                <div className="event-hero-meta__item">
                  <span className="event-hero-meta__icon">🕐</span>
                  <span>{event.event_time}{event.event_end ? ` – ${event.event_end}` : ""}</span>
                </div>
              )}
              <div className="event-hero-meta__item">
                <span className="event-hero-meta__icon">{FORMAT_ICON[event.format] ?? "📋"}</span>
                <span>{FORMAT_LABEL[event.format] ?? event.format}</span>
              </div>
              {event.format === "in-person" && event.location && (
                <div className="event-hero-meta__item">
                  <span className="event-hero-meta__icon">📍</span>
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <main id="main-content" className="inner-content" style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="event-detail-grid">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Feature image */}
            {event.feature_image && (
              <div className="event-feature-image">
                <Image src={event.feature_image} alt={event.title} fill style={{ objectFit: "cover" }} />
              </div>
            )}

            {/* About the event */}
            {event.description && (
              <section className="event-section">
                <div className="eyebrow-tag">About the event</div>
                <EventBodyRenderer content={event.description} />
              </section>
            )}

            {/* Body content */}
            {event.body && (
              <section className="event-section">
                <EventBodyRenderer content={event.body} />
              </section>
            )}

            {/* Recording callout (past events) */}
            {isPast && event.recording_url && (
              <div className="event-recording-callout">
                <div className="event-recording-callout__icon">🎬</div>
                <div className="event-recording-callout__body">
                  <div className="event-recording-callout__label">Recording available</div>
                  <div className="event-recording-callout__title">Missed the live session?</div>
                  <p className="event-recording-callout__text">
                    Watch the full recording at your own pace. All the insights, none of the scheduling pressure.
                  </p>
                  <a
                    href={event.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-recording-callout__link"
                  >
                    ▶ Watch recording
                  </a>
                </div>
              </div>
            )}

            {/* Speakers */}
            {speakers.length > 0 && (
              <section className="event-section">
                <div className="eyebrow-tag">
                  {speakers.length === 1 ? "Your presenter" : "Meet the experts"}
                </div>
                <div className="event-speakers">
                  {speakers.map((sp) => (
                    <div key={sp.id} className="event-speaker">
                      <div className="event-speaker__avatar">
                        {sp.photo ? (
                          <Image src={sp.photo} alt={sp.name} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div className="event-speaker__avatar-placeholder">👤</div>
                        )}
                      </div>
                      <div className="event-speaker__info">
                        <div className="event-speaker__name">{sp.name}</div>
                        {sp.title && <div className="event-speaker__role">{sp.title}</div>}
                        {sp.bio && <p className="event-speaker__bio">{sp.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── RIGHT: Register sidebar ── */}
          <div>
            <div className="event-register-card">
              {/* Header */}
              <div className="event-register-card__header">
                <div className="event-register-card__price">
                  {event.is_free ? "Free" : (event.price || "Paid")}
                </div>
                <div className="event-register-card__price-sub">
                  {event.is_free ? "No cost to attend" : "Per person"}
                </div>
              </div>

              {/* Body */}
              <div className="event-register-card__body">
                {/* Date/time */}
                {(event.event_date || event.event_time) && (
                  <div className="event-register-card__date">
                    {event.event_date && (
                      <div className="event-register-card__date-row">
                        <span>📅</span>
                        <span>{formatDateShort(event.event_date)}</span>
                      </div>
                    )}
                    {event.event_time && (
                      <div className="event-register-card__date-row">
                        <span>🕐</span>
                        <span>{event.event_time}{event.event_end ? ` – ${event.event_end}` : ""}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA */}
                {!isPast && event.register_url && (
                  <a
                    href={event.register_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`event-register-btn${isLive ? " event-register-btn--live" : ""}`}
                  >
                    {isLive ? "🔴 Join live now" : "Register now →"}
                  </a>
                )}
                {!isPast && !event.register_url && (
                  <div className="event-register-coming-soon">
                    Registration opening soon
                  </div>
                )}
                {isPast && event.recording_url && (
                  <a
                    href={event.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="event-register-btn event-register-btn--secondary"
                  >
                    ▶ Watch recording
                  </a>
                )}
                {isPast && !event.recording_url && (
                  <div className="event-register-coming-soon">
                    Recording coming soon
                  </div>
                )}

                {/* Meta */}
                <div className="event-register-card__meta">
                  <div className="event-register-card__meta-row">
                    <span>{FORMAT_ICON[event.format] ?? "�"}</span>
                    <span>{FORMAT_LABEL[event.format] ?? event.format}</span>
                  </div>
                  {event.is_free && (
                    <div className="event-register-card__meta-row">
                      <span>✅</span><span>Free to attend</span>
                    </div>
                  )}
                  {speakers.length > 0 && (
                    <div className="event-register-card__meta-row">
                      <span>🎤</span>
                      <span>{speakers.length} presenter{speakers.length !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                  {event.format === "webinar" && (
                    <div className="event-register-card__meta-row">
                      <span>💻</span><span>Online — join from anywhere</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Back link */}
              <Link href="/events" className="event-register-card__back">
                ← All events
              </Link>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
