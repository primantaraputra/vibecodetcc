'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  User,
  MessageSquarePlus,
  Search,
  Map,
  ClipboardCheck,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { LogoutButton } from './LogoutButton';
import { UserProfile } from '@/lib/types';

interface MasyarakatHeaderProps {
  profile: UserProfile;
}

export function MasyarakatHeader({ profile }: MasyarakatHeaderProps) {
  const pathname = usePathname();

  const tabs = [
    { href: '/status-bansos', label: 'Status Bansos', icon: ClipboardCheck },
    { href: '/profil', label: 'Profil Saya', icon: User },
    { href: '/sanggahan', label: 'Ajukan Sanggahan', icon: MessageSquarePlus },
    { href: '/cek-status', label: 'Cek Status NIK/KK', icon: Search },
    { href: '/peta-transparansi', label: 'Peta Transparansi Anggaran', icon: Map },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/status-bansos" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block leading-tight">Portal Warga</span>
              <span className="text-[10px] text-teal-600 font-semibold tracking-wider block">SI-BANSOS KECAMATAN</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{profile.nama_lengkap}</span>
              <span className="text-[10px] text-slate-500 font-mono">Warga Terverifikasi</span>
            </div>
            <LogoutButton variant="header" />
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 overflow-x-auto shadow-xs">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 sm:gap-3 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium transition border-b-2 ${
                  isActive
                    ? 'text-teal-700 border-teal-600 font-semibold bg-teal-50/50'
                    : 'text-slate-600 border-transparent hover:text-teal-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.href === '/status-bansos' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-0.5" title="Ada progres aktif" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
