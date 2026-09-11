import { StatusPengajuan } from '@/lib/types/database.types';
import { RiwayatApprovalDetail } from '@/lib/types/approval';
import { formatTanggalWaktu } from '@/lib/utils';
import { getRoleBadgeStyle, getRoleLabel } from '@/lib/auth/roles';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface Props {
  status: StatusPengajuan;
  riwayat: RiwayatApprovalDetail[];
}

export function ApprovalTimeline({ status, riwayat }: Props) {
  // Stepper definition
  const stages = [
    { key: 'rt', label: '1. Pengusulan RT' },
    { key: 'rw', label: '2. Approval RW' },
    { key: 'kelurahan', label: '3. Verifikasi Kelurahan' },
    { key: 'kecamatan', label: '4. Keputusan Kecamatan' },
  ];

  const getStageStatus = (stageKey: string) => {
    switch (stageKey) {
      case 'rt':
        return 'completed';
      case 'rw':
        if (['diusulkan_rt'].includes(status)) return 'current';
        if (['disetujui_rw', 'diverifikasi_kelurahan', 'disetujui_kecamatan', 'tersalurkan'].includes(status))
          return 'completed';
        if (['ditolak_rw', 'perlu_revisi_rw'].includes(status)) return 'rejected';
        return 'upcoming';
      case 'kelurahan':
        if (['disetujui_rw'].includes(status)) return 'current';
        if (['diverifikasi_kelurahan', 'disetujui_kecamatan', 'tersalurkan'].includes(status))
          return 'completed';
        if (['ditolak_kelurahan', 'perlu_revisi_kelurahan'].includes(status)) return 'rejected';
        return 'upcoming';
      case 'kecamatan':
        if (['diverifikasi_kelurahan'].includes(status)) return 'current';
        if (['disetujui_kecamatan', 'tersalurkan'].includes(status)) return 'completed';
        if (['ditolak_kecamatan'].includes(status)) return 'rejected';
        return 'upcoming';
      default:
        return 'upcoming';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Visual Progress Stepper */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Alur Progres Approval Berjenjang</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stages.map((st, idx) => {
            const stState = getStageStatus(st.key);
            let stateClass = 'bg-white border-slate-200 text-slate-400';
            let icon = <Clock className="w-4 h-4 text-slate-400" />;

            if (stState === 'completed') {
              stateClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
              icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            } else if (stState === 'current') {
              stateClass = 'bg-blue-50 border-blue-400 text-blue-800 font-semibold ring-2 ring-blue-100';
              icon = <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
            } else if (stState === 'rejected') {
              stateClass = 'bg-rose-50 border-rose-300 text-rose-800 font-semibold';
              icon = <XCircle className="w-4 h-4 text-rose-600" />;
            }

            return (
              <div
                key={st.key}
                className={`p-3 rounded-lg border text-xs flex flex-col justify-between space-y-1.5 transition ${stateClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Tahap {idx + 1}</span>
                  {icon}
                </div>
                <div className="text-[11px] leading-tight font-medium">{st.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Chronological Riwayat Log */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-civic-600" />
          <span>Audit Log Riwayat Tindakan ({riwayat.length} Catatan)</span>
        </h3>

        {riwayat.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl text-xs text-slate-500">
            Belum ada riwayat approval tercatat.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {riwayat.map((r, i) => {
              let actionBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              let actionIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;

              if (r.aksi === 'tolak') {
                actionBadge = 'bg-rose-100 text-rose-800 border-rose-200';
                actionIcon = <XCircle className="w-3.5 h-3.5 text-rose-600" />;
              } else if (r.aksi === 'minta_revisi') {
                actionBadge = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                actionIcon = <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />;
              } else if (r.aksi === 'usulkan') {
                actionBadge = 'bg-blue-100 text-blue-800 border-blue-200';
                actionIcon = <ArrowRight className="w-3.5 h-3.5 text-blue-600" />;
              }

              return (
                <div key={r.id || i} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center group-hover:border-brand-500 transition shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-brand-600" />
                  </div>

                  {/* Card Log */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${actionBadge}`}
                        >
                          {actionIcon}
                          <span className="uppercase">{r.aksi}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] border ${getRoleBadgeStyle(
                            r.role_approver
                          )}`}
                        >
                          {getRoleLabel(r.role_approver)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {formatTanggalWaktu(r.created_at)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-800 font-medium">
                      {r.approver_nama || 'Petugas Verifikator'}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <strong className="text-slate-900 font-semibold">Alasan Tindakan:</strong>{' '}
                      {r.alasan}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
