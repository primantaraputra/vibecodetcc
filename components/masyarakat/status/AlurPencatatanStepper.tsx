'use client';

import React from 'react';
import { VerificationStage } from './StatusBannerHero';

interface AlurPencatatanStepperProps {
  currentStage: VerificationStage;
}

export function AlurPencatatanStepper({ currentStage }: AlurPencatatanStepperProps) {
  // Mapping stage status
  const getStepState = (stepKey: 'rt' | 'rw' | 'kelurahan' | 'kecamatan' | 'tersalurkan') => {
    const stageOrder: VerificationStage[] = ['rt', 'rw', 'kelurahan', 'kecamatan', 'tersalurkan'];
    const currentIndex = stageOrder.indexOf(currentStage);
    const stepIndex = stageOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const steps = [
    {
      key: 'rt' as const,
      number: 1,
      tier: 'Tahap 1: Pengecekan RT',
      pic: 'Ahmad Subarjo',
      action: 'Pengecekan & Pendataan Lapangan',
      completedDate: '04 September 2026, 09:30 WIB',
      notes:
        'Pengecekan langsung ke rumah warga telah selesai. Pengambilan foto fisik rumah, data keluarga, dan verifikasi geolokasi.',
    },
    {
      key: 'rw' as const,
      number: 2,
      tier: 'Tahap 2: Pengecekan RW',
      pic: 'Drs. Bambang Wijaya',
      action: 'Pengecekan & Musyawarah Lingkungan',
      completedDate: '14 September 2026, 11:20 WIB',
      notes:
        'Pengecekan dan musyawarah kewajaran data usulan dari seluruh RT guna memastikan bantuan tepat sasaran dan bebas data ganda.',
    },
    {
      key: 'kelurahan' as const,
      number: 3,
      tier: 'Tahap 3: Pengecekan Kelurahan',
      pic: 'Hj. Ratna Sari, S.Sos',
      action: 'Pengecekan Administratif & Validasi DTKS',
      completedDate: '18 September 2026, 14:00 WIB',
      notes:
        'Pengecekan data kependudukan terhadap basis data DTKS Kementerian Sosial dan penyusunan berita acara kelurahan.',
    },
    {
      key: 'kecamatan' as const,
      number: 4,
      tier: 'Tahap 4: Pengecekan Kecamatan',
      pic: 'Drs. H. Mulyadi',
      action: 'Pengecekan & Rekapitulasi Tingkat Kecamatan',
      completedDate: '22 September 2026, 10:30 WIB',
      notes:
        'Pemeriksaan dan rekapitulasi data usulan se-kecamatan sebelum diteruskan ke Petugas Pusat/Admin untuk penetapan resmi.',
    },
    {
      key: 'tersalurkan' as const,
      number: 5,
      tier: 'Tahap Akhir: Petugas Pusat / Admin',
      pic: 'Petugas Pusat / Admin',
      action: 'Penetapan Resmi Penerima Bansos',
      completedDate: '25 September 2026, 14:00 WIB',
      notes:
        'Penetapan Surat Keputusan (SK) resmi penerima bansos oleh Petugas Pusat/Admin dan alokasi penyaluran dana bantuan.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header Sederhana Tanpa Ikon Berlebih (Font 14px - 12px) */}
      <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Alur Pengecekan Berjenjang & Penetapan Bansos
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengecekan data oleh RT, RW, Kelurahan, Kecamatan, dan penetapan resmi penerima oleh Petugas Pusat/Admin.
          </p>
        </div>
        <span className="text-xs text-slate-500 font-medium self-start sm:self-auto">
          Pengecekan & Penetapan Pusat
        </span>
      </div>

      {/* List Tahapan Bersih & Sederhana */}
      <div className="space-y-3">
        {steps.map((step) => {
          const state = getStepState(step.key);

          return (
            <div
              key={step.key}
              className={`rounded-xl border p-4 transition-all duration-200 ${
                state === 'completed'
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : state === 'current'
                  ? 'bg-amber-50/40 border-amber-300'
                  : 'bg-slate-50/40 border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Info Utama */}
                <div className="flex items-start gap-3">
                  {/* Nomor Langkah Sederhana */}
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      state === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : state === 'current'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step.number}
                  </span>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {step.tier}
                      </span>

                      {state === 'completed' && (
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                          Selesai Diverifikasi
                        </span>
                      )}
                      {state === 'current' && (
                        <span className="text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          Sedang Diverifikasi
                        </span>
                      )}
                      {state === 'upcoming' && (
                        <span className="text-[11px] text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                          Menunggu Giliran
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {step.action}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {step.notes}
                    </p>
                  </div>
                </div>

                {/* Info Penanggung Jawab & Waktu */}
                <div className="sm:text-right text-xs space-y-0.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 pl-10 sm:pl-0">
                  <div className="text-[11px] text-slate-400">Penanggung Jawab:</div>
                  <div className="font-semibold text-slate-800">{step.pic}</div>
                  <div
                    className={`text-[11px] ${
                      state === 'completed'
                        ? 'text-slate-500 font-mono'
                        : state === 'current'
                        ? 'text-amber-700 font-medium'
                        : 'text-slate-400'
                    }`}
                  >
                    {state === 'completed'
                      ? step.completedDate
                      : state === 'current'
                      ? 'Sedang Berlangsung'
                      : 'Belum Dimulai'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
