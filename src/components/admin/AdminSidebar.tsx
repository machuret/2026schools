'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SECTIONS = [
  {
    title: null,
    items: [
      { label: 'Dashboard', href: '/admin', ms: 'dashboard' },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Issues',     href: '/admin/issues',        ms: 'warning' },
      { label: 'States',     href: '/admin/states',        ms: 'analytics' },
      { label: 'Areas',      href: '/admin/content',       ms: 'location_on' },
    ],
  },
  {
    title: 'CMS',
    items: [
      { label: 'Overview',   href: '/admin/cms',           ms: 'public' },
      { label: 'Pages',      href: '/admin/cms/pages',     ms: 'article' },
      { label: 'Navigation', href: '/admin/cms/menu',      ms: 'menu' },
      { label: 'Redirects',  href: '/admin/cms/redirects', ms: 'alt_route' },
    ],
  },
  {
    title: 'AI',
    items: [
      { label: 'Prompts',    href: '/admin/prompts',       ms: 'prompt_suggestion' },
      { label: 'Vault',      href: '/admin/vault/sources', ms: 'lock' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Users',      href: '/admin/users',         ms: 'group' },
      { label: 'API Keys',   href: '/admin/api',           ms: 'key' },
      { label: 'Settings',   href: '/admin/settings',      ms: 'settings' },
    ],
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="swa-sidebar">
      {/* Brand */}
      <div className="swa-sidebar__logo">
        <div className="swa-sidebar__logo-icon">S</div>
        <div>
          <div className="swa-sidebar__logo-title">SWA Admin</div>
          <div className="swa-sidebar__logo-sub">Schools Wellbeing AU</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="swa-sidebar__nav" aria-label="Admin navigation">
        {SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {section.title && (
              <div className="swa-sidebar__section-label">{section.title}</div>
            )}
            {section.items.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`swa-sidebar__nav-item${isActive ? ' active' : ''}`}
                >
                  <span aria-hidden="true" className="material-symbols-outlined">{item.ms}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="swa-sidebar__footer">
        <div className="swa-sidebar__user">
          <div className="swa-sidebar__avatar">
            {(userEmail || 'A')[0].toUpperCase()}
          </div>
          <div>
            <div className="swa-sidebar__user-name">{userEmail ? userEmail.split('@')[0] : 'Admin'}</div>
            <div className="swa-sidebar__user-role">Admin Account</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Sign out"
          className="swa-sidebar__logout"
        >
          <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: 15 }}>logout</span>
        </button>
      </div>
    </aside>
  );
}
