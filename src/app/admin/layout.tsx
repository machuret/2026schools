import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import './admin.css';

export const metadata = {
  title: 'Admin — Schools Wellbeing Australia',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read x-pathname set by middleware to detect login page
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  // Login page renders standalone — no sidebar, no header
  if (pathname === '/admin/login') {
    return <div className="admin-shell">{children}</div>;
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
    <div className="admin-shell min-h-screen flex" style={{ background: 'var(--admin-bg-page)' }}>
      <AdminSidebar userEmail={email} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar email={email} />
        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
