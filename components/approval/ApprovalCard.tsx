import { ApprovalItem } from '@/lib/types/approval';
import { UserRole } from '@/lib/types/database.types';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { maskNIK, formatRupiah, formatTanggal } from '@/lib/utils';
import {
  User,
  MapPin,
  Banknote,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  item: ApprovalItem;
  currentRole: UserRole;
  onOpenDetail: (item: ApprovalItem) => void;
  onActionClick: (item: ApprovalItem, action: 'setujui' | 'tolak' | 'minta_revisi') => void;
}

export function ApprovalCard({ item, currentRole, onOpenDetail, onActionClick }: Props) {
  // Cek apakah item ini butuh tindakan aktif dari role saat ini
  const isActionable = () => {
    if (currentRole === 'petugas_rw' && item.status === 'diusulkan_rt') return true;
    if (currentRole === 'petugas_kelurahan' && item.status === 'disetujui_rw') return true;
    if (currentRole === 'petugas_kecamatan' && item.status === 'diverifikasi_kelurahan') return true;
    if (currentRole === 'super_admin' && ['diusulkan_rt', 'disetujui_rw', 'diverifikasi_kelurahan'].includes(item.status))
      return true;
    return false;
  };

  const actionable = isActionable();

  return (
    <div
      className={`bg-white rounded-2xl border transition shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between ${
        actionable ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'
      }`}
    >
      {/* Card Header */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {item.nomor_pengajuan}
            </span>
            {actionable && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full animate-pulse">
                • Perlu Tindakan Anda
              </span>
            )}
          </div>
          <ApprovalStatusBadge status={item.status} size="sm" />
        </div>

        {/* Warga Info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {item.warga.nama_lengkap}
            </h3>
            <p className="text-xs text-slate-500 font-mono">NIK: {maskNIK(item.warga.nik)}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              <span>
                RT {item.warga.rt || '-'}/RW {item.warga.rw || '-'} - {item.wilayah.nama}
              </span>
            </p>
          </div>
        </div>

        {/* PMT & Program Pills */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <div className="p-2.5 rounded-xl bg-brand-50/70 border border-brand-100 text-xs">
            <div className="text-[10px] text-brand-700 font-medium">Program Bansos</div>
            <div className="font-bold text-brand-900 truncate">{item.program.nama_program}</div>
            <div className="text-[11px] text-brand-700 mt-0.5">
              {formatRupiah(item.program.anggaran_per_penerima)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-civic-50/70 border border-civic-100 text-xs">
            <div className="text-[10px] text-civic-700 font-medium">Skor PMT & Desil</div>
            <div className="font-bold text-civic-900 flex items-center gap-1">
              <span>Desil {item.skor?.desil || 1}</span>
              <span className="text-[10px] text-civic-600 font-normal">
                ({item.skor?.skor_pmt || 85.0} Poin)
              </span>
            </div>
            <div className="text-[10px] text-civic-700 capitalize truncate mt-0.5">
              {item.skor?.kategori_kelayakan?.replace('_', ' ') || 'Sangat Miskin'}
            </div>
          </div>
        </div>

        {/* Tumpang Tindih Warning if exists */}
        {item.flag_tumpang_tindih && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Peringatan: Terdeteksi potensi data tumpang tindih program bansos lain.</span>
          </div>
        )}

        {/* Last note */}
        {item.alasan_status_terakhir && (
          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg line-clamp-2">
            "{item.alasan_status_terakhir}"
          </p>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={() => onOpenDetail(item)}
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-slate-200 transition"
        >
          <span>Detail Lengkap & Riwayat</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {actionable && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onActionClick(item, 'minta_revisi')}
              title="Minta Revisi"
              className="p-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onActionClick(item, 'tolak')}
              title="Tolak Pengajuan"
              className="p-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
            >
              <XCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onActionClick(item, 'setujui')}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {currentRole === 'petugas_rw'
                  ? 'Setujui RW'
                  : currentRole === 'petugas_kelurahan'
                  ? 'Verifikasi'
                  : 'Setujui Final'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
