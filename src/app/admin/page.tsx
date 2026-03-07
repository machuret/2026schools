import { createClient } from '@/lib/supabase/server';

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
    { label: 'Issues', value: String(issueCount), sub: 'Wellbeing issues tracked', gradient: 'linear-gradient(135deg, #6366F1, #818CF8)' },
    { label: 'States', value: String(stateCount), sub: 'With priority data', gradient: 'linear-gradient(135deg, #22C55E, #4ADE80)' },
    { label: 'Areas', value: String(areaCount), sub: 'LGAs and regions', gradient: 'linear-gradient(135deg, #A855F7, #C084FC)' },
    { label: 'Pages', value: String(pageCount), sub: 'Custom CMS pages', gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)' },
  ];

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#FAFAFA', letterSpacing: '-0.025em' }}>
          Welcome back
        </h1>
        <p className="text-[15px]" style={{ color: '#71717A' }}>
          {userEmail ? `Signed in as ${userEmail}` : 'Manage content and data for Schools Wellbeing Australia.'}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: '#18181B', border: '1px solid #27272A' }}>
            <div className="text-3xl font-bold mb-2" style={{ color: '#FAFAFA' }}>{stat.value}</div>
            <div className="text-sm font-semibold mb-0.5" style={{ color: '#D4D4D8' }}>{stat.label}</div>
            <div className="text-xs" style={{ color: '#71717A' }}>{stat.sub}</div>
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-[40px]"
              style={{ background: stat.gradient }} />
          </div>
        ))}
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="rounded-2xl p-6" style={{ background: '#18181B', border: '1px solid #27272A' }}>
          <h2 className="text-base font-semibold mb-5" style={{ color: '#FAFAFA' }}>Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Manage Issues', href: '/admin/issues', desc: 'Edit wellbeing issue content', emoji: '⚠️' },
              { label: 'State Data', href: '/admin/states', desc: 'Update state-level statistics', emoji: '📊' },
              { label: 'Areas & Cities', href: '/admin/content', desc: 'Edit area reports and data', emoji: '📍' },
              { label: 'CMS Pages', href: '/admin/cms/pages', desc: 'Create and edit custom pages', emoji: '📄' },
            ].map((item) => (
              <a key={item.href} href={item.href}
                className="group flex items-center gap-4 px-4 py-3.5 rounded-xl"
                style={{ background: '#09090B', border: '1px solid #27272A' }}>
                <span className="text-lg">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold group-hover:text-indigo-300" style={{ color: '#FAFAFA' }}>{item.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#71717A' }}>{item.desc}</div>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#52525B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:translate-x-0.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="rounded-2xl p-6" style={{ background: '#18181B', border: '1px solid #27272A' }}>
          <h2 className="text-base font-semibold mb-5" style={{ color: '#FAFAFA' }}>System Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Supabase Database', status: 'Connected', ok: true },
              { label: 'Authentication', status: 'Active', ok: true },
              { label: 'AI Integration', status: 'Not configured', ok: false },
              { label: 'Vercel Deployment', status: 'Live', ok: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <span className="text-sm" style={{ color: '#A1A1AA' }}>{item.label}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{
                    background: item.ok ? '#052E1630' : '#450A0A30',
                    color: item.ok ? '#4ADE80' : '#FCA5A5',
                  }}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 text-sm" style={{ borderTop: '1px solid #27272A', color: '#52525B' }}>
            Configure an OpenAI API key to enable AI content generation.
          </div>
        </div>
      </div>
    </div>
  );
}
