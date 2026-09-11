'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Home,
  Zap,
  Droplet,
  Users,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SimulationState {
  statusRumah: string;
  jenisLantai: string;
  jenisDinding: string;
  dayaListrik: string;
  sumberAir: string;
  penghasilanBulan: number;
  jumlahTanggungan: number;
  pekerjaan: string;
  punyaMobil: boolean;
  punyaMotor: boolean;
}

export default function SimulasiMandiriView() {
  const [form, setForm] = useState<SimulationState>({
    statusRumah: 'milik_sendiri',
    jenisLantai: 'semen',
    jenisDinding: 'tembok_plester',
    dayaListrik: 'pln_900va',
    sumberAir: 'sumur_terlindung',
    penghasilanBulan: 1500000,
    jumlahTanggungan: 3,
    pekerjaan: 'buruh_harian',
    punyaMobil: false,
    punyaMotor: true,
  });

  const [hasCalculated, setHasCalculated] = useState(false);

  // Kalkulasi PMT Skor Sederhana (0 - 100) & Desil 1-10
  const calculateResult = () => {
    let score = 50;

    // Bobot Lantai & Dinding
    if (form.jenisLantai === 'tanah') score += 18;
    else if (form.jenisLantai === 'kayu_murah' || form.jenisLantai === 'semen') score += 8;
    else if (form.jenisLantai === 'keramik_mewah') score -= 20;

    if (form.jenisDinding === 'bambu_gedek') score += 15;
    else if (form.jenisDinding === 'kayu_papan') score += 8;
    else if (form.jenisDinding === 'tembok_plester') score -= 5;

    // Daya Listrik
    if (form.dayaListrik === 'non_pln' || form.dayaListrik === 'pln_450va') score += 14;
    else if (form.dayaListrik === 'pln_900va') score += 4;
    else score -= 20;

    // Air
    if (form.sumberAir === 'sungai' || form.sumberAir === 'sumur_tak_terlindung') score += 12;

    // Pengeluaran / Pendapatan per Kapita
    const perKapita = form.penghasilanBulan / Math.max(1, form.jumlahTanggungan + 1);
    if (perKapita < 400000) score += 20;
    else if (perKapita < 700000) score += 12;
    else if (perKapita < 1200000) score += 4;
    else if (perKapita > 2500000) score -= 25;

    // Aset
    if (form.punyaMobil) score -= 40;
    if (!form.punyaMotor && !form.punyaMobil) score += 8;

    score = Math.max(5, Math.min(98, score));

    // Desil mapping
    let desil = 5;
    let kategori = 'Menengah / Non-Prioritas';
    let rekomendasi: string[] = [];

    if (score >= 80) {
      desil = 1;
      kategori = 'Sangat Miskin (Prioritas Utama)';
      rekomendasi = ['Program Keluarga Harapan (PKH)', 'Bantuan Pangan Non Tunai (BPNT)', 'PBI-JK BPJS Gratis'];
    } else if (score >= 70) {
      desil = 2;
      kategori = 'Miskin (Prioritas 2)';
      rekomendasi = ['Bantuan Pangan Non Tunai (BPNT)', 'Bansos Daerah APBD', 'PBI-JK BPJS'];
    } else if (score >= 60) {
      desil = 3;
      kategori = 'Hampir Miskin (Prioritas 3)';
      rekomendasi = ['BPNT / Bantuan Sembako', 'BLT Dana Desa'];
    } else if (score >= 48) {
      desil = 4;
      kategori = 'Rentan Miskin (Desil 4)';
      rekomendasi = ['Bantuan Pelatihan Tenaga Kerja / UMKM'];
    } else {
      desil = Math.min(10, Math.floor(10 - (score / 10)));
      kategori = 'Mampu / Tidak Memenuhi Syarat Bansos Reguler';
      rekomendasi = ['Tidak direkomendasikan untuk bansos kemiskinan'];
    }

    return { score: Math.round(score), desil, kategori, rekomendasi, perKapita };
  };

  const result = calculateResult();

  return (
    <div className="space-y-6">
      {/* Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Simulasi Mandiri Kesejahteraan Warga</h1>
            <p className="text-xs text-slate-500">
              Kuesioner edukatif estimasi desil 1–10 berbasis 14 indikator kemiskinan standar BPS
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Catatan Edukasi:</strong> Hasil kalkulator ini adalah <em>estimasi awal</em> untuk
            membantu Anda memahami kriteria penetapan desil. Penetapan resmi tetap melalui verifikasi
            survei lapangan oleh Petugas RT dan Musyawarah Kelurahan.
          </p>
        </div>
      </div>

      {/* Form Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          1. Kondisi Fisik Tempat Tinggal
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Lantai Terluas
            </label>
            <select
              value={form.jenisLantai}
              onChange={(e) => setForm({ ...form, jenisLantai: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
            >
              <option value="tanah">Tanah</option>
              <option value="kayu_murah">Kayu Kualitas Rendah / Bambu</option>
              <option value="semen">Semen / Plester Kasar</option>
              <option value="keramik_sederhana">Keramik Biasa</option>
              <option value="keramik_mewah">Granit / Marmer Mewah</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jenis Dinding Rumah
            </label>
            <select
              value={form.jenisDinding}
              onChange={(e) => setForm({ ...form, jenisDinding: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
            >
              <option value="bambu_gedek">Bambu / Gedek / Rumbia</option>
              <option value="kayu_papan">Kayu Papan Tidak Rapat</option>
              <option value="tembok_tanpa_plester">Tembok Tanpa Plester (Batako Terbuka)</option>
              <option value="tembok_plester">Tembok Plester & Cat Rapi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Daya Listrik Rumah Tangga
            </label>
            <select
              value={form.dayaListrik}
              onChange={(e) => setForm({ ...form, dayaListrik: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
            >
              <option value="non_pln">Tanpa Listrik / Menumpang Tetangga</option>
              <option value="pln_450va">PLN 450 VA (Bersubsidi)</option>
              <option value="pln_900va">PLN 900 VA</option>
              <option value="pln_1300va">PLN 1300 VA</option>
              <option value="pln_2200va_plus">PLN 2200 VA ke atas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sumber Air Minum Utama
            </label>
            <select
              value={form.sumberAir}
              onChange={(e) => setForm({ ...form, sumberAir: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
            >
              <option value="sungai">Sungai / Mata Air Tak Terlindung</option>
              <option value="sumur_tak_terlindung">Sumur Terbuka Tak Terlindung</option>
              <option value="sumur_terlindung">Sumur Bor / Pompa Terlindung</option>
              <option value="pdam">PDAM / Air Bersih Perpipaan</option>
              <option value="air_isi_ulang">Air Isi Ulang Galon</option>
            </select>
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 pt-4">
          2. Kondisi Ekonomi & Anggota Keluarga
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pekerjaan Kepala Keluarga
            </label>
            <select
              value={form.pekerjaan}
              onChange={(e) => setForm({ ...form, pekerjaan: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
            >
              <option value="tidak_bekerja">Tidak Bekerja / Pengangguran</option>
              <option value="buruh_harian">Buruh Harian Lepas / Pemulung</option>
              <option value="pedagang_kecil">Pedagang Kecil / Keliling</option>
              <option value="karyawan_swasta">Karyawan Swasta / Buruh Pabrik</option>
              <option value="pns_tni_polri">PNS / TNI / POLRI / BUMN</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Anggota Keluarga / Tanggungan
            </label>
            <input
              type="number"
              min={0}
              max={12}
              value={form.jumlahTanggungan}
              onChange={(e) => setForm({ ...form, jumlahTanggungan: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Estimasi Total Pendapatan Seluruh Keluarga per Bulan (Rp)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={300000}
                max={6000000}
                step={100000}
                value={form.penghasilanBulan}
                onChange={(e) => setForm({ ...form, penghasilanBulan: Number(e.target.value) })}
                className="flex-1 accent-brand-600"
              />
              <span className="font-mono font-bold text-sm text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200">
                Rp {form.penghasilanBulan.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.punyaMobil}
                onChange={(e) => setForm({ ...form, punyaMobil: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Memiliki Mobil / Kendaraan Roda 4</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.punyaMotor}
                onChange={(e) => setForm({ ...form, punyaMotor: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>Memiliki Sepeda Motor</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Hitung Estimasi Desil Saya</span>
        </button>
      </div>

      {/* Simulation Result Box */}
      {hasCalculated && (
        <div className="bg-white rounded-2xl border-2 border-brand-500 shadow-md p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                Hasil Simulasi Mandiri
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Estimasi Kategori Kesejahteraan
              </h3>
              <p className="text-xs text-slate-500">
                Pendapatan per kapita keluarga: Rp {Math.round(result.perKapita).toLocaleString('id-ID')} / orang / bulan
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Skor Kelayakan</span>
                <span className="text-xl font-black text-brand-600 font-mono">
                  {result.score} <span className="text-xs text-slate-400">/ 100</span>
                </span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 text-white flex flex-col items-center justify-center shadow-md">
                <span className="text-[10px] uppercase font-bold text-brand-200">DESIL</span>
                <span className="text-2xl font-extrabold leading-none">{result.desil}</span>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
            <span className="font-bold text-slate-900 block">{result.kategori}</span>
            <p className="text-slate-600 leading-relaxed">
              {result.desil <= 3
                ? `Keluarga Anda berada pada kelompok desil prioritas (Desil ${result.desil}). Berdasarkan simulasi indikator kemiskinan dan pengeluaran per kapita, Anda berpotensi memenuhi kriteria penerima bantuan perlindungan sosial.`
                : `Keluarga Anda berada pada kelompok Desil ${result.desil}. Nilai aset dan pendapatan per kapita berada di atas garis kemiskinan ekstrem daerah, sehingga belum menjadi prioritas utama bansos reguler Kemensos.`}
            </p>
          </div>

          {/* Program Recommendations */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Potensi Program Bantuan yang Sesuai:
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.rekomendasi.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Next Steps Guidance */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
            <span className="font-bold block">Langkah Selanjutnya Jika Membutuhkan Bantuan:</span>
            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li>Siapkan dokumen fotokopi KTP dan Kartu Keluarga (KK).</li>
              <li>Hubungi Ketua RT setempat untuk didaftarkan dalam survei kunjungan lapangan.</li>
              <li>Petugas RT akan melakukan survei resmi dengan foto geolokasi dan verifikasi berjenjang.</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setHasCalculated(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Simulasi</span>
            </button>

            <Link
              href="/sanggahan"
              className="w-full sm:w-auto px-5 py-2.5 bg-civic-600 hover:bg-civic-700 text-white rounded-lg text-xs font-medium shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Ajukan Sanggahan Resmi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
