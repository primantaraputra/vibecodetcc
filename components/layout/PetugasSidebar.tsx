import Link from 'next/link';
import {
  ShieldCheck,
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  BarChart3,
  History,
  Map,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { LogoutButton } from './LogoutButton';
import { UserProfile, UserRole } from '@/lib/types';
import { getRoleLabel, getRoleBadgeStyle } from '@/lib/auth/roles';

interface PetugasSidebarProps {
  profile: UserProfile;
  role: UserRole;
}

export function PetugasSidebar({ profile, role }: PetugasSidebarProps) {
  const roleLabel = getRoleLabel(role);
  const badgeStyle = getRoleBadgeStyle(role);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/survei', label: 'Survei Warga', icon: ClipboardList },
    { href: '/approval', label: 'Inbox Approval', icon: CheckSquare },
    { href: '/analitik', label: 'Pelaporan & Analitik', icon: BarChart3 },
    { href: '/peta-transparansi', label: 'Peta Transparansi', icon: Map },
    { href: '/audit-log', label: 'Audit Log', icon: History },
  ];

  return (
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

      {/* User Info Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="text-xs font-semibold text-slate-900 truncate">
          {profile.nama_lengkap}
        </div>
        <div className="text-[11px] text-slate-500 truncate mb-1.5">{profile.email}</div>
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${badgeStyle}`}
        >
          {roleLabel}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              <Icon className="w-4 h-4 text-slate-500" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out Button */}
      <div className="p-3 border-t border-slate-100">
        <LogoutButton variant="sidebar" />
      </div>
    </aside>
  );
}
