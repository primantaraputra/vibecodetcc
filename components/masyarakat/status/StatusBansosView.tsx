'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Menu,
  ShieldCheck,
  ChevronRight,
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
  const [currentStage, setCurrentStage] = useState<VerificationStage>('rw');
  const [isSimulating, setIsSimulating] = useState(false);

  // Extract first name for warm friendly greeting
  const firstName = profile?.nama_lengkap
    ? profile.nama_lengkap.split(' ')[0]
    : 'Warga';

  const simulationOptions: { stage: VerificationStage; label: string }[] = [
    { stage: 'rt', label: '1. Pengecekan RT' },
    { stage: 'rw', label: '2. Pengecekan RW (Kondisi Saat Ini)' },
    { stage: 'kelurahan', label: '3. Pengecekan Kelurahan' },
    { stage: 'kecamatan', label: '4. Pengecekan Kecamatan' },
    { stage: 'tersalurkan', label: '5. Penetapan Petugas Pusat' },
  ];

  const handleStageChange = (stage: VerificationStage) => {
    setIsSimulating(true);
    setCurrentStage(stage);
    setTimeout(() => setIsSimulating(false), 250);
  };

  const handleOpenAI = () => {
    window.dispatchEvent(new CustomEvent('open-bansos-ai'));
  };

  const handleOpenMenu = () => {
    window.dispatchEvent(new CustomEvent('open-mobile-menu'));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* 1. HERO GREETING & GRADIENT TRANSPARENT BANNER */}
      <section className="bg-gradient-to-b from-teal-100/70 via-emerald-50/40 to-transparent border border-teal-100/80 rounded-3xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Soft decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-teal-200/30 to-transparent rounded-full pointer-events-none" />

        {/* Baris Tombol Menu & Notifikasi Mobile (Hanya muncul di mobile) */}
        <div className="flex sm:hidden items-center justify-between gap-2 pb-3 mb-3 border-b border-teal-100/60 relative z-10">
          <button
            type="button"
            onClick={handleOpenMenu}
            className="p-2 rounded-xl text-slate-700 hover:text-teal-700 hover:bg-white/80 border border-slate-200/80 bg-white/70 backdrop-blur-xs transition flex items-center justify-center cursor-pointer shadow-2xs"
            aria-label="Buka Menu Navigasi"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 text-xs tracking-tight">Portal Warga</span>
          </div>

          <div className="p-0.5">
            <NotificationBell />
          </div>
        </div>

        {/* Content Sapaan & Avatar Petugas */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div className="space-y-1.5 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
              <span>Halo, {firstName}</span>
              <span className="text-amber-500 text-base">👋</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Bagaimana kami dapat membantu Anda hari ini?
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block pt-0.5">
              Pantau status pengecekan bantuan sosial berjenjang secara transparan dan akuntabel.
            </p>
          </div>

          {/* Petugas Layanan Bansos Illustration */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-teal-600/10 via-emerald-500/10 to-teal-100 p-1 shadow-xs overflow-hidden border border-teal-200/60 bg-white/60 backdrop-blur-xs">
              <img
                src="/images/petugas_layanan_bansos.jpg"
                alt="Petugas Layanan Bansos"
                className="w-full h-full object-cover object-top rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Tombol Asisten AI (Menggantikan Fitur Search) */}
        <div className="mt-4 pt-1 relative z-10">
          <button
            type="button"
            onClick={handleOpenAI}
            className="w-full p-3 sm:p-3.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white rounded-2xl shadow-md shadow-teal-700/15 flex items-center justify-between transition-all duration-300 group cursor-pointer border border-teal-500/30 active:scale-[0.99]"
            aria-label="Tanya Asisten AI Bansos"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm font-bold block leading-tight flex items-center gap-1.5">
                  <span>Tanya Asisten AI Bansos</span>
                  <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-300/30">
                    Aktif
                  </span>
                </span>
                <span className="text-[11px] text-teal-100/90 block leading-tight mt-0.5">
                  Konsultasi syarat, kelayakan desil, & status pencairan bansos
                </span>
              </div>
            </div>

            <div className="hidden xs:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-teal-800 text-xs font-bold shadow-2xs group-hover:bg-teal-50 transition flex-shrink-0">
              <Bot className="w-3.5 h-3.5" />
              <span>Tanya AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* 2. ALUR PENGECEKAN BERJENJANG & SIMULASI STATUS */}
      <section id="alur-verifikasi" className="space-y-4 pt-1">
        {/* Banner Simulasi Alur Proses */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Sliders className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Simulasi Alur Proses (Coba Kondisi):</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {simulationOptions.map((opt) => (
              <button
                key={opt.stage}
                type="button"
                onClick={() => handleStageChange(opt.stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                  currentStage === opt.stage
                    ? 'bg-teal-600 text-white shadow-xs font-semibold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Card Status Pengajuan Terkini */}
        <div className={isSimulating ? 'opacity-50 transition-opacity duration-200' : 'transition-opacity duration-200'}>
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
