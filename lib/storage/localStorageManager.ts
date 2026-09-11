'use client';

import { SurveiFormData, PMTScoreResult } from '@/lib/types/survei';
import { ApprovalItem, ApprovalDetailData, RiwayatApprovalDetail } from '@/lib/types/approval';
import { UserRole } from '@/lib/types/database.types';
import { UserProfile } from '@/lib/types';
import { DEMO_USERS } from '@/lib/auth/demo-users';

// Storage Keys
export const STORAGE_KEYS = {
  WARGA: 'bansos_warga_v1',
  SURVEI: 'bansos_survei_v1',
  PENGAJUAN: 'bansos_pengajuan_v1',
  RIWAYAT_APPROVAL: 'bansos_riwayat_approval_v1',
  SANGGAHAN: 'bansos_sanggahan_v1',
  PENGADUAN: 'bansos_pengaduan_v1',
  USERS: 'bansos_users_v1',
  AUDIT_LOG: 'bansos_audit_log_v1',
  DRAFTS: 'bansos_drafts_v1',
  INITIALIZED: 'bansos_storage_initialized_v1',
};

// Event Name for reactive state synchronization across tabs/components
export const STORAGE_EVENT_NAME = 'bansos-storage-update';

export interface LocalWargaRecord {
  id: string;
  nik: string;
  no_kk: string;
  nama_lengkap: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin?: 'L' | 'P';
  alamat: string;
  wilayah_id?: string;
  rt: string;
  rw: string;
  pekerjaan?: string;
  pendidikan_terakhir?: string;
  penghasilan_per_bulan?: number;
  jumlah_tanggungan?: number;
  is_disabilitas?: boolean;
  is_lansia?: boolean;
  is_anak_sekolah?: boolean;
  telepon?: string | null;
  desil?: number;
  skor_pmt?: number;
  kategori_kelayakan?: string;
  penjelasan_skor_ai?: string;
  rekomendasi_ai?: string[];
  created_at: string;
  updated_at: string;
}

export interface LocalSurveiRecord {
  id: string;
  warga_id: string;
  nik: string;
  nama_lengkap: string;
  formData: SurveiFormData;
  scoreResult: PMTScoreResult;
  petugasId: string;
  petugasNama: string;
  createdAt: string;
}

export interface LocalSanggahanRecord {
  id: string;
  ticketNumber: string;
  nik: string;
  nama: string;
  kategori: string;
  kondisiRingkas: string;
  tanggungan: number;
  pekerjaan: string;
  dayaListrik: string;
  suratFormal: string;
  status: string;
  tanggal: string;
  createdAt: string;
}

export interface LocalPengaduanRecord {
  id: string;
  ticketNumber: string;
  isAnonim: boolean;
  namaPelapor: string;
  kontakPelapor?: string;
  kategori: string;
  wilayah: string;
  uraian: string;
  status: string;
  tanggapanPetugas?: string;
  tanggal: string;
  createdAt: string;
}

export interface LocalAuditRecord {
  id: string;
  waktu: string;
  aktor: string;
  role: string;
  tindakan: string;
  entitas: string;
  idEntitas: string;
  detail: string;
  ipAddress: string;
  hashSebelumnya: string;
  hashSaatIni: string;
  isTampered: boolean;
}

// --------------------------------------------------------------------------
// DEFAULT SEED DATA
// --------------------------------------------------------------------------
const DEFAULT_WARGA_SEEDS: LocalWargaRecord[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    nik: '3273010101850001',
    no_kk: '3273010101850000',
    nama_lengkap: 'Budi Santoso',
    alamat: 'Jl. Sukamaju No. 12, RT 01 / RW 01',
    rt: '01',
    rw: '01',
    pekerjaan: 'Buruh Bangunan Harian',
    penghasilan_per_bulan: 750000,
    jumlah_tanggungan: 4,
    is_disabilitas: false,
    is_lansia: false,
    is_anak_sekolah: true,
    telepon: '081234567890',
    desil: 1,
    skor_pmt: 88.75,
    kategori_kelayakan: 'Sangat Miskin (Prioritas 1)',
    penjelasan_skor_ai:
      'Keluarga Budi Santoso berada pada Desil 1 (Sangat Miskin) berdasarkan fakta lapangan: lantai tanah, dinding bambu, sanitasi belum layak, daya listrik 450VA, serta memiliki 2 anak usia sekolah dengan pengeluaran per kapita di bawah standar kemiskinan daerah.',
    rekomendasi_ai: ['PKH', 'BPNT'],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    nik: '3273010101600002',
    no_kk: '3273010101600000',
    nama_lengkap: 'Siti Aminah',
    alamat: 'Gang Mawar No. 5, RT 01 / RW 01',
    rt: '01',
    rw: '01',
    pekerjaan: 'Penjual Gorengan Keliling',
    penghasilan_per_bulan: 450000,
    jumlah_tanggungan: 1,
    is_disabilitas: false,
    is_lansia: true,
    is_anak_sekolah: false,
    telepon: '081298765432',
    desil: 2,
    skor_pmt: 74.2,
    kategori_kelayakan: 'Miskin (Prioritas 2)',
    penjelasan_skor_ai:
      'Keluarga Siti Aminah berada pada Desil 2 (Lansia Tunggal Rentan) dengan penghasilan non-formal tidak tetap dan sumber air sumur terlindung.',
    rekomendasi_ai: ['BANSOS_LANSIA', 'BPNT'],
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000003',
    nik: '3273010101920003',
    no_kk: '3273010101920000',
    nama_lengkap: 'Agus Supriatna',
    alamat: 'Jl. Melati No. 8, RT 02 / RW 01',
    rt: '02',
    rw: '01',
    pekerjaan: 'Karyawan Swasta',
    penghasilan_per_bulan: 3500000,
    jumlah_tanggungan: 2,
    is_disabilitas: false,
    is_lansia: false,
    is_anak_sekolah: false,
    telepon: '081345678901',
    desil: 6,
    skor_pmt: 38.5,
    kategori_kelayakan: 'Mampu / Tidak Prioritas',
    penjelasan_skor_ai:
      'Keluarga Agus Supriatna berada pada Desil 6 (Mampu) didukung oleh pendapatan tetap di atas UMR, lantai keramik, daya listrik PLN 1300VA, dan kepemilikan aset motor pribadi.',
    rekomendasi_ai: [],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000004',
    nik: '3273010101780004',
    no_kk: '3273010101780000',
    nama_lengkap: 'Ratna Dewi',
    alamat: 'Jl. Kenanga No. 14, RT 01 / RW 02',
    rt: '01',
    rw: '02',
    pekerjaan: 'Ibu Rumah Tangga / Penjahit Rumahan',
    penghasilan_per_bulan: 500000,
    jumlah_tanggungan: 3,
    is_disabilitas: true,
    is_lansia: false,
    is_anak_sekolah: true,
    telepon: '081567890123',
    desil: 2,
    skor_pmt: 79.5,
    kategori_kelayakan: 'Miskin (Prioritas 2)',
    penjelasan_skor_ai:
      'Memiliki anggota keluarga disabilitas fisik berat dan 1 anak usia SMP. Layak menerima program bantuan asistensi rehabilitasi sosial (ATENSI) & BPNT.',
    rekomendasi_ai: ['ATENSI_DISABILITAS', 'BPNT'],
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_PENGAJUAN_SEEDS: ApprovalItem[] = [
  {
    id: '90000000-0000-0000-0000-000000000001',
    nomor_pengajuan: 'PB-202609-0001',
    warga_id: '60000000-0000-0000-0000-000000000001',
    program_id: '50000000-0000-0000-0000-000000000001',
    survei_id: '70000000-0000-0000-0000-000000000001',
    wilayah_id: '40000000-0000-0000-0000-000000000001',
    status: 'diusulkan_rt',
    alasan_status_terakhir:
      'Diusulkan oleh Petugas RT 01 berdasarkan hasil survei lapangan & skor PMT Desil 1.',
    flag_tumpang_tindih: false,
    catatan_tumpang_tindih: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    warga: {
      id: '60000000-0000-0000-0000-000000000001',
      nik: '3273010101850001',
      no_kk: '3273010101850000',
      nama_lengkap: 'Budi Santoso',
      alamat: 'Jl. Sukamaju No. 12, RT 01 / RW 01',
      rt: '01',
      rw: '01',
      pekerjaan: 'Buruh Bangunan Harian',
      penghasilan_per_bulan: 750000,
      jumlah_tanggungan: 4,
      is_disabilitas: false,
      is_lansia: false,
      is_anak_sekolah: true,
      telepon: '081234567890',
    },
    program: {
      id: '50000000-0000-0000-0000-000000000001',
      kode_program: 'PKH',
      nama_program: 'Program Keluarga Harapan (PKH)',
      anggaran_per_penerima: 750000,
      kriteria_desil_maks: 2,
    },
    skor: {
      skor_pmt: 88.75,
      desil: 1,
      kategori_kelayakan: 'sangat_miskin',
      rekomendasi_ai: ['PKH', 'BPNT'],
      penjelasan_skor_ai:
        'Keluarga Budi Santoso berada pada Desil 1 (Sangat Miskin) dipengaruhi oleh lantai tanah, dinding bambu, penerangan 450VA, dan 2 anak usia sekolah dengan pengeluaran di bawah garis kemiskinan.',
      flag_anomali: false,
    },
    wilayah: {
      id: '40000000-0000-0000-0000-000000000001',
      kode: '32.73.01.1001.RW01.RT01',
      nama: 'RT 01 RW 01 Mekarjaya',
      level: 'rt',
    },
  },
  {
    id: '90000000-0000-0000-0000-000000000002',
    nomor_pengajuan: 'PB-202609-0002',
    warga_id: '60000000-0000-0000-0000-000000000002',
    program_id: '50000000-0000-0000-0000-000000000004',
    survei_id: '70000000-0000-0000-0000-000000000002',
    wilayah_id: '40000000-0000-0000-0000-000000000001',
    status: 'disetujui_rw',
    alasan_status_terakhir:
      'Disetujui dalam musyawarah RW 01: Ibu Siti adalah lansia tunggal pedagang kecil.',
    flag_tumpang_tindih: false,
    catatan_tumpang_tindih: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    warga: {
      id: '60000000-0000-0000-0000-000000000002',
      nik: '3273010101600002',
      no_kk: '3273010101600000',
      nama_lengkap: 'Siti Aminah',
      alamat: 'Gang Mawar No. 5, RT 01 / RW 01',
      rt: '01',
      rw: '01',
      pekerjaan: 'Penjual Gorengan Keliling',
      penghasilan_per_bulan: 450000,
      jumlah_tanggungan: 1,
      is_disabilitas: false,
      is_lansia: true,
      is_anak_sekolah: false,
      telepon: '081298765432',
    },
    program: {
      id: '50000000-0000-0000-0000-000000000004',
      kode_program: 'BANSOS_LANSIA',
      nama_program: 'Bansos Lansia Rentan APBD',
      anggaran_per_penerima: 400000,
      kriteria_desil_maks: 3,
    },
    skor: {
      skor_pmt: 74.2,
      desil: 2,
      kategori_kelayakan: 'miskin',
      rekomendasi_ai: ['BANSOS_LANSIA', 'BPNT'],
      penjelasan_skor_ai:
        'Keluarga Siti Aminah berada pada Desil 2 (Lansia Tunggal Rentan) dengan penghasilan non-formal tidak tetap.',
      flag_anomali: false,
    },
    wilayah: {
      id: '40000000-0000-0000-0000-000000000001',
      kode: '32.73.01.1001.RW01.RT01',
      nama: 'RT 01 RW 01 Mekarjaya',
      level: 'rt',
    },
  },
  {
    id: '90000000-0000-0000-0000-000000000003',
    nomor_pengajuan: 'PB-202609-0003',
    warga_id: '60000000-0000-0000-0000-000000000004',
    program_id: '50000000-0000-0000-0000-000000000005',
    survei_id: '70000000-0000-0000-0000-000000000004',
    wilayah_id: '40000000-0000-0000-0000-000000000003',
    status: 'diverifikasi_kelurahan',
    alasan_status_terakhir:
      'Validasi kelurahan: Memenuhi kriteria penerima Program Asistensi Disabilitas Berat.',
    flag_tumpang_tindih: false,
    catatan_tumpang_tindih: null,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    warga: {
      id: '60000000-0000-0000-0000-000000000004',
      nik: '3273010101780004',
      no_kk: '3273010101780000',
      nama_lengkap: 'Ratna Dewi',
      alamat: 'Jl. Kenanga No. 14, RT 01 / RW 02',
      rt: '01',
      rw: '02',
      pekerjaan: 'Penjahit Rumahan',
      penghasilan_per_bulan: 500000,
      jumlah_tanggungan: 3,
      is_disabilitas: true,
      is_lansia: false,
      is_anak_sekolah: true,
      telepon: '081567890123',
    },
    program: {
      id: '50000000-0000-0000-0000-000000000005',
      kode_program: 'ATENSI_DISABILITAS',
      nama_program: 'Program Asistensi Rehabilitasi Sosial Disabilitas',
      anggaran_per_penerima: 600000,
      kriteria_desil_maks: 3,
    },
    skor: {
      skor_pmt: 79.5,
      desil: 2,
      kategori_kelayakan: 'miskin',
      rekomendasi_ai: ['ATENSI_DISABILITAS', 'BPNT'],
      penjelasan_skor_ai: 'Disabilitas fisik berat terkonfirmasi faktual di lapangan.',
      flag_anomali: false,
    },
    wilayah: {
      id: '40000000-0000-0000-0000-000000000003',
      kode: '32.73.01.1001.RW02.RT01',
      nama: 'RT 01 RW 02 Mekarjaya',
      level: 'rt',
    },
  },
];

const DEFAULT_PENGADUAN_SEEDS: LocalPengaduanRecord[] = [
  {
    id: 'adu-001',
    ticketNumber: 'ADU-202609-0012',
    isAnonim: true,
    namaPelapor: 'Anonim',
    kontakPelapor: '',
    kategori: 'Penerima Fiktif / Salah Sasaran',
    wilayah: 'RW 02 Kelurahan Sariwangi',
    uraian: 'Ada warga yang memiliki mobil dan rumah tingkat tapi masih terdaftar sebagai penerima BPNT.',
    status: 'Sedang Diverifikasi Petugas Lapangan',
    tanggapanPetugas: 'Laporan telah diteruskan ke Petugas Kelurahan Sariwangi untuk dilakukan uji petik survei ulang.',
    tanggal: '02 Sep 2026',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: 'adu-002',
    ticketNumber: 'ADU-202609-0008',
    isAnonim: true,
    namaPelapor: 'Warga Mekarjaya',
    kontakPelapor: '',
    kategori: 'Pungli / Pemotongan Dana Bansos',
    wilayah: 'RW 01 Kelurahan Mekarjaya',
    uraian: 'Dugaan pemotongan biaya administrasi Rp 20.000 saat pengambilan sembako di salah satu agen.',
    status: 'Selesai Ditindaklanjuti',
    tanggapanPetugas: 'Tim Pengawas Kecamatan telah memanggil pengelola agen dan memberikan teguran keras tertulis serta mengembalikan dana warga.',
    tanggal: '28 Agt 2026',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: 'adu-003',
    ticketNumber: 'ADU-202609-0005',
    isAnonim: false,
    namaPelapor: 'Hendra Kusuma',
    kontakPelapor: '081233445566',
    kategori: 'Manipulasi Data Lapangan',
    wilayah: 'RW 01 Kelurahan Cibaduyut Asri',
    uraian: 'Keluarga disabilitas belum pernah dikunjungi oleh surveyor RT setempat.',
    status: 'Selesai Disurvei Lapang',
    tanggapanPetugas: 'Petugas RT dan Kelurahan telah melakukan kunjungan susulan tanggal 1 September 2026 dan mengusulkan program ATENSI.',
    tanggal: '25 Agt 2026',
    createdAt: new Date(Date.now() - 86400000 * 17).toISOString(),
  },
];

const DEFAULT_AUDIT_LOG_SEEDS: LocalAuditRecord[] = [
  {
    id: 'aud-001',
    waktu: '04 Sep 2026 09:30:15',
    aktor: 'Ahmad Ridwan (Petugas RT 01)',
    role: 'petugas_rt',
    tindakan: 'SUBMIT_SURVEI_LAPANGAN',
    entitas: 'survei_kesejahteraan',
    idEntitas: 'SURV-2026-001',
    detail: 'Input survei lapangan 14 variabel BPS + Foto Geotagging untuk Budi Santoso (Desil 1)',
    ipAddress: '10.0.4.12',
    hashSebelumnya: '0000000000000000000000000000000000000000000000000000000000000000',
    hashSaatIni: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    isTampered: false,
  },
  {
    id: 'aud-002',
    waktu: '04 Sep 2026 11:20:44',
    aktor: 'Ketua RW 01 Mekarjaya',
    role: 'petugas_rw',
    tindakan: 'APPROVAL_RW_SETUJU',
    entitas: 'pengajuan_bansos',
    idEntitas: 'PB-202609-0001',
    detail: 'Persetujuan Musyawarah RW 01: Warga sangat layak bansos PKH.',
    ipAddress: '192.168.1.15',
    hashSebelumnya: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    hashSaatIni: '3a5f82c198e09f582b130e6203cf36c0a00e57dd21b2b80a133a8a3ee2687c32',
    isTampered: false,
  },
  {
    id: 'aud-003',
    waktu: '04 Sep 2026 13:45:00',
    aktor: 'Kasi Kesos Kelurahan Mekarjaya',
    role: 'petugas_kelurahan',
    tindakan: 'VERIFIKASI_KELURAHAN_OK',
    entitas: 'pengajuan_bansos',
    idEntitas: 'PB-202609-0001',
    detail: 'Kroscek data kependudukan Dukcapil & alokasi kuota kelurahan terkonfirmasi valid.',
    ipAddress: '192.168.2.45',
    hashSebelumnya: '3a5f82c198e09f582b130e6203cf36c0a00e57dd21b2b80a133a8a3ee2687c32',
    hashSaatIni: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    isTampered: false,
  },
];

// Helper safe localStorage access
function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notifyStorageChange(key);
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

function notifyStorageChange(key: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(STORAGE_EVENT_NAME, { detail: { key, timestamp: Date.now() } })
  );
}

// --------------------------------------------------------------------------
// LOCAL STORAGE MANAGER ENGINE
// --------------------------------------------------------------------------
export const localStorageManager = {
  /**
   * Inisialisasi awal default seed data jika belum ada di localStorage
   */
  init(): void {
    if (typeof window === 'undefined') return;

    const isInitialized = window.localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      if (!window.localStorage.getItem(STORAGE_KEYS.WARGA)) {
        setStorage(STORAGE_KEYS.WARGA, DEFAULT_WARGA_SEEDS);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.PENGAJUAN)) {
        setStorage(STORAGE_KEYS.PENGAJUAN, DEFAULT_PENGAJUAN_SEEDS);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.PENGADUAN)) {
        setStorage(STORAGE_KEYS.PENGADUAN, DEFAULT_PENGADUAN_SEEDS);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)) {
        setStorage(STORAGE_KEYS.AUDIT_LOG, DEFAULT_AUDIT_LOG_SEEDS);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.USERS)) {
        const usersList: UserProfile[] = Object.values(DEMO_USERS);
        setStorage(STORAGE_KEYS.USERS, usersList);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.SURVEI)) {
        setStorage(STORAGE_KEYS.SURVEI, []);
      }
      if (!window.localStorage.getItem(STORAGE_KEYS.SANGGAHAN)) {
        setStorage(STORAGE_KEYS.SANGGAHAN, []);
      }
      window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  /**
   * Subscribe ke event update localStorage untuk real-time re-render
   */
  subscribe(callback: (detail?: any) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    };
    window.addEventListener(STORAGE_EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(STORAGE_EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  },

  // ------------------------------------------------------------------------
  // WARGA & CEK STATUS
  // ------------------------------------------------------------------------
  getWargaList(): LocalWargaRecord[] {
    return getStorage<LocalWargaRecord[]>(STORAGE_KEYS.WARGA, DEFAULT_WARGA_SEEDS);
  },

  findWargaByNikOrKk(queryNumber: string): LocalWargaRecord | undefined {
    const cleanNumber = queryNumber.trim().replace(/\D/g, '');
    if (!cleanNumber) return undefined;
    const list = this.getWargaList();
    return list.find((w) => w.nik === cleanNumber || w.no_kk === cleanNumber);
  },

  upsertWarga(warga: Partial<LocalWargaRecord> & { nik: string; nama_lengkap: string }): LocalWargaRecord {
    const list = this.getWargaList();
    const existingIndex = list.findIndex((w) => w.nik === warga.nik);
    const now = new Date().toISOString();

    let savedRecord: LocalWargaRecord;

    if (existingIndex >= 0) {
      savedRecord = {
        ...list[existingIndex],
        ...warga,
        updated_at: now,
      };
      list[existingIndex] = savedRecord;
    } else {
      savedRecord = {
        id: warga.id || `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        nik: warga.nik,
        no_kk: warga.no_kk || warga.nik,
        nama_lengkap: warga.nama_lengkap,
        alamat: warga.alamat || 'Alamat Belum Diisi',
        rt: warga.rt || '01',
        rw: warga.rw || '01',
        pekerjaan: warga.pekerjaan || 'Buruh Harian',
        penghasilan_per_bulan: warga.penghasilan_per_bulan || 0,
        jumlah_tanggungan: warga.jumlah_tanggungan || 1,
        is_disabilitas: warga.is_disabilitas || false,
        is_lansia: warga.is_lansia || false,
        is_anak_sekolah: warga.is_anak_sekolah || false,
        telepon: warga.telepon || null,
        desil: warga.desil || 1,
        skor_pmt: warga.skor_pmt || 80,
        kategori_kelayakan: warga.kategori_kelayakan || 'Sangat Miskin',
        penjelasan_skor_ai: warga.penjelasan_skor_ai || 'Tingkat kelayakan hasil survei lokal.',
        rekomendasi_ai: warga.rekomendasi_ai || ['PKH', 'BPNT'],
        created_at: now,
        updated_at: now,
      };
      list.unshift(savedRecord);
    }

    setStorage(STORAGE_KEYS.WARGA, list);
    return savedRecord;
  },

  // ------------------------------------------------------------------------
  // SURVEI LAPANGAN & OTOMATISASI PENGAJUAN
  // ------------------------------------------------------------------------
  getSurveiList(): LocalSurveiRecord[] {
    return getStorage<LocalSurveiRecord[]>(STORAGE_KEYS.SURVEI, []);
  },

  saveSurvei(
    formData: SurveiFormData,
    scoreResult: PMTScoreResult,
    petugasInfo: { id: string; nama: string; role: string }
  ): { survei: LocalSurveiRecord; pengajuan: ApprovalItem; nomorPengajuan: string } {
    const surveiId = `surv-${Date.now()}`;
    const pengajuanId = `pb-${Date.now()}`;
    const nomorPengajuan = `PB-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const now = new Date().toISOString();

    // 1. Upsert Warga Record
    const warga = this.upsertWarga({
      nik: formData.nik,
      no_kk: formData.no_kk || formData.nik,
      nama_lengkap: formData.nama_lengkap,
      alamat: formData.alamat,
      rt: formData.rt,
      rw: formData.rw,
      pekerjaan: formData.pekerjaan,
      penghasilan_per_bulan: formData.penghasilan_per_bulan,
      jumlah_tanggungan: formData.jumlah_tanggungan,
      is_disabilitas: formData.anggota_disabilitas_berat > 0,
      is_lansia: formData.anggota_lansia > 0,
      is_anak_sekolah: formData.anggota_anak_sekolah > 0,
      telepon: formData.telepon || null,
      desil: scoreResult.desil,
      skor_pmt: scoreResult.skor_pmt,
      kategori_kelayakan: scoreResult.kategori_kelayakan.replace('_', ' ').toUpperCase(),
      penjelasan_skor_ai: scoreResult.penjelasan_skor_ai,
      rekomendasi_ai: scoreResult.rekomendasi_program,
    });

    // 2. Simpan Survei
    const surveiList = this.getSurveiList();
    const newSurvei: LocalSurveiRecord = {
      id: surveiId,
      warga_id: warga.id,
      nik: formData.nik,
      nama_lengkap: formData.nama_lengkap,
      formData,
      scoreResult,
      petugasId: petugasInfo.id,
      petugasNama: petugasInfo.nama,
      createdAt: now,
    };
    surveiList.unshift(newSurvei);
    setStorage(STORAGE_KEYS.SURVEI, surveiList);

    // 3. Otomatis Buat Pengajuan Bansos di Inbox Approval
    const pengajuanList = this.getPengajuanList();
    const programName =
      formData.program_bansos_id?.includes('50000000-0000-0000-0000-000000000002') || scoreResult.rekomendasi_program.includes('BPNT')
        ? 'Bantuan Pangan Non Tunai (BPNT)'
        : 'Program Keluarga Harapan (PKH)';
    const programCode = programName.includes('BPNT') ? 'BPNT' : 'PKH';

    const newPengajuan: ApprovalItem = {
      id: pengajuanId,
      nomor_pengajuan: nomorPengajuan,
      warga_id: warga.id,
      program_id: formData.program_bansos_id || '50000000-0000-0000-0000-000000000001',
      survei_id: surveiId,
      wilayah_id: formData.wilayah_id || '40000000-0000-0000-0000-000000000001',
      status: 'diusulkan_rt',
      alasan_status_terakhir: `Diusulkan oleh Petugas RT berdasarkan survei lapangan (Skor PMT: ${scoreResult.skor_pmt}, Desil ${scoreResult.desil}).`,
      flag_tumpang_tindih: scoreResult.tumpang_tindih?.flag_tumpang_tindih || false,
      catatan_tumpang_tindih: scoreResult.tumpang_tindih?.pesan_tumpang_tindih || null,
      created_at: now,
      updated_at: now,
      warga: {
        id: warga.id,
        nik: warga.nik,
        no_kk: warga.no_kk,
        nama_lengkap: warga.nama_lengkap,
        alamat: warga.alamat,
        rt: warga.rt,
        rw: warga.rw,
        pekerjaan: warga.pekerjaan || 'Buruh Harian',
        penghasilan_per_bulan: warga.penghasilan_per_bulan || 0,
        jumlah_tanggungan: warga.jumlah_tanggungan || 1,
        is_disabilitas: warga.is_disabilitas || false,
        is_lansia: warga.is_lansia || false,
        is_anak_sekolah: warga.is_anak_sekolah || false,
        telepon: warga.telepon || null,
      },
      program: {
        id: formData.program_bansos_id || '50000000-0000-0000-0000-000000000001',
        kode_program: programCode,
        nama_program: programName,
        anggaran_per_penerima: programCode === 'PKH' ? 750000 : 200000,
        kriteria_desil_maks: 2,
      },
      skor: {
        skor_pmt: scoreResult.skor_pmt,
        desil: scoreResult.desil,
        kategori_kelayakan: scoreResult.kategori_kelayakan,
        rekomendasi_ai: scoreResult.rekomendasi_program,
        penjelasan_skor_ai: scoreResult.penjelasan_skor_ai,
        flag_anomali: scoreResult.anomali?.flag_anomali || false,
      },
      wilayah: {
        id: formData.wilayah_id || '40000000-0000-0000-0000-000000000001',
        kode: `32.73.01.1001.RW${formData.rw}.RT${formData.rt}`,
        nama: `RT ${formData.rt} RW ${formData.rw} Mekarjaya`,
        level: 'rt',
      },
    };

    pengajuanList.unshift(newPengajuan);
    setStorage(STORAGE_KEYS.PENGAJUAN, pengajuanList);

    // 4. Catat Audit Log
    this.addAuditLog({
      aktor: petugasInfo.nama || 'Petugas RT 01',
      role: petugasInfo.role || 'petugas_rt',
      tindakan: 'SUBMIT_SURVEI_LAPANGAN',
      entitas: 'survei_kesejahteraan',
      idEntitas: surveiId,
      detail: `Input survei lapangan 14 variabel BPS untuk warga ${formData.nama_lengkap} (NIK: ${formData.nik}). Skor PMT: ${scoreResult.skor_pmt}, Desil ${scoreResult.desil}. Nomor Pengajuan: ${nomorPengajuan}.`,
    });

    return { survei: newSurvei, pengajuan: newPengajuan, nomorPengajuan };
  },

  // ------------------------------------------------------------------------
  // PENGAJUAN & APPROVAL BERJENJANG
  // ------------------------------------------------------------------------
  getPengajuanList(): ApprovalItem[] {
    return getStorage<ApprovalItem[]>(STORAGE_KEYS.PENGAJUAN, DEFAULT_PENGAJUAN_SEEDS);
  },

  getPengajuanDetail(id: string): ApprovalDetailData | undefined {
    const list = this.getPengajuanList();
    const item = list.find((p) => p.id === id);
    if (!item) return undefined;

    const riwayatList = this.getRiwayatApproval(id);

    return {
      ...item,
      riwayat: riwayatList.length > 0 ? riwayatList : [
        {
          id: 'rw-init',
          pengajuan_id: item.id,
          approver_id: 'usr-petugas-rt-01',
          role_approver: 'petugas_rt',
          tahap: 'rt',
          aksi: 'usulkan',
          alasan: item.alasan_status_terakhir || 'Diusulkan berdasarkan survei lapangan.',
          created_at: item.created_at,
          approver_nama: 'Petugas RT 01',
        },
      ],
    };
  },

  updatePengajuanStatus(
    id: string,
    nextStatus: string,
    alasan: string,
    approver: { id: string; nama: string; role: string; tahap: string }
  ): boolean {
    const list = this.getPengajuanList();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const currentItem = list[index];
    const now = new Date().toISOString();

    list[index] = {
      ...currentItem,
      status: nextStatus as any,
      alasan_status_terakhir: alasan,
      updated_at: now,
    };
    setStorage(STORAGE_KEYS.PENGAJUAN, list);

    // Tambah riwayat approval
    const riwayatList = this.getRiwayatApproval(id);
    riwayatList.push({
      id: `rw-${Date.now()}`,
      pengajuan_id: id,
      approver_id: approver.id,
      role_approver: approver.role as UserRole,
      tahap: approver.tahap as any,
      aksi: (nextStatus.includes('setuju') || nextStatus.includes('verif') ? 'setujui' : nextStatus.includes('tolak') ? 'tolak' : 'minta_revisi') as any,
      alasan,
      created_at: now,
      approver_nama: approver.nama,
    });
    this.saveRiwayatApproval(id, riwayatList);

    // Catat Audit Log
    this.addAuditLog({
      aktor: approver.nama,
      role: approver.role,
      tindakan: `APPROVAL_${approver.role.toUpperCase()}_${nextStatus.toUpperCase()}`,
      entitas: 'pengajuan_bansos',
      idEntitas: currentItem.nomor_pengajuan,
      detail: `Keputusan approval [${nextStatus}] oleh ${approver.nama} (${approver.role}): "${alasan}"`,
    });

    return true;
  },

  getRiwayatApproval(pengajuanId: string): RiwayatApprovalDetail[] {
    const all = getStorage<Record<string, RiwayatApprovalDetail[]>>(STORAGE_KEYS.RIWAYAT_APPROVAL, {});
    return all[pengajuanId] || [];
  },

  saveRiwayatApproval(pengajuanId: string, history: RiwayatApprovalDetail[]): void {
    const all = getStorage<Record<string, RiwayatApprovalDetail[]>>(STORAGE_KEYS.RIWAYAT_APPROVAL, {});
    all[pengajuanId] = history;
    setStorage(STORAGE_KEYS.RIWAYAT_APPROVAL, all);
  },

  // ------------------------------------------------------------------------
  // SANGGAHAN WARGA
  // ------------------------------------------------------------------------
  getSanggahanList(): LocalSanggahanRecord[] {
    return getStorage<LocalSanggahanRecord[]>(STORAGE_KEYS.SANGGAHAN, []);
  },

  saveSanggahan(data: {
    nik: string;
    nama: string;
    kategori: string;
    kondisiRingkas: string;
    tanggungan: number;
    pekerjaan: string;
    dayaListrik: string;
    suratFormal: string;
  }): { ticketNumber: string; record: LocalSanggahanRecord } {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `SGH-202609-${randomSuffix}`;
    const now = new Date().toISOString();

    const record: LocalSanggahanRecord = {
      id: `sgh-${Date.now()}`,
      ticketNumber,
      nik: data.nik,
      nama: data.nama,
      kategori: data.kategori,
      kondisiRingkas: data.kondisiRingkas,
      tanggungan: data.tanggungan,
      pekerjaan: data.pekerjaan,
      dayaListrik: data.dayaListrik,
      suratFormal: data.suratFormal,
      status: 'Diajukan / Menunggu Verifikasi Lapangan',
      tanggal: new Date().toLocaleDateString('id-ID'),
      createdAt: now,
    };

    const list = this.getSanggahanList();
    list.unshift(record);
    setStorage(STORAGE_KEYS.SANGGAHAN, list);

    this.addAuditLog({
      aktor: `Warga (${data.nama} - NIK: ${data.nik.slice(0, 6)}******)`,
      role: 'masyarakat',
      tindakan: 'SUBMIT_SANGGAHAN_WARGA',
      entitas: 'sanggahan',
      idEntitas: ticketNumber,
      detail: `Pengajuan sanggahan kelayakan bansos [${data.kategori}] oleh warga ${data.nama}. Nomor Tiket: ${ticketNumber}.`,
    });

    return { ticketNumber, record };
  },

  // ------------------------------------------------------------------------
  // PENGADUAN & WHISTLEBLOWING
  // ------------------------------------------------------------------------
  getPengaduanList(): LocalPengaduanRecord[] {
    return getStorage<LocalPengaduanRecord[]>(STORAGE_KEYS.PENGADUAN, DEFAULT_PENGADUAN_SEEDS);
  },

  findPengaduanByTicket(ticketNumber: string): LocalPengaduanRecord | undefined {
    const clean = ticketNumber.trim().toUpperCase();
    const list = this.getPengaduanList();
    return list.find((p) => p.ticketNumber.toUpperCase() === clean);
  },

  savePengaduan(data: {
    isAnonim: boolean;
    namaPelapor: string;
    kontakPelapor?: string;
    kategori: string;
    wilayah: string;
    uraian: string;
  }): { ticketNumber: string; record: LocalPengaduanRecord } {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `ADU-202609-${randomSuffix}`;
    const now = new Date().toISOString();

    const record: LocalPengaduanRecord = {
      id: `adu-${Date.now()}`,
      ticketNumber,
      isAnonim: data.isAnonim,
      namaPelapor: data.isAnonim ? 'Anonim' : data.namaPelapor,
      kontakPelapor: data.kontakPelapor || '',
      kategori: data.kategori,
      wilayah: data.wilayah,
      uraian: data.uraian,
      status: 'Laporan Diterima (Menunggu Telaah Tim Pengawas)',
      tanggal: new Date().toLocaleDateString('id-ID'),
      createdAt: now,
    };

    const list = this.getPengaduanList();
    list.unshift(record);
    setStorage(STORAGE_KEYS.PENGADUAN, list);

    this.addAuditLog({
      aktor: data.isAnonim ? 'Pelapor Anonim' : data.namaPelapor,
      role: 'masyarakat',
      tindakan: 'SUBMIT_PENGADUAN_PUBLIK',
      entitas: 'pengaduan_publik',
      idEntitas: ticketNumber,
      detail: `Laporan pengaduan [${data.kategori}] di ${data.wilayah}. Nomor Tiket: ${ticketNumber}.`,
    });

    return { ticketNumber, record };
  },

  // ------------------------------------------------------------------------
  // USERS & REGISTRASI
  // ------------------------------------------------------------------------
  getUsers(): UserProfile[] {
    return getStorage<UserProfile[]>(STORAGE_KEYS.USERS, Object.values(DEMO_USERS));
  },

  registerUser(userData: {
    nama_lengkap: string;
    nik: string;
    email: string;
    telepon?: string;
    password?: string;
    role?: UserRole;
  }): UserProfile {
    const list = this.getUsers();
    const now = new Date().toISOString();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      nama_lengkap: userData.nama_lengkap,
      nik: userData.nik,
      email: userData.email.toLowerCase().trim(),
      role: userData.role || 'masyarakat',
      is_active: true,
      nomor_telepon: userData.telepon || null,
      wilayah_id: '40000000-0000-0000-0000-000000000001',
      avatar_url: null,
      created_at: now,
      updated_at: now,
    };

    list.unshift(newUser);
    setStorage(STORAGE_KEYS.USERS, list);

    // Auto add to Warga master record
    this.upsertWarga({
      nik: userData.nik,
      nama_lengkap: userData.nama_lengkap,
      telepon: userData.telepon || null,
      alamat: 'Warga Terdaftar Mandiri',
    });

    return newUser;
  },

  authenticateUser(email: string): UserProfile | undefined {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || DEMO_USERS[cleanEmail];
  },

  // ------------------------------------------------------------------------
  // AUDIT LOGGING (Append-Only Hash Chaining)
  // ------------------------------------------------------------------------
  getAuditLogs(): LocalAuditRecord[] {
    return getStorage<LocalAuditRecord[]>(STORAGE_KEYS.AUDIT_LOG, DEFAULT_AUDIT_LOG_SEEDS);
  },

  addAuditLog(entry: {
    aktor: string;
    role: string;
    tindakan: string;
    entitas: string;
    idEntitas: string;
    detail: string;
  }): LocalAuditRecord {
    const logs = this.getAuditLogs();
    const prevHash = logs.length > 0 ? logs[0].hashSaatIni : '0000000000000000000000000000000000000000000000000000000000000000';
    const id = `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const waktu = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Hash calculation simulator
    const dataString = `${prevHash}|${entry.tindakan}|${entry.idEntitas}|${now.toISOString()}`;
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = (hash << 5) - hash + dataString.charCodeAt(i);
      hash |= 0;
    }
    const hashSaatIni = Math.abs(hash).toString(16).padStart(64, 'a');

    const newLog: LocalAuditRecord = {
      id,
      waktu,
      aktor: entry.aktor,
      role: entry.role,
      tindakan: entry.tindakan,
      entitas: entry.entitas,
      idEntitas: entry.idEntitas,
      detail: entry.detail,
      ipAddress: '127.0.0.1 (Local Client)',
      hashSebelumnya: prevHash,
      hashSaatIni,
      isTampered: false,
    };

    logs.unshift(newLog);
    setStorage(STORAGE_KEYS.AUDIT_LOG, logs);
    return newLog;
  },

  // ------------------------------------------------------------------------
  // FORM DRAFTS (Auto-Save)
  // ------------------------------------------------------------------------
  saveDraft<T>(formKey: string, data: T): void {
    const drafts = getStorage<Record<string, any>>(STORAGE_KEYS.DRAFTS, {});
    drafts[formKey] = {
      data,
      savedAt: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.DRAFTS, drafts);
  },

  getDraft<T>(formKey: string): { data: T; savedAt: string } | null {
    const drafts = getStorage<Record<string, any>>(STORAGE_KEYS.DRAFTS, {});
    return drafts[formKey] || null;
  },

  clearDraft(formKey: string): void {
    const drafts = getStorage<Record<string, any>>(STORAGE_KEYS.DRAFTS, {});
    delete drafts[formKey];
    setStorage(STORAGE_KEYS.DRAFTS, drafts);
  },

  // ------------------------------------------------------------------------
  // STATISTIK & RINGKASAN DATA LOKAL
  // ------------------------------------------------------------------------
  getStats() {
    return {
      totalWarga: this.getWargaList().length,
      totalSurvei: this.getSurveiList().length,
      totalPengajuan: this.getPengajuanList().length,
      totalSanggahan: this.getSanggahanList().length,
      totalPengaduan: this.getPengaduanList().length,
      totalUsers: this.getUsers().length,
      totalAuditLogs: this.getAuditLogs().length,
    };
  },

  // ------------------------------------------------------------------------
  // SUPABASE EXPORTER: JSON & SQL SCRIPT GENERATOR
  // ------------------------------------------------------------------------
  exportAllAsJson(): string {
    const exportObject = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      storageType: 'localStorage-pre-supabase',
      stats: this.getStats(),
      data: {
        users: this.getUsers(),
        warga: this.getWargaList(),
        survei: this.getSurveiList(),
        pengajuan: this.getPengajuanList(),
        sanggahan: this.getSanggahanList(),
        pengaduan: this.getPengaduanList(),
        audit_logs: this.getAuditLogs(),
      },
    };
    return JSON.stringify(exportObject, null, 2);
  },

  exportAllAsSql(): string {
    const warga = this.getWargaList();
    const survei = this.getSurveiList();
    const pengajuan = this.getPengajuanList();
    const sanggahan = this.getSanggahanList();
    const pengaduan = this.getPengaduanList();

    let sql = `-- ==============================================================================
-- SI-BANSOS KECAMATAN: EXPORT DATA DARI LOCALSTORAGE KE SUPABASE DATABASE
-- Waktu Ekspor: ${new Date().toLocaleString('id-ID')}
-- Total: ${warga.length} Warga, ${survei.length} Survei, ${pengajuan.length} Pengajuan, ${sanggahan.length} Sanggahan, ${pengaduan.length} Pengaduan
-- ==============================================================================

BEGIN;

-- 1. INSERT DATA MASTER WARGA
`;

    warga.forEach((w) => {
      sql += `INSERT INTO public.warga (id, nik, no_kk, nama_lengkap, alamat, rt, rw, pekerjaan, penghasilan_per_bulan, jumlah_tanggungan, is_disabilitas, is_lansia, is_anak_sekolah, telepon, created_at, updated_at)
VALUES ('${w.id}', '${w.nik}', '${w.no_kk}', '${w.nama_lengkap.replace(/'/g, "''")}', '${w.alamat.replace(/'/g, "''")}', '${w.rt}', '${w.rw}', '${(w.pekerjaan || 'Buruh').replace(/'/g, "''")}', ${w.penghasilan_per_bulan || 0}, ${w.jumlah_tanggungan || 1}, ${w.is_disabilitas ? 'TRUE' : 'FALSE'}, ${w.is_lansia ? 'TRUE' : 'FALSE'}, ${w.is_anak_sekolah ? 'TRUE' : 'FALSE'}, ${w.telepon ? `'${w.telepon}'` : 'NULL'}, '${w.created_at}', '${w.updated_at}')
ON CONFLICT (nik) DO UPDATE SET nama_lengkap = EXCLUDED.nama_lengkap, updated_at = EXCLUDED.updated_at;\n\n`;
    });

    sql += `-- 2. INSERT PENGAJUAN BANSOS\n`;
    pengajuan.forEach((p) => {
      sql += `INSERT INTO public.pengajuan_bansos (id, nomor_pengajuan, warga_id, program_id, wilayah_id, status, alasan_status_terakhir, flag_tumpang_tindih, created_at, updated_at)
VALUES ('${p.id}', '${p.nomor_pengajuan}', '${p.warga_id}', '${p.program_id}', '${p.wilayah_id}', '${p.status}', '${(p.alasan_status_terakhir || '').replace(/'/g, "''")}', ${p.flag_tumpang_tindih ? 'TRUE' : 'FALSE'}, '${p.created_at}', '${p.updated_at}')
ON CONFLICT (id) DO NOTHING;\n\n`;
    });

    sql += `-- 3. INSERT PENGADUAN PUBLIK\n`;
    pengaduan.forEach((ad) => {
      sql += `INSERT INTO public.pengaduan_publik (nomor_tiket, nama_pelapor, is_anonim, kategori, wilayah, uraian, status, created_at)
VALUES ('${ad.ticketNumber}', '${ad.namaPelapor.replace(/'/g, "''")}', ${ad.isAnonim ? 'TRUE' : 'FALSE'}, '${ad.kategori.replace(/'/g, "''")}', '${ad.wilayah.replace(/'/g, "''")}', '${ad.uraian.replace(/'/g, "''")}', '${ad.status.replace(/'/g, "''")}', '${ad.createdAt}')
ON CONFLICT (nomor_tiket) DO NOTHING;\n\n`;
    });

    sql += `COMMIT;\n-- Selesai migrasi data LocalStorage ke Supabase!`;
    return sql;
  },

  // ------------------------------------------------------------------------
  // RESET & CLEANUP
  // ------------------------------------------------------------------------
  resetToDefaultSeeds(): void {
    if (typeof window === 'undefined') return;
    setStorage(STORAGE_KEYS.WARGA, DEFAULT_WARGA_SEEDS);
    setStorage(STORAGE_KEYS.PENGAJUAN, DEFAULT_PENGAJUAN_SEEDS);
    setStorage(STORAGE_KEYS.PENGADUAN, DEFAULT_PENGADUAN_SEEDS);
    setStorage(STORAGE_KEYS.AUDIT_LOG, DEFAULT_AUDIT_LOG_SEEDS);
    setStorage(STORAGE_KEYS.USERS, Object.values(DEMO_USERS));
    setStorage(STORAGE_KEYS.SURVEI, []);
    setStorage(STORAGE_KEYS.SANGGAHAN, []);
    setStorage(STORAGE_KEYS.RIWAYAT_APPROVAL, {});
    setStorage(STORAGE_KEYS.DRAFTS, {});
    window.localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    notifyStorageChange('ALL_RESET');
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    notifyStorageChange('ALL_CLEARED');
  },
};
