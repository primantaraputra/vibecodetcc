import { Database } from './database.types';

export * from './database.types';

export type Wilayah = Database['public']['Tables']['wilayah']['Row'];
export type UserProfile = Database['public']['Tables']['users']['Row'];
export type Warga = Database['public']['Tables']['warga']['Row'];
export type SurveiKesejahteraan = Database['public']['Tables']['survei_kesejahteraan']['Row'];
export type KunjunganLapangan = Database['public']['Tables']['kunjungan_lapangan']['Row'];
export type SkorKelayakan = Database['public']['Tables']['skor_kelayakan']['Row'];
export type ProgramBansos = Database['public']['Tables']['program_bansos']['Row'];
export type PengajuanBansos = Database['public']['Tables']['pengajuan_bansos']['Row'];
export type RiwayatApproval = Database['public']['Tables']['riwayat_approval']['Row'];
export type Sanggahan = Database['public']['Tables']['sanggahan']['Row'];
export type PengaduanPublik = Database['public']['Tables']['pengaduan_publik']['Row'];
export type Notifikasi = Database['public']['Tables']['notifikasi']['Row'];
export type AuditLog = Database['public']['Tables']['audit_log']['Row'];

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  profile: UserProfile | null;
  role: Database['public']['Tables']['users']['Row']['role'] | 'anon';
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
}
