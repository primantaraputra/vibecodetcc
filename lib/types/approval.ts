import {
  StatusPengajuan,
  TahapApproval,
  AksiApproval,
  UserRole,
  KategoriKelayakan,
} from './database.types';

export interface ApprovalItem {
  id: string;
  nomor_pengajuan: string;
  warga_id: string;
  program_id: string;
  survei_id: string | null;
  wilayah_id: string;
  status: StatusPengajuan;
  alasan_status_terakhir: string | null;
  flag_tumpang_tindih: boolean;
  catatan_tumpang_tindih: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  warga: {
    id: string;
    nik: string;
    no_kk: string;
    nama_lengkap: string;
    alamat: string;
    rt: string | null;
    rw: string | null;
    pekerjaan: string | null;
    penghasilan_per_bulan: number;
    jumlah_tanggungan: number;
    is_disabilitas: boolean;
    is_lansia: boolean;
    is_anak_sekolah: boolean;
    telepon: string | null;
  };
  program: {
    id: string;
    kode_program: string;
    nama_program: string;
    anggaran_per_penerima: number;
    kriteria_desil_maks: number;
  };
  skor?: {
    skor_pmt: number;
    desil: number;
    kategori_kelayakan: KategoriKelayakan;
    rekomendasi_ai: string[] | null;
    penjelasan_skor_ai: string | null;
    flag_anomali: boolean;
  } | null;
  wilayah: {
    id: string;
    kode: string;
    nama: string;
    level: string;
  };
  riwayat_count?: number;
}

export interface RiwayatApprovalDetail {
  id: string;
  pengajuan_id: string;
  approver_id: string;
  role_approver: UserRole | string;
  tahap: TahapApproval;
  aksi: AksiApproval;
  alasan: string;
  created_at: string;
  approver_nama?: string;
}

export interface ApprovalDetailData extends ApprovalItem {
  riwayat: RiwayatApprovalDetail[];
}

export interface ApprovalActionPayload {
  pengajuanId: string;
  aksi: 'setujui' | 'tolak' | 'minta_revisi';
  alasan: string;
  simulatedRole?: UserRole; // For demo/simulation
}
