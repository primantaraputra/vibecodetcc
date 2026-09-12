'use client';

import React from 'react';

interface WaveAuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
  mode?: 'login' | 'register';
}

export function WaveAuthCard({
  title,
  subtitle,
  children,
  backHref = '/',
  mode = 'login',
}: WaveAuthCardProps) {
  const isLogin = mode === 'login';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 md:p-6 lg:p-10 bg-gradient-to-br from-emerald-50/70 via-slate-100/90 to-teal-50/50 relative overflow-hidden">
      {/* Desktop Atmospheric Ambient Glows */}
      <div className="hidden md:block absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full bg-emerald-300/25 blur-3xl pointer-events-none" />
      <div className="hidden md:block absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-teal-300/25 blur-3xl pointer-events-none" />

      {/* Main Responsive Container: Full-screen on Mobile, 2-Column Wide Card on Desktop */}
      <div className="w-full md:max-w-4xl lg:max-w-5xl min-h-screen md:min-h-[620px] bg-white md:rounded-[36px] shadow-2xl shadow-emerald-950/10 border-0 md:border border-slate-200/80 overflow-hidden relative transition-all duration-300 grid grid-cols-1 md:grid-cols-12 z-10">
        
        {/* ==================================================================== */}
        {/* DESKTOP LEFT SHOWCASE PANEL (Visible on md & lg, hidden on mobile)  */}
        {/* ==================================================================== */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-5 bg-gradient-to-br from-[#0f766e] via-[#15803d] to-[#166534] text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Decorative Flowing Fluid Waves in Header Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 400 600"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50,200 C100,350 250,150 450,300 L450,0 L-50,0 Z"
                fill="rgba(255,255,255,0.3)"
              />
              <path
                d="M-50,360 C80,500 280,250 450,420 L450,0 L-50,0 Z"
                fill="rgba(255,255,255,0.15)"
              />
            </svg>
          </div>

          {/* Top Branding */}
          <div className="relative z-10 space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-200 font-semibold">
                SI-BANSOS KECAMATAN
              </span>
            </div>

            {/* Clean Title & Description (Tanpa ikon atau kartu tambahan) */}
            <div className="space-y-2 pt-6 lg:pt-8">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                {isLogin
                  ? 'Transparansi Bantuan Sosial'
                  : 'Pendaftaran Akun Warga'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                {isLogin
                  ? 'Sistem informasi pendataan, verifikasi berjenjang, dan monitoring penyaluran bantuan sosial terpadu.'
                  : 'Daftarkan data diri Anda untuk mengakses status bantuan sosial dan riwayat kepesertaan secara mandiri.'}
              </p>
            </div>
          </div>

          {/* Bottom Footer Sederhana & Bersih */}
          <div className="relative z-10 text-xs text-emerald-200/80 font-medium pt-6">
            Pemerintah Daerah • Layanan Kesejahteraan Sosial
          </div>
        </div>

        {/* ==================================================================== */}
        {/* MOBILE TOP CURVED WAVE HEADER (Visible on mobile, hidden on md+)     */}
        {/* ==================================================================== */}
        <div className="md:hidden relative bg-gradient-to-br from-[#0f766e] via-[#15803d] to-[#166534] text-white pt-6 pb-12 px-6 overflow-hidden flex-shrink-0">
          {/* Subtle Decorative Flowing Fluid Waves in Header Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50,100 C100,180 250,50 450,140 L450,0 L-50,0 Z"
                fill="rgba(255,255,255,0.3)"
              />
              <path
                d="M-50,160 C80,240 280,100 450,200 L450,0 L-50,0 Z"
                fill="rgba(255,255,255,0.15)"
              />
            </svg>
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-center mb-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-200/90 font-semibold">
              SI-BANSOS KECAMATAN
            </span>
          </div>

          {/* Centered White Emblem Logo */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 drop-shadow-xs"
              >
                <path
                  d="M16 26V14"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M16 6C16 6 13 10 13 13.5C13 15.1 14.3 16.5 16 16.5C17.7 16.5 19 15.1 19 13.5C19 10 16 6 16 6Z"
                  fill="white"
                />
                <path
                  d="M15 15.5C15 15.5 10 13.5 8.5 10.5C7.5 7.5 10 7 11.5 7.5C13.5 9 14.5 12 15 15.5Z"
                  fill="white"
                  fillOpacity="0.85"
                />
                <path
                  d="M17 15.5C17 15.5 22 13.5 23.5 10.5C24.5 7.5 22 7 20.5 7.5C18.5 9 17.5 12 17 15.5Z"
                  fill="white"
                  fillOpacity="0.85"
                />
                <circle cx="16" cy="26" r="2" fill="white" />
              </svg>
            </div>

            {/* Mobile Title & Subtitle */}
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
              {title}
            </h1>
            <p className="text-xs text-emerald-100/90 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Organic Fluid Wave Transition Cutout for Mobile */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none leading-none">
            <svg
              className="w-full h-8 block"
              viewBox="0 0 400 48"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,22 C120,44 260,2 400,26 L400,48 L0,48 Z"
                fill="rgba(255,255,255,0.25)"
              />
              <path
                d="M0,28 C140,50 280,10 400,32 L400,48 L0,48 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: FORM BODY (Responsive for both Mobile & Desktop)       */}
        {/* ==================================================================== */}
        <div className="md:col-span-7 lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-center relative z-20">
          {/* Desktop Heading Header (Visible on md+ only) */}
          <div className="hidden md:block mb-5 space-y-1">
            <h1 className="text-xl lg:text-2xl font-bold text-[#14532d] tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          </div>

          {/* Form Content */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
