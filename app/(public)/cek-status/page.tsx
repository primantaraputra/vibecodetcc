import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CekStatusView from '@/components/masyarakat/CekStatusView';

export const metadata = {
  title: 'Cek Status Bansos Transparan | SI-BANSOS Kecamatan',
  description: 'Pencarian status penerimaan dan kelayakan bantuan sosial secara transparan dan berjenjang.',
};

export default function CekStatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Utama</span>
        </Link>

        <CekStatusView />
      </div>
    </div>
  );
}
