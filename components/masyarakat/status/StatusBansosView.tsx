'use client';

import React, { useState } from 'react';
import {
  Bot,
} from 'lucide-react';
import NotificationBell from '@/components/layout/NotificationBell';
import { StatusBannerHero, VerificationStage } from './StatusBannerHero';
import { AlurPencatatanStepper } from './AlurPencatatanStepper';
import { UserProfile } from '@/lib/types';

interface StatusBansosViewProps {
  profile: UserProfile;
}

export function StatusBansosView({ profile }: StatusBansosViewProps) {
  const [currentStage] = useState<VerificationStage>('rw');

  const handleOpenAI = () => {
    window.dispatchEvent(new CustomEvent('open-bansos-ai'));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. TOP HEADER BANNER DENGAN GRADASI TRANSISI KE BAWAH */}
      <section className="-mx-4 -mt-4 sm:mx-0 sm:mt-0 p-5 sm:p-6 pt-5 pb-8 sm:rounded-3xl bg-gradient-to-b from-teal-800 via-teal-700 to-teal-500/10 text-white relative shadow-sm">
        {/* Soft background radial shine */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-white/10 to-transparent rounded-full pointer-events-none" />

        {/* Baris Atas: Sapaan Nama di Kiri & Notifikasi di Kanan (z-30 agar popover di atas elemen banner) */}
        <div className="flex items-center justify-between gap-3 relative z-30">
          {/* Greeting Text */}
          <div className="min-w-0 pr-2">
            <span className="text-xs text-teal-100 font-medium block leading-tight">
              Selamat Datang,
            </span>
            <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate mt-0.5">
              {profile.nama_lengkap}!
            </h1>
          </div>

          {/* Sisi Kanan: Notifikasi dengan Circle Transparan 100% Rounded */}
          <div className="flex items-center flex-shrink-0 relative z-40">
            <NotificationBell
              buttonClassName="w-10 h-10 rounded-full aspect-square bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/25 flex items-center justify-center transition shadow-xs cursor-pointer"
            />
          </div>
        </div>

        {/* 2. TOMBOL ASISTEN AI (Kompak, Secukupnya, Ikon Chatbot di Kiri, z-10) */}
        <div className="mt-4 relative z-10 flex items-center">
          <button
            type="button"
            onClick={handleOpenAI}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-xs hover:shadow transition-all duration-150 group cursor-pointer border border-white/80 active:scale-95 text-xs font-bold"
            aria-label="Buka AI Asisten"
          >
            <Bot className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span>AI Asisten</span>
          </button>
        </div>
      </section>

      {/* 2. ALUR PENGECEKAN BERJENJANG */}
      <section id="alur-verifikasi" className="space-y-4 pt-1">
        {/* Hero Card Status Pengajuan Terkini */}
        <div>
          <StatusBannerHero
            currentStage={currentStage}
            nomorPengajuan="PB-202609-0001"
            updatedAt="10 September 2026"
          />
        </div>

        {/* Stepper Detail 5 Tingkat Verifikasi Berjenjang */}
        <AlurPencatatanStepper currentStage={currentStage} />
      </section>
    </div>
  );
}
