import { requireMasyarakatAuth } from '@/lib/auth/session';
import { StatusBansosView } from '@/components/masyarakat/status';

export const metadata = {
  title: 'Beranda Warga | SI-BANSOS Kecamatan',
  description:
    'Pantau alur proses pengecekan dan verifikasi berjenjang bantuan sosial mulai dari RT, RW, Kelurahan, hingga penetapan oleh Petugas Pusat.',
};

export default async function BerandaPage() {
  const profile = await requireMasyarakatAuth();

  return <StatusBansosView profile={profile} />;
}
