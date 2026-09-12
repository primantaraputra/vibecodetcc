import { requireMasyarakatAuth } from '@/lib/auth/session';
import { StatusBansosView } from '@/components/masyarakat/status';

export const metadata = {
  title: 'Status Bansos Saya | SI-BANSOS Kecamatan',
  description:
    'Pantau alur proses pencatatan dan verifikasi berjenjang bantuan sosial mulai dari RT, RW, Kelurahan, hingga penetapan Kecamatan.',
};

export default async function StatusBansosPage() {
  const profile = await requireMasyarakatAuth();

  return <StatusBansosView profile={profile} />;
}
