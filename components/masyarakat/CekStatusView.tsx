'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  FileText,
  Calendar,
  Layers,
  Info,
  CreditCard,
} from 'lucide-react';
import { searchWargaStatusByNik, WargaStatusResult } from '@/lib/actions/public';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { maskNIK, maskName } from '@/lib/utils';
import { Skeleton } from '@/components/ui';

export default function CekStatusView() {
  const [nikInput, setNikInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WargaStatusResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableWarga, setAvailableWarga] = useState<any[]>([]);

  useEffect(() => {
    localStorageManager.init();
    setAvailableWarga(localStorageManager.getWargaList());
    const unsubscribe = localStorageManager.subscribe(() => {
      setAvailableWarga(localStorageManager.getWargaList());
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nikInput || nikInput.length < 16) return;

    setIsLoading(true);
    try {
      // 1. Cek LocalStorage terlebih dahulu
      const localWarga = localStorageManager.findWargaByNikOrKk(nikInput);
      if (localWarga) {
        const pengajuanList = localStorageManager.getPengajuanList();
        const matchingPengajuan = pengajuanList.find(
          (p) => p.warga.nik === localWarga.nik || p.warga_id === localWarga.id
        );

        let stepper = 1;
        if (matchingPengajuan?.status === 'disetujui_rw') stepper = 2;
        else if (matchingPengajuan?.status === 'diverifikasi_kelurahan') stepper = 3;
        else if (matchingPengajuan?.status === 'disetujui_kecamatan' || matchingPengajuan?.status === 'tersalurkan') stepper = 4;
        else if (matchingPengajuan?.status?.includes('ditolak') || matchingPengajuan?.status?.includes('revisi')) stepper = -1;

        const localResult: WargaStatusResult = {
          found: true,
          nikMasked: maskNIK(localWarga.nik),
          namaMasked: maskName(localWarga.nama_lengkap),
          alamatMasked: `RT ${localWarga.rt} / RW ${localWarga.rw}`,
          wilayahNama: 'Kelurahan Mekarjaya, Kecamatan Sukamaju',
          desil: localWarga.desil || 1,
          kategoriKelayakan: localWarga.kategori_kelayakan || 'Sangat Miskin (Prioritas 1)',
          skorPmt: localWarga.skor_pmt || 85,
          penjelasanSkorAi:
            localWarga.penjelasan_skor_ai ||
            'Tingkat kelayakan kemiskinan hasil survei lapangan 14 variabel standar BPS.',
          rekomendasiAi: localWarga.rekomendasi_ai || ['PKH', 'BPNT'],
          pengajuanAktif: matchingPengajuan
            ? {
                id: matchingPengajuan.id,
                nomorPengajuan: matchingPengajuan.nomor_pengajuan,
                namaProgram: matchingPengajuan.program.nama_program,
                kodeProgram: matchingPengajuan.program.kode_program,
                status: matchingPengajuan.status,
                alasanStatusTerakhir: matchingPengajuan.alasan_status_terakhir || 'Dalam proses verifikasi.',
                tanggalDiusulkan: new Date(matchingPengajuan.created_at).toLocaleDateString('id-ID'),
                stepperStage: stepper,
                riwayat: [
                  {
                    tahap: 'Pengusulan Survei RT',
                    status: matchingPengajuan.status,
                    oleh: 'Petugas RT 01',
                    alasan: matchingPengajuan.alasan_status_terakhir || 'Proses verifikasi aktif.',
                    tanggal: new Date(matchingPengajuan.created_at).toLocaleDateString('id-ID'),
                  },
                ],
              }
            : undefined,
          riwayatBantuanMasaLalu: [
            {
              program: 'Bantuan Pangan Non Tunai (BPNT)',
              periode: 'Triwulan II 2026',
              nominal: 600000,
              statusPencairan: 'Tersalurkan',
              tanggalCair: '15 Juni 2026',
            },
          ],
        };

        setResult(localResult);
        setHasSearched(true);
        setIsLoading(false);
        return;
      }

      // Fallback ke server action
      const res = await searchWargaStatusByNik(nikInput);
      setResult(res);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuickNik = (identifier: string) => {
    setNikInput(identifier);
  };

  const getStepperStatusClass = (stepIndex: number, currentStage?: number) => {
    if (!currentStage) return 'bg-slate-200 text-slate-500 border-slate-300';
    if (currentStage === -1) return 'bg-rose-100 text-rose-700 border-rose-300';
    if (currentStage >= stepIndex) return 'bg-emerald-600 text-white border-emerald-600';
    return 'bg-slate-100 text-slate-400 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Search Box Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-civic-100 text-civic-700 flex items-center justify-center shadow-sm">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900">
              Cek Status Kelayakan Bansos (NIK / No. KK)
            </h1>
            <p className="text-xs text-slate-500">
              Pencarian transparan status kelayakan berbasis 16 digit NIK atau Nomor Kartu Keluarga
            </p>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <div>
            <span className="font-semibold block mb-0.5">Jaminan Perlindungan Privasi (UU PDP):</span>
            <p className="text-amber-700 leading-relaxed">
              Data yang ditampilkan ke publik telah disamarkan (*masked*). Titik koordinat GPS presisi
              dan informasi rahasia kependudukan tidak pernah diekspos ke publik untuk melindungi martabat
              warga.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="nik" className="block text-sm font-medium text-slate-700 mb-1">
              Nomor Induk Kependudukan (NIK) atau Nomor Kartu Keluarga (KK)
            </label>
            <div className="relative">
              <input
                id="nik"
                type="text"
                maxLength={16}
                value={nikInput}
                onChange={(e) => setNikInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Masukkan 16 digit NIK atau No. KK..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-base font-mono tracking-wider text-slate-800 placeholder:text-slate-400"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-mono text-slate-400">
                {nikInput.length}/16 digit
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || nikInput.length < 16}
            className="w-full bg-civic-600 hover:bg-civic-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cari Status Warga</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Test Pills */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Klik NIK tersimpan di LocalStorage untuk menguji coba pencarian:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {availableWarga.slice(0, 6).map((w) => (
              <button
                key={w.nik}
                type="button"
                onClick={() => handleSelectQuickNik(w.nik)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-100 hover:bg-civic-50 hover:text-civic-700 border border-slate-200 transition"
              >
                NIK: {w.nik} ({w.nama_lengkap} - Desil {w.desil || 1})
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelectQuickNik('3273010101850000')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
            >
              No. KK: 3273010101850000 (KK Budi)
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="w-16 h-16 rounded-xl" />
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <Skeleton className="h-4 w-52" />
              <div className="grid grid-cols-4 gap-2 py-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Section */}
      {!isLoading && hasSearched && result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Result */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                    Identitas: {result.nikMasked}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Terdaftar di DTKS
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">{result.namaMasked}</h2>
                <p className="text-xs text-slate-300">{result.wilayahNama}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right sm:text-right">
                  <span className="text-xs text-slate-300 block">Tingkat Kesejahteraan</span>
                  <span className="text-sm font-bold text-amber-300">
                    Desil {result.desil} ({result.kategoriKelayakan})
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex flex-col items-center justify-center font-mono font-bold text-white">
                  <span className="text-[10px] leading-none text-slate-300">DESIL</span>
                  <span className="text-sm leading-none text-amber-400 font-bold">{result.desil}</span>
                </div>
              </div>
            </div>

            {/* Stepper Status Pengajuan Berjenjang */}
            {result.pengajuanAktif ? (
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-medium text-civic-700 bg-civic-50 px-2.5 py-1 rounded-full border border-civic-200">
                      Pengajuan Aktif: {result.pengajuanAktif.namaProgram}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      Status Progres Verifikasi Berjenjang
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    No: {result.pengajuanAktif.nomorPengajuan}
                  </span>
                </div>

                {/* 4-Stage Visual Stepper */}
                <div className="py-4">
                  <div className="grid grid-cols-4 gap-2 relative">
                    {/* Stage 1 */}
                    <div className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition ${getStepperStatusClass(
                          1,
                          result.pengajuanAktif.stepperStage
                        )}`}
                      >
                        1
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Diusulkan RT</span>
                      <span className="text-[10px] text-slate-500">Survei Lapang</span>
                    </div>

                    {/* Stage 2 */}
                    <div className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition ${getStepperStatusClass(
                          2,
                          result.pengajuanAktif.stepperStage
                        )}`}
                      >
                        2
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Disetujui RW</span>
                      <span className="text-[10px] text-slate-500">Musyawarah RW</span>
                    </div>

                    {/* Stage 3 */}
                    <div className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition ${getStepperStatusClass(
                          3,
                          result.pengajuanAktif.stepperStage
                        )}`}
                      >
                        3
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Verifikasi Kelurahan</span>
                      <span className="text-[10px] text-slate-500">Kroscek Kuota</span>
                    </div>

                    {/* Stage 4 */}
                    <div className="flex flex-col items-center text-center space-y-1.5">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-xs font-bold transition ${getStepperStatusClass(
                          4,
                          result.pengajuanAktif.stepperStage
                        )}`}
                      >
                        4
                      </div>
                      <span className="text-xs font-semibold text-slate-800">Persetujuan Kecamatan</span>
                      <span className="text-[10px] text-slate-500">SK Final Camat</span>
                    </div>
                  </div>
                </div>

                {/* Status Callout Box */}
                <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-civic-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Catatan Status Terakhir:</span>
                    <p className="text-slate-600 mt-0.5">
                      {result.pengajuanAktif.alasanStatusTerakhir}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Tidak Ada Usulan Bansos Baru Aktif</h3>
                    <p className="text-xs text-slate-500">
                      Warga belum diusulkan pada periode bansos berjalan atau berada pada kategori non-prioritas.
                    </p>
                  </div>
                </div>
                <Link
                  href="/sanggahan"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-civic-50 text-civic-700 hover:bg-civic-100 transition border border-civic-200 flex items-center gap-1"
                >
                  <span>Ajukan Sanggahan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* AI Explainability & PMT Score Narrative */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Penjelasan AI Kelayakan & Skor PMT</h3>
                  <p className="text-xs text-slate-500">
                    Transparansi faktor penentu tingkat desil warga (Skor PMT: {result.skorPmt}/100)
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border border-indigo-100 text-slate-800 text-xs sm:text-sm leading-relaxed">
                <p>{result.penjelasanSkorAi}</p>

                {result.rekomendasiAi.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-indigo-100/60 flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-900">Program Terkait:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.rekomendasiAi.map((prog) => (
                        <span
                          key={prog}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-200/60 text-indigo-800"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Past Aid History Timeline */}
            <div className="p-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Riwayat Penerimaan Bantuan Sosial</h3>
                  <p className="text-xs text-slate-500">Catatan riwayat penyaluran masa lalu</p>
                </div>
              </div>

              {result.riwayatBantuanMasaLalu.length > 0 ? (
                <div className="space-y-3">
                  {result.riwayatBantuanMasaLalu.map((hist, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{hist.program}</span>
                        <span className="text-slate-500">{hist.periode}</span>
                      </div>
                      <div className="text-right space-y-0.5">
                        <span className="font-mono font-bold text-emerald-700 block">
                          Rp {hist.nominal.toLocaleString('id-ID')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> {hist.statusPencairan} ({hist.tanggalCair})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Belum ada catatan penerimaan bantuan sosial sebelumnya pada sistem terpadu.
                </p>
              )}
            </div>

            {/* Grievance / Sanggahan Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 text-center sm:text-left">
                <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Merasa data tidak sesuai atau keluarga berhak tapi belum menerima?</span>
              </div>
              <Link
                href="/sanggahan"
                className="w-full sm:w-auto px-4 py-2 bg-civic-600 hover:bg-civic-700 text-white rounded-lg font-medium transition text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Ajukan Sanggahan Resmi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
