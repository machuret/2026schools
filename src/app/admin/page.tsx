import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default async function AdminDashboard() {
  let userEmail = '';
  let issueCount = 0;
  let stateCount = 0;
  let areaCount = 0;
  let eventCount = 0;
  let publishedEventCount = 0;
  let seoMissingCount = 0;
  let schoolCount = 0;
  type ActivityRow = { ms: string; bg: string; color: string; title: string; desc: string; time: string; href: string };
  let activity: ActivityRow[] = [];
  let dashError = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? '';

    const [issues, states, areas, events, eventsPublished, seoMissing, schools,
      recentIssues, recentAreas, recentEvents] = await Promise.all([
      supabase.from('issues').select('id', { count: 'exact', head: true }),
      supabase.from('states').select('id', { count: 'exact', head: true }),
      supabase.from('areas').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('areas').select('id', { count: 'exact', head: true })
        .or('seo_title.is.null,seo_title.eq.'),
      supabase.from('school_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('issues').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(3),
      supabase.from('areas').select('id, name, state, updated_at').order('updated_at', { ascending: false }).limit(3),
      supabase.from('events').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(3),
    ]);

    issueCount = issues.count ?? 0;
    stateCount = states.count ?? 0;
    areaCount = areas.count ?? 0;
    eventCount = events.count ?? 0;
    publishedEventCount = eventsPublished.count ?? 0;
    seoMissingCount = seoMissing.count ?? 0;
    schoolCount = schools.count ?? 0;

    // Build real activity feed — carry raw timestamp for correct sort
    type RawRow = { id: string; title?: string; name?: string; state?: string; updated_at: string };
    type ActivityRowWithTs = ActivityRow & { _ts: string };
    const rows: ActivityRowWithTs[] = [
      ...((recentIssues.data ?? []) as RawRow[]).map(r => ({
        ms: 'warning', bg: '#fef3c7', color: '#d97706',
        title: 'Issue updated', desc: r.title ?? '—',
        time: timeAgo(r.updated_at), href: `/admin/issues/${r.id}`,
        _ts: r.updated_at,
      })),
      ...((recentAreas.data ?? []) as RawRow[]).map(r => ({
        ms: 'location_on', bg: '#ede9fe', color: '#7c3aed',
        title: 'Area updated', desc: `${r.name ?? '—'}, ${r.state ?? ''}`,
        time: timeAgo(r.updated_at), href: `/admin/content/${r.id}`,
        _ts: r.updated_at,
      })),
      ...((recentEvents.data ?? []) as RawRow[]).map(r => ({
        ms: 'event', bg: '#e0f2fe', color: '#0284c7',
        title: 'Event updated', desc: r.title ?? '—',
        time: timeAgo(r.updated_at), href: `/admin/events/${r.id}`,
        _ts: r.updated_at,
      })),
    ];
    rows.sort((a, b) => b._ts.localeCompare(a._ts));
    activity = rows.slice(0, 6).map(({ _ts: _, ...rest }) => rest);
  } catch (e) {
    console.error('Dashboard fetch error:', e);
    dashError = true;
  }

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' });

  const QUICK_ACTIONS = [
    { label: 'Manage Issues',  href: '/admin/issues',      ms: 'warning' },
    { label: 'Schools',        href: '/admin/schools',     ms: 'school' },
    { label: 'Events',         href: '/admin/events',      ms: 'event' },
    { label: 'Areas & Cities', href: '/admin/content',     ms: 'location_on' },
    { label: 'SEO Manager',    href: '/admin/seo',         ms: 'travel_explore' },
    { label: 'CMS Pages',      href: '/admin/cms/pages',   ms: 'article' },
    { label: 'API Keys',       href: '/admin/api',         ms: 'key' },
  ];

  const seoHealthPct = areaCount > 0 ? Math.round(((areaCount - seoMissingCount) / areaCount) * 100) : 100;
  const circumference = 2 * Math.PI * 54;

  return (
    <>
      {/* Page Header */}
      <div className="swa-page-header">
        <div>
          <h1 className="swa-page-title">Dashboard</h1>
          <p className="swa-page-subtitle">{today} · {userEmail || 'Schools Wellbeing AU'}</p>
        </div>
        <Link href="/admin/events/new" className="swa-btn swa-btn--primary" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New Event
        </Link>
      </div>

      {dashError && (
        <div className="swa-alert swa-alert--error" style={{ marginBottom: 20 }}>
          Could not load dashboard data — check your Supabase connection.
        </div>
      )}

      {/* Stat Cards */}
      <div className="swa-stat-grid">
        <Link href="/admin/issues" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Wellbeing Issues</span>
            <span className="swa-badge swa-badge--success">Live</span>
          </div>
          <div className="swa-stat-card__value">{issueCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">{stateCount} states covered</span>
          </div>
        </Link>

        <Link href="/admin/events" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Events</span>
            <span className="swa-badge swa-badge--primary">{publishedEventCount} published</span>
          </div>
          <div className="swa-stat-card__value">{eventCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">{eventCount - publishedEventCount} drafts</span>
          </div>
        </Link>

        <Link href="/admin/content" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Areas & Cities</span>
            <span className="swa-badge swa-badge--warning">{seoMissingCount} need SEO</span>
          </div>
          <div className="swa-stat-card__value">{areaCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">{stateCount} states</span>
          </div>
        </Link>

        <Link href="/admin/schools" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Schools</span>
            <span className="swa-badge swa-badge--primary">ACARA</span>
          </div>
          <div className="swa-stat-card__value">{schoolCount.toLocaleString()}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">All Australian schools</span>
          </div>
        </Link>
      </div>

      {/* Two-column: Activity + Right panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginTop: 24 }}>

        {/* Recent Activity — real data */}
        <div className="swa-card">
          <div className="swa-card__header">
            <span className="swa-card__title">Recent Activity</span>
            <Link href="/admin/content" className="swa-btn-ghost" style={{ fontSize: 12 }}>View areas →</Link>
          </div>
          {activity.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-faint)', padding: '16px 0' }}>No recent activity.</p>
          ) : (
            <div>
              {activity.map((a) => (
                <Link key={`${a.href}-${a.desc}`} href={a.href} className="swa-activity-item" style={{ textDecoration: 'none' }}>
                  <div className="swa-activity-item__icon" style={{ background: a.bg }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: a.color }}>{a.ms}</span>
                  </div>
                  <div className="swa-activity-item__text">
                    <strong>{a.title}:</strong> {a.desc}
                  </div>
                  <div className="swa-activity-item__time">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                    {a.time}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* SEO Coverage ring */}
          <div className="swa-card">
            <div className="swa-card__header">
              <span className="swa-card__title">SEO Coverage</span>
              <Link href="/admin/seo" className="swa-btn-ghost" style={{ fontSize: 12 }}>Fix →</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '8px 0' }}>
              <svg width="80" height="80" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#ede9fe" strokeWidth="12"/>
                <circle cx="70" cy="70" r="54" fill="none" stroke="#7c3aed" strokeWidth="12"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${circumference - (seoHealthPct / 100) * circumference}`}
                  strokeLinecap="round" transform="rotate(-90 70 70)"/>
                <text x="70" y="67" textAnchor="middle" fontSize="26" fontWeight="700" fill="#1e1040">{seoHealthPct}%</text>
                <text x="70" y="85" textAnchor="middle" fontSize="10" fill="#9ca3af" letterSpacing="1">AREAS</text>
              </svg>
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 6 }}>
                  <strong>{areaCount - seoMissingCount}</strong> of {areaCount} areas have SEO metadata
                </div>
                {seoMissingCount > 0 && (
                  <Link href="/admin/seo" className="swa-btn swa-btn--primary" style={{ fontSize: 12, padding: '5px 12px', textDecoration: 'none', display: 'inline-flex' }}>
                    ✨ Generate {seoMissingCount} missing
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="swa-card">
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-faint)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>QUICK ACTIONS</div>
            {QUICK_ACTIONS.map(a => (
              <Link key={a.href} href={a.href} className="swa-quick-action">
                <div className="swa-quick-action__icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{a.ms}</span>
                </div>
                <span className="swa-quick-action__label">{a.label}</span>
                <span className="material-symbols-outlined swa-quick-action__chevron" style={{ fontSize: 14 }}>chevron_right</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
