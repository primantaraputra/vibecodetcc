import Link from 'next/link';
import { ArrowLeft, Map } from 'lucide-react';

export function PetaTransparansiHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Login</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-sm">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Peta Transparansi Anggaran & Bantuan Sosial
          </h1>
          <p className="text-xs text-slate-500">
            Visualisasi agregat sebaran penerima manfaat dan realisasi dana bansos per kelurahan
          </p>
        </div>
      </div>
    </div>
  );
}
