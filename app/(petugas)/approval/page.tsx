import { requirePetugasAuth } from '@/lib/auth/session';
import { getApprovalInboxData } from '@/lib/actions/approval';
import { ApprovalInboxView } from '@/components/approval/ApprovalInboxView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inbox Approval Berjenjang | SI-BANSOS Kecamatan',
  description: 'Halaman verifikasi dan persetujuan bertingkat usulan penerima bantuan sosial',
};

export default async function ApprovalPage() {
  const profile = await requirePetugasAuth();
  const initialData = await getApprovalInboxData(profile.role);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ApprovalInboxView
        initialData={initialData}
        userRole={profile.role}
        userNama={profile.nama_lengkap}
      />
    </div>
  );
}
