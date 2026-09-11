import { redirect } from 'next/navigation';
import { getCurrentUserSession } from '@/lib/auth/session';
import { isPetugas, getRoleLabel, getRoleBadgeStyle } from '@/lib/auth/roles';
import { logoutUser } from '@/lib/actions/auth';
import Link from 'next/link';
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  BarChart3,
  History,
  LogOut,
  Map,
} from 'lucide-react';
import NotificationBell from '@/components/layout/NotificationBell';

export default async function PetugasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUserSession();

  if (!session.profile || !isPetugas(session.role)) {
    redirect('/login');
  }

  const roleLabel = getRoleLabel(session.role);
  const badgeStyle = getRoleBadgeStyle(session.role);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block leading-tight">
                SI-BANSOS
              </span>
              <span className="text-[10px] text-slate-500 font-medium">PORTAL PETUGAS</span>
            </div>
          </div>
          <NotificationBell />
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="text-xs font-semibold text-slate-900 truncate">
            {session.profile.nama_lengkap}
          </div>
          <div className="text-[11px] text-slate-500 truncate mb-1.5">{session.profile.email}</div>
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${badgeStyle}`}
          >
            {roleLabel}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/survei"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <ClipboardList className="w-4 h-4 text-slate-500" />
            <span>Survei Warga</span>
          </Link>
          <Link
            href="/approval"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <CheckSquare className="w-4 h-4 text-slate-500" />
            <span>Inbox Approval</span>
          </Link>
          <Link
            href="/analitik"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Pelaporan & Analitik</span>
          </Link>
          <Link
            href="/peta-transparansi"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <Map className="w-4 h-4 text-slate-500" />
            <span>Peta Transparansi</span>
          </Link>
          <Link
            href="/audit-log"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>Audit Log</span>
          </Link>
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-slate-100">
          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
