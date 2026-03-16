import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const SECTION: React.CSSProperties = { marginBottom: 28 };
const LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: 'var(--color-text-faint)', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 14 };
const ROW: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' };
const ROW_LAST: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' };
const KEY: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' };
const VAL: React.CSSProperties = { fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'monospace' };

export default async function AdminSettingsPage() {
  let apiKeyCount = 0;
  let promptCount = 0;
  let userCount   = 0;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '—';
  const openaiSet   = !!(process.env.OPENAI_API_KEY);
  const serviceSet  = !!(process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const sb = await createClient();
    const [keys, prompts] = await Promise.all([
      sb.from('api_keys').select('id', { count: 'exact', head: true }),
      sb.from('prompt_templates').select('id', { count: 'exact', head: true }),
    ]);
    apiKeyCount  = keys.count    ?? 0;
    promptCount  = prompts.count ?? 0;
  } catch { /* env vars may be missing at build time */ }

  const badge = (ok: boolean, yes = 'Set', no = 'Missing') => (
    <span className={`swa-badge ${ok ? 'swa-badge--success' : 'swa-badge--error'}`}
      style={!ok ? { background: '#FEF2F2', color: '#DC2626' } : {}}>
      {ok ? yes : no}
    </span>
  );

  return (
    <div>
      <div className="swa-page-header">
        <div>
          <h1 className="swa-page-title">Settings</h1>
          <p className="swa-page-subtitle">Site configuration, environment status and integrations</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Environment */}
        <div className="swa-card">
          <div style={SECTION}>
            <div style={LABEL}>Environment Variables</div>
            <div style={ROW}>
              <span style={KEY}>NEXT_PUBLIC_SUPABASE_URL</span>
              <span style={{ ...VAL, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={supabaseUrl}>
                {supabaseUrl.replace('https://', '').split('.')[0]}…
              </span>
            </div>
            <div style={ROW}>
              <span style={KEY}>SUPABASE_SERVICE_ROLE_KEY</span>
              {badge(serviceSet)}
            </div>
            <div style={ROW}>
              <span style={KEY}>OPENAI_API_KEY</span>
              {badge(openaiSet)}
            </div>
            <div style={ROW_LAST}>
              <span style={KEY}>NODE_ENV</span>
              <span style={VAL}>{process.env.NODE_ENV ?? '—'}</span>
            </div>
          </div>
          {!openaiSet && (
            <div className="swa-alert swa-alert--warning" style={{ fontSize: 12 }}>
              <strong>OPENAI_API_KEY</strong> is not set — AI content generation and SEO mass-generate will not work.
              Add it in your <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>Vercel environment variables</a>.
            </div>
          )}
        </div>

        {/* Integrations */}
        <div className="swa-card">
          <div style={LABEL}>Integrations & Data</div>
          <div style={ROW}>
            <div>
              <div style={KEY}>API Keys</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>Stored in Supabase api_keys table</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{apiKeyCount}</span>
              <Link href="/admin/api" className="swa-btn swa-btn--ghost" style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}>Manage →</Link>
            </div>
          </div>
          <div style={ROW}>
            <div>
              <div style={KEY}>AI Prompt Templates</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>State & area generation prompts</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{promptCount}</span>
              <Link href="/admin/prompts" className="swa-btn swa-btn--ghost" style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}>Manage →</Link>
            </div>
          </div>
          <div style={ROW_LAST}>
            <div>
              <div style={KEY}>User Management</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 2 }}>Admin accounts via Supabase Auth</div>
            </div>
            <Link href="/admin/users" className="swa-btn swa-btn--ghost" style={{ fontSize: 12, padding: '4px 10px', textDecoration: 'none' }}>Manage →</Link>
          </div>
        </div>

        {/* Quick links */}
        <div className="swa-card">
          <div style={LABEL}>Site Links</div>
          {[
            { label: 'Homepage',        href: '/',             ms: 'home' },
            { label: 'Events listing',  href: '/events',       ms: 'event' },
            { label: 'FAQ page',        href: '/faq',          ms: 'help' },
            { label: 'Partners page',   href: '/partners',     ms: 'handshake' },
            { label: 'Sitemap.xml',     href: '/sitemap.xml',  ms: 'map' },
            { label: 'Robots.txt',      href: '/robots.txt',   ms: 'smart_toy' },
          ].map(l => (
            <div key={l.href} style={ROW}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-text-faint)' }}>{l.ms}</span>
                <span style={KEY}>{l.label}</span>
              </div>
              <a href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Open ↗
              </a>
            </div>
          ))}
        </div>

        {/* Build info */}
        <div className="swa-card">
          <div style={LABEL}>Build Information</div>
          <div style={ROW}>
            <span style={KEY}>Framework</span>
            <span style={VAL}>Next.js (App Router)</span>
          </div>
          <div style={ROW}>
            <span style={KEY}>Database</span>
            <span style={VAL}>Supabase (PostgreSQL)</span>
          </div>
          <div style={ROW}>
            <span style={KEY}>Hosting</span>
            <span style={VAL}>Vercel</span>
          </div>
          <div style={ROW}>
            <span style={KEY}>Auth</span>
            <span style={VAL}>Supabase Auth</span>
          </div>
          <div style={ROW_LAST}>
            <span style={KEY}>AI</span>
            <span style={VAL}>OpenAI GPT-4o-mini</span>
          </div>
        </div>

      </div>
    </div>
  );
}
