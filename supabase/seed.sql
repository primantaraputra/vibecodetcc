-- ==============================================================================
-- SISTEM CEK KELAYAKAN BANSOS & PENDATAAN TERPADU KECAMATAN
-- SEED DATA: Akun Pengguna Dummy, Wilayah, Warga, Survei, & Workflow Approval
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    -- ID Wilayah
    v_kec_id UUID := '10000000-0000-0000-0000-000000000001';
    v_kel1_id UUID := '20000000-0000-0000-0000-000000000001';
    v_kel2_id UUID := '20000000-0000-0000-0000-000000000002';
    v_kel3_id UUID := '20000000-0000-0000-0000-000000000003';
    v_rw1_id UUID := '30000000-0000-0000-0000-000000000001';
    v_rw2_id UUID := '30000000-0000-0000-0000-000000000002';
    v_rt1_id UUID := '40000000-0000-0000-0000-000000000001';
    v_rt2_id UUID := '40000000-0000-0000-0000-000000000002';
    v_rt3_id UUID := '40000000-0000-0000-0000-000000000003';

    -- ID Program Bansos
    v_pkh_id UUID := '50000000-0000-0000-0000-000000000001';
    v_bpnt_id UUID := '50000000-0000-0000-0000-000000000002';
    v_blt_id UUID := '50000000-0000-0000-0000-000000000003';
    v_lansia_id UUID := '50000000-0000-0000-0000-000000000004';
    v_disabilitas_id UUID := '50000000-0000-0000-0000-000000000005';

    -- ID Users
    v_u_admin UUID := 'a0000000-0000-0000-0000-000000000001';
    v_u_kecamatan UUID := 'a0000000-0000-0000-0000-000000000002';
    v_u_kelurahan UUID := 'a0000000-0000-0000-0000-000000000003';
    v_u_rw UUID := 'a0000000-0000-0000-0000-000000000004';
    v_u_rt UUID := 'a0000000-0000-0000-0000-000000000005';
    v_u_warga1 UUID := 'a0000000-0000-0000-0000-000000000006';
    v_u_warga2 UUID := 'a0000000-0000-0000-0000-000000000007';

    -- ID Warga
    v_warga1_id UUID := '60000000-0000-0000-0000-000000000001';
    v_warga2_id UUID := '60000000-0000-0000-0000-000000000002';
    v_warga3_id UUID := '60000000-0000-0000-0000-000000000003';
    v_warga4_id UUID := '60000000-0000-0000-0000-000000000004';
    v_warga5_id UUID := '60000000-0000-0000-0000-000000000005';
    v_warga6_id UUID := '60000000-0000-0000-0000-000000000006';

    -- Password hash for 'Password123!'
    v_password_hash TEXT := crypt('Password123!', gen_salt('bf'));

BEGIN

    -- --------------------------------------------------------------------------
    -- 1. SEED WILAYAH HIERARKI (Kecamatan -> Kelurahan -> RW -> RT)
    -- --------------------------------------------------------------------------
    -- 1.1 Kecamatan
    INSERT INTO public.wilayah (id, kode, nama, level, parent_id)
    VALUES (v_kec_id, '32.73.01', 'Kecamatan Sukamaju', 'kecamatan', NULL)
    ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;

    -- 1.2 Kelurahan
    INSERT INTO public.wilayah (id, kode, nama, level, parent_id)
    VALUES 
        (v_kel1_id, '32.73.01.1001', 'Kelurahan Mekarjaya', 'kelurahan', v_kec_id),
        (v_kel2_id, '32.73.01.1002', 'Kelurahan Sariwangi', 'kelurahan', v_kec_id),
        (v_kel3_id, '32.73.01.1003', 'Kelurahan Cibaduyut Asri', 'kelurahan', v_kec_id)
    ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;

    -- 1.3 Rukun Warga (RW)
    INSERT INTO public.wilayah (id, kode, nama, level, parent_id)
    VALUES 
        (v_rw1_id, '32.73.01.1001.RW01', 'RW 01 Mekarjaya', 'rw', v_kel1_id),
        (v_rw2_id, '32.73.01.1001.RW02', 'RW 02 Mekarjaya', 'rw', v_kel1_id)
    ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;

    -- 1.4 Rukun Tetangga (RT)
    INSERT INTO public.wilayah (id, kode, nama, level, parent_id)
    VALUES 
        (v_rt1_id, '32.73.01.1001.RW01.RT01', 'RT 01 RW 01 Mekarjaya', 'rt', v_rw1_id),
        (v_rt2_id, '32.73.01.1001.RW01.RT02', 'RT 02 RW 01 Mekarjaya', 'rt', v_rw1_id),
        (v_rt3_id, '32.73.01.1001.RW02.RT01', 'RT 01 RW 02 Mekarjaya', 'rt', v_rw2_id)
    ON CONFLICT (kode) DO UPDATE SET nama = EXCLUDED.nama;


    -- --------------------------------------------------------------------------
    -- 2. SEED AUTH USERS & IDENTITIES (Supabase GoTrue Auth)
    -- --------------------------------------------------------------------------
    -- Insert / Update ke auth.users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    )
    VALUES 
        (
            '00000000-0000-0000-0000-000000000000', v_u_admin, 'authenticated', 'authenticated',
            'admin@bansos.gov', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Super Admin Dinsos","role":"super_admin"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_kecamatan, 'authenticated', 'authenticated',
            'kecamatan@bansos.gov', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Bambang Hidayat (Kecamatan)","role":"petugas_kecamatan"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_kelurahan, 'authenticated', 'authenticated',
            'kelurahan@bansos.gov', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Dewi Lestari (Kelurahan)","role":"petugas_kelurahan"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_rw, 'authenticated', 'authenticated',
            'rw01@bansos.gov', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"H. Mulyadi (Ketua RW 01)","role":"petugas_rw"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_rt, 'authenticated', 'authenticated',
            'rt01@bansos.gov', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Ahmad Subarjo (Ketua RT 01)","role":"petugas_rt"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_warga1, 'authenticated', 'authenticated',
            'budi.santoso@warga.id', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Budi Santoso","role":"masyarakat","nik":"3273010101850001"}'::jsonb,
            now(), now(), '', '', '', ''
        ),
        (
            '00000000-0000-0000-0000-000000000000', v_u_warga2, 'authenticated', 'authenticated',
            'siti.aminah@warga.id', v_password_hash, now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"nama_lengkap":"Siti Aminah","role":"masyarakat","nik":"3273010101600002"}'::jsonb,
            now(), now(), '', '', '', ''
        )
    ON CONFLICT (id) DO UPDATE SET
        encrypted_password = EXCLUDED.encrypted_password,
        email_confirmed_at = now();

    -- Insert ke auth.identities jika didukung oleh skema
    BEGIN
        INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
        VALUES 
            (v_u_admin, v_u_admin, json_build_object('sub', v_u_admin::text, 'email', 'admin@bansos.gov'), 'email', 'admin@bansos.gov', now(), now(), now()),
            (v_u_kecamatan, v_u_kecamatan, json_build_object('sub', v_u_kecamatan::text, 'email', 'kecamatan@bansos.gov'), 'email', 'kecamatan@bansos.gov', now(), now(), now()),
            (v_u_kelurahan, v_u_kelurahan, json_build_object('sub', v_u_kelurahan::text, 'email', 'kelurahan@bansos.gov'), 'email', 'kelurahan@bansos.gov', now(), now(), now()),
            (v_u_rw, v_u_rw, json_build_object('sub', v_u_rw::text, 'email', 'rw01@bansos.gov'), 'email', 'rw01@bansos.gov', now(), now(), now()),
            (v_u_rt, v_u_rt, json_build_object('sub', v_u_rt::text, 'email', 'rt01@bansos.gov'), 'email', 'rt01@bansos.gov', now(), now(), now()),
            (v_u_warga1, v_u_warga1, json_build_object('sub', v_u_warga1::text, 'email', 'budi.santoso@warga.id'), 'email', 'budi.santoso@warga.id', now(), now(), now()),
            (v_u_warga2, v_u_warga2, json_build_object('sub', v_u_warga2::text, 'email', 'siti.aminah@warga.id'), 'email', 'siti.aminah@warga.id', now(), now(), now())
        ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        -- Abaikan jika skema auth.identities berbeda
        NULL;
    END;


    -- --------------------------------------------------------------------------
    -- 3. SEED TABEL PROFIL: public.users
    -- --------------------------------------------------------------------------
    INSERT INTO public.users (
        id, nama_lengkap, email, nomor_telepon, nik, role, wilayah_id, is_active
    )
    VALUES 
        (
            v_u_admin, 'Super Admin Dinsos', 'admin@bansos.gov', '081100000001',
            '3273010000000001', 'super_admin', v_kec_id, true
        ),
        (
            v_u_kecamatan, 'Bambang Hidayat (Kecamatan)', 'kecamatan@bansos.gov', '081200000002',
            '3273010000000002', 'petugas_kecamatan', v_kec_id, true
        ),
        (
            v_u_kelurahan, 'Dewi Lestari (Kelurahan)', 'kelurahan@bansos.gov', '081300000003',
            '3273010000000003', 'petugas_kelurahan', v_kel1_id, true
        ),
        (
            v_u_rw, 'H. Mulyadi (Ketua RW 01)', 'rw01@bansos.gov', '081400000004',
            '3273010000000004', 'petugas_rw', v_rw1_id, true
        ),
        (
            v_u_rt, 'Ahmad Subarjo (Ketua RT 01)', 'rt01@bansos.gov', '081500000005',
            '3273010000000005', 'petugas_rt', v_rt1_id, true
        ),
        (
            v_u_warga1, 'Budi Santoso', 'budi.santoso@warga.id', '081234567890',
            '3273010101850001', 'masyarakat', v_rt1_id, true
        ),
        (
            v_u_warga2, 'Siti Aminah', 'siti.aminah@warga.id', '081234567891',
            '3273010101600002', 'masyarakat', v_rt1_id, true
        )
    ON CONFLICT (id) DO UPDATE SET 
        nama_lengkap = EXCLUDED.nama_lengkap,
        role = EXCLUDED.role,
        wilayah_id = EXCLUDED.wilayah_id,
        is_active = true;


    -- --------------------------------------------------------------------------
    -- 4. SEED MASTER PROGRAM BANSOS
    -- --------------------------------------------------------------------------
    INSERT INTO public.program_bansos (
        id, kode_program, nama_program, deskripsi, kriteria_desil_maks,
        kriteria_tambahan, kuota, anggaran_per_penerima, periode_anggaran, is_aktif, allow_stacking
    )
    VALUES 
        (
            v_pkh_id,
            'PKH',
            'Program Keluarga Harapan (PKH)',
            'Bantuan bersyarat untuk keluarga sangat miskin dengan komponen ibu hamil, anak sekolah, atau lansia/disabilitas.',
            2,
            '{"syarat_komponen": ["anak_sekolah", "lansia", "disabilitas", "ibu_hamil"]}'::jsonb,
            350,
            750000.00,
            '2026',
            true,
            false
        ),
        (
            v_bpnt_id,
            'BPNT',
            'Bantuan Pangan Non Tunai (BPNT / Sembako)',
            'Bantuan pangan untuk memenuhi kebutuhan pokok sembako keluarga berpenghasilan rendah.',
            3,
            '{"prioritas_desil": [1, 2, 3]}'::jsonb,
            600,
            200000.00,
            '2026',
            true,
            true
        ),
        (
            v_blt_id,
            'BLT_DESA',
            'Bantuan Langsung Tunai Dana Desa (BLT-DD)',
            'Bantuan tunai langsung alokasi desa bagi warga miskin ekstrem non-penerima PKH/BPNT.',
            4,
            '{"non_pkh_bpnt": true}'::jsonb,
            200,
            300000.00,
            '2026',
            true,
            false
        ),
        (
            v_lansia_id,
            'BANSOS_LANSIA',
            'Bansos Khusus Lansia Rentan Daerah',
            'Bantuan sosial terarah dari APBD Kecamatan untuk lansia non-produktif tunggal.',
            4,
            '{"usia_minimal": 60, "lansia_tunggal": true}'::jsonb,
            120,
            400000.00,
            '2026',
            true,
            true
        ),
        (
            v_disabilitas_id,
            'ATENSI_DISABILITAS',
            'Asistensi Rehabilitasi Sosial Disabilitas (ATENSI)',
            'Dukungan sosial dan alat bantu hidup bagi penyandang disabilitas fisik berat.',
            4,
            '{"is_disabilitas_berat": true}'::jsonb,
            80,
            500000.00,
            '2026',
            true,
            true
        )
    ON CONFLICT (kode_program) DO UPDATE SET 
        nama_program = EXCLUDED.nama_program,
        deskripsi = EXCLUDED.deskripsi,
        anggaran_per_penerima = EXCLUDED.anggaran_per_penerima;


    -- --------------------------------------------------------------------------
    -- 5. SEED DATA WARGA DUMMY (Terhubung ke Wilayah RT & RW)
    -- --------------------------------------------------------------------------
    INSERT INTO public.warga (
        id, nik, no_kk, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, 
        alamat, wilayah_id, rt, rw, status_keluarga, status_perkawinan, 
        pekerjaan, pendidikan_terakhir, penghasilan_per_bulan, jumlah_tanggungan, 
        is_disabilitas, is_lansia, is_anak_sekolah, telepon, created_by
    )
    VALUES 
        (
            v_warga1_id,
            '3273010101850001',
            '3273010101850000',
            'Budi Santoso',
            'Bandung',
            '1985-05-12',
            'L',
            'Jl. Sukamaju No. 12, RT 01 / RW 01',
            v_rt1_id,
            '01',
            '01',
            'kepala_keluarga',
            'kawin',
            'Buruh Bangunan Harian',
            'sd',
            750000.00,
            4,
            false,
            false,
            true,
            '081234567890',
            v_u_rt
        ),
        (
            v_warga2_id,
            '3273010101600002',
            '3273010101600000',
            'Siti Aminah',
            'Garut',
            '1960-03-20',
            'P',
            'Gang Mawar No. 5, RT 01 / RW 01',
            v_rt1_id,
            '01',
            '01',
            'kepala_keluarga',
            'cerai_mati',
            'Penjual Gorengan Keliling',
            'tidak_tamat_sd',
            450000.00,
            1,
            false,
            true,
            false,
            '081234567891',
            v_u_rt
        ),
        (
            v_warga3_id,
            '3273010101920003',
            '3273010101920000',
            'Agus Supriatna',
            'Sumedang',
            '1992-11-08',
            'L',
            'Jl. Melati No. 8, RT 02 / RW 01',
            v_rt2_id,
            '02',
            '01',
            'kepala_keluarga',
            'kawin',
            'Karyawan Swasta Logistik',
            'sma',
            3200000.00,
            2,
            false,
            false,
            true,
            '081234567892',
            v_u_rt
        ),
        (
            v_warga4_id,
            '3273010101780004',
            '3273010101780000',
            'Yayan Hendrawan',
            'Bandung',
            '1978-08-17',
            'L',
            'Gang Anggrek No. 15, RT 01 / RW 02',
            v_rt3_id,
            '01',
            '02',
            'kepala_keluarga',
            'kawin',
            'Pemulung Barang Bekas',
            'sd',
            600000.00,
            3,
            true,
            false,
            true,
            '081234567893',
            v_u_rt
        ),
        (
            v_warga5_id,
            '3273010101950005',
            '3273010101950000',
            'Ratna Wulandari',
            'Cimahi',
            '1995-02-14',
            'P',
            'Jl. Sukamaju Gang Buntu No. 3, RT 01 / RW 01',
            v_rt1_id,
            '01',
            '01',
            'kepala_keluarga',
            'cerai_mati',
            'Buruh Cuci Harian',
            'smp',
            500000.00,
            3,
            false,
            false,
            true,
            '081234567894',
            v_u_rt
        ),
        (
            v_warga6_id,
            '3273010101880006',
            '3273010101880000',
            'Hendra Kusuma',
            'Bandung',
            '1988-10-10',
            'L',
            'Jl. Melati No. 22, RT 02 / RW 01',
            v_rt2_id,
            '02',
            '01',
            'kepala_keluarga',
            'kawin',
            'Tukang Ojek Pangkalan',
            'smp',
            950000.00,
            3,
            false,
            false,
            true,
            '081234567895',
            v_u_rt
        )
    ON CONFLICT (nik) DO UPDATE SET 
        nama_lengkap = EXCLUDED.nama_lengkap,
        penghasilan_per_bulan = EXCLUDED.penghasilan_per_bulan,
        wilayah_id = EXCLUDED.wilayah_id;


    -- --------------------------------------------------------------------------
    -- 6. SEED SURVEI KESEJAHTERAAN & SKOR KELAYAKAN
    -- --------------------------------------------------------------------------
    -- 6.1 Survei Budi Santoso (Desil 1)
    INSERT INTO public.survei_kesejahteraan (
        id, warga_id, wilayah_id, petugas_id, periode_survei,
        status_kepemilikan_rumah, luas_lantai, jenis_lantai, jenis_dinding, jenis_atap,
        sumber_air_minum, jenis_jamban, pembuangan_akhir_tinja, daya_listrik,
        sumber_penerangan_utama, bahan_bakar_memasak, aset_tanah, aset_kendaraan, aset_ternak,
        pengeluaran_per_bulan, pengeluaran_makanan_per_bulan, pengeluaran_non_makanan_per_bulan,
        anggota_disabilitas_berat, anggota_penyakit_kronis, anggota_lansia, anggota_anak_sekolah,
        status_verifikasi, catatan_petugas
    )
    VALUES (
        '70000000-0000-0000-0000-000000000001',
        v_warga1_id, v_rt1_id, v_u_rt, '2026-Q1',
        'menumpang', 28.00, 'tanah', 'bambu_gedek', 'seng',
        'sumur_tak_terlindung', 'tidak_ada', 'lubang_tanah', 'pln_450va',
        'listrik_pln', 'kayu_bakar', false, 'tidak_ada', false,
        650000.00, 500000.00, 150000.00,
        0, 0, 0, 2, 'verified', 'Keluarga sangat membutuhkan bantuan PKH untuk biaya sekolah 2 anak.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.skor_kelayakan (
        id, warga_id, survei_id, skor_pmt, desil, kategori_kelayakan,
        rekomendasi_ai, penjelasan_skor_ai, faktor_kunci, flag_anomali, periode
    )
    VALUES (
        '80000000-0000-0000-0000-000000000001',
        v_warga1_id, '70000000-0000-0000-0000-000000000001', 88.75, 1, 'sangat_miskin',
        '["PKH", "BPNT"]'::jsonb,
        'Keluarga Budi Santoso berada pada Desil 1 (Sangat Miskin) berdasarkan fakta lapangan: lantai tanah, dinding bambu, sanitasi belum layak, daya listrik 450VA, serta memiliki 2 anak usia sekolah dengan pengeluaran di bawah garis kemiskinan daerah.',
        '{"lantai": "tanah", "dinding": "bambu_gedek", "sanitasi": "tidak_ada", "anak_sekolah": 2}'::jsonb,
        false, '2026-Q1'
    ) ON CONFLICT (id) DO NOTHING;


    -- 6.2 Survei Siti Aminah (Desil 2)
    INSERT INTO public.survei_kesejahteraan (
        id, warga_id, wilayah_id, petugas_id, periode_survei,
        status_kepemilikan_rumah, luas_lantai, jenis_lantai, jenis_dinding, jenis_atap,
        sumber_air_minum, jenis_jamban, pembuangan_akhir_tinja, daya_listrik,
        sumber_penerangan_utama, bahan_bakar_memasak, aset_tanah, aset_kendaraan, aset_ternak,
        pengeluaran_per_bulan, pengeluaran_makanan_per_bulan, pengeluaran_non_makanan_per_bulan,
        anggota_disabilitas_berat, anggota_penyakit_kronis, anggota_lansia, anggota_anak_sekolah,
        status_verifikasi, catatan_petugas
    )
    VALUES (
        '70000000-0000-0000-0000-000000000002',
        v_warga2_id, v_rt1_id, v_u_rt, '2026-Q1',
        'kontrak_sewa', 21.00, 'semen', 'tembok_tanpa_plester', 'asbes',
        'sumur_terlindung', 'bersama_umum', 'tangki_septic', 'pln_450va',
        'listrik_pln', 'kayu_bakar', false, 'tidak_ada', false,
        450000.00, 350000.00, 100000.00,
        0, 1, 1, 0, 'verified', 'Lansia hidup sebatang kara, berjualan gorengan keliling.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.skor_kelayakan (
        id, warga_id, survei_id, skor_pmt, desil, kategori_kelayakan,
        rekomendasi_ai, penjelasan_skor_ai, faktor_kunci, flag_anomali, periode
    )
    VALUES (
        '80000000-0000-0000-0000-000000000002',
        v_warga2_id, '70000000-0000-0000-0000-000000000002', 82.30, 2, 'miskin',
        '["BPNT", "BANSOS_LANSIA"]'::jsonb,
        'Lansia tunggal kepala keluarga dengan sanitasi bersama dan pengeluaran per bulan Rp 450.000, layak menerima BPNT dan Bansos Lansia.',
        '{"lansia_tunggal": true, "sanitasi": "bersama_umum", "pengeluaran": 450000}'::jsonb,
        false, '2026-Q1'
    ) ON CONFLICT (id) DO NOTHING;


    -- 6.3 Survei Yayan Hendrawan (Desil 1 - Disabilitas)
    INSERT INTO public.survei_kesejahteraan (
        id, warga_id, wilayah_id, petugas_id, periode_survei,
        status_kepemilikan_rumah, luas_lantai, jenis_lantai, jenis_dinding, jenis_atap,
        sumber_air_minum, jenis_jamban, pembuangan_akhir_tinja, daya_listrik,
        sumber_penerangan_utama, bahan_bakar_memasak, aset_tanah, aset_kendaraan, aset_ternak,
        pengeluaran_per_bulan, pengeluaran_makanan_per_bulan, pengeluaran_non_makanan_per_bulan,
        anggota_disabilitas_berat, anggota_penyakit_kronis, anggota_lansia, anggota_anak_sekolah,
        status_verifikasi, catatan_petugas
    )
    VALUES (
        '70000000-0000-0000-0000-000000000003',
        v_warga4_id, v_rt3_id, v_u_rt, '2026-Q1',
        'menumpang', 24.00, 'tanah', 'kayu_kualitas_rendah', 'seng',
        'sumur_tak_terlindung', 'tidak_ada', 'lubang_tanah', 'pln_450va',
        'listrik_pln', 'kayu_bakar', false, 'tidak_ada', false,
        550000.00, 400000.00, 150000.00,
        1, 0, 0, 1, 'verified', 'Kepala keluarga penyandang disabilitas berat dan bekerja sebagai pemulung.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.skor_kelayakan (
        id, warga_id, survei_id, skor_pmt, desil, kategori_kelayakan,
        rekomendasi_ai, penjelasan_skor_ai, faktor_kunci, flag_anomali, periode
    )
    VALUES (
        '80000000-0000-0000-0000-000000000003',
        v_warga4_id, '70000000-0000-0000-0000-000000000003', 85.10, 1, 'sangat_miskin',
        '["ATENSI_DISABILITAS", "PKH"]'::jsonb,
        'Kepala keluarga memiliki disabilitas fisik berat dengan tanggungan 1 anak usia sekolah dan tempat tinggal tidak layak.',
        '{"disabilitas_berat": 1, "lantai": "tanah", "anak_sekolah": 1}'::jsonb,
        false, '2026-Q1'
    ) ON CONFLICT (id) DO NOTHING;


    -- 6.4 Survei Agus Supriatna (Desil 6 - Mampu / Tidak Layak)
    INSERT INTO public.survei_kesejahteraan (
        id, warga_id, wilayah_id, petugas_id, periode_survei,
        status_kepemilikan_rumah, luas_lantai, jenis_lantai, jenis_dinding, jenis_atap,
        sumber_air_minum, jenis_jamban, pembuangan_akhir_tinja, daya_listrik,
        sumber_penerangan_utama, bahan_bakar_memasak, aset_tanah, aset_kendaraan, aset_ternak,
        pengeluaran_per_bulan, pengeluaran_makanan_per_bulan, pengeluaran_non_makanan_per_bulan,
        anggota_disabilitas_berat, anggota_penyakit_kronis, anggota_lansia, anggota_anak_sekolah,
        status_verifikasi, catatan_petugas
    )
    VALUES (
        '70000000-0000-0000-0000-000000000004',
        v_warga3_id, v_rt2_id, v_u_rt, '2026-Q1',
        'milik_sendiri', 60.00, 'keramik', 'tembok_plester', 'genteng_biasa',
        'leding_pdam', 'sendiri_leher_angsa', 'tangki_septic', 'pln_1300va',
        'listrik_pln', 'lpg_3kg', false, 'motor', false,
        2800000.00, 1800000.00, 1000000.00,
        0, 0, 0, 1, 'verified', 'Keluarga berpenghasilan tetap di atas standar kemiskinan.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.skor_kelayakan (
        id, warga_id, survei_id, skor_pmt, desil, kategori_kelayakan,
        rekomendasi_ai, penjelasan_skor_ai, faktor_kunci, flag_anomali, periode
    )
    VALUES (
        '80000000-0000-0000-0000-000000000004',
        v_warga3_id, '70000000-0000-0000-0000-000000000004', 42.00, 6, 'mampu',
        '[]'::jsonb,
        'Keluarga berada pada Desil 6 dengan penghasilan tetap Rp 3.200.000/bulan, fasilitas rumah permanen dan daya listrik 1300VA.',
        '{"penghasilan": 3200000, "daya_listrik": "pln_1300va", "lantai": "keramik"}'::jsonb,
        false, '2026-Q1'
    ) ON CONFLICT (id) DO NOTHING;


    -- 6.5 Survei Ratna Wulandari (Desil 1 - Siap Diajukan RT)
    INSERT INTO public.survei_kesejahteraan (
        id, warga_id, wilayah_id, petugas_id, periode_survei,
        status_kepemilikan_rumah, luas_lantai, jenis_lantai, jenis_dinding, jenis_atap,
        sumber_air_minum, jenis_jamban, pembuangan_akhir_tinja, daya_listrik,
        sumber_penerangan_utama, bahan_bakar_memasak, aset_tanah, aset_kendaraan, aset_ternak,
        pengeluaran_per_bulan, pengeluaran_makanan_per_bulan, pengeluaran_non_makanan_per_bulan,
        anggota_disabilitas_berat, anggota_penyakit_kronis, anggota_lansia, anggota_anak_sekolah,
        status_verifikasi, catatan_petugas
    )
    VALUES (
        '70000000-0000-0000-0000-000000000005',
        v_warga5_id, v_rt1_id, v_u_rt, '2026-Q1',
        'menumpang', 20.00, 'tanah', 'bambu_gedek', 'seng',
        'sumur_tak_terlindung', 'tidak_ada', 'lubang_tanah', 'pln_450va',
        'listrik_pln', 'kayu_bakar', false, 'tidak_ada', false,
        480000.00, 360000.00, 120000.00,
        0, 0, 0, 1, 'verified', 'Ibu tunggal buruh cuci dengan 2 anak kecil.'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.skor_kelayakan (
        id, warga_id, survei_id, skor_pmt, desil, kategori_kelayakan,
        rekomendasi_ai, penjelasan_skor_ai, faktor_kunci, flag_anomali, periode
    )
    VALUES (
        '80000000-0000-0000-0000-000000000005',
        v_warga5_id, '70000000-0000-0000-0000-000000000005', 86.40, 1, 'sangat_miskin',
        '["PKH", "BPNT"]'::jsonb,
        'Keluarga berada pada Desil 1. Ibu tunggal bekerja buruh cuci, hunian lantai tanah dan dinding bambu.',
        '{"kepala_keluarga_perempuan": true, "lantai": "tanah", "anak_sekolah": 1}'::jsonb,
        false, '2026-Q1'
    ) ON CONFLICT (id) DO NOTHING;


    -- --------------------------------------------------------------------------
    -- 7. SEED WORKFLOW APPROVAL BERJENJANG (pengajuan_bansos & riwayat_approval)
    -- --------------------------------------------------------------------------

    -- Kasus 1: Budi Santoso -> Status 'diusulkan_rt' (Siap ditinjau Petugas RW)
    INSERT INTO public.pengajuan_bansos (
        id, nomor_pengajuan, warga_id, program_id, survei_id, wilayah_id,
        status, alasan_status_terakhir, diajukan_oleh, created_at, updated_at
    )
    VALUES (
        '90000000-0000-0000-0000-000000000001',
        'PB-202609-0001',
        v_warga1_id,
        v_pkh_id,
        '70000000-0000-0000-0000-000000000001',
        v_rt1_id,
        'diusulkan_rt',
        'Diusulkan oleh Petugas RT 01 berdasarkan hasil survei lapangan & skor PMT Desil 1.',
        v_u_rt,
        now() - INTERVAL '2 days',
        now() - INTERVAL '2 days'
    ) ON CONFLICT (nomor_pengajuan) DO NOTHING;

    INSERT INTO public.riwayat_approval (
        id, pengajuan_id, approver_id, role_approver, tahap, aksi, alasan, created_at
    )
    VALUES (
        'c0000000-0000-0000-0000-000000000001',
        '90000000-0000-0000-0000-000000000001',
        v_u_rt,
        'petugas_rt',
        'rt',
        'usulkan',
        'Hasil survei lapangan membuktikan keluarga Budi Santoso masuk kategori Sangat Miskin (Desil 1) dan anak butuh bantuan sekolah.',
        now() - INTERVAL '2 days'
    ) ON CONFLICT (id) DO NOTHING;


    -- Kasus 2: Siti Aminah -> Status 'disetujui_rw' (Siap diverifikasi Petugas Kelurahan)
    INSERT INTO public.pengajuan_bansos (
        id, nomor_pengajuan, warga_id, program_id, survei_id, wilayah_id,
        status, alasan_status_terakhir, diajukan_oleh, created_at, updated_at
    )
    VALUES (
        '90000000-0000-0000-0000-000000000002',
        'PB-202609-0002',
        v_warga2_id,
        v_bpnt_id,
        '70000000-0000-0000-0000-000000000002',
        v_rt1_id,
        'disetujui_rw',
        'Disetujui dalam musyawarah RW 01 karena Ibu Siti adalah lansia tunggal pedagang kecil.',
        v_u_rt,
        now() - INTERVAL '3 days',
        now() - INTERVAL '1 day'
    ) ON CONFLICT (nomor_pengajuan) DO NOTHING;

    INSERT INTO public.riwayat_approval (
        id, pengajuan_id, approver_id, role_approver, tahap, aksi, alasan, created_at
    )
    VALUES 
        (
            'c0000000-0000-0000-0000-000000000002',
            '90000000-0000-0000-0000-000000000002',
            v_u_rt,
            'petugas_rt',
            'rt',
            'usulkan',
            'Diusulkan untuk program BPNT sembako bagi lansia tunggal.',
            now() - INTERVAL '3 days'
        ),
        (
            'c0000000-0000-0000-0000-000000000003',
            '90000000-0000-0000-0000-000000000002',
            v_u_rw,
            'petugas_rw',
            'rw',
            'setujui',
            'Disetujui tingkat RW 01, data valid dan sesuai kondisi riil warga.',
            now() - INTERVAL '1 day'
        )
    ON CONFLICT (id) DO NOTHING;


    -- Kasus 3: Yayan Hendrawan -> Status 'diverifikasi_kelurahan' (Siap diapprove Petugas Kecamatan)
    INSERT INTO public.pengajuan_bansos (
        id, nomor_pengajuan, warga_id, program_id, survei_id, wilayah_id,
        status, alasan_status_terakhir, diajukan_oleh, created_at, updated_at
    )
    VALUES (
        '90000000-0000-0000-0000-000000000003',
        'PB-202609-0003',
        v_warga4_id,
        v_disabilitas_id,
        '70000000-0000-0000-0000-000000000003',
        v_rt3_id,
        'diverifikasi_kelurahan',
        'Terverifikasi oleh Kelurahan Mekarjaya, kuota program ATENSI disabilitas mencukupi.',
        v_u_rt,
        now() - INTERVAL '4 days',
        now() - INTERVAL '1 day'
    ) ON CONFLICT (nomor_pengajuan) DO NOTHING;

    INSERT INTO public.riwayat_approval (
        id, pengajuan_id, approver_id, role_approver, tahap, aksi, alasan, created_at
    )
    VALUES 
        (
            'c0000000-0000-0000-0000-000000000004',
            '90000000-0000-0000-0000-000000000003',
            v_u_rt,
            'petugas_rt',
            'rt',
            'usulkan',
            'Diusulkan program ATENSI disabilitas berat.',
            now() - INTERVAL '4 days'
        ),
        (
            'c0000000-0000-0000-0000-000000000005',
            '90000000-0000-0000-0000-000000000003',
            v_u_rw,
            'petugas_rw',
            'rw',
            'setujui',
            'Disetujui tingkat RW 02, disabilitas fisik berat terkonfirmasi.',
            now() - INTERVAL '2 days'
        ),
        (
            'c0000000-0000-0000-0000-000000000006',
            '90000000-0000-0000-0000-000000000003',
            v_u_kelurahan,
            'petugas_kelurahan',
            'kelurahan',
            'setujui',
            'Verifikasi berkas kelurahan selesai, diteruskan ke dinas/kecamatan.',
            now() - INTERVAL '1 day'
        )
    ON CONFLICT (id) DO NOTHING;


    -- Kasus 4: Agus Supriatna -> Status 'ditolak_rw' (Contoh Penolakan Alur)
    INSERT INTO public.pengajuan_bansos (
        id, nomor_pengajuan, warga_id, program_id, survei_id, wilayah_id,
        status, alasan_status_terakhir, diajukan_oleh, created_at, updated_at
    )
    VALUES (
        '90000000-0000-0000-0000-000000000004',
        'PB-202609-0004',
        v_warga3_id,
        v_pkh_id,
        '70000000-0000-0000-0000-000000000004',
        v_rt2_id,
        'ditolak_rw',
        'Penghasilan warga di atas batas kelayakan (Desil 6, Rp 3.200.000/bulan) dan memiliki kendaraan bermotor roda dua.',
        v_u_rt,
        now() - INTERVAL '5 days',
        now() - INTERVAL '2 days'
    ) ON CONFLICT (nomor_pengajuan) DO NOTHING;

    INSERT INTO public.riwayat_approval (
        id, pengajuan_id, approver_id, role_approver, tahap, aksi, alasan, created_at
    )
    VALUES 
        (
            'c0000000-0000-0000-0000-000000000007',
            '90000000-0000-0000-0000-000000000004',
            v_u_rt,
            'petugas_rt',
            'rt',
            'usulkan',
            'Diusulkan untuk verifikasi kelayakan.',
            now() - INTERVAL '5 days'
        ),
        (
            'c0000000-0000-0000-0000-000000000008',
            '90000000-0000-0000-0000-000000000004',
            v_u_rw,
            'petugas_rw',
            'rw',
            'tolak',
            'Ditolak pada musyawarah RW karena penghasilan Rp 3.200.000/bln dan rumah milik sendiri berkeramik.',
            now() - INTERVAL '2 days'
        )
    ON CONFLICT (id) DO NOTHING;


    -- Kasus 5: Hendra Kusuma -> Status 'perlu_revisi_rw' (Contoh Permintaan Revisi Berkas)
    INSERT INTO public.pengajuan_bansos (
        id, nomor_pengajuan, warga_id, program_id, survei_id, wilayah_id,
        status, alasan_status_terakhir, diajukan_oleh, created_at, updated_at
    )
    VALUES (
        '90000000-0000-0000-0000-000000000005',
        'PB-202609-0005',
        v_warga6_id,
        v_blt_id,
        NULL,
        v_rt2_id,
        'perlu_revisi_rw',
        'Harap lengkapi foto meteran listrik dan update foto Kartu Keluarga terbaru.',
        v_u_rt,
        now() - INTERVAL '2 days',
        now() - INTERVAL '1 day'
    ) ON CONFLICT (nomor_pengajuan) DO NOTHING;


    -- --------------------------------------------------------------------------
    -- 8. SEED SANGGAHAN & PENGADUAN PUBLIK
    -- --------------------------------------------------------------------------
    INSERT INTO public.sanggahan (
        id, warga_id, pengajuan_id, pelapor_user_id, alasan_sanggahan,
        uraian_keluhan_ai_parsed, status_sanggahan, created_at
    )
    VALUES (
        'd0000000-0000-0000-0000-000000000001',
        v_warga3_id,
        '90000000-0000-0000-0000-000000000004',
        v_u_warga1,
        'Saya baru saja mengalami PHK bulan lalu dan saat ini belum bekerja kembali sehingga membutuhkan bantuan sementara.',
        'Warga mengajukan sanggahan penolakan karena ada perubahan kondisi ekonomi terkini (PHK baru).',
        'pending',
        now() - INTERVAL '1 day'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.pengaduan_publik (
        id, judul, deskripsi, kategori, wilayah_id, terlapor_nama_atau_nik,
        is_anonim, pelapor_user_id, status, is_public_visible, created_at
    )
    VALUES (
        'e0000000-0000-0000-0000-000000000001',
        'Laporan Dugaan Bansos Mampu di RW 01',
        'Terdapat warga memiliki 2 mobil namun masuk dalam daftar penerima bantuan sembako.',
        'salah_sasaran',
        v_rw1_id,
        'Warga Rumah Tingkat No 4',
        false,
        v_u_warga1,
        'menunggu_verifikasi',
        true,
        now() - INTERVAL '3 days'
    ) ON CONFLICT (id) DO NOTHING;

END $$;
