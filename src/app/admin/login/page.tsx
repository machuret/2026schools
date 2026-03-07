'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
      <div className="w-full max-w-sm px-6">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
              <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#FAFAFA', letterSpacing: '-0.025em' }}>
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: '#71717A' }}>Sign in to the SWA admin dashboard</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl p-8" style={{ background: '#18181B', border: '1px solid #27272A' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#D4D4D8' }}>
                Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required autoComplete="email" placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-[15px] outline-none"
                style={{ background: '#09090B', border: '1px solid #3F3F46', color: '#FAFAFA' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px #6366F120'; }}
                onBlur={(e) => { e.target.style.borderColor = '#3F3F46'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#D4D4D8' }}>
                Password
              </label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="current-password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-[15px] outline-none"
                style={{ background: '#09090B', border: '1px solid #3F3F46', color: '#FAFAFA' }}
                onFocus={(e) => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px #6366F120'; }}
                onBlur={(e) => { e.target.style.borderColor = '#3F3F46'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: '#450A0A30', border: '1px solid #7F1D1D50', color: '#FCA5A5' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-[15px] font-semibold"
              style={{
                background: loading ? '#3F3F46' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                color: '#fff',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-xs" style={{ color: '#52525B' }}>
          Schools Wellbeing Australia · Admin Portal
        </p>
      </div>
    </div>
  );
}
