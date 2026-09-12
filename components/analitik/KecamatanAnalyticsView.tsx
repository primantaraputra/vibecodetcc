'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  Download,
  FileSpreadsheet,
  Printer,
  PieChart,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Layers,
  Building,
  Users,
  Wallet,
  ShieldCheck,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import { DashboardMetrics, getAIExtendedExecutiveReport } from '@/lib/actions/analytics';
import { Skeleton } from '@/components/ui';

interface Props {
  metrics: DashboardMetrics;
}

export default function KecamatanAnalyticsView({ metrics }: Props) {
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const report = await getAIExtendedExecutiveReport();
      setAiReport(report);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleExportCSV = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const rows = [
      ['=== LAPORAN REKAPITULASI BANSOS SIKS-NG KECAMATAN SUKAMAJU ==='],
      ['Tanggal Cetak', new Date().toLocaleDateString('id-ID')],
      ['Total Penduduk Terdata', `${metrics.totalWarga} Jiwa`],
      ['Total Pengajuan Bansos', `${metrics.totalPengajuan} Berkas`],
      ['Total SK Disetujui', `${metrics.totalDisetujuiKecamatan} Penerima`],
      [''],
      ['--- REKAPITULASI PER KELURAHAN / DESA ---'],
      ['Kelurahan / Desa', 'Total Penduduk', 'Desil 1-2 (Prioritas)', 'Pengajuan', 'Disetujui SK', 'Rasio Persetujuan'],
      ...metrics.rekapKelurahan.map((k) => [
        k.nama,
        k.warga.toString(),
        k.desil1_2.toString(),
        k.pengajuan.toString(),
        k.disetujui.toString(),
        `${Math.round((k.disetujui / k.pengajuan) * 100)}%`,
      ]),
      [''],
      ['--- REKAPITULASI PROGRAM & ANGGARAN ---'],
      ['Nama Program', 'Kode', 'Pagu Kuota', 'Realisasi Penerima', 'Anggaran/Orang (Rp)', 'Total Anggaran Terserap (Rp)', 'Persentase Serapan'],
      ...metrics.alokasiProgram.map((p) => [
        p.nama,
        p.kode,
        p.kuota.toString(),
        p.terisi.toString(),
        p.anggaranPerOrang.toString(),
        (p.terisi * p.anggaranPerOrang).toString(),
        `${p.persen}%`,
      ]),
      [''],
      ['--- DISTRIBUSI DESIL KESEJAHTERAAN ---'],
      ['Desil', 'Jumlah KK', 'Kategori BPS'],
      ...Object.entries(metrics.sebaranDesil).map(([desil, count]) => [
        `Desil ${desil}`,
        count.toString(),
        Number(desil) === 1
          ? 'Sangat Miskin'
          : Number(desil) === 2
          ? 'Miskin'
          : Number(desil) <= 4
          ? 'Hampir/Rentan Miskin'
          : 'Menengah/Mampu',
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_siks_ng_kecamatan_sukamaju_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportMessage('Laporan SIKS-NG format CSV/Excel berhasil diunduh!');
    setTimeout(() => setExportMessage(null), 4000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Find max value for scaling desil bar chart
  const maxDesilCount = Math.max(...Object.values(metrics.sebaranDesil));
  const totalAnggaranTerserap = metrics.alokasiProgram.reduce(
    (acc, curr) => acc + curr.terisi * curr.anggaranPerOrang,
    0
  );
  const totalPaguAnggaran = metrics.alokasiProgram.reduce(
    (acc, curr) => acc + curr.kuota * curr.anggaranPerOrang,
    0
  );
  const persenSerapanTotal = Math.round((totalAnggaranTerserap / totalPaguAnggaran) * 100);

  return (
    <div className="space-y-6">
      {/* SCREEN-ONLY: Header Bar */}
      <div className="print:hidden bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center shadow-sm">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Analitik Wilayah & Laporan Eksekutif Kecamatan
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-100 text-brand-800">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualisasi distribusi desil kesejahteraan, serapan kuota bansos per desa, dan ringkasan kebijakan AI
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-200 flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor SIKS-NG (Excel/CSV)</span>
          </button>
          <button
            type="button"
            onClick={handlePrintPDF}
            className="px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak PDF Resmi (Kop Dinas)</span>
          </button>
        </div>
      </div>

      {exportMessage && (
        <div className="print:hidden p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* PRINT-ONLY: Official Government Kop Surat Header */}
      <div className="hidden print:block text-center border-b-4 border-double border-black pb-4 mb-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-black">
          Pemerintah Kabupaten Bandung
        </h2>
        <h1 className="text-xl font-extrabold uppercase tracking-widest text-black">
          Kecamatan Sukamaju
        </h1>
        <p className="text-xs text-gray-700">
          Jl. Raya Sukamaju No. 01 Telp. (022) 8765-4321 | Email: kec.sukamaju@bandungkab.go.id | Kode Pos 40287
        </p>
        <p className="text-[11px] font-bold mt-2 uppercase tracking-wide border-t border-black pt-1">
          LAPORAN REKAPITULASI PENYALURAN DAN KELAYAKAN BANTUAN SOSIAL TAHAP III TAHUN 2026
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Penduduk Terdata</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {metrics.totalWarga.toLocaleString('id-ID')} <span className="text-xs font-sans text-slate-400 font-normal">Jiwa</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Tersebar di 3 Kelurahan & 18 RW
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pengajuan Bansos</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {metrics.totalPengajuan} <span className="text-xs font-sans text-slate-400 font-normal">Berkas</span>
          </div>
          <div className="text-[11px] text-blue-600 font-semibold">
            {metrics.totalDalamProses} berkas dalam verifikasi
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Penerima SK Final</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {metrics.totalDisetujuiKecamatan} <span className="text-xs font-sans text-slate-400 font-normal">KK</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {Math.round((metrics.totalDisetujuiKecamatan / metrics.totalPengajuan) * 100)}% Rasio Approval
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Serapan Anggaran</span>
            <Wallet className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {persenSerapanTotal}%
          </div>
          <div className="text-[11px] text-emerald-700 font-bold truncate">
            Rp {totalAnggaranTerserap.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* AI Executive Summary Generator Section */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 border border-indigo-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-wide">
                  AI Policy Brief & Ringkasan Naratif Camat
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Claude AI Engine
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Sintesis otomatis profil kemiskinan, anomali data lapangan, dan rekomendasi kebijakan Muspika
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isGeneratingAI}
            className="print:hidden px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-400/70 text-slate-950 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isGeneratingAI ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-slate-950" />
            )}
            <span>{isGeneratingAI ? 'AI Sedang Menganalisis Data...' : '✨ Generate AI Brief'}</span>
          </button>
        </div>

        {/* AI Generating Skeleton */}
        {isGeneratingAI && (
          <div className="mt-4 p-5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm space-y-4 backdrop-blur-md animate-fadeIn">
            <div className="space-y-2 border-b border-white/10 pb-3">
              <Skeleton className="h-3.5 w-40 bg-white/20" />
              <Skeleton className="h-5 w-3/4 bg-white/20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full bg-white/20" />
              <Skeleton className="h-3 w-5/6 bg-white/20" />
              <Skeleton className="h-3 w-4/5 bg-white/20" />
            </div>
            <div className="pt-2 border-t border-white/10 space-y-2">
              <Skeleton className="h-3.5 w-32 bg-white/20" />
              <Skeleton className="h-3 w-2/3 bg-white/20" />
            </div>
          </div>
        )}

        {!isGeneratingAI && aiReport && (
          <div className="mt-4 p-5 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm space-y-4 backdrop-blur-md animate-fadeIn">
            <div className="border-b border-white/10 pb-2">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                HEADLINE LAPORAN EKSEKUTIF:
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                {aiReport.headline}
              </h3>
            </div>

            <p className="text-indigo-100 leading-relaxed">{aiReport.ringkasanEksekutif}</p>

            {/* Temuan Kunci */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-bold text-amber-300 block">Temuan Kunci:</span>
              <ul className="list-disc list-inside text-xs text-indigo-100 space-y-1">
                {aiReport.temuanKunci.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Rekomendasi */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-emerald-300 block">
                Rekomendasi Kebijakan Muspika:
              </span>
              <ul className="list-disc list-inside text-xs text-indigo-100 space-y-1">
                {aiReport.rekomendasiKebijakan.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Kelurahan Breakdown & Desil Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kelurahan Breakdown Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Sebaran Kelayakan per Kelurahan / Desa
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">3 Wilayah Administrasi</span>
          </div>

          <div className="space-y-3">
            {metrics.rekapKelurahan.map((kel, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/70 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{kel.nama}</span>
                  <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {kel.disetujui} SK Disetujui
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Warga:</span>
                    <span className="font-semibold text-slate-800">{kel.warga} Jiwa</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-500 font-bold block">Desil 1-2 (Prioritas):</span>
                    <span className="font-bold text-rose-700">{kel.desil1_2} KK</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Pengajuan:</span>
                    <span className="font-semibold text-slate-800">{kel.pengajuan} Berkas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart: Visual Desil Distribution (Desil 1 through 10) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Distribusi Desil Kesejahteraan (1 – 10)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Prioritas Desil 1–4
            </span>
          </div>

          {/* Visual Bar Chart */}
          <div className="space-y-2.5 pt-1">
            {Object.entries(metrics.sebaranDesil).map(([desilKey, count]) => {
              const desilNum = Number(desilKey);
              const percentage = Math.round((count / maxDesilCount) * 100);
              const isPriority = desilNum <= 3;

              return (
                <div key={desilKey} className="space-y-0.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold w-14 text-[11px] ${
                          isPriority ? 'text-rose-700 font-extrabold' : 'text-slate-700'
                        }`}
                      >
                        Desil {desilKey}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {desilNum === 1
                          ? 'Sangat Miskin'
                          : desilNum === 2
                          ? 'Miskin'
                          : desilNum === 3
                          ? 'Hampir Miskin'
                          : desilNum === 4
                          ? 'Rentan Miskin'
                          : 'Mampu / Non-Prioritas'}
                      </span>
                    </div>
                    <span className="font-mono text-slate-800 font-semibold text-[11px]">
                      {count} KK
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        desilNum === 1
                          ? 'bg-rose-600'
                          : desilNum === 2
                          ? 'bg-orange-500'
                          : desilNum === 3
                          ? 'bg-amber-500'
                          : desilNum === 4
                          ? 'bg-yellow-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Program Budget & Realization Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Analisis Serapan Anggaran & Kuota Program Bansos
            </h2>
            <p className="text-xs text-slate-500">
              Rekapitulasi alokasi pagu bansos APBN/APBD terhadap realisasi penyaluran per program
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            Total Serapan: Rp {totalAnggaranTerserap.toLocaleString('id-ID')} / Rp {totalPaguAnggaran.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Program Bansos</th>
                <th className="py-3 px-4">Pagu Kuota</th>
                <th className="py-3 px-4">Penerima SK</th>
                <th className="py-3 px-4">Anggaran / Orang</th>
                <th className="py-3 px-4">Total Anggaran Terserap</th>
                <th className="py-3 px-4">Status Kuota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.alokasiProgram.map((p, idx) => {
                const totalAnggaran = p.terisi * p.anggaranPerOrang;
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{p.nama}</div>
                      <span className="text-[10px] font-mono text-slate-400">Kode: {p.kode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{p.kuota} orang</td>
                    <td className="py-3.5 px-4 font-mono text-brand-700 font-bold">{p.terisi} orang</td>
                    <td className="py-3.5 px-4 font-mono">Rp {p.anggaranPerOrang.toLocaleString('id-ID')}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      Rp {totalAnggaran.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800">{p.persen}%</span>
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.persen >= 90 ? 'bg-rose-500' : p.persen >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${p.persen}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY: Official Signature & Approval Block */}
      <div className="hidden print:block pt-8 text-xs text-black">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala Seksi Kesejahteraan Sosial</p>
            <div className="h-20" />
            <p className="font-bold underline">DRA. RINA MARLINA</p>
            <p className="text-[10px] font-mono">NIP. 19780512 200312 2 004</p>
          </div>
          <div className="text-center">
            <p>Sukamaju, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold">Camat Sukamaju</p>
            <div className="h-20" />
            <p className="font-bold underline">DR. H. HENDRA GUNAWAN, M.SI</p>
            <p className="text-[10px] font-mono">NIP. 19720315 199803 1 002</p>
          </div>
        </div>
      </div>
    </div>
  );
}
