import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SimulasiMandiriView from '@/components/masyarakat/SimulasiMandiriView';

export const metadata = {
  title: 'Simulasi Mandiri Kesejahteraan Warga | SI-BANSOS Kecamatan',
  description: 'Kuesioner mandiri estimasi desil 1–10 dan rekomendasi program bantuan sosial.',
};

export default function SimulasiPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Login</span>
        </Link>

        <SimulasiMandiriView />
      </div>
    </div>
  );
}
