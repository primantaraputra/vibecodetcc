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
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:hidden"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/beranda' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 transition-all relative select-none ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-2xs'
                    : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-teal-800' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 bg-teal-600 rounded-full absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
