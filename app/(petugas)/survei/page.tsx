import { requirePetugasAuth } from '@/lib/auth/session';
import { OfflineStatusBanner, SurveiMultiStepForm } from '@/components/survei';
import { Metadata } from 'next';
import { ClipboardList } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Form Survei Kesejahteraan Lapangan | SI-BANSOS Kecamatan',
  description: 'Pendataan terpadu lapangan, validasi kamera, geolokasi GPS, dan skoring PMT',
};

export default async function SurveiPage() {
  const profile = await requirePetugasAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Offline connectivity banner */}
      <OfflineStatusBanner />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-600" />
            <span>Form Survei Kesejahteraan Warga</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Petugas Surveyor: <strong className="text-slate-800">{profile.nama_lengkap}</strong> • Mode Pendataan Lapangan
          </p>
        </div>
      </div>

      {/* Multi-step Touch Form */}
      <SurveiMultiStepForm />
    </div>
  );
}
