'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  User,
  MessageSquarePlus,
  Search,
  Map,
  Home,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { LogoutButton } from './LogoutButton';
import { UserProfile } from '@/lib/types';

interface MasyarakatHeaderProps {
  profile: UserProfile;
}

export function MasyarakatHeader({ profile }: MasyarakatHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    {
      href: '/beranda',
      label: 'Beranda',
      desc: 'Alur pengecekan & verifikasi bansos berjenjang',
      icon: Home,
    },
    {
      href: '/profil',
      label: 'Profil Saya',
      desc: 'Data kependudukan & riwayat bansos diterima',
      icon: User,
    },
    {
      href: '/sanggahan',
      label: 'Ajukan Sanggahan',
      desc: 'Layanan sanggahan transparan berbasis AI',
      icon: MessageSquarePlus,
    },
    {
      href: '/cek-status',
      label: 'Cek Status NIK/KK',
      desc: 'Pengecekan keterdaftaran NIK & KK terbuka',
      icon: Search,
    },
    {
      href: '/peta-transparansi',
      label: 'Peta Transparansi Anggaran',
      desc: 'Distribusi kuota & visualisasi anggaran bansos',
      icon: Map,
    },
  ];

  // Tutup menu otomatis saat rute berpindah
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle escape key dan lock scroll saat menu bawah terbuka
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/beranda" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm block leading-tight">Portal Warga</span>
              <span className="text-[10px] text-teal-600 font-semibold tracking-wider block">SI-BANSOS KECAMATAN</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tombol notifikasi tetap berada di pojok kanan atas sebelah kiri tombol menu */}
            <NotificationBell />

            {/* Desktop User Info */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{profile.nama_lengkap}</span>
              <span className="text-[10px] text-slate-500 font-mono">Warga Terverifikasi</span>
            </div>

            {/* Desktop Logout Button */}
            <div className="hidden sm:block">
              <LogoutButton variant="header" />
            </div>

            {/* Mobile Menu Button: Tepat di posisi tombol logout untuk ukuran layar mobile */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="sm:hidden p-2 rounded-lg text-slate-700 hover:text-teal-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
              aria-label={isMenuOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-4 h-4 text-slate-700" /> : <Menu className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar - Tampil hanya di desktop (sm ke atas) */}
      <div className="hidden sm:block bg-white border-b border-slate-200 overflow-x-auto shadow-xs">
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
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Bottom Navigation Sheet: Muncul dari bawah halaman saat tombol menu diklik */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 sm:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Bottom Sheet Drawer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 sm:hidden flex flex-col max-h-[85vh] transition-transform duration-300 ease-out transform ${
          isMenuOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigasi Menu Warga"
      >
        {/* Drag Handle Bar */}
        <div
          className="pt-3 pb-1 flex justify-center cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">Navigasi Portal Warga</span>
              <span className="text-[10px] text-slate-500">Pilih menu layanan di bawah</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Akun Warga */}
        <div className="px-5 pt-3 pb-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {profile.nama_lengkap ? profile.nama_lengkap.charAt(0).toUpperCase() : 'W'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{profile.nama_lengkap}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{profile.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-100 text-teal-800 flex-shrink-0">
              Warga
            </span>
          </div>
        </div>

        {/* Daftar Navigasi Tab-Tab */}
        <div className="px-5 py-2 overflow-y-auto flex-1 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 py-1">
            Menu Utama
          </span>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-teal-50 border border-teal-200 text-teal-800'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs ${isActive ? 'font-bold text-teal-900' : 'font-semibold text-slate-800'}`}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{tab.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-300'}`} />
              </Link>
            );
          })}
        </div>

        {/* Bagian Bawah: Tombol Logout Mobile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl">
          <LogoutButton
            variant="sidebar"
            className="w-full justify-center bg-white border border-red-200 shadow-xs py-2 rounded-xl text-xs font-semibold"
          />
        </div>
      </div>
    </>
  );
}

