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
  } catch { /* middleware ensures auth, this is just for display */ }

  const stats = [
    {
      label: 'Issues', value: issueCount, sub: 'Wellbeing issues tracked',
      href: '/admin/issues', stroke: '#4f46e5', fill: 'rgba(79,70,229,0.12)',
      path: 'M0 15 Q 10 5, 20 18 T 40 10 T 60 15 T 80 5 T 100 12',
      badge: '+2 this month', badgeOk: true,
    },
    {
      label: 'States', value: stateCount, sub: 'With priority data',
      href: '/admin/states', stroke: '#16a34a', fill: 'rgba(22,163,74,0.12)',
      path: 'M0 18 Q 20 15, 40 12 T 60 8 T 80 14 T 100 6',
      badge: 'All active', badgeOk: true,
    },
    {
      label: 'Areas', value: areaCount, sub: 'LGAs and regions',
      href: '/admin/content', stroke: '#7c3aed', fill: 'rgba(124,58,237,0.12)',
      path: 'M0 12 Q 20 18, 40 10 T 60 16 T 80 8 T 100 14',
      badge: 'Updated', badgeOk: true,
    },
    {
      label: 'Pages', value: pageCount, sub: 'Custom CMS pages',
      href: '/admin/cms/pages', stroke: '#d97706', fill: 'rgba(217,119,6,0.12)',
      path: 'M0 10 Q 15 18, 30 12 T 55 15 T 75 8 T 100 13',
      badge: 'Live', badgeOk: true,
    },
  ];

  const QUICK_ACTIONS = [
    { label: 'Manage Issues', href: '/admin/issues', desc: 'Edit wellbeing issue content',
      iconColor: '#4f46e5', iconBg: 'rgba(79,70,229,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
    { label: 'State Data', href: '/admin/states', desc: 'Update state-level statistics',
      iconColor: '#16a34a', iconBg: 'rgba(22,163,74,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { label: 'Areas & Cities', href: '/admin/content', desc: 'Edit area reports and data',
      iconColor: '#7c3aed', iconBg: 'rgba(124,58,237,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { label: 'CMS Pages', href: '/admin/cms/pages', desc: 'Create and edit custom pages',
      iconColor: '#d97706', iconBg: 'rgba(217,119,6,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: 'API Keys', href: '/admin/api', desc: 'Manage integration keys',
      iconColor: '#0891b2', iconBg: 'rgba(8,145,178,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg> },
    { label: 'Settings', href: '/admin/settings', desc: 'Configure system preferences',
      iconColor: '#64748b', iconBg: 'rgba(100,116,139,0.08)',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  const ACTIVITY = [
    { label: 'New issue published', desc: 'Mental Health issue went live', time: 'Today', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
    { label: 'State data updated', desc: 'Victoria statistics refreshed', time: 'Yesterday', color: '#16a34a', bg: 'rgba(22,163,74,0.08)',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
    { label: 'New area added', desc: 'Northern Beaches (NSW) created', time: '2 days ago', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/></svg> },
    { label: 'CMS page edited', desc: 'About page content updated', time: '3 days ago', color: '#d97706', bg: 'rgba(217,119,6,0.08)',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#0f172a', letterSpacing: '-0.025em' }}>Dashboard</h1>
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          {userEmail
            ? <>Welcome back, <span style={{ color: '#64748b', fontWeight: 500 }}>{userEmail.split('@')[0]}</span>. Here&apos;s what&apos;s happening.</>
            : 'Manage content and data for Schools Wellbeing Australia.'}
        </p>
      </div>

      {/* Stat cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div className="group rounded-xl p-5 transition-all cursor-pointer"
              style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>{stat.label}</p>
                  <p className="text-3xl font-bold" style={{ color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1 }}>{stat.value}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: stat.badgeOk ? '#dcfce7' : '#fee2e2', color: stat.badgeOk ? '#15803d' : '#b91c1c' }}>
                  {stat.badge}
                </span>
              </div>
              <div className="h-10 w-full mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`g-${stat.label}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: stat.fill, stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: stat.fill, stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path d={`${stat.path} V 20 H 0 Z`} fill={`url(#g-${stat.label})`} />
                  <path d={stat.path} fill="none" stroke={stat.stroke} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <p className="text-xs" style={{ color: '#94a3b8' }}>{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Main 2/3 + 1/3 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Quick Actions + System Status */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h2 className="text-base font-bold" style={{ color: '#0f172a' }}>Quick Actions</h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: '#f1f5f9', color: '#64748b' }}>
                {QUICK_ACTIONS.length} shortcuts
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((item) => (
                <a key={item.href} href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-xl transition-all"
                  style={{ border: '1px solid #f1f5f9' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: item.iconBg, color: item.iconColor }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: '#0f172a' }}>{item.label}</div>
                      <div className="text-[11px]" style={{ color: '#94a3b8' }}>{item.desc}</div>
                    </div>
                  </div>
                  <svg className="flex-shrink-0 transition-transform group-hover:translate-x-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
              <h2 className="text-base font-bold" style={{ color: '#0f172a' }}>System Status</h2>
              <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)' }} />
            </div>
            <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
              {[
                { label: 'Supabase Database', status: 'Connected', ok: true },
                { label: 'Authentication', status: 'Active', ok: true },
                { label: 'AI Integration', status: 'Not configured', ok: false },
                { label: 'Deployment', status: 'Live', ok: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: item.ok ? '#22c55e' : '#f59e0b' }} />
                    <span className="text-sm" style={{ color: '#475569' }}>{item.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={item.ok
                      ? { background: '#dcfce7', color: '#15803d' }
                      : { background: '#fef9c3', color: '#854d0e' }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 text-xs" style={{ borderTop: '1px solid #f1f5f9', color: '#94a3b8', background: '#fafafa' }}>
              Configure an OpenAI API key in{' '}
              <a href="/admin/settings" style={{ color: '#4f46e5', fontWeight: 500 }}>Settings</a>
              {' '}to enable AI content generation.
            </div>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <h2 className="text-base font-bold" style={{ color: '#0f172a' }}>Recent Activity</h2>
            <button className="text-xs font-medium" style={{ color: '#4f46e5' }}>View all</button>
          </div>
          <div className="divide-y" style={{ borderColor: '#f1f5f9' }}>
            {ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-slate-50">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold" style={{ color: '#0f172a' }}>{item.label}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#64748b' }}>{item.desc}</p>
                  <p className="text-[11px] mt-1.5" style={{ color: '#94a3b8' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Gradient upsell card */}
          <div className="m-4 rounded-xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 14px rgba(79,70,229,0.3)' }}>
            <div className="relative z-10">
              <p className="text-sm font-bold text-white mb-1">Content Tips</p>
              <p className="text-xs text-white/80 mb-3 leading-relaxed">Keep issue data up to date to improve site rankings and user trust.</p>
              <a href="/admin/issues"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                Go to Issues
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
            <svg className="absolute -bottom-3 -right-3 opacity-10" width="80" height="80" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" fill="none"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
