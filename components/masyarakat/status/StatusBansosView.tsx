'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
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

  // Stage simulation list
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

  const userInitial = profile?.nama_lengkap
    ? profile.nama_lengkap.charAt(0).toUpperCase()
    : 'W';

  return (
    <div className="space-y-6 pb-8">
      {/* 1. TOP HEADER BANNER DENGAN GRADASI TRANSISI KE BAWAH */}
      <section className="-mx-4 -mt-4 sm:mx-0 sm:mt-0 p-5 sm:p-6 pt-5 pb-8 sm:rounded-3xl bg-gradient-to-b from-teal-800 via-teal-700 to-teal-500/10 text-white relative shadow-sm overflow-hidden">
        {/* Soft background radial shine */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-white/10 to-transparent rounded-full pointer-events-none" />

        {/* Baris Atas: Sapaan Nama di Kiri & Profil / Notifikasi / Menu di Kanan */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          {/* Greeting Text */}
          <div className="min-w-0 pr-2">
            <span className="text-xs text-teal-100 font-medium block leading-tight">
              Selamat Datang,
            </span>
            <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate mt-0.5">
              {profile.nama_lengkap}!
            </h1>
          </div>

          {/* Sisi Kanan: Hanya Notifikasi dengan Circle Transparan */}
          <div className="flex items-center flex-shrink-0">
            <NotificationBell
              buttonClassName="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-xs border border-white/25 flex items-center justify-center transition shadow-xs cursor-pointer"
            />
          </div>
        </div>

        {/* 2. TOMBOL ASISTEN AI (Bilah Putih Mengambang di atas Gradasi) */}
        <div className="mt-5 relative z-10">
          <button
            type="button"
            onClick={handleOpenAI}
            className="w-full p-2.5 sm:p-3 px-4 bg-white hover:bg-slate-50 text-slate-800 rounded-full shadow-lg shadow-teal-950/15 flex items-center justify-between transition-all duration-200 group cursor-pointer border border-white/80 active:scale-[0.99]"
            aria-label="Tanya Asisten AI Bansos"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight truncate">
                  Tanya Asisten AI Bansos...
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight truncate hidden xs:block">
                  Cek kriteria, status desil, & info bansos seketika
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-teal-600 text-white text-[11px] font-bold shadow-xs group-hover:bg-teal-700 transition flex-shrink-0 ml-2">
              <Bot className="w-3.5 h-3.5" />
              <span>Tanya AI</span>
            </div>
          </button>
        </div>
      </section>

      {/* 3. ALUR PENGECEKAN BERJENJANG & SIMULASI STATUS */}
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
