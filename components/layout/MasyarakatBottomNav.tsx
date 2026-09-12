'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, MessageSquarePlus, User } from 'lucide-react';

export function MasyarakatBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/beranda',
      label: 'Beranda',
      icon: Home,
    },
    {
      href: '/cek-status',
      label: 'Cek Status',
      icon: Search,
    },
    {
      href: '/sanggahan',
      label: 'Sanggahan',
      icon: MessageSquarePlus,
    },
    {
      href: '/profil',
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="fixed bottom-4 inset-x-4 z-40 max-w-sm mx-auto bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl shadow-slate-900/15 rounded-full sm:hidden p-1.5 ring-1 ring-black/5"
    >
      <div className="grid grid-cols-4 items-center h-12">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/beranda' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 select-none ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`w-8 h-6 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-teal-100/80 text-teal-800 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-teal-800' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
