import dynamic from 'next/dynamic';
import { PetaTransparansiHeader } from '@/components/maps';
import { MapSkeleton } from '@/components/ui';

export const metadata = {
  title: 'Peta Transparansi Anggaran Bansos | SI-BANSOS Kecamatan',
  description:
    'Peta transparansi sebaran realisasi anggaran dan kuota bantuan sosial agregat tingkat kelurahan.',
};

const DynamicPetaTransparansi = dynamic(
  () => import('@/components/maps/PetaTransparansiAgregat'),
  {
    ssr: false,
    loading: () => <MapSkeleton height="500px" />,
  }
);

export default function PetaTransparansiPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <PetaTransparansiHeader />
        <DynamicPetaTransparansi />
      </div>
    </div>
  );
}
