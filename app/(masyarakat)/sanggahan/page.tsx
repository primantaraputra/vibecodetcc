import { requireMasyarakatAuth } from '@/lib/auth/session';
import SanggahanForm from '@/components/masyarakat/SanggahanForm';

export const metadata = {
  title: 'Pengajuan Sanggahan Warga | SI-BANSOS Kecamatan',
};

export default async function WargaSanggahanPage() {
  await requireMasyarakatAuth();

  return (
    <div className="space-y-6">
      <SanggahanForm />
    </div>
  );
}
