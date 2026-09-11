import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth/session';
import { logoutUser } from '@/lib/actions/auth';
import Link from 'next/link';
import { ShieldCheck, User, MessageSquarePlus, LogOut, ArrowLeft, Search, Map } from 'lucide-react';
import NotificationBell from '@/components/layout/NotificationBell';

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
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-slate-500 hover:text-slate-800 p-1" title="Ke Beranda">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Portal Warga</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <span className="text-xs text-slate-600 hidden sm:inline">
              {session.profile.nama_lengkap}
            </span>
            <form action={logoutUser}>
              <button
                type="submit"
                className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4 flex gap-4 min-w-max">
          <Link
            href="/profil"
            className="flex items-center gap-1.5 py-3 text-xs font-semibold text-teal-700 border-b-2 border-teal-600"
          >
            <User className="w-4 h-4" />
            <span>Profil & Status Bansos</span>
          </Link>
          <Link
            href="/sanggahan"
            className="flex items-center gap-1.5 py-3 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Ajukan Sanggahan</span>
          </Link>
          <Link
            href="/cek-status"
            className="flex items-center gap-1.5 py-3 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <Search className="w-4 h-4" />
            <span>Cek Status NIK/KK</span>
          </Link>
          <Link
            href="/peta-transparansi"
            className="flex items-center gap-1.5 py-3 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            <Map className="w-4 h-4" />
            <span>Peta Transparansi Anggaran</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
}
