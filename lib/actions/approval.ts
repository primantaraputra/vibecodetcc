'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserSession } from '@/lib/auth/session';
import {
  ApprovalItem,
  ApprovalDetailData,
  ApprovalActionPayload,
  RiwayatApprovalDetail,
} from '@/lib/types/approval';
import { UserRole, StatusPengajuan, TahapApproval } from '@/lib/types/database.types';
import { recordAuditEvent } from '@/lib/actions/audit';

// In-Memory store for Demo / Development when Supabase is running with dummy keys
// This ensures that live interactive state transitions work 100% out of the box!
const DEMO_STORE: {
  pengajuan: ApprovalItem[];
  riwayat: Record<string, RiwayatApprovalDetail[]>;
} = {
  pengajuan: [
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
        nama_lengkap: 'Budi Santoso (Dummy)',
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
      program_id: '50000000-0000-0000-0000-000000000002',
      survei_id: '70000000-0000-0000-0000-000000000002',
      wilayah_id: '40000000-0000-0000-0000-000000000001',
      status: 'disetujui_rw',
      alasan_status_terakhir:
        'Disetujui dalam musyawarah RW 01 karena Ibu Siti adalah lansia tunggal pedagang kecil.',
      flag_tumpang_tindih: false,
      catatan_tumpang_tindih: null,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      warga: {
        id: '60000000-0000-0000-0000-000000000002',
        nik: '3273010101600002',
        no_kk: '3273010101600000',
        nama_lengkap: 'Siti Aminah (Dummy)',
        alamat: 'Gang Mawar No. 5, RT 01 / RW 01',
        rt: '01',
        rw: '01',
        pekerjaan: 'Penjual Gorengan Keliling',
        penghasilan_per_bulan: 450000,
        jumlah_tanggungan: 1,
        is_disabilitas: false,
        is_lansia: true,
        is_anak_sekolah: false,
        telepon: '081234567891',
      },
      program: {
        id: '50000000-0000-0000-0000-000000000002',
        kode_program: 'BPNT',
        nama_program: 'Bantuan Pangan Non Tunai (BPNT)',
        anggaran_per_penerima: 200000,
        kriteria_desil_maks: 3,
      },
      skor: {
        skor_pmt: 82.3,
        desil: 2,
        kategori_kelayakan: 'miskin',
        rekomendasi_ai: ['BPNT', 'BANSOS_LANSIA'],
        penjelasan_skor_ai:
          'Lansia tunggal kepala keluarga dengan sanitasi terbatas dan pengeluaran per bulan Rp 450.000.',
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
      survei_id: '70000000-0000-0000-0000-000000000003',
      wilayah_id: '40000000-0000-0000-0000-000000000003',
      status: 'diverifikasi_kelurahan',
      alasan_status_terakhir:
        'Terverifikasi oleh Petugas Kelurahan Mekarjaya, kuota ATENSI disabilitas mencukupi.',
      flag_tumpang_tindih: false,
      catatan_tumpang_tindih: null,
      created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      warga: {
        id: '60000000-0000-0000-0000-000000000004',
        nik: '3273010101780004',
        no_kk: '3273010101780000',
        nama_lengkap: 'Yayan Hendrawan (Dummy)',
        alamat: 'Gang Anggrek RT 01 / RW 02 No. 15',
        rt: '01',
        rw: '02',
        pekerjaan: 'Pemulung Barang Bekas',
        penghasilan_per_bulan: 600000,
        jumlah_tanggungan: 3,
        is_disabilitas: true,
        is_lansia: false,
        is_anak_sekolah: true,
        telepon: '081234567893',
      },
      program: {
        id: '50000000-0000-0000-0000-000000000005',
        kode_program: 'ATENSI_DISABILITAS',
        nama_program: 'Asistensi Rehabilitasi Sosial Disabilitas',
        anggaran_per_penerima: 500000,
        kriteria_desil_maks: 4,
      },
      skor: {
        skor_pmt: 85.1,
        desil: 1,
        kategori_kelayakan: 'sangat_miskin',
        rekomendasi_ai: ['ATENSI_DISABILITAS', 'PKH'],
        penjelasan_skor_ai:
          'Kepala keluarga memiliki disabilitas fisik berat dengan 1 anak usia sekolah.',
        flag_anomali: false,
      },
      wilayah: {
        id: '40000000-0000-0000-0000-000000000003',
        kode: '32.73.01.1001.RW02.RT01',
        nama: 'RT 01 RW 02 Mekarjaya',
        level: 'rt',
      },
    },
    {
      id: '90000000-0000-0000-0000-000000000004',
      nomor_pengajuan: 'PB-202609-0004',
      warga_id: '60000000-0000-0000-0000-000000000003',
      program_id: '50000000-0000-0000-0000-000000000001',
      survei_id: '70000000-0000-0000-0000-000000000004',
      wilayah_id: '40000000-0000-0000-0000-000000000002',
      status: 'ditolak_rw',
      alasan_status_terakhir:
        'Penghasilan warga di atas batas kelayakan (Desil 6, Rp 3.200.000/bulan) dan memiliki kendaraan bermotor roda dua.',
      flag_tumpang_tindih: false,
      catatan_tumpang_tindih: null,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      warga: {
        id: '60000000-0000-0000-0000-000000000003',
        nik: '3273010101920003',
        no_kk: '3273010101920000',
        nama_lengkap: 'Agus Supriatna (Dummy)',
        alamat: 'Jl. Melati RT 02 / RW 01 No. 8',
        rt: '02',
        rw: '01',
        pekerjaan: 'Karyawan Swasta Logistik',
        penghasilan_per_bulan: 3200000,
        jumlah_tanggungan: 2,
        is_disabilitas: false,
        is_lansia: false,
        is_anak_sekolah: true,
        telepon: '081234567892',
      },
      program: {
        id: '50000000-0000-0000-0000-000000000001',
        kode_program: 'PKH',
        nama_program: 'Program Keluarga Harapan (PKH)',
        anggaran_per_penerima: 750000,
        kriteria_desil_maks: 2,
      },
      skor: {
        skor_pmt: 42.0,
        desil: 6,
        kategori_kelayakan: 'rentan_miskin',
        rekomendasi_ai: [],
        penjelasan_skor_ai:
          'Keluarga berada pada Desil 6 dengan penghasilan tetap di atas standar kemiskinan daerah.',
        flag_anomali: false,
      },
      wilayah: {
        id: '40000000-0000-0000-0000-000000000002',
        kode: '32.73.01.1001.RW01.RT02',
        nama: 'RT 02 RW 01 Mekarjaya',
        level: 'rt',
      },
    },
  ],
  riwayat: {
    '90000000-0000-0000-0000-000000000001': [
      {
        id: 'r-001',
        pengajuan_id: '90000000-0000-0000-0000-000000000001',
        approver_id: 'usr-rt-01',
        approver_nama: 'Ahmad Subarjo (Ketua RT 01)',
        role_approver: 'petugas_rt',
        tahap: 'rt',
        aksi: 'usulkan',
        alasan:
          'Hasil survei lapangan menunjukkan kondisi rumah sangat tidak layak dan anak sekolah butuh bantuan biaya pendidikan.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
    '90000000-0000-0000-0000-000000000002': [
      {
        id: 'r-002',
        pengajuan_id: '90000000-0000-0000-0000-000000000002',
        approver_id: 'usr-rt-01',
        approver_nama: 'Ahmad Subarjo (Ketua RT 01)',
        role_approver: 'petugas_rt',
        tahap: 'rt',
        aksi: 'usulkan',
        alasan: 'Diusulkan untuk program BPNT sembako bagi lansia tunggal.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'r-003',
        pengajuan_id: '90000000-0000-0000-0000-000000000002',
        approver_id: 'usr-rw-01',
        approver_nama: 'Drs. Bambang Wijaya (Ketua RW 01)',
        role_approver: 'petugas_rw',
        tahap: 'rw',
        aksi: 'setujui',
        alasan:
          'Disetujui dalam musyawarah RW 01 karena Ibu Siti adalah lansia tunggal pedagang kecil.',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    '90000000-0000-0000-0000-000000000003': [
      {
        id: 'r-004',
        pengajuan_id: '90000000-0000-0000-0000-000000000003',
        approver_id: 'usr-rt-02',
        approver_nama: 'Hendra Gunawan (Ketua RT 01 RW 02)',
        role_approver: 'petugas_rt',
        tahap: 'rt',
        aksi: 'usulkan',
        alasan: 'Warga penyandang disabilitas fisik membutuhkan asistensi ATENSI.',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'r-005',
        pengajuan_id: '90000000-0000-0000-0000-000000000003',
        approver_id: 'usr-rw-02',
        approver_nama: 'Mulyadi (Ketua RW 02)',
        role_approver: 'petugas_rw',
        tahap: 'rw',
        aksi: 'setujui',
        alasan: 'Data disabilitas diverifikasi benar saat kunjungan bersama.',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: 'r-006',
        pengajuan_id: '90000000-0000-0000-0000-000000000003',
        approver_id: 'usr-kel-01',
        approver_nama: 'Siti Rahmawati, S.STP (Kasi Kesos Kelurahan)',
        role_approver: 'petugas_kelurahan',
        tahap: 'kelurahan',
        aksi: 'setujui',
        alasan:
          'Terverifikasi oleh Petugas Kelurahan Mekarjaya, kuota ATENSI disabilitas mencukupi.',
        created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    '90000000-0000-0000-0000-000000000004': [
      {
        id: 'r-007',
        pengajuan_id: '90000000-0000-0000-0000-000000000004',
        approver_id: 'usr-rt-02',
        approver_nama: 'Ahmad Subarjo (Ketua RT 01)',
        role_approver: 'petugas_rt',
        tahap: 'rt',
        aksi: 'usulkan',
        alasan: 'Pengajuan awal PKH.',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 'r-008',
        pengajuan_id: '90000000-0000-0000-0000-000000000004',
        approver_id: 'usr-rw-01',
        approver_nama: 'Drs. Bambang Wijaya (Ketua RW 01)',
        role_approver: 'petugas_rw',
        tahap: 'rw',
        aksi: 'tolak',
        alasan:
          'Penghasilan warga di atas batas kelayakan (Desil 6, Rp 3.200.000/bulan) dan memiliki kendaraan bermotor roda dua.',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  },
};

/**
 * Server-Side query untuk mengambil daftar pengajuan di inbox approval
 * terfilter berdasarkan role & hierarki wilayah
 */
export async function getApprovalInboxData(effectiveRole?: UserRole) {
  const session = await getCurrentUserSession();
  const currentRole = effectiveRole || session.role || 'petugas_rw';

  try {
    const supabase = createClient();
    // Coba query dari Supabase jika koneksi online
    const { data: dbData, error } = await (supabase.from('pengajuan_bansos') as any)
      .select(`
        *,
        warga:warga_id (*),
        program:program_id (*),
        wilayah:wilayah_id (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && dbData && dbData.length > 0) {
      return dbData as unknown as ApprovalItem[];
    }
  } catch (err) {
    console.warn('Supabase query fallback to in-memory demo store:', err);
  }

  // Fallback to rich Demo store with real state transitions
  return DEMO_STORE.pengajuan;
}

/**
 * Mengambil detail pengajuan dan riwayat approval (timeline)
 */
export async function getApprovalDetail(pengajuanId: string): Promise<ApprovalDetailData | null> {
  const item = DEMO_STORE.pengajuan.find((p) => p.id === pengajuanId);
  if (!item) return null;

  const riwayat = DEMO_STORE.riwayat[pengajuanId] || [];

  return {
    ...item,
    riwayat,
  };
}

/**
 * Server Action: Submit Aksi Approval (Setuju, Tolak, Minta Revisi)
 * Wajib mengisi alasan dan memvalidasi transisi state berjenjang
 */
export async function submitApprovalAction(payload: ApprovalActionPayload) {
  const session = await getCurrentUserSession();
  const approverRole = payload.simulatedRole || session.role || 'petugas_rw';
  const approverId = session.user?.id || 'simulated-approver-id';
  const approverName = session.profile?.nama_lengkap || 'Petugas Verifikator';

  // Validasi Alasan Wajib (Poin 3 spesifikasi)
  const alasanClean = payload.alasan?.trim();
  if (!alasanClean || alasanClean.length < 5) {
    return {
      success: false,
      message: 'Alasan tindakan wajib diisi (minimal 5 karakter) untuk keperluan audit trail.',
    };
  }

  // Cari item pengajuan
  const itemIndex = DEMO_STORE.pengajuan.findIndex((p) => p.id === payload.pengajuanId);
  if (itemIndex === -1) {
    return {
      success: false,
      message: 'Data pengajuan tidak ditemukan.',
    };
  }

  const currentItem = DEMO_STORE.pengajuan[itemIndex];
  let nextStatus: StatusPengajuan = currentItem.status;
  let tahapApproval: TahapApproval = 'rt';

  // State Machine Berjenjang
  if (approverRole === 'petugas_rw' || (approverRole === 'super_admin' && currentItem.status === 'diusulkan_rt')) {
    tahapApproval = 'rw';
    if (payload.aksi === 'setujui') {
      nextStatus = 'disetujui_rw';
    } else if (payload.aksi === 'tolak') {
      nextStatus = 'ditolak_rw';
    } else if (payload.aksi === 'minta_revisi') {
      nextStatus = 'perlu_revisi_rw';
    }
  } else if (approverRole === 'petugas_kelurahan' || (approverRole === 'super_admin' && currentItem.status === 'disetujui_rw')) {
    tahapApproval = 'kelurahan';
    if (payload.aksi === 'setujui') {
      nextStatus = 'diverifikasi_kelurahan';
    } else if (payload.aksi === 'tolak') {
      nextStatus = 'ditolak_kelurahan';
    } else if (payload.aksi === 'minta_revisi') {
      nextStatus = 'perlu_revisi_kelurahan';
    }
  } else if (approverRole === 'petugas_kecamatan' || (approverRole === 'super_admin' && currentItem.status === 'diverifikasi_kelurahan')) {
    tahapApproval = 'kecamatan';
    if (payload.aksi === 'setujui') {
      nextStatus = 'disetujui_kecamatan';
    } else if (payload.aksi === 'tolak') {
      nextStatus = 'ditolak_kecamatan';
    } else if (payload.aksi === 'minta_revisi') {
      nextStatus = 'perlu_revisi_kelurahan';
    }
  } else if (approverRole === 'petugas_rt' && (currentItem.status === 'perlu_revisi_rw' || currentItem.status === 'perlu_revisi_kelurahan')) {
    tahapApproval = 'rt';
    if (payload.aksi === 'setujui') {
      nextStatus = 'diusulkan_rt'; // Pengajuan ulang revisi
    }
  } else {
    return {
      success: false,
      message: `Role ${approverRole} tidak memiliki wewenang untuk memproses pengajuan berstatus "${currentItem.status}".`,
    };
  }

  const timestamp = new Date().toISOString();

  // 1. Update Pengajuan di Store
  DEMO_STORE.pengajuan[itemIndex] = {
    ...currentItem,
    status: nextStatus,
    alasan_status_terakhir: alasanClean,
    updated_at: timestamp,
  };

  // 2. Insert ke Riwayat Approval
  const newRiwayat: RiwayatApprovalDetail = {
    id: `r-${Date.now()}`,
    pengajuan_id: payload.pengajuanId,
    approver_id: approverId,
    approver_nama: approverName,
    role_approver: approverRole,
    tahap: tahapApproval,
    aksi: payload.aksi,
    alasan: alasanClean,
    created_at: timestamp,
  };

  if (!DEMO_STORE.riwayat[payload.pengajuanId]) {
    DEMO_STORE.riwayat[payload.pengajuanId] = [];
  }
  DEMO_STORE.riwayat[payload.pengajuanId].push(newRiwayat);

  // 3. Cryptographic Append-Only Audit Log Chaining (SHA-256)
  await recordAuditEvent({
    aksi: `APPROVAL_${payload.aksi.toUpperCase()}`,
    tabel: 'pengajuan_bansos',
    recordId: payload.pengajuanId,
    aktor: approverName,
    role: approverRole,
    detail: `Aksi [${payload.aksi.toUpperCase()}] oleh ${approverName} (${approverRole}) pada berkas ${currentItem.nomor_pengajuan}. Alasan: "${alasanClean}"`,
    dataSebelum: { status: currentItem.status },
    dataSesudah: { status: nextStatus, alasan: alasanClean, tahap: tahapApproval },
  });

  // 4. Sync ke Supabase jika database aktif
  try {
    const supabase = createClient();
    await (supabase.from('pengajuan_bansos') as any)
      .update({
        status: nextStatus,
        alasan_status_terakhir: alasanClean,
        updated_at: timestamp,
      })
      .eq('id', payload.pengajuanId);

    await (supabase.from('riwayat_approval') as any).insert({
      pengajuan_id: payload.pengajuanId,
      approver_id: approverId,
      role_approver: approverRole,
      tahap: tahapApproval,
      aksi: payload.aksi,
      alasan: alasanClean,
      metadata: { approver_nama: approverName },
    });

    await (supabase.from('audit_log') as any).insert({
      user_id: approverId,
      role: approverRole,
      aksi: payload.aksi.toUpperCase(),
      nama_tabel: 'pengajuan_bansos',
      record_id: payload.pengajuanId,
      data_baru: {
        status: nextStatus,
        alasan: alasanClean,
        tahap: tahapApproval,
      },
    });
  } catch (err) {
    console.warn('DB Sync notice:', err);
  }

  revalidatePath('/approval');

  return {
    success: true,
    message: `Berhasil memproses tindakan (${payload.aksi.toUpperCase()}). Status baru: ${nextStatus}.`,
    nextStatus,
  };
}
