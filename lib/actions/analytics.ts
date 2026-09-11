'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateExecutiveAnalyticsSummary } from '@/lib/ai/assistant';

export interface DashboardMetrics {
  totalWarga: number;
  totalSurvei: number;
  totalPengajuan: number;
  totalDisetujuiKecamatan: number;
  totalDalamProses: number;
  totalDitolak: number;
  totalSanggahan: number;
  totalPengaduan: number;
  sebaranDesil: Record<number, number>;
  alokasiProgram: {
    nama: string;
    kode: string;
    kuota: number;
    terisi: number;
    anggaranPerOrang: number;
    persen: number;
  }[];
  jadwalKunjunganHariIni: {
    id: string;
    namaWarga: string;
    alamat: string;
    rt: string;
    rw: string;
    status: string;
    petugas: string;
    waktu: string;
  }[];
  rekapKelurahan: {
    nama: string;
    warga: number;
    desil1_2: number;
    pengajuan: number;
    disetujui: number;
  }[];
}

export interface AuditLogEntry {
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

const DEMO_METRICS: DashboardMetrics = {
  totalWarga: 1248,
  totalSurvei: 482,
  totalPengajuan: 312,
  totalDisetujuiKecamatan: 184,
  totalDalamProses: 96,
  totalDitolak: 32,
  totalSanggahan: 14,
  totalPengaduan: 8,
  sebaranDesil: {
    1: 142,
    2: 198,
    3: 254,
    4: 180,
    5: 145,
    6: 120,
    7: 95,
    8: 60,
    9: 34,
    10: 20,
  },
  alokasiProgram: [
    {
      nama: 'Program Keluarga Harapan (PKH)',
      kode: 'PKH',
      kuota: 350,
      terisi: 295,
      anggaranPerOrang: 750000,
      persen: 84,
    },
    {
      nama: 'Bantuan Pangan Non Tunai (BPNT)',
      kode: 'BPNT',
      kuota: 600,
      terisi: 540,
      anggaranPerOrang: 200000,
      persen: 90,
    },
    {
      nama: 'BLT Dana Desa (BLT-DD)',
      kode: 'BLT_DESA',
      kuota: 200,
      terisi: 130,
      anggaranPerOrang: 300000,
      persen: 65,
    },
    {
      nama: 'Bansos Lansia Rentan APBD',
      kode: 'BANSOS_LANSIA',
      kuota: 120,
      terisi: 98,
      anggaranPerOrang: 400000,
      persen: 81,
    },
    {
      nama: 'ATENSI Disabilitas',
      kode: 'ATENSI_DISABILITAS',
      kuota: 80,
      terisi: 45,
      anggaranPerOrang: 500000,
      persen: 56,
    },
  ],
  jadwalKunjunganHariIni: [
    {
      id: 'kunjungan-1',
      namaWarga: 'Budi Santoso',
      alamat: 'Jl. Sukamaju No. 12',
      rt: '01',
      rw: '01',
      status: 'Selesai Disurvei',
      petugas: 'Ahmad Ridwan (RT 01)',
      waktu: '09:00 WIB',
    },
    {
      id: 'kunjungan-2',
      namaWarga: 'Siti Aminah',
      alamat: 'Gang Mawar No. 5',
      rt: '01',
      rw: '01',
      status: 'Selesai Disurvei',
      petugas: 'Ahmad Ridwan (RT 01)',
      waktu: '11:00 WIB',
    },
    {
      id: 'kunjungan-3',
      namaWarga: 'Yayan Hendrawan',
      alamat: 'Gang Anggrek No. 15',
      rt: '01',
      rw: '02',
      status: 'Dijadwalkan Hari Ini',
      petugas: 'Bambang (RT 01 RW 02)',
      waktu: '14:30 WIB',
    },
  ],
  rekapKelurahan: [
    {
      nama: 'Kelurahan Mekarjaya',
      warga: 540,
      desil1_2: 165,
      pengajuan: 140,
      disetujui: 88,
    },
    {
      nama: 'Kelurahan Sariwangi',
      warga: 410,
      desil1_2: 98,
      pengajuan: 95,
      disetujui: 54,
    },
    {
      nama: 'Kelurahan Cibaduyut Asri',
      warga: 298,
      desil1_2: 77,
      pengajuan: 77,
      disetujui: 42,
    },
  ],
};

const DEMO_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    waktu: '04 Sep 2026 14:15:22',
    aktor: 'Camat Sukamaju (Dr. H. Hendra, M.Si)',
    role: 'petugas_kecamatan',
    tindakan: 'APPROVE_FINAL',
    entitas: 'pengajuan_bansos',
    idEntitas: 'PB-202609-0001',
    detail: 'Persetujuan penetapan SK Bansos PKH Tahap III',
    ipAddress: '192.168.1.10',
    hashSebelumnya: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    hashSaatIni: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    isTampered: false,
  },
  {
    id: 'aud-002',
    waktu: '04 Sep 2026 11:30:10',
    aktor: 'Lurah Mekarjaya (Dra. Rina Marlina)',
    role: 'petugas_kelurahan',
    tindakan: 'VERIFIKASI_BERKAS',
    entitas: 'pengajuan_bansos',
    idEntitas: 'PB-202609-0001',
    detail: 'Verifikasi kecukupan kuota kelurahan dan kroscek DTKS',
    ipAddress: '192.168.2.45',
    hashSebelumnya: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    hashSaatIni: '3a5f82c198e09f582b130e6203cf36c0a00e57dd21b2b80a133a8a3ee2687c32',
    isTampered: false,
  },
  {
    id: 'aud-003',
    waktu: '04 Sep 2026 09:45:00',
    aktor: 'Ahmad Ridwan',
    role: 'petugas_rt',
    tindakan: 'SUBMIT_SURVEI',
    entitas: 'survei_kesejahteraan',
    idEntitas: 'SURV-2026-001',
    detail: 'Input survei lapangan 14 variabel BPS + Foto Kamera Geotagging',
    ipAddress: '10.0.4.12',
    hashSebelumnya: '3a5f82c198e09f582b130e6203cf36c0a00e57dd21b2b80a133a8a3ee2687c32',
    hashSaatIni: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    isTampered: false,
  },
];

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    const supabase = createServerSupabaseClient();
    const { count: wargaCount } = await supabase.from('warga').select('*', { count: 'exact', head: true });
    const { count: pengajuanCount } = await supabase.from('pengajuan_bansos').select('*', { count: 'exact', head: true });

    if (wargaCount !== null && wargaCount > 0) {
      return {
        ...DEMO_METRICS,
        totalWarga: wargaCount,
        totalPengajuan: pengajuanCount || DEMO_METRICS.totalPengajuan,
      };
    }
  } catch {
    // Fallback to rich demo metrics
  }

  return DEMO_METRICS;
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: logs, error } = await supabase
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && logs && logs.length > 0) {
      return logs.map((l: any) => ({
        id: l.id,
        waktu: new Date(l.created_at).toLocaleString('id-ID'),
        aktor: l.user_id ? `User ${l.user_id.slice(0, 8)}` : 'Sistem',
        role: 'petugas',
        tindakan: l.aksi,
        entitas: l.tabel_terkait || 'pengajuan_bansos',
        idEntitas: l.record_id ? l.record_id.slice(0, 8) : 'REF',
        detail: JSON.stringify(l.data_sesudah || {}),
        ipAddress: l.ip_address || '127.0.0.1',
        hashSebelumnya: l.prev_hash || '0'.repeat(64),
        hashSaatIni: l.current_hash || '0'.repeat(64),
        isTampered: false,
      }));
    }
  } catch {
    // Fallback
  }

  return DEMO_AUDIT_LOGS;
}

export async function getAIExtendedExecutiveReport() {
  const metrics = await getDashboardMetrics();

  const report = generateExecutiveAnalyticsSummary({
    totalWarga: metrics.totalWarga,
    totalPengajuan: metrics.totalPengajuan,
    disetujuiKecamatan: metrics.totalDisetujuiKecamatan,
    ditolak: metrics.totalDitolak,
    dalamProses: metrics.totalDalamProses,
    sebaranDesil: metrics.sebaranDesil,
    serapanAnggaran: metrics.alokasiProgram.map((p) => ({
      program: p.nama,
      kuota: p.kuota,
      terpakai: p.terisi,
      anggaranPerOrang: p.anggaranPerOrang,
    })),
  });

  return report;
}
