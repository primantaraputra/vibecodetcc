export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | 'super_admin'
  | 'petugas_kecamatan'
  | 'petugas_kelurahan'
  | 'petugas_rw'
  | 'petugas_rt'
  | 'masyarakat';

export type WilayahLevel = 'kecamatan' | 'kelurahan' | 'rw' | 'rt';

export type StatusPengajuan =
  | 'diusulkan_rt'
  | 'disetujui_rw'
  | 'ditolak_rw'
  | 'perlu_revisi_rw'
  | 'diverifikasi_kelurahan'
  | 'ditolak_kelurahan'
  | 'perlu_revisi_kelurahan'
  | 'disetujui_kecamatan'
  | 'ditolak_kecamatan'
  | 'tersalurkan'
  | 'dibatalkan';

export type KategoriKelayakan =
  | 'sangat_miskin'
  | 'miskin'
  | 'hampir_miskin'
  | 'rentan_miskin'
  | 'mampu';

export type AksiApproval = 'usulkan' | 'setujui' | 'tolak' | 'minta_revisi';
export type TahapApproval = 'rt' | 'rw' | 'kelurahan' | 'kecamatan';

export type StatusSanggahan = 'pending' | 'diverifikasi' | 'diterima' | 'ditolak';
export type StatusPengaduan =
  | 'menunggu_verifikasi'
  | 'dalam_investigasi'
  | 'terbukti_ditindaklanjuti'
  | 'tidak_terbukti'
  | 'ditutup';

export interface Database {
  public: {
    Tables: {
      wilayah: {
        Row: {
          id: string;
          kode: string;
          nama: string;
          level: WilayahLevel;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kode: string;
          nama: string;
          level: WilayahLevel;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kode?: string;
          nama?: string;
          level?: WilayahLevel;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'wilayah_parent_id_fkey';
            columns: ['parent_id'];
            isOneToOne: false;
            referencedRelation: 'wilayah';
            referencedColumns: ['id'];
          }
        ];
      };
      users: {
        Row: {
          id: string;
          nama_lengkap: string;
          email: string;
          nomor_telepon: string | null;
          nik: string | null;
          role: UserRole;
          wilayah_id: string | null;
          is_active: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nama_lengkap: string;
          email: string;
          nomor_telepon?: string | null;
          nik?: string | null;
          role: UserRole;
          wilayah_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama_lengkap?: string;
          email?: string;
          nomor_telepon?: string | null;
          nik?: string | null;
          role?: UserRole;
          wilayah_id?: string | null;
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'users_wilayah_id_fkey';
            columns: ['wilayah_id'];
            isOneToOne: false;
            referencedRelation: 'wilayah';
            referencedColumns: ['id'];
          }
        ];
      };
      warga: {
        Row: {
          id: string;
          nik: string;
          no_kk: string;
          nama_lengkap: string;
          tempat_lahir: string | null;
          tanggal_lahir: string;
          jenis_kelamin: 'L' | 'P';
          alamat: string;
          wilayah_id: string;
          rt: string | null;
          rw: string | null;
          status_keluarga: string;
          status_perkawinan: string | null;
          pekerjaan: string | null;
          pendidikan_terakhir: string | null;
          penghasilan_per_bulan: number;
          jumlah_tanggungan: number;
          is_disabilitas: boolean;
          is_lansia: boolean;
          is_anak_sekolah: boolean;
          telepon: string | null;
          foto_ktp_path: string | null;
          foto_kk_path: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nik: string;
          no_kk: string;
          nama_lengkap: string;
          tempat_lahir?: string | null;
          tanggal_lahir: string;
          jenis_kelamin: 'L' | 'P';
          alamat: string;
          wilayah_id: string;
          rt?: string | null;
          rw?: string | null;
          status_keluarga?: string;
          status_perkawinan?: string | null;
          pekerjaan?: string | null;
          pendidikan_terakhir?: string | null;
          penghasilan_per_bulan?: number;
          jumlah_tanggungan?: number;
          is_disabilitas?: boolean;
          is_lansia?: boolean;
          is_anak_sekolah?: boolean;
          telepon?: string | null;
          foto_ktp_path?: string | null;
          foto_kk_path?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nik?: string;
          no_kk?: string;
          nama_lengkap?: string;
          tempat_lahir?: string | null;
          tanggal_lahir?: string;
          jenis_kelamin?: 'L' | 'P';
          alamat?: string;
          wilayah_id?: string;
          rt?: string | null;
          rw?: string | null;
          status_keluarga?: string;
          status_perkawinan?: string | null;
          pekerjaan?: string | null;
          pendidikan_terakhir?: string | null;
          penghasilan_per_bulan?: number;
          jumlah_tanggungan?: number;
          is_disabilitas?: boolean;
          is_lansia?: boolean;
          is_anak_sekolah?: boolean;
          telepon?: string | null;
          foto_ktp_path?: string | null;
          foto_kk_path?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'warga_wilayah_id_fkey';
            columns: ['wilayah_id'];
            isOneToOne: false;
            referencedRelation: 'wilayah';
            referencedColumns: ['id'];
          }
        ];
      };
      survei_kesejahteraan: {
        Row: {
          id: string;
          warga_id: string;
          wilayah_id: string;
          petugas_id: string;
          periode_survei: string;
          status_kepemilikan_rumah: string;
          luas_lantai: number;
          jenis_lantai: string;
          jenis_dinding: string;
          jenis_atap: string;
          sumber_air_minum: string;
          jenis_jamban: string;
          pembuangan_akhir_tinja: string;
          daya_listrik: string;
          sumber_penerangan_utama: string;
          bahan_bakar_memasak: string;
          aset_tanah: boolean;
          aset_kendaraan: string;
          aset_ternak: boolean;
          pengeluaran_per_bulan: number;
          pengeluaran_makanan_per_bulan: number;
          pengeluaran_non_makanan_per_bulan: number;
          anggota_disabilitas_berat: number;
          anggota_penyakit_kronis: number;
          anggota_lansia: number;
          anggota_anak_sekolah: number;
          anggota_balita: number;
          ttd_warga_path: string | null;
          ttd_petugas_path: string | null;
          catatan_petugas: string | null;
          voice_note_transcript: string | null;
          status_verifikasi: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warga_id: string;
          wilayah_id: string;
          petugas_id: string;
          periode_survei?: string;
          status_kepemilikan_rumah?: string;
          luas_lantai?: number;
          jenis_lantai?: string;
          jenis_dinding?: string;
          jenis_atap?: string;
          sumber_air_minum?: string;
          jenis_jamban?: string;
          pembuangan_akhir_tinja?: string;
          daya_listrik?: string;
          sumber_penerangan_utama?: string;
          bahan_bakar_memasak?: string;
          aset_tanah?: boolean;
          aset_kendaraan?: string;
          aset_ternak?: boolean;
          pengeluaran_per_bulan?: number;
          pengeluaran_makanan_per_bulan?: number;
          pengeluaran_non_makanan_per_bulan?: number;
          anggota_disabilitas_berat?: number;
          anggota_penyakit_kronis?: number;
          anggota_lansia?: number;
          anggota_anak_sekolah?: number;
          anggota_balita?: number;
          ttd_warga_path?: string | null;
          ttd_petugas_path?: string | null;
          catatan_petugas?: string | null;
          voice_note_transcript?: string | null;
          status_verifikasi?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warga_id?: string;
          wilayah_id?: string;
          petugas_id?: string;
          periode_survei?: string;
          status_kepemilikan_rumah?: string;
          luas_lantai?: number;
          jenis_lantai?: string;
          jenis_dinding?: string;
          jenis_atap?: string;
          sumber_air_minum?: string;
          jenis_jamban?: string;
          pembuangan_akhir_tinja?: string;
          daya_listrik?: string;
          sumber_penerangan_utama?: string;
          bahan_bakar_memasak?: string;
          aset_tanah?: boolean;
          aset_kendaraan?: string;
          aset_ternak?: boolean;
          pengeluaran_per_bulan?: number;
          pengeluaran_makanan_per_bulan?: number;
          pengeluaran_non_makanan_per_bulan?: number;
          anggota_disabilitas_berat?: number;
          anggota_penyakit_kronis?: number;
          anggota_lansia?: number;
          anggota_anak_sekolah?: number;
          anggota_balita?: number;
          ttd_warga_path?: string | null;
          ttd_petugas_path?: string | null;
          catatan_petugas?: string | null;
          voice_note_transcript?: string | null;
          status_verifikasi?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'survei_kesejahteraan_warga_id_fkey';
            columns: ['warga_id'];
            isOneToOne: false;
            referencedRelation: 'warga';
            referencedColumns: ['id'];
          }
        ];
      };
      kunjungan_lapangan: {
        Row: {
          id: string;
          survei_id: string | null;
          warga_id: string;
          petugas_id: string;
          latitude: number;
          longitude: number;
          akurasi_meter: number | null;
          alamat_geocoding: string | null;
          foto_bukti_path: string;
          foto_meteran_listrik_path: string | null;
          foto_dapur_path: string | null;
          waktu_kunjungan: string;
          catatan_kunjungan: string | null;
          is_mock_offline: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          survei_id?: string | null;
          warga_id: string;
          petugas_id: string;
          latitude: number;
          longitude: number;
          akurasi_meter?: number | null;
          alamat_geocoding?: string | null;
          foto_bukti_path: string;
          foto_meteran_listrik_path?: string | null;
          foto_dapur_path?: string | null;
          waktu_kunjungan?: string;
          catatan_kunjungan?: string | null;
          is_mock_offline?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          survei_id?: string | null;
          warga_id?: string;
          petugas_id?: string;
          latitude?: number;
          longitude?: number;
          akurasi_meter?: number | null;
          alamat_geocoding?: string | null;
          foto_bukti_path?: string;
          foto_meteran_listrik_path?: string | null;
          foto_dapur_path?: string | null;
          waktu_kunjungan?: string;
          catatan_kunjungan?: string | null;
          is_mock_offline?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'kunjungan_lapangan_warga_id_fkey';
            columns: ['warga_id'];
            isOneToOne: false;
            referencedRelation: 'warga';
            referencedColumns: ['id'];
          }
        ];
      };
      skor_kelayakan: {
        Row: {
          id: string;
          warga_id: string;
          survei_id: string;
          skor_pmt: number;
          desil: number;
          kategori_kelayakan: KategoriKelayakan;
          rekomendasi_ai: Json | null;
          penjelasan_skor_ai: string | null;
          faktor_kunci: Json | null;
          flag_anomali: boolean;
          detail_anomali: string | null;
          periode: string;
          dihitung_pada: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warga_id: string;
          survei_id: string;
          skor_pmt: number;
          desil: number;
          kategori_kelayakan: KategoriKelayakan;
          rekomendasi_ai?: Json | null;
          penjelasan_skor_ai?: string | null;
          faktor_kunci?: Json | null;
          flag_anomali?: boolean;
          detail_anomali?: string | null;
          periode?: string;
          dihitung_pada?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warga_id?: string;
          survei_id?: string;
          skor_pmt?: number;
          desil?: number;
          kategori_kelayakan?: KategoriKelayakan;
          rekomendasi_ai?: Json | null;
          penjelasan_skor_ai?: string | null;
          faktor_kunci?: Json | null;
          flag_anomali?: boolean;
          detail_anomali?: string | null;
          periode?: string;
          dihitung_pada?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'skor_kelayakan_warga_id_fkey';
            columns: ['warga_id'];
            isOneToOne: false;
            referencedRelation: 'warga';
            referencedColumns: ['id'];
          }
        ];
      };
      program_bansos: {
        Row: {
          id: string;
          kode_program: string;
          nama_program: string;
          deskripsi: string | null;
          kriteria_desil_maks: number;
          kriteria_tambahan: Json | null;
          kuota: number;
          anggaran_per_penerima: number;
          periode_anggaran: string;
          is_aktif: boolean;
          allow_stacking: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kode_program: string;
          nama_program: string;
          deskripsi?: string | null;
          kriteria_desil_maks?: number;
          kriteria_tambahan?: Json | null;
          kuota?: number;
          anggaran_per_penerima?: number;
          periode_anggaran?: string;
          is_aktif?: boolean;
          allow_stacking?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kode_program?: string;
          nama_program?: string;
          deskripsi?: string | null;
          kriteria_desil_maks?: number;
          kriteria_tambahan?: Json | null;
          kuota?: number;
          anggaran_per_penerima?: number;
          periode_anggaran?: string;
          is_aktif?: boolean;
          allow_stacking?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pengajuan_bansos: {
        Row: {
          id: string;
          nomor_pengajuan: string;
          warga_id: string;
          program_id: string;
          survei_id: string | null;
          wilayah_id: string;
          status: StatusPengajuan;
          alasan_status_terakhir: string | null;
          diajukan_oleh: string | null;
          flag_tumpang_tindih: boolean;
          catatan_tumpang_tindih: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_pengajuan: string;
          warga_id: string;
          program_id: string;
          survei_id?: string | null;
          wilayah_id: string;
          status?: StatusPengajuan;
          alasan_status_terakhir?: string | null;
          diajukan_oleh?: string | null;
          flag_tumpang_tindih?: boolean;
          catatan_tumpang_tindih?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_pengajuan?: string;
          warga_id?: string;
          program_id?: string;
          survei_id?: string | null;
          wilayah_id?: string;
          status?: StatusPengajuan;
          alasan_status_terakhir?: string | null;
          diajukan_oleh?: string | null;
          flag_tumpang_tindih?: boolean;
          catatan_tumpang_tindih?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pengajuan_bansos_warga_id_fkey';
            columns: ['warga_id'];
            isOneToOne: false;
            referencedRelation: 'warga';
            referencedColumns: ['id'];
          }
        ];
      };
      riwayat_approval: {
        Row: {
          id: string;
          pengajuan_id: string;
          approver_id: string;
          role_approver: string;
          tahap: TahapApproval;
          aksi: AksiApproval;
          alasan: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pengajuan_id: string;
          approver_id: string;
          role_approver: string;
          tahap: TahapApproval;
          aksi: AksiApproval;
          alasan: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pengajuan_id?: string;
          approver_id?: string;
          role_approver?: string;
          tahap?: TahapApproval;
          aksi?: AksiApproval;
          alasan?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'riwayat_approval_pengajuan_id_fkey';
            columns: ['pengajuan_id'];
            isOneToOne: false;
            referencedRelation: 'pengajuan_bansos';
            referencedColumns: ['id'];
          }
        ];
      };
      sanggahan: {
        Row: {
          id: string;
          warga_id: string;
          pengajuan_id: string | null;
          pelapor_user_id: string | null;
          alasan_sanggahan: string;
          uraian_keluhan_ai_parsed: string | null;
          bukti_foto_path: string | null;
          bukti_dokumen_path: string | null;
          status_sanggahan: StatusSanggahan;
          petugas_penelaah_id: string | null;
          tanggapan_petugas: string | null;
          tanggal_tindak_lanjut: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          warga_id: string;
          pengajuan_id?: string | null;
          pelapor_user_id?: string | null;
          alasan_sanggahan: string;
          uraian_keluhan_ai_parsed?: string | null;
          bukti_foto_path?: string | null;
          bukti_dokumen_path?: string | null;
          status_sanggahan?: StatusSanggahan;
          petugas_penelaah_id?: string | null;
          tanggapan_petugas?: string | null;
          tanggal_tindak_lanjut?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          warga_id?: string;
          pengajuan_id?: string | null;
          pelapor_user_id?: string | null;
          alasan_sanggahan?: string;
          uraian_keluhan_ai_parsed?: string | null;
          bukti_foto_path?: string | null;
          bukti_dokumen_path?: string | null;
          status_sanggahan?: StatusSanggahan;
          petugas_penelaah_id?: string | null;
          tanggapan_petugas?: string | null;
          tanggal_tindak_lanjut?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'sanggahan_warga_id_fkey';
            columns: ['warga_id'];
            isOneToOne: false;
            referencedRelation: 'warga';
            referencedColumns: ['id'];
          }
        ];
      };
      pengaduan_publik: {
        Row: {
          id: string;
          judul: string;
          deskripsi: string;
          kategori: string;
          wilayah_id: string | null;
          terlapor_nama_atau_nik: string | null;
          is_anonim: boolean;
          pelapor_user_id: string | null;
          pelapor_nama_kontak: string | null;
          bukti_lampiran_path: string | null;
          status: StatusPengaduan;
          tanggapan_resmi: string | null;
          is_public_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          judul: string;
          deskripsi: string;
          kategori?: string;
          wilayah_id?: string | null;
          terlapor_nama_atau_nik?: string | null;
          is_anonim?: boolean;
          pelapor_user_id?: string | null;
          pelapor_nama_kontak?: string | null;
          bukti_lampiran_path?: string | null;
          status?: StatusPengaduan;
          tanggapan_resmi?: string | null;
          is_public_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          judul?: string;
          deskripsi?: string;
          kategori?: string;
          wilayah_id?: string | null;
          terlapor_nama_atau_nik?: string | null;
          is_anonim?: boolean;
          pelapor_user_id?: string | null;
          pelapor_nama_kontak?: string | null;
          bukti_lampiran_path?: string | null;
          status?: StatusPengaduan;
          tanggapan_resmi?: string | null;
          is_public_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifikasi: {
        Row: {
          id: string;
          user_id: string;
          judul: string;
          pesan: string;
          tipe: string;
          link_terkait: string | null;
          is_read: boolean;
          channel: 'in_app' | 'wa' | 'email';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          judul: string;
          pesan: string;
          tipe?: string;
          link_terkait?: string | null;
          is_read?: boolean;
          channel?: 'in_app' | 'wa' | 'email';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          judul?: string;
          pesan?: string;
          tipe?: string;
          link_terkait?: string | null;
          is_read?: boolean;
          channel?: 'in_app' | 'wa' | 'email';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'notifikasi_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          role: string | null;
          aksi: string;
          nama_tabel: string;
          record_id: string;
          data_lama: Json | null;
          data_baru: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          hash_sebelumnya: string | null;
          hash_sekarang: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          role?: string | null;
          aksi: string;
          nama_tabel: string;
          record_id: string;
          data_lama?: Json | null;
          data_baru?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          hash_sebelumnya?: string | null;
          hash_sekarang?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          role?: string | null;
          aksi?: string;
          nama_tabel?: string;
          record_id?: string;
          data_lama?: Json | null;
          data_baru?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          hash_sebelumnya?: string | null;
          hash_sekarang?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_current_user_wilayah_id: {
        Args: Record<PropertyKey, never>;
        Returns: string | null;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_wilayah_in_scope: {
        Args: {
          user_w_id: string;
          target_w_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
