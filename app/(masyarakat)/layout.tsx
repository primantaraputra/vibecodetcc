import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth/session';
import { MasyarakatHeader, MasyarakatBottomNav } from '@/components/layout';

export default async function MasyarakatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session.profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <MasyarakatHeader profile={session.profile} />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-20 sm:pb-6">{children}</main>
      <MasyarakatBottomNav />
    </div>
  );
}

