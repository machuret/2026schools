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
      style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>

      {/* Left: breadcrumbs or search */}
      <div className="flex-1 flex items-center gap-4 min-w-0">
        {showBreadcrumbs ? (
          <nav className="flex items-center gap-1.5 min-w-0" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                  {i > 0 && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                  {isLast ? (
                    <span className="text-sm font-semibold truncate" style={{ color: '#0f172a' }}>{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-sm flex-shrink-0 transition-colors hover:text-slate-700" style={{ color: '#94a3b8' }}>
                      {crumb.label}
                    </Link>
                  )}
                </span>
              );
            })}
          </nav>
        ) : (
          <div className="relative max-w-sm w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search pages, issues, areas…"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-all"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.1)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-6">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          style={{ color: '#64748b', border: '1px solid #e2e8f0', background: '#fff' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View site
        </a>
        <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 4px' }} />
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: '#fff' }}>
          {(email || 'A')[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
