import { KategoriKelayakan } from './database.types';

export interface SurveiFormData {
  // Identitas Pokok Warga
  warga_id?: string;
  nik: string;
  no_kk: string;
  nama_lengkap: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  wilayah_id: string;
  rt: string;
  rw: string;
  status_keluarga: string;
  status_perkawinan: string;
  pekerjaan: string;
  pendidikan_terakhir: string;
  penghasilan_per_bulan: number;
  jumlah_tanggungan: number;
  telepon: string;

  // Kondisi Fisik Rumah & Sanitasi
  status_kepemilikan_rumah: 'milik_sendiri' | 'kontrak_sewa' | 'menumpang' | 'bebas_sewa';
  luas_lantai: number;
  jenis_lantai: 'tanah' | 'kayu_kualitas_rendah' | 'semen' | 'keramik' | 'marmer_granit';
  jenis_dinding: 'bambu_gedek' | 'kayu_kualitas_rendah' | 'tembok_tanpa_plester' | 'tembok_plester';
  jenis_atap: 'rumbia_ijuk' | 'seng' | 'asbes' | 'genteng_biasa' | 'genteng_keramik_beton';
  sumber_air_minum:
    | 'air_kemasan'
    | 'leding_pdam'
    | 'sumur_terlindung'
    | 'sumur_tak_terlindung'
    | 'mata_air'
    | 'sungai_danau'
    | 'air_hujan';
  jenis_jamban: 'sendiri_leher_angsa' | 'sendiri_plengsengan' | 'bersama_umum' | 'tidak_ada';
  pembuangan_akhir_tinja: 'tangki_septic' | 'kolam_sungai_laut' | 'lubang_tanah' | 'lainnya';
  daya_listrik: 'non_pln' | 'pln_450va' | 'pln_900va' | 'pln_1300va' | 'pln_gt_1300va';
  sumber_penerangan_utama: string;
  bahan_bakar_memasak: 'kayu_bakar' | 'minyak_tanah' | 'lpg_3kg' | 'lpg_12kg' | 'listrik_biogas';

  // Aset & Pengeluaran
  aset_tanah: boolean;
  aset_kendaraan: 'tidak_ada' | 'sepeda' | 'motor' | 'mobil';
  aset_ternak: boolean;
  pengeluaran_per_bulan: number;
  pengeluaran_makanan_per_bulan: number;
  pengeluaran_non_makanan_per_bulan: number;

  // Kerentanan Sosial
  anggota_disabilitas_berat: number;
  anggota_penyakit_kronis: number;
  anggota_lansia: number;
  anggota_anak_sekolah: number;
  anggota_balita: number;

  // Geolokasi & Kunjungan Lapangan
  latitude: number;
  longitude: number;
  akurasi_meter: number;
  alamat_geocoding: string;
  foto_bukti_path: string; // Base64 data url or storage path
  foto_meteran_listrik_path?: string;
  foto_dapur_path?: string;

  // Digital Signatures & Notes
  ttd_warga_path?: string;
  ttd_petugas_path?: string;
  catatan_petugas: string;
  voice_note_transcript?: string;

  // Pilihan Program Bantuan yang Diusulkan
  program_bansos_id: string;
}

export interface PMTScoreResult {
  skor_pmt: number; // 0 - 100
  desil: number; // 1 - 10
  kategori_kelayakan: KategoriKelayakan;
  penjelasan_skor_ai: string;
  rekomendasi_program: string[];
  faktor_kunci: Record<string, string | number>;
  anomali: {
    flag_anomali: boolean;
    pesan_anomali?: string;
  };
  tumpang_tindih: {
    flag_tumpang_tindih: boolean;
    pesan_tumpang_tindih?: string;
  };
}

export interface OfflineSurveiRecord {
  id: string;
  formData: SurveiFormData;
  scoreResult: PMTScoreResult;
  createdAt: string;
  status: 'pending_sync' | 'synced' | 'failed';
  errorMessage?: string;
}
