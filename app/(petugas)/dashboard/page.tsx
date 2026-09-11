import { requirePetugasAuth } from '@/lib/auth/session';
import { getDashboardMetrics } from '@/lib/actions/analytics';
import PetugasDashboardView from '@/components/dashboard/PetugasDashboardView';

export const metadata = {
  title: 'Dashboard Petugas | SI-BANSOS Kecamatan',
};

export default async function PetugasDashboardPage() {
  const profile = await requirePetugasAuth();
  const metrics = await getDashboardMetrics();

  return (
    <PetugasDashboardView
      metrics={metrics}
      currentUserRole={profile.role}
      currentWilayahName={profile.wilayah_id ? 'Kecamatan Sukamaju' : 'Kecamatan Sukamaju'}
    />
  );
}
