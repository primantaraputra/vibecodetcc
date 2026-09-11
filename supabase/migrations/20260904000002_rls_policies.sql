-- ==============================================================================
-- SISTEM CEK KELAYAKAN BANSOS & PENDATAAN TERPADU KECAMATAN
-- Migration 02: Row Level Security (RLS) Policies & Role Scoping Functions
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Helper Security Functions (SECURITY DEFINER)
-- ------------------------------------------------------------------------------

-- Get role of currently authenticated user
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS VARCHAR AS $$
DECLARE
    current_role VARCHAR;
BEGIN
    SELECT role INTO current_role
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN COALESCE(current_role, 'anon');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Get wilayah_id of currently authenticated user
CREATE OR REPLACE FUNCTION public.get_current_user_wilayah_id()
RETURNS UUID AS $$
DECLARE
    current_wilayah_id UUID;
BEGIN
    SELECT wilayah_id INTO current_wilayah_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN current_wilayah_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (public.get_current_user_role() = 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Check if target wilayah is within user's administrative subtree
CREATE OR REPLACE FUNCTION public.is_wilayah_in_scope(user_w_id UUID, target_w_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    IF user_w_id IS NULL OR target_w_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF user_w_id = target_w_id THEN
        RETURN TRUE;
    END IF;

    -- Recursive check down the hierarchy tree
    RETURN EXISTS (
        WITH RECURSIVE descendants AS (
            SELECT id FROM public.wilayah WHERE id = user_w_id
            UNION ALL
            SELECT w.id FROM public.wilayah w
            INNER JOIN descendants d ON w.parent_id = d.id
        )
        SELECT 1 FROM descendants WHERE id = target_w_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- ------------------------------------------------------------------------------
-- 2. Enable Row Level Security (RLS) on all tables
-- ------------------------------------------------------------------------------
ALTER TABLE public.wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warga ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survei_kesejahteraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kunjungan_lapangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skor_kelayakan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_bansos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengajuan_bansos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanggahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaduan_publik ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifikasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. RLS: wilayah
-- ------------------------------------------------------------------------------
-- Publik dan seluruh user dapat melihat struktur wilayah
CREATE POLICY "wilayah_select_all"
    ON public.wilayah FOR SELECT
    USING (true);

-- Hanya super admin yang dapat mengubah master data wilayah
CREATE POLICY "wilayah_modify_admin"
    ON public.wilayah FOR ALL
    TO authenticated
    USING (public.is_super_admin())
    WITH CHECK (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 4. RLS: users
-- ------------------------------------------------------------------------------
-- User dapat melihat profil diri sendiri, Super Admin melihat semua, Petugas melihat bawahan/wilayahnya
CREATE POLICY "users_select_policy"
    ON public.users FOR SELECT
    TO authenticated
    USING (
        id = auth.uid()
        OR public.is_super_admin()
        OR (
            role != 'masyarakat' 
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

-- User dapat mendaftarkan profil diri sendiri atau di-insert oleh super admin
CREATE POLICY "users_insert_policy"
    ON public.users FOR INSERT
    TO authenticated
    WITH CHECK (
        id = auth.uid() OR public.is_super_admin()
    );

-- User dapat mengupdate profil diri sendiri (nama, telepon, avatar) atau oleh super admin
CREATE POLICY "users_update_policy"
    ON public.users FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_super_admin())
    WITH CHECK (id = auth.uid() OR public.is_super_admin());

-- ------------------------------------------------------------------------------
-- 5. RLS: warga
-- ------------------------------------------------------------------------------
-- Petugas melihat warga dalam wilayah scope, Super admin melihat semua, Masyarakat hanya melihat data miliknya
CREATE POLICY "warga_select_policy"
    ON public.warga FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
        OR (
            public.get_current_user_role() = 'masyarakat'
            AND nik = (SELECT nik FROM public.users WHERE id = auth.uid())
        )
    );

-- Hanya Petugas dan Super Admin yang dapat menginput atau mengedit data warga
CREATE POLICY "warga_insert_policy"
    ON public.warga FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

CREATE POLICY "warga_update_policy"
    ON public.warga FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    )
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

-- ------------------------------------------------------------------------------
-- 6. RLS: survei_kesejahteraan
-- ------------------------------------------------------------------------------
CREATE POLICY "survei_select_policy"
    ON public.survei_kesejahteraan FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
        OR (
            public.get_current_user_role() = 'masyarakat'
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE nik = (SELECT nik FROM public.users WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "survei_insert_policy"
    ON public.survei_kesejahteraan FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

CREATE POLICY "survei_update_policy"
    ON public.survei_kesejahteraan FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    )
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

-- ------------------------------------------------------------------------------
-- 7. RLS: kunjungan_lapangan (Geolokasi & Foto Kunjungan)
-- Catatan: Role masyarakat dilarang mengakses data presisi GPS internal
-- ------------------------------------------------------------------------------
CREATE POLICY "kunjungan_select_policy"
    ON public.kunjungan_lapangan FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
            )
        )
    );

CREATE POLICY "kunjungan_insert_policy"
    ON public.kunjungan_lapangan FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
            )
        )
    );

-- ------------------------------------------------------------------------------
-- 8. RLS: skor_kelayakan
-- ------------------------------------------------------------------------------
CREATE POLICY "skor_select_policy"
    ON public.skor_kelayakan FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
            )
        )
        OR (
            public.get_current_user_role() = 'masyarakat'
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE nik = (SELECT nik FROM public.users WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "skor_modify_policy"
    ON public.skor_kelayakan FOR ALL
    TO authenticated
    USING (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    )
    WITH CHECK (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    );

-- ------------------------------------------------------------------------------
-- 9. RLS: program_bansos
-- ------------------------------------------------------------------------------
CREATE POLICY "program_select_all"
    ON public.program_bansos FOR SELECT
    USING (true);

CREATE POLICY "program_modify_admin"
    ON public.program_bansos FOR ALL
    TO authenticated
    USING (public.is_super_admin() OR public.get_current_user_role() = 'petugas_kecamatan')
    WITH CHECK (public.is_super_admin() OR public.get_current_user_role() = 'petugas_kecamatan');

-- ------------------------------------------------------------------------------
-- 10. RLS: pengajuan_bansos
-- ------------------------------------------------------------------------------
CREATE POLICY "pengajuan_select_policy"
    ON public.pengajuan_bansos FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
        OR (
            public.get_current_user_role() = 'masyarakat'
            AND warga_id IN (
                SELECT id FROM public.warga 
                WHERE nik = (SELECT nik FROM public.users WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "pengajuan_insert_policy"
    ON public.pengajuan_bansos FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

CREATE POLICY "pengajuan_update_policy"
    ON public.pengajuan_bansos FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    )
    WITH CHECK (
        public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
            AND public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
        )
    );

-- ------------------------------------------------------------------------------
-- 11. RLS: riwayat_approval
-- ------------------------------------------------------------------------------
CREATE POLICY "riwayat_select_policy"
    ON public.riwayat_approval FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
        OR (
            public.get_current_user_role() = 'masyarakat'
            AND pengajuan_id IN (
                SELECT pb.id FROM public.pengajuan_bansos pb
                JOIN public.warga w ON pb.warga_id = w.id
                WHERE w.nik = (SELECT nik FROM public.users WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "riwayat_insert_policy"
    ON public.riwayat_approval FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    );

-- ------------------------------------------------------------------------------
-- 12. RLS: sanggahan
-- ------------------------------------------------------------------------------
CREATE POLICY "sanggahan_select_policy"
    ON public.sanggahan FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
        OR pelapor_user_id = auth.uid()
        OR warga_id IN (
            SELECT id FROM public.warga 
            WHERE nik = (SELECT nik FROM public.users WHERE id = auth.uid())
        )
    );

CREATE POLICY "sanggahan_insert_policy"
    ON public.sanggahan FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "sanggahan_update_policy"
    ON public.sanggahan FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    )
    WITH CHECK (
        public.is_super_admin()
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    );

-- ------------------------------------------------------------------------------
-- 13. RLS: pengaduan_publik
-- ------------------------------------------------------------------------------
-- Publik dapat melihat pengaduan yang disetujui ditampilkan (is_public_visible = true)
CREATE POLICY "pengaduan_select_policy"
    ON public.pengaduan_publik FOR SELECT
    USING (
        is_public_visible = true
        OR pelapor_user_id = auth.uid()
        OR public.is_super_admin()
        OR (
            public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan')
            AND (
                wilayah_id IS NULL 
                OR public.is_wilayah_in_scope(public.get_current_user_wilayah_id(), wilayah_id)
            )
        )
    );

-- Pengaduan dapat dibuat oleh siapa saja (authenticated atau anon)
CREATE POLICY "pengaduan_insert_policy"
    ON public.pengaduan_publik FOR INSERT
    WITH CHECK (true);

-- Hanya petugas atau admin yang dapat memperbarui status pengaduan & memberikan tanggapan
CREATE POLICY "pengaduan_update_policy"
    ON public.pengaduan_publik FOR UPDATE
    TO authenticated
    USING (
        public.is_super_admin() 
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan')
    )
    WITH CHECK (
        public.is_super_admin() 
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan')
    );

-- ------------------------------------------------------------------------------
-- 14. RLS: notifikasi
-- ------------------------------------------------------------------------------
CREATE POLICY "notifikasi_user_policy"
    ON public.notifikasi FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifikasi_admin_insert"
    ON public.notifikasi FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_super_admin() 
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan', 'petugas_rw', 'petugas_rt')
    );

-- ------------------------------------------------------------------------------
-- 15. RLS: audit_log (Strictly internal for officers & admins)
-- ------------------------------------------------------------------------------
CREATE POLICY "audit_log_select_policy"
    ON public.audit_log FOR SELECT
    TO authenticated
    USING (
        public.is_super_admin() 
        OR public.get_current_user_role() IN ('petugas_kecamatan', 'petugas_kelurahan')
    );

CREATE POLICY "audit_log_insert_policy"
    ON public.audit_log FOR INSERT
    TO authenticated
    WITH CHECK (true);
