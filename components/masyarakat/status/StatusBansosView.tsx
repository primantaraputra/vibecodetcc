'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  GitMerge,
  MessageSquarePlus,
  Map,
  User,
  ArrowRight,
  Sparkles,
  Sliders,
  ChevronRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { StatusBannerHero, VerificationStage } from './StatusBannerHero';
import { AlurPencatatanStepper } from './AlurPencatatanStepper';
import { UserProfile } from '@/lib/types';

interface StatusBansosViewProps {
  profile: UserProfile;
}

export function StatusBansosView({ profile }: StatusBansosViewProps) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<VerificationStage>('rw');
  const [isSimulating, setIsSimulating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cek-status?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/cek-status');
    }
  };

  const scrollToAlur = () => {
    document.getElementById('alur-verifikasi')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 5 Quick Service Buttons (Grid Cards)
  const quickServices = [
    {
      id: 'alur',
      label: 'Alur Proses',
      icon: GitMerge,
      onClick: scrollToAlur,
    },
    {
      id: 'cek-status',
      label: 'Cek Status',
      icon: Search,
      href: '/cek-status',
    },
    {
      id: 'sanggahan',
      label: 'Sanggahan',
      icon: MessageSquarePlus,
      href: '/sanggahan',
    },
    {
      id: 'peta',
      label: 'Peta Bansos',
      icon: Map,
      href: '/peta-transparansi',
    },
    {
      id: 'profil',
      label: 'Profil Saya',
      icon: User,
      href: '/profil',
    },
  ];

  // 3 Articles / Educational Guidance Cards
  const guideArticles = [
    {
      id: 'bps-14',
      title: '14 Variabel Kemiskinan BPS',
      category: 'Kriteria Resmi',
      readTime: '3 mnt baca',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=500&q=80',
      href: '/simulasi',
    },
    {
      id: 'alur-5',
      title: 'Alur 5 Tingkat Verifikasi',
      category: 'Transparansi',
      readTime: '4 mnt baca',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=500&q=80',
      href: '#alur-verifikasi',
      onClick: scrollToAlur,
    },
    {
      id: 'sanggah-ai',
      title: 'Panduan Sanggahan Mandiri',
      category: 'Layanan AI',
      readTime: '2 mnt baca',
      image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=500&q=80',
      href: '/sanggahan',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* 1. HERO GREETING & CIVIC OFFICER AVATAR */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Soft decorative background shape */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-50 via-emerald-50/40 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center justify-between gap-4 relative z-10">
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
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-teal-600/10 via-emerald-500/10 to-teal-100 p-1 shadow-xs overflow-hidden border border-teal-200/60">
              <img
                src="/images/petugas_layanan_bansos.jpg"
                alt="Petugas Layanan Bansos"
                className="w-full h-full object-cover object-top rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 2. MODERN SEARCH BAR */}
        <div className="mt-4 pt-2 relative z-10">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari status pengajuan, NIK, atau layanan bansos..."
              className="w-full bg-slate-50/80 hover:bg-white focus:bg-white border border-slate-200/90 rounded-2xl py-2.5 sm:py-3 pl-4 pr-12 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition duration-200"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              aria-label="Cari Layanan"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>

      {/* 3. QUICK SERVICE BUTTONS (5 GRID CARDS) */}
      <section>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {quickServices.map((service) => {
            const Icon = service.icon;

            const content = (
              <div className="bg-white border border-slate-200/80 hover:border-teal-300 rounded-2xl p-2.5 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center text-center cursor-pointer group h-full">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-teal-50/90 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-all duration-200 mb-1.5 shadow-2xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 group-hover:text-teal-900 leading-tight">
                  {service.label}
                </span>
              </div>
            );

            if (service.href) {
              return (
                <Link key={service.id} href={service.href} className="block">
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={service.id}
                type="button"
                onClick={service.onClick}
                className="w-full text-left"
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SPOTLIGHT FEATURED BANNER ("Consult Online" style) */}
      <section className="bg-gradient-to-r from-teal-50/90 via-emerald-50/70 to-teal-100/50 border border-teal-200/80 rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Tahap 2: Pengecekan RW (Sedang Berjalan)</span>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              Status Verifikasi Bansos Anda
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed">
              No. Pengajuan: <strong className="font-mono text-slate-800">PB-202609-0001</strong>. Berkas sedang dalam musyawarah lingkungan tingkat RW untuk verifikasi keabsahan data usulan.
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={scrollToAlur}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs hover:shadow-sm transition cursor-pointer"
              >
                <span>Cek Detail Alur Proses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smartphone digital verification mockup */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white">
              <img
                src="/images/verifikasi_bansos_phone.jpg"
                alt="Verifikasi Bansos Mobile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. INFORMASI & PANDUAN BANTUAN SOSIAL ("Health Tips" style) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900">
            Informasi & Panduan Bantuan Sosial
          </h2>
          <Link
            href="/cek-status"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-0.5"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guideArticles.map((article) => {
            const cardContent = (
              <div className="bg-white border border-slate-200/80 hover:border-teal-300 rounded-2xl p-3 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-full group">
                <div className="space-y-2">
                  <div className="h-28 rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-800 leading-snug">
                    {article.title}
                  </h3>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 font-medium">
                  {article.readTime}
                </div>
              </div>
            );

            if (article.onClick) {
              return (
                <button
                  key={article.id}
                  type="button"
                  onClick={article.onClick}
                  className="text-left cursor-pointer h-full"
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <Link key={article.id} href={article.href} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. ALUR PENGECEKAN BERJENJANG & SIMULASI STATUS */}
      <section id="alur-verifikasi" className="space-y-4 pt-2">
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
