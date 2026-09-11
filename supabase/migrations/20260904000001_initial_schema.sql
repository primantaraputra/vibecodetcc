-- ==============================================================================
-- SISTEM CEK KELAYAKAN BANSOS & PENDATAAN TERPADU KECAMATAN
-- Migration 01: Initial Schema (13 Tables, Enums, Constraints, Triggers & Hash Chain)
-- ==============================================================================

-- Enable pgcrypto for UUID and Cryptographic Hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Helper Functions: updated_at trigger
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 2. TABEL: wilayah (Hierarki Kecamatan -> Kelurahan -> RW -> RT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wilayah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(150) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('kecamatan', 'kelurahan', 'rw', 'rt')),
    parent_id UUID REFERENCES public.wilayah(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_wilayah_parent_id ON public.wilayah(parent_id);
CREATE INDEX IF NOT EXISTS idx_wilayah_level ON public.wilayah(level);

CREATE TRIGGER trg_wilayah_updated_at
    BEFORE UPDATE ON public.wilayah
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 3. TABEL: users (Profil Petugas & Admin terintegrasi Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama_lengkap VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nomor_telepon VARCHAR(50),
    nik VARCHAR(16) UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_admin',
        'petugas_kecamatan',
        'petugas_kelurahan',
        'petugas_rw',
        'petugas_rt',
        'masyarakat'
    )),
    wilayah_id UUID REFERENCES public.wilayah(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_wilayah_id ON public.users(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_users_nik ON public.users(nik);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. TABEL: warga (Data Induk Warga Sintetis / Dummy)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.warga (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nik VARCHAR(16) NOT NULL UNIQUE,
    no_kk VARCHAR(16) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    tempat_lahir VARCHAR(100),
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(1) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    alamat TEXT NOT NULL,
    wilayah_id UUID NOT NULL REFERENCES public.wilayah(id) ON DELETE RESTRICT,
    rt VARCHAR(10),
    rw VARCHAR(10),
    status_keluarga VARCHAR(50) NOT NULL DEFAULT 'kepala_keluarga' CHECK (
        status_keluarga IN ('kepala_keluarga', 'istri', 'anak', 'famili_lain')
    ),
    status_perkawinan VARCHAR(50) DEFAULT 'kawin' CHECK (
        status_perkawinan IN ('belum_kawin', 'kawin', 'cerai_hidup', 'cerai_mati')
    ),
    pekerjaan VARCHAR(100) DEFAULT 'buruh_harian_lepas',
    pendidikan_terakhir VARCHAR(50) DEFAULT 'sd',
    penghasilan_per_bulan NUMERIC(15,2) DEFAULT 0,
    jumlah_tanggungan INT DEFAULT 1,
    is_disabilitas BOOLEAN DEFAULT false,
    is_lansia BOOLEAN DEFAULT false,
    is_anak_sekolah BOOLEAN DEFAULT false,
    telepon VARCHAR(50),
    foto_ktp_path TEXT,
    foto_kk_path TEXT,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_warga_nik ON public.warga(nik);
CREATE INDEX IF NOT EXISTS idx_warga_no_kk ON public.warga(no_kk);
CREATE INDEX IF NOT EXISTS idx_warga_wilayah_id ON public.warga(wilayah_id);

CREATE TRIGGER trg_warga_updated_at
    BEFORE UPDATE ON public.warga
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. TABEL: survei_kesejahteraan (Form Survei & Variabel Kemiskinan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.survei_kesejahteraan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warga_id UUID NOT NULL REFERENCES public.warga(id) ON DELETE CASCADE,
    wilayah_id UUID NOT NULL REFERENCES public.wilayah(id) ON DELETE RESTRICT,
    petugas_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    periode_survei VARCHAR(20) NOT NULL DEFAULT '2026-Q1',
    -- Kondisi Rumah & Bangunan
    status_kepemilikan_rumah VARCHAR(50) NOT NULL DEFAULT 'milik_sendiri' CHECK (
        status_kepemilikan_rumah IN ('milik_sendiri', 'kontrak_sewa', 'menumpang', 'bebas_sewa')
    ),
    luas_lantai NUMERIC(8,2) NOT NULL DEFAULT 36.0,
    jenis_lantai VARCHAR(50) NOT NULL DEFAULT 'tanah' CHECK (
        jenis_lantai IN ('tanah', 'kayu_kualitas_rendah', 'semen', 'keramik', 'marmer_granit')
    ),
    jenis_dinding VARCHAR(50) NOT NULL DEFAULT 'tembok_tanpa_plester' CHECK (
        jenis_dinding IN ('bambu_gedek', 'kayu_kualitas_rendah', 'tembok_tanpa_plester', 'tembok_plester')
    ),
    jenis_atap VARCHAR(50) NOT NULL DEFAULT 'seng' CHECK (
        jenis_atap IN ('rumbia_ijuk', 'seng', 'asbes', 'genteng_biasa', 'genteng_keramik_beton')
    ),
    -- Sanitasi & Fasilitas
    sumber_air_minum VARCHAR(50) NOT NULL DEFAULT 'sumur_tak_terlindung' CHECK (
        sumber_air_minum IN ('air_kemasan', 'leding_pdam', 'sumur_terlindung', 'sumur_tak_terlindung', 'mata_air', 'sungai_danau', 'air_hujan')
    ),
    jenis_jamban VARCHAR(50) NOT NULL DEFAULT 'tidak_ada' CHECK (
        jenis_jamban IN ('sendiri_leher_angsa', 'sendiri_plengsengan', 'bersama_umum', 'tidak_ada')
    ),
    pembuangan_akhir_tinja VARCHAR(50) NOT NULL DEFAULT 'tangki_septic' CHECK (
        pembuangan_akhir_tinja IN ('tangki_septic', 'kolam_sungai_laut', 'lubang_tanah', 'lainnya')
    ),
    -- Energi & Bahan Bakar
    daya_listrik VARCHAR(50) NOT NULL DEFAULT 'pln_450va' CHECK (
        daya_listrik IN ('non_pln', 'pln_450va', 'pln_900va', 'pln_1300va', 'pln_gt_1300va')
    ),
    sumber_penerangan_utama VARCHAR(50) NOT NULL DEFAULT 'listrik_pln',
    bahan_bakar_memasak VARCHAR(50) NOT NULL DEFAULT 'kayu_bakar' CHECK (
        bahan_bakar_memasak IN ('kayu_bakar', 'minyak_tanah', 'lpg_3kg', 'lpg_12kg', 'listrik_biogas')
    ),
    -- Aset & Pengeluaran
    aset_tanah BOOLEAN NOT NULL DEFAULT false,
    aset_kendaraan VARCHAR(50) NOT NULL DEFAULT 'tidak_ada' CHECK (
        aset_kendaraan IN ('tidak_ada', 'sepeda', 'motor', 'mobil')
    ),
    aset_ternak BOOLEAN NOT NULL DEFAULT false,
    pengeluaran_per_bulan NUMERIC(15,2) NOT NULL DEFAULT 800000,
    pengeluaran_makanan_per_bulan NUMERIC(15,2) NOT NULL DEFAULT 600000,
    pengeluaran_non_makanan_per_bulan NUMERIC(15,2) NOT NULL DEFAULT 200000,
    -- Kerentanan Sosial
    anggota_disabilitas_berat INT NOT NULL DEFAULT 0,
    anggota_penyakit_kronis INT NOT NULL DEFAULT 0,
    anggota_lansia INT NOT NULL DEFAULT 0,
    anggota_anak_sekolah INT NOT NULL DEFAULT 0,
    anggota_balita INT NOT NULL DEFAULT 0,
    -- Verifikasi & Bukti Digital
    ttd_warga_path TEXT,
    ttd_petugas_path TEXT,
    catatan_petugas TEXT,
    voice_note_transcript TEXT,
    status_verifikasi VARCHAR(30) NOT NULL DEFAULT 'submitted' CHECK (
        status_verifikasi IN ('draft', 'submitted', 'verified', 'rejected')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_survei_warga_id ON public.survei_kesejahteraan(warga_id);
CREATE INDEX IF NOT EXISTS idx_survei_wilayah_id ON public.survei_kesejahteraan(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_survei_petugas_id ON public.survei_kesejahteraan(petugas_id);

CREATE TRIGGER trg_survei_updated_at
    BEFORE UPDATE ON public.survei_kesejahteraan
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. TABEL: kunjungan_lapangan (Geolokasi & Bukti Lapangan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.kunjungan_lapangan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survei_id UUID REFERENCES public.survei_kesejahteraan(id) ON DELETE CASCADE,
    warga_id UUID NOT NULL REFERENCES public.warga(id) ON DELETE CASCADE,
    petugas_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    akurasi_meter DOUBLE PRECISION,
    alamat_geocoding TEXT,
    foto_bukti_path TEXT NOT NULL,
    foto_meteran_listrik_path TEXT,
    foto_dapur_path TEXT,
    waktu_kunjungan TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    catatan_kunjungan TEXT,
    is_mock_offline BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_kunjungan_warga_id ON public.kunjungan_lapangan(warga_id);
CREATE INDEX IF NOT EXISTS idx_kunjungan_petugas_id ON public.kunjungan_lapangan(petugas_id);
CREATE INDEX IF NOT EXISTS idx_kunjungan_survei_id ON public.kunjungan_lapangan(survei_id);

CREATE TRIGGER trg_kunjungan_updated_at
    BEFORE UPDATE ON public.kunjungan_lapangan
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. TABEL: skor_kelayakan (Proxy Means Testing, Desil 1-10 & AI Explainability)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skor_kelayakan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warga_id UUID NOT NULL REFERENCES public.warga(id) ON DELETE CASCADE,
    survei_id UUID REFERENCES public.survei_kesejahteraan(id) ON DELETE CASCADE,
    skor_pmt NUMERIC(6,2) NOT NULL,
    desil INT NOT NULL CHECK (desil BETWEEN 1 AND 10),
    kategori_kelayakan VARCHAR(50) NOT NULL CHECK (
        kategori_kelayakan IN ('sangat_miskin', 'miskin', 'hampir_miskin', 'rentan_miskin', 'mampu')
    ),
    rekomendasi_ai JSONB,
    penjelasan_skor_ai TEXT,
    faktor_kunci JSONB,
    flag_anomali BOOLEAN NOT NULL DEFAULT false,
    detail_anomali TEXT,
    periode VARCHAR(20) NOT NULL DEFAULT '2026-Q1',
    dihitung_pada TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_skor_warga_id ON public.skor_kelayakan(warga_id);
CREATE INDEX IF NOT EXISTS idx_skor_desil ON public.skor_kelayakan(desil);

CREATE TRIGGER trg_skor_updated_at
    BEFORE UPDATE ON public.skor_kelayakan
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 8. TABEL: program_bansos (Master Program Bantuan Sosial)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.program_bansos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_program VARCHAR(50) NOT NULL UNIQUE,
    nama_program VARCHAR(200) NOT NULL,
    deskripsi TEXT,
    kriteria_desil_maks INT NOT NULL DEFAULT 4 CHECK (kriteria_desil_maks BETWEEN 1 AND 10),
    kriteria_tambahan JSONB,
    kuota INT NOT NULL DEFAULT 500,
    anggaran_per_penerima NUMERIC(15,2) NOT NULL DEFAULT 600000,
    periode_anggaran VARCHAR(50) NOT NULL DEFAULT '2026',
    is_aktif BOOLEAN NOT NULL DEFAULT true,
    allow_stacking BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER trg_program_updated_at
    BEFORE UPDATE ON public.program_bansos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 9. TABEL: pengajuan_bansos (Workflow Approval Berjenjang)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pengajuan_bansos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_pengajuan VARCHAR(50) NOT NULL UNIQUE,
    warga_id UUID NOT NULL REFERENCES public.warga(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.program_bansos(id) ON DELETE RESTRICT,
    survei_id UUID REFERENCES public.survei_kesejahteraan(id) ON DELETE SET NULL,
    wilayah_id UUID NOT NULL REFERENCES public.wilayah(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'diusulkan_rt' CHECK (status IN (
        'diusulkan_rt',
        'disetujui_rw',
        'ditolak_rw',
        'perlu_revisi_rw',
        'diverifikasi_kelurahan',
        'ditolak_kelurahan',
        'perlu_revisi_kelurahan',
        'disetujui_kecamatan',
        'ditolak_kecamatan',
        'tersalurkan',
        'dibatalkan'
    )),
    alasan_status_terakhir TEXT,
    diajukan_oleh UUID REFERENCES public.users(id) ON DELETE SET NULL,
    flag_tumpang_tindih BOOLEAN NOT NULL DEFAULT false,
    catatan_tumpang_tindih TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pengajuan_warga_id ON public.pengajuan_bansos(warga_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_program_id ON public.pengajuan_bansos(program_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_wilayah_id ON public.pengajuan_bansos(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_pengajuan_status ON public.pengajuan_bansos(status);

CREATE TRIGGER trg_pengajuan_updated_at
    BEFORE UPDATE ON public.pengajuan_bansos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 10. TABEL: riwayat_approval (Log Aksi Berjenjang & Alasan Wajib)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.riwayat_approval (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pengajuan_id UUID NOT NULL REFERENCES public.pengajuan_bansos(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    role_approver VARCHAR(50) NOT NULL,
    tahap VARCHAR(30) NOT NULL CHECK (tahap IN ('rt', 'rw', 'kelurahan', 'kecamatan')),
    aksi VARCHAR(30) NOT NULL CHECK (aksi IN ('usulkan', 'setujui', 'tolak', 'minta_revisi')),
    alasan TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_riwayat_pengajuan_id ON public.riwayat_approval(pengajuan_id);
CREATE INDEX IF NOT EXISTS idx_riwayat_approver_id ON public.riwayat_approval(approver_id);

CREATE TRIGGER trg_riwayat_updated_at
    BEFORE UPDATE ON public.riwayat_approval
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 11. TABEL: sanggahan (Saluran Sanggah & Verifikasi Ulang Masyarakat)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sanggahan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warga_id UUID NOT NULL REFERENCES public.warga(id) ON DELETE CASCADE,
    pengajuan_id UUID REFERENCES public.pengajuan_bansos(id) ON DELETE SET NULL,
    pelapor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    alasan_sanggahan TEXT NOT NULL,
    uraian_keluhan_ai_parsed TEXT,
    bukti_foto_path TEXT,
    bukti_dokumen_path TEXT,
    status_sanggahan VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (
        status_sanggahan IN ('pending', 'diverifikasi', 'diterima', 'ditolak')
    ),
    petugas_penelaah_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    tanggapan_petugas TEXT,
    tanggal_tindak_lanjut TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sanggahan_warga_id ON public.sanggahan(warga_id);
CREATE INDEX IF NOT EXISTS idx_sanggahan_status ON public.sanggahan(status_sanggahan);

CREATE TRIGGER trg_sanggahan_updated_at
    BEFORE UPDATE ON public.sanggahan
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 12. TABEL: pengaduan_publik (Whistleblowing & Laporan Bansos Salah Sasaran)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pengaduan_publik (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    kategori VARCHAR(50) NOT NULL DEFAULT 'salah_sasaran' CHECK (
        kategori IN ('salah_sasaran', 'pungli', 'data_fiktif', 'layanan_buruk', 'lainnya')
    ),
    wilayah_id UUID REFERENCES public.wilayah(id) ON DELETE SET NULL,
    terlapor_nama_atau_nik VARCHAR(255),
    is_anonim BOOLEAN NOT NULL DEFAULT false,
    pelapor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    pelapor_nama_kontak VARCHAR(255),
    bukti_lampiran_path TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'menunggu_verifikasi' CHECK (
        status IN ('menunggu_verifikasi', 'dalam_investigasi', 'terbukti_ditindaklanjuti', 'tidak_terbukti', 'ditutup')
    ),
    tanggapan_resmi TEXT,
    is_public_visible BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_pengaduan_wilayah_id ON public.pengaduan_publik(wilayah_id);
CREATE INDEX IF NOT EXISTS idx_pengaduan_status ON public.pengaduan_publik(status);

CREATE TRIGGER trg_pengaduan_updated_at
    BEFORE UPDATE ON public.pengaduan_publik
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 13. TABEL: notifikasi (Notifikasi In-App & Multi-Channel)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifikasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    pesan TEXT NOT NULL,
    tipe VARCHAR(50) NOT NULL DEFAULT 'status_pengajuan' CHECK (
        tipe IN ('status_pengajuan', 'sanggahan', 'tugas_survei', 'reminder_verifikasi', 'pengaduan', 'sistem')
    ),
    link_terkait VARCHAR(255),
    is_read BOOLEAN NOT NULL DEFAULT false,
    channel VARCHAR(20) NOT NULL DEFAULT 'in_app' CHECK (
        channel IN ('in_app', 'wa', 'email')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifikasi_user_id ON public.notifikasi(user_id);
CREATE INDEX IF NOT EXISTS idx_notifikasi_is_read ON public.notifikasi(is_read);

CREATE TRIGGER trg_notifikasi_updated_at
    BEFORE UPDATE ON public.notifikasi
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 14. TABEL: audit_log (Append-Only Immutable Log with Cryptographic Hash Chain)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    role VARCHAR(50),
    aksi VARCHAR(50) NOT NULL CHECK (
        aksi IN ('CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'REVISE', 'EXPORT', 'LOGIN', 'LOGOUT')
    ),
    nama_tabel VARCHAR(100) NOT NULL,
    record_id TEXT NOT NULL,
    data_lama JSONB,
    data_baru JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    hash_sebelumnya TEXT,
    hash_sekarang TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_tabel_record ON public.audit_log(nama_tabel, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- Trigger function to enforce immutable SHA256 hash chaining
CREATE OR REPLACE FUNCTION public.handle_audit_log_hash_chain()
RETURNS TRIGGER AS $$
DECLARE
    last_hash TEXT;
    raw_payload TEXT;
BEGIN
    -- Ambil hash record audit terakhir
    SELECT hash_sekarang INTO last_hash
    FROM public.audit_log
    ORDER BY created_at DESC, id DESC
    LIMIT 1;

    NEW.hash_sebelumnya = COALESCE(last_hash, 'GENESIS_BLOCK_HASH');
    
    -- Kalkulasi SHA256 hash berantai
    raw_payload = NEW.hash_sebelumnya || '|' || 
                  COALESCE(NEW.user_id::text, 'system') || '|' ||
                  NEW.aksi || '|' || 
                  NEW.nama_tabel || '|' || 
                  NEW.record_id || '|' || 
                  COALESCE(NEW.data_baru::text, '') || '|' || 
                  NEW.created_at::text;

    NEW.hash_sekarang = encode(digest(raw_payload, 'sha256'), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_chain
    BEFORE INSERT ON public.audit_log
    FOR EACH ROW EXECUTE FUNCTION public.handle_audit_log_hash_chain();

-- Rule to prevent any UPDATE or DELETE on audit_log
CREATE OR REPLACE RULE audit_log_no_update AS ON UPDATE TO public.audit_log DO INSTEAD NOTHING;
CREATE OR REPLACE RULE audit_log_no_delete AS ON DELETE TO public.audit_log DO INSTEAD NOTHING;
