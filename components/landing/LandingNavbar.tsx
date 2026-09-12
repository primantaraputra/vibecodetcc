import Link from 'next/link';
import { ShieldCheck, Map, LogIn } from 'lucide-react';

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base sm:text-lg block leading-tight">
              SI-BANSOS KECAMATAN
            </span>
            <span className="text-xs text-slate-500 hidden sm:block">
              Sistem Terpadu Cek Kelayakan & Verifikasi Berjenjang
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/peta-transparansi"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
          >
            <Map className="w-4 h-4 text-emerald-600" />
            <span>Peta Anggaran</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Petugas / Warga</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
