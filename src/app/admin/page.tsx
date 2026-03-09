import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  let userEmail = '';
  let issueCount = 0;
  let stateCount = 0;
  let areaCount = 0;
  let pageCount = 0;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? '';
    const [issues, states, areas, pages] = await Promise.all([
      supabase.from('issues').select('id', { count: 'exact', head: true }),
      supabase.from('states').select('id', { count: 'exact', head: true }),
      supabase.from('areas').select('id', { count: 'exact', head: true }),
      supabase.from('pages').select('id', { count: 'exact', head: true }),
    ]);
    issueCount = issues.count ?? 0;
    stateCount = states.count ?? 0;
    areaCount = areas.count ?? 0;
    pageCount = pages.count ?? 0;
  } catch { /* middleware ensures auth */ }

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' });

  const QUICK_ACTIONS = [
    { label: 'Manage Issues',  href: '/admin/issues',      ms: 'warning' },
    { label: 'State Data',     href: '/admin/states',      ms: 'analytics' },
    { label: 'Areas & Cities', href: '/admin/content',     ms: 'location_on' },
    { label: 'CMS Pages',      href: '/admin/cms/pages',   ms: 'article' },
    { label: 'API Keys',       href: '/admin/api',         ms: 'key' },
    { label: 'Settings',       href: '/admin/settings',    ms: 'settings' },
  ];

  const healthItems = [
    { label: 'Supabase DB',    status: 'OK',      color: '#10b981', pct: '100%' },
    { label: 'Auth',           status: 'Active',   color: '#10b981', pct: '100%' },
    { label: 'AI Integration', status: 'Not set',  color: '#f59e0b', pct: '45%' },
    { label: 'Deployment',     status: 'Live',     color: '#10b981', pct: '88%' },
  ];

  const activity = [
    { ms: 'article',     bg: '#ede9fe', color: '#7c3aed', title: 'Issue published',    desc: 'New wellbeing issue went live.',      time: '2 min ago' },
    { ms: 'trending_up', bg: '#e0f2fe', color: '#06b6d4', title: 'State data updated', desc: 'Victoria statistics refreshed.',      time: '45 min ago' },
    { ms: 'location_on', bg: '#fef3c7', color: '#f59e0b', title: 'New area added',     desc: 'Northern Beaches (NSW) created.',     time: '1 hr ago' },
    { ms: 'edit_note',   bg: '#ede9fe', color: '#8b5cf6', title: 'CMS page edited',    desc: 'About page content updated.',         time: '3 hr ago' },
  ];

  const sparkD = "M0,15 Q10,5 20,18 T40,10 T60,15 T80,5 T120,12";
  const sparkD2 = "M0,18 Q20,15 40,12 T60,8 T80,15 T120,5";
  const sparkD3 = "M0,5 Q20,10 40,5 T60,15 T80,12 T120,18";

  return (
    <>
      {/* Page Header */}
      <div className="swa-page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e1040', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '2px 0 0' }}>{today} · Schools Wellbeing AU</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            placeholder="Search resources, users or reports..."
            className="swa-search"
            type="search"
          />
          <Link href="/admin/issues/new" className="swa-btn swa-btn-primary" style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            New Issue
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="swa-stat-grid">
        <Link href="/admin/issues" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Wellbeing Issues</span>
            <span className="swa-badge swa-badge--success">Active</span>
          </div>
          <div className="swa-stat-card__value">{issueCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">+12 this week</span>
            <svg width="120" height="40" viewBox="0 0 120 40"><polyline fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,30 10,12 20,35 35,18 50,22 65,10 80,28 95,8 110,20 120,14"/></svg>
          </div>
        </Link>

        <Link href="/admin/states" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">States & Territories</span>
            <span className="swa-badge swa-badge--success">All active</span>
          </div>
          <div className="swa-stat-card__value">{stateCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">Full coverage</span>
            <svg width="120" height="40" viewBox="0 0 120 40"><polyline fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,35 15,30 30,24 45,18 60,14 75,20 90,10 105,16 120,6"/></svg>
          </div>
        </Link>

        <Link href="/admin/content" className="swa-stat-card">
          <div className="swa-stat-card__top">
            <span className="swa-stat-card__label">Areas & Cities</span>
            <span className="swa-badge swa-badge--warning">{pageCount} pages</span>
          </div>
          <div className="swa-stat-card__value">{areaCount}</div>
          <div className="swa-stat-card__bottom">
            <span className="swa-stat-card__delta">+5 added today</span>
            <svg width="120" height="40" viewBox="0 0 120 40"><polyline fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="0,10 15,18 30,8 45,25 60,14 75,30 90,22 105,35 120,28"/></svg>
          </div>
        </Link>
      </div>

      {/* System Health */}
      <div className="swa-card" style={{ marginBottom: 24 }}>
        <div className="swa-card__header">
          <span className="swa-card__title">System Health</span>
          <button className="swa-btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>sync</span> Refresh
          </button>
        </div>
        <div className="swa-health__body">
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
            <circle cx="70" cy="70" r="54" fill="none" stroke="#ede9fe" strokeWidth="10"/>
            <circle cx="70" cy="70" r="54" fill="none" stroke="#7c3aed" strokeWidth="10"
              strokeDasharray={`${2*Math.PI*54}`} strokeDashoffset={`${2*Math.PI*54 - (84/100)*2*Math.PI*54}`}
              strokeLinecap="round" transform="rotate(-90 70 70)"/>
            <text x="70" y="65" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1e1040">84%</text>
            <text x="70" y="83" textAnchor="middle" fontSize="11" fill="#9ca3af" letterSpacing="1">OPTIMAL</text>
          </svg>
          <div className="swa-health-grid">
            {healthItems.map(h => (
              <div key={h.label} className="swa-health-item">
                <div className="swa-health-item__label">{h.label}</div>
                <div className="swa-health-item__row">
                  <div className="swa-health-item__dot" style={{ background: h.color }}/>
                  <div className="swa-health-item__bar" style={{ background: h.color + '33' }}>
                    <div className="swa-health-item__bar-fill" style={{ width: h.pct, background: h.color }}/>
                  </div>
                  <span className="swa-health-item__status" style={{ color: h.color }}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column: Activity + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* Recent Activity */}
        <div className="swa-card">
          <div className="swa-card__header">
            <span className="swa-card__title">Recent Activity</span>
            <button className="swa-btn-ghost">View All</button>
          </div>
          <div>
            {activity.map((a, i) => (
              <div key={i} className="swa-activity-item">
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
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Quick Actions + Promo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="swa-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 12 }}>QUICK ACTIONS</div>
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

          {/* Platform Status */}
          <div className="swa-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 12 }}>PLATFORM STATUS</div>
            {[
              { l: 'API Response', v: '98ms',  c: '#10b981' },
              { l: 'Uptime',      v: '99.9%', c: '#10b981' },
              { l: 'Active Users',v: '1,204', c: '#7c3aed' },
            ].map(s => (
              <div key={s.l} className="swa-platform-row">
                <span style={{ fontSize: 13, color: '#6b7280' }}>{s.l}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: s.c }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Promo Banner */}
          <div className="swa-promo">
            <div className="swa-promo__title">Unlock Advanced Analytics</div>
            <div className="swa-promo__body">Get real-time insights across all states and territories.</div>
            <button className="swa-promo__btn">Upgrade Plan</button>
          </div>
        </div>
      </div>
    </>
  );
}
