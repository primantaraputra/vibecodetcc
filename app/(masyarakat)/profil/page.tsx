import Link from 'next/link';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import { requireMasyarakatAuth } from '@/lib/auth/session';
import {
  WargaProfileHeader,
  DataKependudukanCard,
  RiwayatBansosMasaLaluCard,
  NotificationListCard,
} from '@/components/masyarakat/profil';

export const metadata = {
  title: 'Profil Saya | SI-BANSOS Kecamatan',
  description:
    'Profil kepesertaan, kartu digital bansos, data kependudukan, dan riwayat bantuan yang pernah diterima.',
};

export default async function WargaProfilPage() {
  const profile = await requireMasyarakatAuth();

  return (
    <div className="space-y-6 pb-12">
      {/* Quick Link Banner ke Halaman Beranda Warga */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-100 block">
              Ada Pengajuan Bansos Sedang Berjalan
            </span>
            <p className="text-xs sm:text-sm font-semibold text-white">
              Cek alur proses pencatatan berjenjang dari RT, RW, Kelurahan, hingga Kecamatan.
            </p>
          </div>
        </div>
        <Link
          href="/beranda"
          className="px-4 py-2.5 bg-white text-teal-800 font-bold text-xs rounded-xl shadow-xs hover:bg-teal-50 transition flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <span>Buka Beranda Bansos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Profile Header & Digital ID Card */}
      <WargaProfileHeader profile={profile} />

      {/* Data Kependudukan & Rumah Tangga Lengkap */}
      <DataKependudukanCard profile={profile} />

      {/* Riwayat Bansos Masa Lalu yang Pernah Diterima */}
      <RiwayatBansosMasaLaluCard />

      {/* Notifications Inbox */}
      <NotificationListCard />
    </div>
  );
}
