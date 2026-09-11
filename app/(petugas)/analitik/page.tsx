import { requirePetugasAuth } from '@/lib/auth/session';
import { getDashboardMetrics } from '@/lib/actions/analytics';
import KecamatanAnalyticsView from '@/components/analitik/KecamatanAnalyticsView';

export const metadata = {
  title: 'Analitik & Pelaporan Kecamatan | SI-BANSOS Kecamatan',
};

export default async function AnalitikPage() {
  await requirePetugasAuth();
  const metrics = await getDashboardMetrics();

  return <KecamatanAnalyticsView metrics={metrics} />;
}
