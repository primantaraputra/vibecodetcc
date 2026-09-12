import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CekStatusView from '@/components/masyarakat/CekStatusView';
import { MasyarakatBottomNav } from '@/components/layout';
import { getCurrentUserSession } from '@/lib/auth/session';

export const metadata = {
  title: 'Cek Status Bansos Transparan | SI-BANSOS Kecamatan',
  description: 'Pencarian status penerimaan dan kelayakan bantuan sosial secara transparan dan berjenjang.',
};

export default async function CekStatusPage() {
  const session = await getCurrentUserSession();
  const isLoggedIn = !!session.profile;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href={isLoggedIn ? '/beranda' : '/login'}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isLoggedIn ? 'Kembali ke Beranda' : 'Kembali ke Halaman Login'}</span>
        </Link>

        <CekStatusView />
      </div>
      {isLoggedIn && <MasyarakatBottomNav />}
    </div>
  );
}

