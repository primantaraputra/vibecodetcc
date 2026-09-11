import { requirePetugasAuth } from '@/lib/auth/session';
import { getAuditLogs } from '@/lib/actions/analytics';
import AuditLogView from '@/components/audit/AuditLogView';

export const metadata = {
  title: 'Audit Log & Keamanan Kriptografis | SI-BANSOS Kecamatan',
};

export default async function AuditLogPage() {
  await requirePetugasAuth();
  const logs = await getAuditLogs();

  return <AuditLogView initialLogs={logs} />;
}
