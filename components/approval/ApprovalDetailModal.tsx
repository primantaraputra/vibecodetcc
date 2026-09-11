'use client';

import { useState } from 'react';
import { ApprovalDetailData } from '@/lib/types/approval';
import { UserRole } from '@/lib/types/database.types';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { ApprovalTimeline } from './ApprovalTimeline';
import { maskNIK, maskKK, formatRupiah, formatTanggal } from '@/lib/utils';
import {
  X,
  User,
  MapPin,
  Sparkles,
  Home,
  Zap,
  Droplets,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  detail: ApprovalDetailData | null;
  currentRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (item: ApprovalDetailData, action: 'setujui' | 'tolak' | 'minta_revisi') => void;
}

export function ApprovalDetailModal({
  detail,
  currentRole,
  isOpen,
  onClose,
  onActionClick,
}: Props) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'survei' | 'ai'>('timeline');

  if (!isOpen || !detail) return null;

  const isActionable = () => {
    if (currentRole === 'petugas_rw' && detail.status === 'diusulkan_rt') return true;
    if (currentRole === 'petugas_kelurahan' && detail.status === 'disetujui_rw') return true;
    if (currentRole === 'petugas_kecamatan' && detail.status === 'diverifikasi_kelurahan') return true;
    if (
      currentRole === 'super_admin' &&
      ['diusulkan_rt', 'disetujui_rw', 'diverifikasi_kelurahan'].includes(detail.status)
    )
      return true;
    return false;
  };

  const actionable = isActionable();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base sm:text-lg truncate">
                  Detail Pengajuan Bansos
                </h2>
                <span className="font-mono text-xs text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                  {detail.nomor_pengajuan}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Warga: <span className="font-semibold text-slate-800">{detail.warga.nama_lengkap}</span> • {detail.wilayah.nama}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Status & Tabs */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <ApprovalStatusBadge status={detail.status} size="md" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'timeline'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Timeline & Riwayat Approval
            </button>
            <button
              onClick={() => setActiveTab('survei')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'survei'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Data Warga & Indikator Survei
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                activeTab === 'ai'
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-700 bg-brand-50 hover:bg-brand-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analisis AI & Skor PMT</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'timeline' && (
            <ApprovalTimeline status={detail.status} riwayat={detail.riwayat || []} />
          )}

          {activeTab === 'survei' && (
            <div className="space-y-4">
              {/* Demografi */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Data Pokok Kependudukan</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500">Nama Lengkap:</span>{' '}
                    <strong>{detail.warga.nama_lengkap}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">NIK (Masked):</span>{' '}
                    <strong className="font-mono">{maskNIK(detail.warga.nik)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">No. KK (Masked):</span>{' '}
                    <strong className="font-mono">{maskKK(detail.warga.no_kk)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Pekerjaan:</span>{' '}
                    <strong>{detail.warga.pekerjaan || 'Buruh Harian'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Penghasilan/Bulan:</span>{' '}
                    <strong>{formatRupiah(detail.warga.penghasilan_per_bulan)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Jumlah Tanggungan:</span>{' '}
                    <strong>{detail.warga.jumlah_tanggungan} Jiwa</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500">Alamat:</span>{' '}
                    <span>{detail.warga.alamat}</span>
                  </div>
                </div>
              </div>

              {/* Indikator Fisik Lapangan */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-civic-600" />
                  <span>Indikator Fisik Bangunan & Fasilitas (Hasil Survei)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Jenis Lantai</div>
                    <div className="font-semibold text-slate-800">Tanah / Semen Kasar</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Jenis Dinding</div>
                    <div className="font-semibold text-slate-800">Bambu / Kayu Kualitas Rendah</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Jenis Atap</div>
                    <div className="font-semibold text-slate-800">Seng / Asbes Tua</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Daya Listrik</div>
                    <div className="font-semibold text-slate-800">450 VA (Bersubsidi)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Sanitasi / Jamban</div>
                    <div className="font-semibold text-slate-800">Tidak Ada / Umum</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500">Bahan Bakar Masak</div>
                    <div className="font-semibold text-slate-800">Kayu Bakar / LPG 3kg</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-emerald-50 border border-brand-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <span>Hasil Skoring PMT (Proxy Means Testing) & AI</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white">
                    Desil {detail.skor?.desil || 1}
                  </span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-brand-100">
                  <strong>Penjelasan Skor AI:</strong>
                  <p className="mt-1">
                    {detail.skor?.penjelasan_skor_ai ||
                      'Skor kelayakan dihitung berdasarkan 14 variabel kemiskinan BPS. Kondisi lantai tanah, atap seng, daya listrik 450VA, dan pendapatan di bawah Rp 800.000 menempatkan keluarga pada kategori prioritas Desil 1.'}
                  </p>
                </div>

                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-800">Program yang Direkomendasikan AI:</strong>{' '}
                  <span className="font-semibold text-brand-700">
                    {detail.skor?.rekomendasi_ai?.join(', ') || 'PKH, BPNT'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    * Catatan: AI hanya memberikan rekomendasi dan penjelasan. Keputusan penetapan tetap berada pada petugas verifikator (Human-in-the-loop).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Terakhir diupdate: {formatTanggal(detail.updated_at)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition"
            >
              Tutup
            </button>

            {actionable && (
              <>
                <button
                  onClick={() => onActionClick(detail, 'minta_revisi')}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Minta Revisi</span>
                </button>
                <button
                  onClick={() => onActionClick(detail, 'tolak')}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 rounded-lg transition"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Tolak</span>
                </button>
                <button
                  onClick={() => onActionClick(detail, 'setujui')}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {currentRole === 'petugas_rw'
                      ? 'Setujui (RW)'
                      : currentRole === 'petugas_kelurahan'
                      ? 'Verifikasi (Kelurahan)'
                      : 'Setujui Final (Kecamatan)'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
