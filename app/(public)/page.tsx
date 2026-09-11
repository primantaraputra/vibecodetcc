import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Calculator,
  MessageSquareWarning,
  LogIn,
  Users,
  MapPin,
  CheckCircle2,
  Map,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
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

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 py-12 sm:py-20 px-4 border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Transparansi Penyaluran Bansos Berbasis Data & AI Explainability</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Sistem Cek Kelayakan & Pendataan Terpadu Bansos Kecamatan
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Mewujudkan transparansi status bantuan sosial, pendataan akurat oleh RT/RW/Kelurahan,
              verifikasi geolokasi lapangan, dan saluran sanggahan yang adil bagi masyarakat.
            </p>

            {/* Quick Action Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
              <Link
                href="/cek-status"
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-civic-50 text-civic-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Search className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm mb-1">Cek Status Bansos</h2>
                <p className="text-[11px] text-slate-500">
                  Cek transparansi kelayakan dengan NIK atau No. KK
                </p>
              </Link>

              <Link
                href="/peta-transparansi"
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Map className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm mb-1">Peta Transparansi</h2>
                <p className="text-[11px] text-slate-500">
                  Data sebaran anggaran agregat per kelurahan
                </p>
              </Link>

              <Link
                href="/simulasi"
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Calculator className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm mb-1">Simulasi Mandiri</h2>
                <p className="text-[11px] text-slate-500">
                  Kuesioner edukatif estimasi desil kesejahteraan
                </p>
              </Link>

              <Link
                href="/pengaduan"
                className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <h2 className="font-bold text-slate-900 text-sm mb-1">Forum Pengaduan</h2>
                <p className="text-[11px] text-slate-500">
                  Lapor bansos anonim & pantau tindak lanjut
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Roles Highlight */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Alur Verifikasi Berjenjang & Tata Kelola
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Dari pengusulan lapangan hingga penetapan tingkat kecamatan
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                Tahap 1
              </span>
              <div className="font-bold text-slate-800 text-sm">Petugas RT</div>
              <p className="text-xs text-slate-500">Survei warga, foto bukti lapangan & geolokasi</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Tahap 2
              </span>
              <div className="font-bold text-slate-800 text-sm">Petugas RW</div>
              <p className="text-xs text-slate-500">Verifikasi & musyawarah kelayakan tingkat RW</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Tahap 3
              </span>
              <div className="font-bold text-slate-800 text-sm">Petugas Kelurahan</div>
              <p className="text-xs text-slate-500">Verifikasi data & kroscek kuota kelurahan</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                Tahap 4
              </span>
              <div className="font-bold text-slate-800 text-sm">Petugas Kecamatan</div>
              <p className="text-xs text-slate-500">Approval final, alokasi anggaran & rekapitulasi</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 SI-BANSOS Kecamatan. Data yang digunakan merupakan data sintetis/dummy.</p>
      </footer>
    </div>
  );
}
