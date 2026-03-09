import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import './admin.css';
import './swa-design.css';

export const metadata = {
  title: 'Admin — Schools Wellbeing Australia',
};

export function generateStaticParams() { return []; }

const MATERIAL_SYMBOLS_URL =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
const DM_SANS_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  const fonts = (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={DM_SANS_URL} />
      <link rel="stylesheet" href={MATERIAL_SYMBOLS_URL} />
    </>
  );

  // Login page renders standalone
  if (pathname === '/admin/login') {
    return <div className="admin-shell">{fonts}{children}</div>;
  }

  let email = '';
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? '';
  } catch {
    // Supabase unavailable — still render the shell
  }

  return (
    <div className="admin-shell swa-root">
      {fonts}
      <AdminSidebar userEmail={email} />
      <div className="swa-main-area no-right-panel">
        <main className="swa-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
