'use client';

import React from 'react';

export type VerificationStage = 'rt' | 'rw' | 'kelurahan' | 'kecamatan' | 'tersalurkan';

interface StatusBannerHeroProps {
  currentStage: VerificationStage;
  nomorPengajuan?: string;
  updatedAt?: string;
}

export function StatusBannerHero({
  currentStage = 'rw',
  nomorPengajuan = 'PB-202609-0001',
  updatedAt = '10 September 2026',
}: StatusBannerHeroProps) {
  const stageConfig = {
    rt: {
      title: 'Menunggu Pengecekan RT',
      badge: 'Tahap 1: Pengecekan RT',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
      borderColor: 'border-l-blue-500',
      description:
        'Pengajuan baru dibuat. Petugas RT dijadwalkan melakukan pengecekan data dan survei lapangan sosial-ekonomi langsung ke tempat tinggal Anda.',
      pic: 'Ahmad Subarjo',
      phone: '0812-7788-9901',
    },
    rw: {
      title: 'Menunggu Pengecekan RW',
      badge: 'Tahap 2: Pengecekan RW',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
      borderColor: 'border-l-amber-500',
      description:
        'Pengecekan lapangan oleh Petugas RT telah selesai. Saat ini berkas dalam proses pengecekan dan verifikasi musyawarah lingkungan tingkat RW.',
      pic: 'Drs. Bambang Wijaya',
      phone: '0813-2233-4455',
    },
    kelurahan: {
      title: 'Menunggu Pengecekan Kelurahan',
      badge: 'Tahap 3: Pengecekan Kelurahan',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dotColor: 'bg-indigo-500',
      borderColor: 'border-l-indigo-500',
      description:
        'Hasil pengecekan RW telah diterima. Berkas saat ini sedang dalam pengecekan administratif dan kroscek data DTKS oleh Petugas Kelurahan.',
      pic: 'Hj. Ratna Sari, S.Sos',
      phone: '0821-3344-5566',
    },
    kecamatan: {
      title: 'Menunggu Pengecekan Kecamatan',
      badge: 'Tahap 4: Pengecekan Kecamatan',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      dotColor: 'bg-teal-500',
      borderColor: 'border-l-teal-500',
      description:
        'Kelurahan telah menyelesaikan pengecekan. Berkas sedang dalam tahap pengecekan dan rekapitulasi data tingkat kecamatan sebelum diteruskan ke Petugas Pusat.',
      pic: 'Drs. H. Mulyadi',
      phone: '0811-9988-7766',
    },
    tersalurkan: {
      title: 'Ditetapkan Petugas Pusat & Siap Disalurkan',
      badge: 'Selesai: Ditetapkan Pusat',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      borderColor: 'border-l-emerald-500',
      description:
        'Seluruh tahapan pengecekan data selesai. Penetapan resmi penerima bantuan sosial telah disahkan oleh Petugas Pusat/Admin dan dana siap disalurkan.',
      pic: 'Petugas Pusat / Admin',
      phone: 'Call Center 1500-299',
    },
  }[currentStage] || {
    title: 'Menunggu Pengecekan RW',
    badge: 'Tahap 2: Pengecekan RW',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
    borderColor: 'border-l-amber-500',
    description:
      'Pengecekan lapangan RT telah selesai. Saat ini berkas sedang dicek oleh pihak RW.',
    pic: 'Drs. Bambang Wijaya',
    phone: '0813-2233-4455',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${stageConfig.borderColor} p-5 sm:p-6 shadow-xs space-y-3.5 transition-all duration-200`}
    >
      {/* Baris Atas: Badge Status & No. Pengajuan */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${stageConfig.badgeColor}`}
        >
          <span className={`w-2 h-2 rounded-full ${stageConfig.dotColor} animate-pulse`} />
          <span>{stageConfig.badge}</span>
        </span>

        <div className="text-xs text-slate-500 font-mono">
          No. Pengajuan: <span className="font-semibold text-slate-700">{nomorPengajuan}</span>
          <span className="hidden sm:inline text-slate-400"> • Diperbarui: {updatedAt}</span>
        </div>
      </div>

      {/* Judul Status & Deskripsi Bersih (Font Harmonik 14px & 12px) */}
      <div className="space-y-0.5">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          {stageConfig.title}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          {stageConfig.description}
        </p>
      </div>

      {/* Baris Informasi Ringkas (Clear & Minimal) */}
      <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-x-8 gap-y-2 text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Penanggung Jawab</span>
          <span className="font-semibold text-slate-800 text-xs">{stageConfig.pic}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Kontak</span>
          <span className="font-medium text-slate-700 font-mono text-xs">{stageConfig.phone}</span>
        </div>
      </div>
    </div>
  );
}
