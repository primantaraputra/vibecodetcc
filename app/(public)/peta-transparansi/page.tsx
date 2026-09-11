import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Map } from 'lucide-react';

export const metadata = {
  title: 'Peta Transparansi Anggaran Bansos | SI-BANSOS Kecamatan',
  description: 'Peta transparansi sebaran realisasi anggaran dan kuota bantuan sosial agregat tingkat kelurahan.',
};

const DynamicPetaTransparansi = dynamic(
  () => import('@/components/maps/PetaTransparansiAgregat'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-xs animate-pulse">
        Memuat Peta Transparansi Anggaran Agregat Wilayah...
      </div>
    ),
  }
);

export default function PetaTransparansiPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
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

        <DynamicPetaTransparansi />
      </div>
    </div>
  );
}
