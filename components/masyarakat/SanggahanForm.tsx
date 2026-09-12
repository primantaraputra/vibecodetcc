'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Send,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  ShieldCheck,
  User,
  Info,
} from 'lucide-react';
import { generateSanggahanLetter } from '@/lib/ai/assistant';
import { submitSanggahanAction } from '@/lib/actions/public';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { Skeleton } from '@/components/ui';

export default function SanggahanForm() {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<
    'layak_tidak_dapat' | 'desil_tidak_sesuai' | 'data_salah' | 'pemberhentian_sepihak' | 'lainnya'
  >('layak_tidak_dapat');
  const [kondisiRingkas, setKondisiRingkas] = useState('');
  const [tanggungan, setTanggungan] = useState(3);
  const [pekerjaan, setPekerjaan] = useState('Buruh Harian Lepas');
  const [dayaListrik, setDayaListrik] = useState('PLN 450 VA (Bersubsidi)');

  // AI Generated Draft State
  const [aiDraft, setAiDraft] = useState<{
    perihal: string;
    isiSurat: string;
    rekomendasiBukti: string[];
  } | null>(null);

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateAIDraft = () => {
    if (!kondisiRingkas.trim()) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      const draft = generateSanggahanLetter({
        nama,
        nik,
        kategori,
        kondisiRingkas,
        tanggungan,
        pekerjaan,
        dayaListrik,
      });
      setAiDraft(draft);
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik || !nama || !kondisiRingkas) return;

    setIsSubmitting(true);
    try {
      const generated = generateSanggahanLetter({
        nama,
        nik,
        kategori,
        kondisiRingkas,
        tanggungan,
        pekerjaan,
        dayaListrik,
      });

      // 1. Simpan ke LocalStorage
      const localRes = localStorageManager.saveSanggahan({
        nik,
        nama,
        kategori,
        kondisiRingkas,
        tanggungan,
        pekerjaan,
        dayaListrik,
        suratFormal: aiDraft?.isiSurat || generated.isiSurat,
      });

      // 2. Background sync
      try {
        await submitSanggahanAction({
          nik,
          nama,
          kategori,
          kondisiRingkas,
          tanggungan,
          pekerjaan,
          dayaListrik,
        });
      } catch {
        // Local storage has saved it
      }

      setSubmittedTicket(localRes.ticketNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLetter = () => {
    if (aiDraft?.isiSurat) {
      navigator.clipboard.writeText(aiDraft.isiSurat);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedTicket) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sanggahan Berhasil Terkirim
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-2">
            Pengajuan Keberatan Anda Telah Masuk Sistem
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Petugas Kesejahteraan Sosial Kelurahan & Kecamatan akan meneliti berkas serta menjadwalkan verifikasi lapang.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-1">
          <span className="text-xs text-slate-500">Nomor Registrasi Tiket Sanggahan:</span>
          <div className="text-sm font-mono font-bold text-civic-700 tracking-wider">
            {submittedTicket}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedTicket(null);
              setAiDraft(null);
              setKondisiRingkas('');
            }}
            className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg"
          >
            Ajukan Sanggahan Lain
          </button>
          <Link
            href="/cek-status"
            className="px-5 py-2.5 text-xs font-medium text-white bg-civic-600 hover:bg-civic-700 rounded-lg shadow-sm transition"
          >
            Kembali ke Cek Status Bansos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900">Formulir Sanggahan & Keberatan Warga</h1>
          <p className="text-xs text-slate-500">
            Saluran resmi pengajuan peninjauan ulang kelayakan bansos dengan bantuan penyusunan AI
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Pemohon */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-500" />
            <span>1. Identitas Pemohon</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Induk Kependudukan (NIK)
              </label>
              <input
                type="text"
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                placeholder="16 digit NIK kepala keluarga..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Sesuai KTP
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Keberatan / Sanggahan
              </label>
              <select
                value={kategori}
                onChange={(e) =>
                  setKategori(
                    e.target.value as
                      | 'layak_tidak_dapat'
                      | 'desil_tidak_sesuai'
                      | 'data_salah'
                      | 'pemberhentian_sepihak'
                      | 'lainnya'
                  )
                }
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
              >
                <option value="layak_tidak_dapat">Merasa Sangat Layak Tapi Belum Pernah Menerima</option>
                <option value="desil_tidak_sesuai">Penetapan Desil Tidak Sesuai Kondisi Riil</option>
                <option value="data_salah">Data Survei Lapangan Sebelumnya Salah/Keliru</option>
                <option value="pemberhentian_sepihak">Bantuan Tiba-Tiba Terhenti Sepihak</option>
                <option value="lainnya">Alasan Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pekerjaan Utama
              </label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                placeholder="Contoh: Buruh serabutan..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Catatan Singkat Warga & AI Assistant */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>2. Alasan & Kondisi Riil Lapangan (Dengan Asisten AI)</span>
            </h2>
            <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">
              AI Draft Assistant Aktif
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tuliskan Poin-Poin Singkat Kondisi Anda:
            </label>
            <textarea
              rows={3}
              value={kondisiRingkas}
              onChange={(e) => setKondisiRingkas(e.target.value)}
              placeholder="Contoh: Rumah masih lantai tanah, anak 3 masih sekolah SD & SMP, suami kena PHK bulan lalu, daya listrik meteran 450 watt..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Cukup tulis poin-poin sederhana. AI kami akan menyusunnya menjadi surat permohonan formal yang rapi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateAIDraft}
            disabled={isGeneratingAI || !kondisiRingkas.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 disabled:bg-indigo-50/50 text-indigo-700 border border-indigo-200 text-xs font-medium transition disabled:cursor-not-allowed"
          >
            {isGeneratingAI ? (
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingAI ? 'AI Sedang Menyusun Surat...' : '✨ Bantu Susun Surat Formal dengan AI'}</span>
          </button>

          {/* AI Drafting Skeleton */}
          {isGeneratingAI && (
            <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <Skeleton className="h-4 w-52" />
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          )}

          {/* AI Draft Result Preview */}
          {!isGeneratingAI && aiDraft && (
            <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Draf Surat Sanggahan Resmi (Disusun Otomatis):</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyLetter}
                  className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {aiDraft.isiSurat}
              </div>

              {/* Recommended Evidence */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Rekomendasi Dokumen / Foto Bukti Pendukung:
                </span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                  {aiDraft.rekomendasiBukti.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Upload Bukti File */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700">
            Unggah Foto / Dokumen Pendukung (KTP/KK/Foto Rumah)
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-slate-400 transition cursor-pointer bg-slate-50">
            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <span className="text-xs font-medium text-slate-700 block">
              Pilih file foto dari galeri atau kamera
            </span>
            <span className="text-[10px] text-slate-400">Format JPG/PNG/PDF (Maks 5 MB)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !nik || !nama || !kondisiRingkas}
          className="w-full bg-civic-600 hover:bg-civic-700 disabled:bg-slate-300 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Kirimkan Pengajuan Sanggahan Resmi</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
