'use client';

import { useState } from 'react';
import { ApprovalItem } from '@/lib/types/approval';
import { UserRole } from '@/lib/types/database.types';
import { submitApprovalAction } from '@/lib/actions/approval';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface Props {
  item: ApprovalItem;
  aksi: 'setujui' | 'tolak' | 'minta_revisi';
  simulatedRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nextStatus: string, message: string) => void;
}

export function ApprovalActionModal({
  item,
  aksi,
  simulatedRole,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [alasan, setAlasan] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getActionDetails = () => {
    switch (aksi) {
      case 'setujui':
        return {
          title: 'Konfirmasi Persetujuan Bansos',
          btnText: 'Setujui Pengajuan',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700',
          icon: CheckCircle2,
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          placeholder:
            'Contoh: Berkas dan survei lapangan telah diverifikasi sesuai kriteria Desil 1 & kuota tersedia...',
        };
      case 'tolak':
        return {
          title: 'Konfirmasi Penolakan Pengajuan',
          btnText: 'Tolak Pengajuan',
          btnBg: 'bg-rose-600 hover:bg-rose-700',
          icon: XCircle,
          badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
          placeholder:
            'Contoh: Penghasilan warga melebihi batas desil maksimal atau terdaftar program bansos lain...',
        };
      case 'minta_revisi':
        return {
          title: 'Kembalikan untuk Revisi Berkas',
          btnText: 'Minta Revisi Petugas',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          icon: AlertTriangle,
          badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
          placeholder:
            'Contoh: Foto bukti rumah kurang jelas, mohon survei ulang koordinat GPS dan foto meteran...',
        };
    }
  };

  const details = getActionDetails();
  const Icon = details.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alasan.trim().length < 5) {
      setErrorMsg('Alasan tindakan wajib diisi minimal 5 karakter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Hitung status berikutnya
    let nextStatus = item.status;
    let tahap = 'rw';
    if (simulatedRole === 'petugas_rw') {
      tahap = 'rw';
      if (aksi === 'setujui') nextStatus = 'disetujui_rw';
      else if (aksi === 'tolak') nextStatus = 'ditolak_rw';
      else nextStatus = 'perlu_revisi_rw';
    } else if (simulatedRole === 'petugas_kelurahan') {
      tahap = 'kelurahan';
      if (aksi === 'setujui') nextStatus = 'diverifikasi_kelurahan';
      else if (aksi === 'tolak') nextStatus = 'ditolak_kelurahan';
      else nextStatus = 'perlu_revisi_kelurahan';
    } else if (simulatedRole === 'petugas_kecamatan' || simulatedRole === 'super_admin') {
      tahap = 'kecamatan';
      if (aksi === 'setujui') nextStatus = 'disetujui_kecamatan';
      else if (aksi === 'tolak') nextStatus = 'ditolak_kecamatan';
      else nextStatus = 'perlu_revisi_kelurahan';
    }

    try {
      // 1. Update status di LocalStorage
      localStorageManager.updatePengajuanStatus(item.id, nextStatus, alasan.trim(), {
        id: `usr-${simulatedRole}`,
        nama: `Petugas (${simulatedRole.replace('_', ' ').toUpperCase()})`,
        role: simulatedRole,
        tahap,
      });

      // 2. Background sync attempt
      try {
        await submitApprovalAction({
          pengajuanId: item.id,
          aksi,
          alasan: alasan.trim(),
          simulatedRole,
        });
      } catch {
        // Fallback OK
      }

      onSuccess(
        nextStatus,
        `Tindakan ${aksi.toUpperCase()} berhasil disimpan di LocalStorage!`
      );
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat memproses tindakan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${details.badgeColor}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">{details.title}</h2>
              <p className="text-[11px] text-slate-500 font-mono">{item.nomor_pengajuan}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          {/* Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Warga:</span>
              <span className="font-semibold text-slate-900">{item.warga.nama_lengkap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program:</span>
              <span className="font-semibold text-slate-900">{item.program.nama_program}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Wilayah:</span>
              <span className="font-medium text-slate-700">{item.wilayah.nama}</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="alasan" className="text-xs font-semibold text-slate-800">
                Alasan / Catatan Tindakan <span className="text-red-500">* (Wajib diisi)</span>
              </label>
              <span className="text-[10px] text-slate-500">{alasan.length}/250 karakter</span>
            </div>
            <textarea
              id="alasan"
              rows={4}
              required
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder={details.placeholder}
              className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 inline" />
              Alasan ini akan tercatat permanen di riwayat audit log sistem.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || alasan.trim().length < 5}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${details.btnBg}`}
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{loading ? 'Memproses...' : details.btnText}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
