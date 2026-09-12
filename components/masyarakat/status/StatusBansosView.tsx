'use client';

import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { StatusBannerHero, VerificationStage } from './StatusBannerHero';
import { AlurPencatatanStepper } from './AlurPencatatanStepper';
import { UserProfile } from '@/lib/types';

interface StatusBansosViewProps {
  profile: UserProfile;
}

export function StatusBansosView({ profile }: StatusBansosViewProps) {
  // Default stage is 'rw' as explicitly requested by user:
  // "misal ni RT datang ke rumah dan mendata dan RW harus melakukan verifikasi. maka status benner nya itu berada di kondisi Menuggnu Verifikasi RW dan seterusnya"
  const [currentStage, setCurrentStage] = useState<VerificationStage>('rw');
  const [isSimulating, setIsSimulating] = useState(false);

  // Stage simulation list
  const simulationOptions: { stage: VerificationStage; label: string; badge: string }[] = [
    { stage: 'rt', label: '1. Pengecekan RT', badge: 'Pengecekan RT' },
    { stage: 'rw', label: '2. Pengecekan RW (Kondisi Saat Ini)', badge: 'Aktif: Menunggu RW' },
    { stage: 'kelurahan', label: '3. Pengecekan Kelurahan', badge: 'Pengecekan Kelurahan' },
    { stage: 'kecamatan', label: '4. Pengecekan Kecamatan', badge: 'Pengecekan Kecamatan' },
    { stage: 'tersalurkan', label: '5. Penetapan Petugas Pusat (Selesai)', badge: 'Ditetapkan Pusat' },
  ];

  const handleStageChange = (stage: VerificationStage) => {
    setIsSimulating(true);
    setCurrentStage(stage);
    setTimeout(() => setIsSimulating(false), 300);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner Simulasi Alur Proses (Demo Status) */}
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

      {/* 1. Main Hero Banner (Focus of User Requirement) */}
      <div className={isSimulating ? 'opacity-50 transition-opacity duration-200' : 'transition-opacity duration-200'}>
        <StatusBannerHero
          currentStage={currentStage}
          nomorPengajuan="PB-202609-0001"
          updatedAt="10 September 2026"
        />
      </div>

      {/* 2. 4-Tier Verification Process Stepper */}
      <AlurPencatatanStepper currentStage={currentStage} />
    </div>
  );
}
