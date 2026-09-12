'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  Eye,
  EyeOff,
  FileText,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Layers,
  MapPin,
  Search,
  User,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  Info,
} from 'lucide-react';
import { VerificationStage } from './StatusBannerHero';
import { AlurPencatatanStepper } from './AlurPencatatanStepper';
import { UserProfile } from '@/lib/types';

interface StatusBansosViewProps {
  profile: UserProfile;
}

export function StatusBansosView({ profile }: StatusBansosViewProps) {
  // Default stage is 'rw' as requested by user
  const [currentStage, setCurrentStage] = useState<VerificationStage>('rw');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showSkModal, setShowSkModal] = useState(false);

  // Stage simulation list
  const simulationOptions: { stage: VerificationStage; label: string }[] = [
    { stage: 'rt', label: '1. Pengecekan RT' },
    { stage: 'rw', label: '2. Pengecekan RW (Kondisi Saat Ini)' },
    { stage: 'kelurahan', label: '3. Pengecekan Kelurahan' },
    { stage: 'kecamatan', label: '4. Pengecekan Kecamatan' },
    { stage: 'tersalurkan', label: '5. Penetapan Petugas Pusat (Selesai)' },
  ];

  const stageDetails: Record<
    VerificationStage,
    {
      title: string;
      badge: string;
      badgeColor: string;
      dotColor: string;
      percentage: number;
      stepText: string;
      pic: string;
      phone: string;
      description: string;
    }
  > = {
    rt: {
      title: 'Menunggu Pengecekan RT',
      badge: 'Tahap 1: Pengecekan RT',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
      percentage: 20,
      stepText: 'Tahap 1 dari 5 Berjalan',
      pic: 'Ahmad Subarjo',
      phone: '0812-7788-9901',
      description:
        'Pengajuan baru dibuat. Petugas RT dijadwalkan melakukan pengecekan data dan survei lapangan sosial-ekonomi langsung ke tempat tinggal Anda.',
    },
    rw: {
      title: 'Menunggu Pengecekan RW',
      badge: 'Tahap 2: Pengecekan RW',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
      percentage: 40,
      stepText: 'Tahap 2 dari 5 Berjalan',
      pic: 'Drs. Bambang Wijaya',
      phone: '0813-2233-4455',
      description:
        'Pengecekan lapangan oleh Petugas RT telah selesai. Saat ini berkas dalam proses pengecekan dan verifikasi musyawarah lingkungan tingkat RW.',
    },
    kelurahan: {
      title: 'Menunggu Pengecekan Kelurahan',
      badge: 'Tahap 3: Pengecekan Kelurahan',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      dotColor: 'bg-indigo-500',
      percentage: 60,
      stepText: 'Tahap 3 dari 5 Berjalan',
      pic: 'Hj. Ratna Sari, S.Sos',
      phone: '0821-3344-5566',
      description:
        'Hasil pengecekan RW telah diterima. Berkas saat ini sedang dalam pengecekan administratif dan kroscek data DTKS oleh Petugas Kelurahan.',
    },
    kecamatan: {
      title: 'Menunggu Pengecekan Kecamatan',
      badge: 'Tahap 4: Pengecekan Kecamatan',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      dotColor: 'bg-teal-500',
      percentage: 80,
      stepText: 'Tahap 4 dari 5 Berjalan',
      pic: 'Drs. H. Mulyadi',
      phone: '0811-9988-7766',
      description:
        'Kelurahan telah menyelesaikan pengecekan. Berkas sedang dalam tahap pengecekan dan rekapitulasi data tingkat kecamatan sebelum diteruskan ke Petugas Pusat.',
    },
    tersalurkan: {
      title: 'Ditetapkan Petugas Pusat & Siap Disalurkan',
      badge: 'Selesai: Ditetapkan Pusat',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
      percentage: 100,
      stepText: 'Tahap 5 dari 5 Selesai',
      pic: 'Petugas Pusat / Admin',
      phone: 'Call Center 1500-299',
      description:
        'Seluruh tahapan pengecekan data selesai. Penetapan resmi penerima bantuan sosial telah disahkan oleh Petugas Pusat/Admin dan dana siap disalurkan.',
    },
  };

  const currentStageConfig = stageDetails[currentStage];

  const handleStageChange = (stage: VerificationStage) => {
    setIsSimulating(true);
    setCurrentStage(stage);
    setTimeout(() => setIsSimulating(false), 250);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowSkModal(false);
    };
    if (showSkModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSkModal]);

  return (
    <div className="space-y-5 pb-16">
      {/* 1. TOP GREETING & CITIZEN PROFILE HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-base flex items-center justify-center shadow-xs border-2 border-white ring-2 ring-teal-100 flex-shrink-0">
            {profile.nama_lengkap ? profile.nama_lengkap.charAt(0).toUpperCase() : 'B'}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
              Selamat Datang, {profile.nama_lengkap || 'Budi Santoso'} 👋
            </h1>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
              NIK: {profile.nik ? `${profile.nik.slice(0, 6)}••••••${profile.nik.slice(-4)}` : '327301••••••0007'} • Desil 1 (Sangat Rentan)
            </p>
          </div>
        </div>

        <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Warga Terverifikasi</span>
        </div>
      </div>

      {/* 2. PRIMARY STATUS & BALANCE HERO CARD ("Balance" Card) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-0.5">
          Status Bantuan Sosial
        </span>
        <div
          className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden transition-all duration-300 ${
            isSimulating ? 'opacity-60 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Alokasi Bantuan Program</span>
                <button
                  type="button"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer p-0.5"
                  title={showBalance ? 'Sembunyikan Nominal' : 'Tampilkan Nominal'}
                  aria-label={showBalance ? 'Sembunyikan Nominal' : 'Tampilkan Nominal'}
                >
                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-baseline gap-1.5">
                <span>{showBalance ? 'Rp 600.000' : 'Rp ••••••••'}</span>
                <span className="text-xs font-normal text-slate-500">/ bulan (PKH & BPNT)</span>
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                No. Pengajuan: PB-202609-0001 • Diperbarui: 10 September 2026
              </p>
            </div>

            {/* Quick Action Pill (Matches "Top Up" Pill from Reference) */}
            <button
              type="button"
              onClick={() => setShowSkModal(true)}
              className="px-4 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Detail SK</span>
            </button>
          </div>

          {/* Current Status Badge Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${currentStageConfig.badgeColor}`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStageConfig.dotColor} animate-pulse`} />
              <span>{currentStageConfig.badge}</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Kewenangan Penetapan: <span className="font-semibold text-slate-700">Petugas Pusat</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. PROGRES PENGECEKAN BERJENJANG ("Usage" Card) */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-0.5">
          Progres Pengecekan Berjenjang
        </span>
        <div
          className={`bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4 transition-all duration-300 ${
            isSimulating ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 leading-tight">Alur Verifikasi Lapangan</h3>
                <p className="text-[11px] text-slate-500">{currentStageConfig.title}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
              {currentStageConfig.percentage}% Selesai
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700">{currentStageConfig.stepText}</span>
              <span className="text-slate-500 font-mono">5 Tahapan Pengecekan</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${currentStageConfig.percentage}%` }}
              />
            </div>
          </div>

          {/* Stage Description Box */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs text-slate-600 leading-relaxed">
            {currentStageConfig.description}
          </div>

          {/* Bottom Split Metrics */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Penanggung Jawab</span>
              <span className="font-semibold text-slate-800 text-xs truncate block">
                {currentStageConfig.pic}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Kontak Pengecekan</span>
              <span className="font-medium text-slate-700 font-mono text-xs truncate block">
                {currentStageConfig.phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. OFFERS FOR YOU / HORIZONTAL LAYANAN CAROUSEL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Layanan Untuk Anda</h3>
            <p className="text-[11px] text-slate-500">Fitur bantuan, transparansi, dan pengecekan data</p>
          </div>
          <Link
            href="/sanggahan"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 transition"
          >
            <span>Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scrollable Horizontal Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0">
          {/* Card 1: Featured Gradient Card (Matches Purple Promo Card in Reference) */}
          <div className="w-60 sm:w-64 flex-shrink-0 snap-start rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800 text-white p-4.5 flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-sm transition">
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-teal-50">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Layanan AI Unggulan</span>
              </span>
              <h4 className="text-sm font-bold leading-snug">Ajukan Sanggahan AI</h4>
              <p className="text-[11px] text-teal-50/90 leading-relaxed">
                Laporkan ketidaksesuaian data survei rumah atau status ekonomi secara transparan.
              </p>
            </div>
            <Link
              href="/sanggahan"
              className="mt-3 px-3 py-1.5 bg-white text-teal-800 text-xs font-bold rounded-xl shadow-xs hover:bg-teal-50 transition inline-flex items-center justify-center gap-1 w-fit relative z-10"
            >
              <span>Mulai Sanggah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Peta Transparansi */}
          <div className="w-52 sm:w-56 flex-shrink-0 snap-start rounded-3xl bg-white border border-slate-200/90 p-4.5 flex flex-col justify-between shadow-xs hover:border-teal-300 transition">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-block">
                Transparansi
              </span>
              <h4 className="text-xs font-bold text-slate-800">Peta Kuota Anggaran</h4>
              <p className="text-sm font-bold text-slate-900 font-mono">Rp 2,4 Miliar</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Distribusi kuota bansos per-kelurahan se-Kecamatan Sukamaju.
              </p>
            </div>
            <Link
              href="/peta-transparansi"
              className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Buka Peta</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Cek Status NIK/KK */}
          <div className="w-52 sm:w-56 flex-shrink-0 snap-start rounded-3xl bg-white border border-slate-200/90 p-4.5 flex flex-col justify-between shadow-xs hover:border-teal-300 transition">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block">
                Cek Terbuka
              </span>
              <h4 className="text-xs font-bold text-slate-800">Cek Status NIK / KK</h4>
              <p className="text-sm font-bold text-slate-900">Akses Mandiri</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Pencarian status keterdaftaran bansos terbuka dengan masking privasi.
              </p>
            </div>
            <Link
              href="/cek-status"
              className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Cek Sekarang</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Profil Kependudukan */}
          <div className="w-52 sm:w-56 flex-shrink-0 snap-start rounded-3xl bg-white border border-slate-200/90 p-4.5 flex flex-col justify-between shadow-xs hover:border-teal-300 transition">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full inline-block">
                Kependudukan
              </span>
              <h4 className="text-xs font-bold text-slate-800">Profil & Data BPS</h4>
              <p className="text-sm font-bold text-slate-900">14 Kriteria BPS</p>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Kelayakan desil, foto tempat tinggal, dan susunan keluarga.
              </p>
            </div>
            <Link
              href="/profil"
              className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Buka Profil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. SIMULASI ALUR PROSES (COBA KONDISI TAHAP 1 - 5) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sliders className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span>Simulasi Alur Proses (Coba Kondisi Pengajuan):</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {simulationOptions.map((opt) => (
            <button
              key={opt.stage}
              type="button"
              onClick={() => handleStageChange(opt.stage)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
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

      {/* 6. DETAIL LENGKAP ALUR PENGECEKAN BERJENJANG (STEPPER) */}
      <AlurPencatatanStepper currentStage={currentStage} />

      {/* 7. MODAL DETAIL SK RESMI */}
      {showSkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Detail Surat Keputusan Penetapan Bansos"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Surat Keputusan (SK) Bansos
                  </h3>
                  <p className="text-[11px] text-slate-500">Dokumen Penetapan Resmi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSkModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Nomor SK Penetapan:</span>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">
                    SK-BANSOS/2026/09/0042
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Tanggal Penetapan:</span>
                  <span className="font-medium text-slate-800 text-[11px]">10 September 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[11px]">Pejabat Berwenang:</span>
                  <span className="font-semibold text-emerald-700 text-[11px]">
                    Petugas Pusat / Admin Kemensos
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Nama Penerima:</span>
                  <span className="font-bold text-slate-800">{profile.nama_lengkap || 'Budi Santoso'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Jenis Bantuan:</span>
                  <span className="font-semibold text-slate-800">PKH & Sembako (BPNT)</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Nominal Alokasi:</span>
                  <span className="font-bold text-teal-700">Rp 600.000 / bulan</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Bank / Lembaga Penyalur:</span>
                  <span className="font-medium text-slate-800">Bank Himbara / PT Pos Indonesia</span>
                </div>
              </div>

              <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-start gap-2 text-teal-800 text-[11px]">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-teal-600" />
                <p>
                  Sesuai aturan resmi, penetapan akhir penerima bantuan sosial sepenuhnya ditetapkan oleh Petugas Pusat/Admin setelah proses pengecekan data lapangan selesai.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSkModal(false)}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Tutup Rincian SK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

