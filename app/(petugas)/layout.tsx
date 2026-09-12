import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth/session';
import { isPetugas } from '@/lib/auth/roles';
import { PetugasSidebar } from '@/components/layout';
import { UserRole } from '@/lib/types';

export default async function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session.profile || !isPetugas(session.role)) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      <PetugasSidebar profile={session.profile} role={session.role as UserRole} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
