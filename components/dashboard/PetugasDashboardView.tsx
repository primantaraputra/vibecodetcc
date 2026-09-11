'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react';
import { DashboardMetrics } from '@/lib/actions/analytics';
import { localStorageManager } from '@/lib/storage/localStorageManager';

interface Props {
  metrics: DashboardMetrics;
  currentUserRole?: string;
  currentWilayahName?: string;
}

export default function PetugasDashboardView({
  metrics: initialMetrics,
  currentUserRole = 'petugas_kecamatan',
  currentWilayahName = 'Kecamatan Sukamaju',
}: Props) {
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>('all');
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics);

  useEffect(() => {
    localStorageManager.init();
    const updateFromStorage = () => {
      const pengajuanList = localStorageManager.getPengajuanList();
      const wargaList = localStorageManager.getWargaList();
      const surveiList = localStorageManager.getSurveiList();
      const sanggahanList = localStorageManager.getSanggahanList();
      const pengaduanList = localStorageManager.getPengaduanList();

      const disetujui = pengajuanList.filter((p) =>
        ['disetujui_kecamatan', 'tersalurkan'].includes(p.status)
      ).length;
      const ditolak = pengajuanList.filter((p) =>
        ['ditolak_rw', 'ditolak_kelurahan', 'ditolak_kecamatan'].includes(p.status)
      ).length;
      const dalamProses = pengajuanList.filter((p) =>
        ['diusulkan_rt', 'disetujui_rw', 'diverifikasi_kelurahan', 'perlu_revisi_rw', 'perlu_revisi_kelurahan'].includes(p.status)
      ).length;

      setMetrics((prev) => ({
        ...prev,
        totalWarga: wargaList.length > 0 ? wargaList.length : prev.totalWarga,
        totalSurvei: surveiList.length > 0 ? surveiList.length : prev.totalSurvei,
        totalPengajuan: pengajuanList.length > 0 ? pengajuanList.length : prev.totalPengajuan,
        totalDisetujuiKecamatan: disetujui > 0 ? disetujui : prev.totalDisetujuiKecamatan,
        totalDalamProses: dalamProses > 0 ? dalamProses : prev.totalDalamProses,
        totalDitolak: ditolak > 0 ? ditolak : prev.totalDitolak,
        totalSanggahan: sanggahanList.length > 0 ? sanggahanList.length : prev.totalSanggahan,
        totalPengaduan: pengaduanList.length > 0 ? pengaduanList.length : prev.totalPengaduan,
      }));
    };

    updateFromStorage();
    const unsubscribe = localStorageManager.subscribe(updateFromStorage);
    return () => unsubscribe();
  }, []);

  const approvalRate =
    metrics.totalPengajuan > 0
      ? Math.round((metrics.totalDisetujuiKecamatan / metrics.totalPengajuan) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome & Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold bg-brand-500/30 text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-400/30">
              Dashboard Monitoring Terpadu
            </span>
            <span className="text-xs text-slate-400">Wilayah: {currentWilayahName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Pusat Kendali & Penyaluran Bansos Kecamatan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Pantau arus usulan berjenjang, jadwal survei lapangan RT, verifikasi kuota kelurahan,
            hingga penetapan SK Camat.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/survei"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-medium shadow-sm transition flex items-center gap-1.5"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Input Survei Baru</span>
          </Link>
          <Link
            href="/approval"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition border border-white/20 flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>Inbox Approval ({metrics.totalDalamProses})</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Terdata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Warga Terdata</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {metrics.totalWarga.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12 warga baru minggu ini
          </span>
        </div>

        {/* Total Usulan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Berkas Usulan Bansos</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {metrics.totalPengajuan}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics.totalSurvei} survei lapangan terverifikasi
          </span>
        </div>

        {/* Disetujui Kecamatan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Disetujui Kecamatan (Final)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {metrics.totalDisetujuiKecamatan}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            Approval Rate: {approvalRate}%
          </span>
        </div>

        {/* Antrean Dalam Proses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Menunggu Verifikasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {metrics.totalDalamProses}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            {metrics.totalDitolak} berkas tidak lolos kriteria
          </span>
        </div>
      </div>

      {/* Grid: Kuota Program & Jadwal Lapangan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kuota & Serapan Bansos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Serapan Kuota Program Bansos 2026</h2>
              <p className="text-xs text-slate-500">Alokasi pagu anggaran dan realisasi penerima</p>
            </div>
            <Link
              href="/analitik"
              className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
            >
              <span>Analitik Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {metrics.alokasiProgram.map((prog, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{prog.nama}</span>
                  <span className="font-mono text-slate-600">
                    <strong className="text-slate-900">{prog.terisi}</strong> / {prog.kuota} Kuota ({prog.persen}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prog.persen > 85
                        ? 'bg-emerald-500'
                        : prog.persen > 60
                        ? 'bg-brand-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, prog.persen)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Kunjungan Lapangan RT Hari Ini */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Kunjungan Lapangan</span>
              </h2>
              <p className="text-xs text-slate-500">Jadwal survei RT hari ini</p>
            </div>
          </div>

          <div className="space-y-3">
            {metrics.jadwalKunjunganHariIni.map((jadwal) => (
              <div
                key={jadwal.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{jadwal.namaWarga}</span>
                  <span className="text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {jadwal.waktu}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {jadwal.alamat} (RT {jadwal.rt} / RW {jadwal.rw})
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-600 font-medium">
                    {jadwal.petugas}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      jadwal.status.includes('Selesai')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {jadwal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown per Kelurahan */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Rekapitulasi Data Bansos Tingkat Kelurahan / Desa
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Kelurahan</th>
                <th className="py-3 px-4">Warga Terdata</th>
                <th className="py-3 px-4">Warga Desil 1–2 (Ekstrem)</th>
                <th className="py-3 px-4">Total Usulan</th>
                <th className="py-3 px-4">Disetujui Kecamatan</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.rekapKelurahan.map((kel, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{kel.nama}</td>
                  <td className="py-3.5 px-4 font-mono">{kel.warga} jiwa</td>
                  <td className="py-3.5 px-4 font-mono text-rose-600 font-semibold">{kel.desil1_2} KK</td>
                  <td className="py-3.5 px-4 font-mono">{kel.pengajuan} berkas</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{kel.disetujui} SK</td>
                  <td className="py-3.5 px-4">
                    <Link
                      href="/approval"
                      className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                    >
                      Buka Inbox
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
