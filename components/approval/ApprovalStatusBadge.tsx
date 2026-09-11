import { StatusPengajuan } from '@/lib/types/database.types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';

interface Props {
  status: StatusPengajuan;
  size?: 'sm' | 'md' | 'lg';
}

export function ApprovalStatusBadge({ status, size = 'md' }: Props) {
  const getStatusConfig = () => {
    switch (status) {
      case 'diusulkan_rt':
        return {
          label: 'Diusulkan RT (Menunggu RW)',
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: Clock,
        };
      case 'disetujui_rw':
        return {
          label: 'Disetujui RW (Menunggu Kelurahan)',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'ditolak_rw':
        return {
          label: 'Ditolak RW',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
        };
      case 'perlu_revisi_rw':
        return {
          label: 'Perlu Revisi (Dari RW)',
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          icon: AlertTriangle,
        };
      case 'diverifikasi_kelurahan':
        return {
          label: 'Diverifikasi Kelurahan (Menunggu Kecamatan)',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock,
        };
      case 'ditolak_kelurahan':
        return {
          label: 'Ditolak Kelurahan',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
        };
      case 'perlu_revisi_kelurahan':
        return {
          label: 'Perlu Revisi (Dari Kelurahan)',
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          icon: AlertTriangle,
        };
      case 'disetujui_kecamatan':
        return {
          label: 'Disetujui Final (Kecamatan)',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold',
          icon: CheckCircle2,
        };
      case 'ditolak_kecamatan':
        return {
          label: 'Ditolak Final (Kecamatan)',
          bg: 'bg-rose-50 text-rose-700 border-rose-300 font-semibold',
          icon: XCircle,
        };
      case 'tersalurkan':
        return {
          label: 'Bansos Tersalurkan',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Sparkles,
        };
      case 'dibatalkan':
        return {
          label: 'Dibatalkan',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: XCircle,
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Send,
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${sizeClasses} transition shadow-sm`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
}
