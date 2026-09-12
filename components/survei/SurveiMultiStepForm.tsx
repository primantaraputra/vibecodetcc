'use client';

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SurveiFormData, PMTScoreResult } from '@/lib/types/survei';
import { calculatePMTScore } from '@/lib/scoring/pmt';
import { CameraCapture } from './CameraCapture';
import { SignatureCanvas } from './SignatureCanvas';
import { VoiceInput } from './VoiceInput';
import { saveSurveiOffline } from '@/lib/offline/surveiStore';
import { submitSurveiLapang } from '@/lib/actions/survei';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { formatRupiah } from '@/lib/utils';
import {
  User,
  Home,
  DollarSign,
  Camera,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Send,
  ShieldCheck,
  Zap,
  Droplets,
  HeartHandshake,
  Save,
  RotateCcw,
} from 'lucide-react';

// Dynamic import for Leaflet (No SSR)
const LocationConfirmMap = dynamic(() => import('@/components/maps/LocationConfirmMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center text-xs text-slate-500">
      Memuat Peta Interaktif Leaflet...
    </div>
  ),
});

const INITIAL_FORM: SurveiFormData = {
  nik: '3273010101850001',
  no_kk: '3273010101850000',
  nama_lengkap: 'Budi Santoso (Dummy)',
  tempat_lahir: 'Bandung',
  tanggal_lahir: '1985-05-12',
  jenis_kelamin: 'L',
  alamat: 'Jl. Sukamaju No. 12, RT 01 / RW 01',
  wilayah_id: '40000000-0000-0000-0000-000000000001',
  rt: '01',
  rw: '01',
  status_keluarga: 'kepala_keluarga',
  status_perkawinan: 'kawin',
  pekerjaan: 'Buruh Bangunan Harian',
  pendidikan_terakhir: 'sd',
  penghasilan_per_bulan: 750000,
  jumlah_tanggungan: 4,
  telepon: '081234567890',

  status_kepemilikan_rumah: 'menumpang',
  luas_lantai: 28,
  jenis_lantai: 'tanah',
  jenis_dinding: 'bambu_gedek',
  jenis_atap: 'seng',
  sumber_air_minum: 'sumur_tak_terlindung',
  jenis_jamban: 'tidak_ada',
  pembuangan_akhir_tinja: 'lubang_tanah',
  daya_listrik: 'pln_450va',
  sumber_penerangan_utama: 'listrik_pln',
  bahan_bakar_memasak: 'kayu_bakar',

  aset_tanah: false,
  aset_kendaraan: 'tidak_ada',
  aset_ternak: false,
  pengeluaran_per_bulan: 650000,
  pengeluaran_makanan_per_bulan: 500000,
  pengeluaran_non_makanan_per_bulan: 150000,

  anggota_disabilitas_berat: 0,
  anggota_penyakit_kronis: 0,
  anggota_lansia: 0,
  anggota_anak_sekolah: 2,
  anggota_balita: 0,

  latitude: -6.9175,
  longitude: 107.6191,
  akurasi_meter: 15,
  alamat_geocoding: 'Jl. Sukamaju RT 01 / RW 01, Kelurahan Mekarjaya, Bandung',
  foto_bukti_path: '',
  catatan_petugas: 'Rumah berada di gang sempit dengan dinding anyaman bambu, atap bocor saat hujan.',
  program_bansos_id: '50000000-0000-0000-0000-000000000001', // PKH
};

export function SurveiMultiStepForm() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SurveiFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    nomorPengajuan?: string;
  } | null>(null);

  // Load draft and init localStorage on mount
  useEffect(() => {
    localStorageManager.init();
    const savedDraft = localStorageManager.getDraft<SurveiFormData>('survei_form');
    if (savedDraft?.data) {
      setHasDraft(true);
    }
  }, []);

  // Real-time PMT calculation
  const scoreResult = useMemo(() => calculatePMTScore(formData), [formData]);

  const updateField = (field: keyof SurveiFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorageManager.saveDraft('survei_form', updated);
      return updated;
    });
  };

  const handleRestoreDraft = () => {
    const savedDraft = localStorageManager.getDraft<SurveiFormData>('survei_form');
    if (savedDraft?.data) {
      setFormData(savedDraft.data);
      setHasDraft(false);
    }
  };

  const handleClearDraft = () => {
    localStorageManager.clearDraft('survei_form');
    setFormData(INITIAL_FORM);
    setHasDraft(false);
  };

  // Step names
  const steps = [
    { num: 1, label: 'Identitas', icon: User },
    { num: 2, label: 'Kondisi Rumah', icon: Home },
    { num: 3, label: 'Ekonomi', icon: DollarSign },
    { num: 4, label: 'Foto Kamera', icon: Camera },
    { num: 5, label: 'Geolokasi', icon: MapPin },
    { num: 6, label: 'Skor & Submit', icon: Sparkles },
  ];

  const handleNext = () => {
    setStep((prev) => Math.min(6, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitFinal = async () => {
    if (!formData.foto_bukti_path) {
      alert('Foto bukti kunjungan dari kamera wajib diambil pada Langkah 4.');
      setStep(4);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Simpan Utama ke LocalStorage
      const localResult = localStorageManager.saveSurvei(formData, scoreResult, {
        id: 'usr-petugas-rt-01',
        nama: 'Petugas RT 01',
        role: 'petugas_rt',
      });

      // Clear draft
      localStorageManager.clearDraft('survei_form');

      // 2. Coba kirim ke Supabase / Offline queue di latar belakang tanpa menghambat UI
      try {
        if (typeof window !== 'undefined' && !navigator.onLine) {
          await saveSurveiOffline(formData, scoreResult);
        } else {
          await submitSurveiLapang(formData, scoreResult);
        }
      } catch {
        // Abaikan error Supabase karena LocalStorage sudah menyimpan data
      }

      setSubmitResult({
        success: true,
        message: `Survei berhasil disimpan ke LocalStorage! Warga ${formData.nama_lengkap} terpetakan pada Desil ${scoreResult.desil} dan langsung muncul di Inbox Approval RW.`,
        nomorPengajuan: localResult.nomorPengajuan,
      });
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err?.message || 'Gagal menyimpan survei.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitResult?.success) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 text-center space-y-5 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Survei Lapangan Berhasil Disimpan!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            {submitResult.message}
          </p>
        </div>

        {submitResult.nomorPengajuan && (
          <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 max-w-sm mx-auto text-xs space-y-1">
            <div className="text-brand-700 font-medium">Nomor Usulan Bansos:</div>
            <div className="font-mono font-bold text-brand-950 text-sm">
              {submitResult.nomorPengajuan}
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto space-y-2 text-left">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Hasil Penilaian Objektif PMT:</span>
          </div>
          <div>
            • Desil Kesejahteraan: <strong>Desil {scoreResult.desil} ({scoreResult.kategori_kelayakan.replace('_', ' ').toUpperCase()})</strong>
          </div>
          <div>
            • Skor PMT: <strong>{scoreResult.skor_pmt} / 100</strong>
          </div>
          <div>
            • Rekomendasi Program: <strong>{scoreResult.rekomendasi_program.join(', ')}</strong>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmitResult(null);
              setStep(1);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
          >
            Input Survei Warga Baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Draft Recovery Banner */}
      {hasDraft && (
        <div className="bg-amber-50 border-b border-amber-200 p-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Ditemukan draft pengisian formulir survei sebelumnya di <strong>LocalStorage</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs transition"
            >
              Pulihkan Draft
            </button>
            <button
              type="button"
              onClick={handleClearDraft}
              className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold rounded-lg transition"
            >
              Abaikan
            </button>
          </div>
        </div>
      )}

      {/* Step Stepper Header (Mobile-First scrollable) */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
          {steps.map((st) => {
            const Icon = st.icon;
            const isDone = st.num < step;
            const isCurrent = st.num === step;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => setStep(st.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                  isCurrent
                    ? 'bg-brand-600 text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-white text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {st.num}. {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Steps Body */}
      <div className="p-4 sm:p-7 space-y-6">
        {/* ================= STEP 1: IDENTITAS WARGA ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 1: Data Pokok Kependudukan Warga
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Induk Kependudukan (NIK Dummy) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  value={formData.nik}
                  onChange={(e) => updateField('nik', e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Kartu Keluarga (No. KK) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  required
                  value={formData.no_kk}
                  onChange={(e) => updateField('no_kk', e.target.value.replace(/\D/g, ''))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Kepala Keluarga *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_lengkap}
                  onChange={(e) => updateField('nama_lengkap', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pekerjaan Utama</label>
                <input
                  type="text"
                  value={formData.pekerjaan}
                  onChange={(e) => updateField('pekerjaan', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penghasilan Rumah Tangga / Bulan (Rp)
                </label>
                <input
                  type="number"
                  value={formData.penghasilan_per_bulan}
                  onChange={(e) => updateField('penghasilan_per_bulan', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jumlah Anggota / Tanggungan (Jiwa) *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.jumlah_tanggungan}
                  onChange={(e) => updateField('jumlah_tanggungan', Math.max(1, Number(e.target.value)))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Domisili KTP
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => updateField('alamat', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: KONDISI RUMAH & SANITASI ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Home className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 2: Kondisi Fisik Rumah, Sanitasi & Fasilitas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Kepemilikan Bangunan
                </label>
                <select
                  value={formData.status_kepemilikan_rumah}
                  onChange={(e) => updateField('status_kepemilikan_rumah', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="milik_sendiri">Milik Sendiri</option>
                  <option value="kontrak_sewa">Kontrak / Sewa</option>
                  <option value="menumpang">Menumpang (Keluarga/Kerabat)</option>
                  <option value="bebas_sewa">Bebas Sewa</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Luas Lantai Bangunan (m²)
                </label>
                <input
                  type="number"
                  value={formData.luas_lantai}
                  onChange={(e) => updateField('luas_lantai', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jenis Lantai Terluas
                </label>
                <select
                  value={formData.jenis_lantai}
                  onChange={(e) => updateField('jenis_lantai', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="tanah">Tanah (Prioritas Miskin)</option>
                  <option value="kayu_kualitas_rendah">Kayu Kualitas Rendah</option>
                  <option value="semen">Semen / Plester Kasar</option>
                  <option value="keramik">Keramik</option>
                  <option value="marmer_granit">Marmer / Granit (Mewah)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jenis Dinding Terluas
                </label>
                <select
                  value={formData.jenis_dinding}
                  onChange={(e) => updateField('jenis_dinding', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="bambu_gedek">Bambu Gedek / Anyaman</option>
                  <option value="kayu_kualitas_rendah">Kayu Kualitas Rendah</option>
                  <option value="tembok_tanpa_plester">Tembok Tanpa Plester / Batako</option>
                  <option value="tembok_plester">Tembok Plester & Cat Rapi</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Atap Terluas</label>
                <select
                  value={formData.jenis_atap}
                  onChange={(e) => updateField('jenis_atap', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="rumbia_ijuk">Rumbia / Ijuk / Daun</option>
                  <option value="seng">Seng</option>
                  <option value="asbes">Asbes</option>
                  <option value="genteng_biasa">Genteng Biasa / Tanah Liat</option>
                  <option value="genteng_keramik_beton">Genteng Keramik / Beton Cor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Daya Listrik Terpasang
                </label>
                <select
                  value={formData.daya_listrik}
                  onChange={(e) => updateField('daya_listrik', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="non_pln">Non-PLN (Menumpang/Tidak Ada Listrik)</option>
                  <option value="pln_450va">PLN 450 VA (Bersubsidi Penuh)</option>
                  <option value="pln_900va">PLN 900 VA</option>
                  <option value="pln_1300va">PLN 1300 VA</option>
                  <option value="pln_gt_1300va">PLN &gt; 1300 VA</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fasilitas Jamban / BAB
                </label>
                <select
                  value={formData.jenis_jamban}
                  onChange={(e) => updateField('jenis_jamban', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="tidak_ada">Tidak Ada (Sungai/Kebun)</option>
                  <option value="bersama_umum">Jamban Bersama / Umum</option>
                  <option value="sendiri_plengsengan">Sendiri Plengsengan</option>
                  <option value="sendiri_leher_angsa">Sendiri Leher Angsa (Septic Tank)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sumber Air Minum Utama
                </label>
                <select
                  value={formData.sumber_air_minum}
                  onChange={(e) => updateField('sumber_air_minum', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="sumur_tak_terlindung">Sumur Tak Terlindung / Sungai</option>
                  <option value="sumur_terlindung">Sumur Terlindung / Pompa</option>
                  <option value="mata_air">Mata Air Alami / Air Hujan</option>
                  <option value="leding_pdam">Leding PDAM</option>
                  <option value="air_kemasan">Air Kemasan Galon Bermerek</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: EKONOMI & KERENTANAN ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 3: Pengeluaran, Kepemilikan Aset & Kerentanan
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pengeluaran Total Rumah Tangga / Bulan (Rp) *
                </label>
                <input
                  type="number"
                  value={formData.pengeluaran_per_bulan}
                  onChange={(e) => updateField('pengeluaran_per_bulan', Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kepemilikan Kendaraan
                </label>
                <select
                  value={formData.aset_kendaraan}
                  onChange={(e) => updateField('aset_kendaraan', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="tidak_ada">Tidak Ada Kendaraan</option>
                  <option value="sepeda">Sepeda Kayuh</option>
                  <option value="motor">Sepeda Motor</option>
                  <option value="mobil">Mobil Pribadi</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 sm:col-span-2">
                <div className="font-bold text-slate-900 text-xs">
                  Komponen Kerentanan Khusus (Jumlah Jiwa)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      Anak Usia Sekolah (SD/SMP/SMA)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.anggota_anak_sekolah}
                      onChange={(e) => updateField('anggota_anak_sekolah', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      Lansia (&gt;= 60 Tahun)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.anggota_lansia}
                      onChange={(e) => updateField('anggota_lansia', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      Penyandang Disabilitas Berat
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.anggota_disabilitas_berat}
                      onChange={(e) => updateField('anggota_disabilitas_berat', Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: FOTO KAMERA & VOICE ================= */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Camera className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 4: Bukti Kunjungan Kamera Langsung & Catatan Suara
              </h2>
            </div>

            <CameraCapture
              label="1. Foto Depan Rumah & Kondisi Bangunan Warga"
              required={true}
              value={formData.foto_bukti_path}
              onChange={(val) => updateField('foto_bukti_path', val)}
            />

            <VoiceInput
              label="Observasi Lapangan Petugas (Bisa Input Suara / Ketik)"
              value={formData.catatan_petugas}
              onChange={(val) => updateField('catatan_petugas', val)}
            />
          </div>
        )}

        {/* ================= STEP 5: GEOLOKASI & PETA LEAFLET ================= */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 5: Konfirmasi Titik Peta & Reverse Geocoding
              </h2>
            </div>

            <LocationConfirmMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              accuracy={formData.akurasi_meter}
              address={formData.alamat_geocoding}
              onLocationChange={(lat, lng, addr, acc) => {
                updateField('latitude', lat);
                updateField('longitude', lng);
                updateField('alamat_geocoding', addr);
                updateField('akurasi_meter', acc);
              }}
            />
          </div>
        )}

        {/* ================= STEP 6: SKOR PMT & SUBMIT FINAL ================= */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Langkah 6: Hasil Penilaian PMT AI & Persetujuan Digital
              </h2>
            </div>

            {/* AI PMT Result Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-brand-50 via-white to-emerald-50 border border-brand-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider">
                    Hasil Kalkulasi Skor Proxy Means Testing (PMT)
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    Desil {scoreResult.desil}{' '}
                    <span className="text-xs font-semibold text-brand-700">
                      ({scoreResult.kategori_kelayakan.replace('_', ' ').toUpperCase()})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Skor Indeks</div>
                  <div className="text-2xl font-extrabold text-brand-700">
                    {scoreResult.skor_pmt}
                    <span className="text-xs font-normal text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              {/* Anomaly / Overlap Alert if any */}
              {scoreResult.anomali.flag_anomali && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{scoreResult.anomali.pesan_anomali}</span>
                </div>
              )}

              {/* AI Narrative */}
              <div className="p-3 bg-white/90 rounded-xl border border-brand-100 text-xs text-slate-700 leading-relaxed">
                <strong>Narasi AI Explainability:</strong>
                <p className="mt-1">{scoreResult.penjelasan_skor_ai}</p>
              </div>

              {/* Program Selector */}
              <div className="pt-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Program Bansos yang Diusulkan Petugas RT:
                  </label>
                  <span className="text-[10px] text-brand-700 bg-brand-50 px-2 py-0.5 rounded font-medium border border-brand-200">
                    Saran AI (Bukan Keputusan Final)
                  </span>
                </div>
                <select
                  value={formData.program_bansos_id}
                  onChange={(e) => updateField('program_bansos_id', e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-brand-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                >
                  <option value="50000000-0000-0000-0000-000000000001">
                    PKH - Program Keluarga Harapan (Rekomendasi AI)
                  </option>
                  <option value="50000000-0000-0000-0000-000000000002">
                    BPNT - Bantuan Pangan Non Tunai (Sembako)
                  </option>
                  <option value="50000000-0000-0000-0000-000000000003">
                    BLT Dana Desa (BLT-DD)
                  </option>
                  <option value="50000000-0000-0000-0000-000000000004">
                    Bansos Khusus Lansia Rentan
                  </option>
                  <option value="50000000-0000-0000-0000-000000000005">
                    ATENSI - Asistensi Rehabilitasi Disabilitas
                  </option>
                </select>
                <p className="text-[10px] text-slate-500 italic">
                  *Prinsip Wajib: AI hanya membantu menyajikan rekomendasi indikator. Penetapan kelayakan dan keputusan akhir sepenuhnya wewenang verifikasi musyawarah petugas (RT/RW/Kelurahan/Kecamatan).
                </p>
              </div>
            </div>

            {/* Signature Canvases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <SignatureCanvas
                label="Tanda Tangan Digital Warga / Responden"
                value={formData.ttd_warga_path}
                onChange={(val) => updateField('ttd_warga_path', val)}
              />
              <SignatureCanvas
                label="Tanda Tangan Digital Petugas Surveyor RT"
                value={formData.ttd_petugas_path}
                onChange={(val) => updateField('ttd_petugas_path', val)}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
            >
              <span>Lanjut: {steps[step]?.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmitFinal}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-700/80 shadow-md transition disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Menyimpan Survei...' : 'Kirim Survei & Usulkan ke RW'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
