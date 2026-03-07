"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const LABELS: Record<string, string> = {
  admin:     "Dashboard",
  issues:    "Issues",
  states:    "States",
  content:   "Areas",
  cms:       "CMS",
  pages:     "Pages",
  menu:      "Menu",
  redirects: "Redirects",
  users:     "Users",
  api:       "API Keys",
  settings:  "Settings",
  vault:     "Vault",
  sources:   "Sources",
  new:       "New",
};

export default function AdminTopbar({ email }: { email: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isId = /^[0-9a-f-]{8,}$/i.test(seg) || /^\d+$/.test(seg);
    const label = isId ? "Edit" : (LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1));
    return { label, href };
  });

  const showBreadcrumbs = crumbs.length > 1;

  return (
    <header className="h-16 flex items-center justify-between px-8 flex-shrink-0 sticky top-0 z-10"
      style={{ background: '#fff', borderBottom: '1px solid var(--admin-border)' }}>

      {/* Left: search (dashboard) or breadcrumbs (inner pages) */}
      <div className="flex-1 max-w-xl">
        {showBreadcrumbs ? (
          <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--admin-border-strong)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                  {isLast ? (
                    <span className="text-sm font-semibold" style={{ color: 'var(--admin-text-primary)' }}>{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-sm font-medium flex-shrink-0 transition-colors"
                      style={{ color: 'var(--admin-text-faint)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--admin-text-muted)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--admin-text-faint)')}>
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        ) : (
          /* Reference-style search — bg-slate-100, search icon turns purple on focus */
          <div className="relative group">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: 'var(--admin-text-faint)' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search resources, issues, areas…"
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
              style={{ background: 'var(--admin-bg-elevated)', border: 'none', color: 'var(--admin-text-primary)' }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--admin-accent)';
                (e.currentTarget.previousElementSibling as SVGElement | null)?.style.setProperty('color', 'var(--admin-accent)');
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = 'none';
                (e.currentTarget.previousElementSibling as SVGElement | null)?.style.setProperty('color', 'var(--admin-text-faint)');
              }}
            />
          </div>
        )}
      </div>

      {/* Right actions — reference pattern */}
      <div className="flex items-center gap-2 ml-8">
        {/* Notification bell with red dot */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg relative transition-colors"
          style={{ color: 'var(--admin-text-subtle)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-bg-elevated)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white" style={{ background: '#ef4444' }} />
        </button>

        {/* View site */}
        <button className="w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: 'var(--admin-text-subtle)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--admin-bg-elevated)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          onClick={() => window.open('/', '_blank')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>

        {/* Divider */}
        <div className="h-6 w-px mx-1" style={{ background: 'var(--admin-border)' }} />

        {/* New content CTA — reference purple button */}
        <Link href="/admin/cms/pages/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: 'var(--admin-accent)', color: '#fff' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Page
        </Link>
      </div>
    </header>
  );
}
