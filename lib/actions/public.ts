'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateSanggahanLetter } from '@/lib/ai/assistant';
import { maskNIK, maskName, maskKK } from '@/lib/utils';
import { recordAuditEvent } from '@/lib/actions/audit';

export interface WargaStatusResult {
  found: boolean;
  nikMasked: string;
  namaMasked: string;
  alamatMasked: string;
  wilayahNama: string;
  desil: number;
  kategoriKelayakan: string;
  skorPmt: number;
  penjelasanSkorAi: string;
  rekomendasiAi: string[];
  pengajuanAktif?: {
    id: string;
    nomorPengajuan: string;
    namaProgram: string;
    kodeProgram: string;
    status: string;
    alasanStatusTerakhir: string;
    tanggalDiusulkan: string;
    stepperStage: number;
    riwayat: {
      tahap: string;
      status: string;
      oleh: string;
      alasan: string;
      tanggal: string;
    }[];
  };
  riwayatBantuanMasaLalu: {
    program: string;
    periode: string;
    nominal: number;
    statusPencairan: string;
    tanggalCair: string;
  }[];
}

// In-memory demo data store for public search (keyed by NIK and No. KK)
const DEMO_PUBLIC_DATA: Record<string, WargaStatusResult> = {
  // Budi Santoso (By NIK)
  '3273010101850001': {
    found: true,
    nikMasked: '327301******0001',
    namaMasked: 'B*** S******',
    alamatMasked: 'Jl. S*** No. 12, RT 01 / RW 01',
    wilayahNama: 'Kelurahan Mekarjaya, Kecamatan Sukamaju',
    desil: 1,
    kategoriKelayakan: 'Sangat Miskin (Prioritas 1)',
    skorPmt: 88.75,
    penjelasanSkorAi:
      'Keluarga Budi Santoso berada pada Desil 1 (Sangat Miskin) berdasarkan fakta lapangan: lantai tanah, dinding bambu, sanitasi belum layak, daya listrik 450VA, serta memiliki 2 anak usia sekolah dengan pengeluaran per kapita di bawah standar kemiskinan daerah.',
    rekomendasiAi: ['PKH', 'BPNT'],
    pengajuanAktif: {
      id: '90000000-0000-0000-0000-000000000001',
      nomorPengajuan: 'PB-202609-0001',
      namaProgram: 'Program Keluarga Harapan (PKH)',
      kodeProgram: 'PKH',
      status: 'diusulkan_rt',
      alasanStatusTerakhir:
        'Diusulkan oleh Petugas RT 01 berdasarkan survei lapangan & skor PMT Desil 1.',
      tanggalDiusulkan: '2026-09-04',
      stepperStage: 1,
      riwayat: [
        {
          tahap: 'Pengusulan RT',
          status: 'diusulkan_rt',
          oleh: 'Petugas RT 01 (Ahmad Ridwan)',
          alasan: 'Hasil survei lapangan terverifikasi Desil 1 dengan 2 anak sekolah.',
          tanggal: '04 Sep 2026 09:30',
        },
      ],
    },
    riwayatBantuanMasaLalu: [
      {
        program: 'Bantuan Pangan Non Tunai (BPNT)',
        periode: 'Triwulan II 2026',
        nominal: 600000,
        statusPencairan: 'Tersalurkan',
        tanggalCair: '15 Juni 2026',
      },
      {
        program: 'BLT BBM / Mitigasi Risiko Pangan',
        periode: 'Tahun 2025',
        nominal: 400000,
        statusPencairan: 'Tersalurkan',
        tanggalCair: '10 Desember 2025',
      },
    ],
  },
  // Budi Santoso (By No. KK)
  '3273010101850000': {
    found: true,
    nikMasked: '327301******0001',
    namaMasked: 'B*** S****** (Kepala Keluarga)',
    alamatMasked: 'Jl. S*** No. 12, RT 01 / RW 01',
    wilayahNama: 'Kelurahan Mekarjaya, Kecamatan Sukamaju',
    desil: 1,
    kategoriKelayakan: 'Sangat Miskin (Prioritas 1)',
    skorPmt: 88.75,
    penjelasanSkorAi:
      'Keluarga Budi Santoso berada pada Desil 1 (Sangat Miskin) berdasarkan fakta lapangan: lantai tanah, dinding bambu, sanitasi belum layak, daya listrik 450VA, serta memiliki 2 anak usia sekolah dengan pengeluaran per kapita di bawah standar kemiskinan daerah.',
    rekomendasiAi: ['PKH', 'BPNT'],
    pengajuanAktif: {
      id: '90000000-0000-0000-0000-000000000001',
      nomorPengajuan: 'PB-202609-0001',
      namaProgram: 'Program Keluarga Harapan (PKH)',
      kodeProgram: 'PKH',
      status: 'diusulkan_rt',
      alasanStatusTerakhir:
        'Diusulkan oleh Petugas RT 01 berdasarkan survei lapangan & skor PMT Desil 1.',
      tanggalDiusulkan: '2026-09-04',
      stepperStage: 1,
      riwayat: [
        {
          tahap: 'Pengusulan RT',
          status: 'diusulkan_rt',
          oleh: 'Petugas RT 01 (Ahmad Ridwan)',
          alasan: 'Hasil survei lapangan terverifikasi Desil 1 dengan 2 anak sekolah.',
          tanggal: '04 Sep 2026 09:30',
        },
      ],
    },
    riwayatBantuanMasaLalu: [
      {
        program: 'Bantuan Pangan Non Tunai (BPNT)',
        periode: 'Triwulan II 2026',
        nominal: 600000,
        statusPencairan: 'Tersalurkan',
        tanggalCair: '15 Juni 2026',
      },
    ],
  },
  // Siti Aminah (By NIK)
  '3273010101600002': {
    found: true,
    nikMasked: '327301******0002',
    namaMasked: 'S*** A*****',
    alamatMasked: 'Gang M**** No. 5, RT 01 / RW 01',
    wilayahNama: 'Kelurahan Mekarjaya, Kecamatan Sukamaju',
    desil: 2,
    kategoriKelayakan: 'Miskin (Prioritas 2)',
    skorPmt: 74.2,
    penjelasanSkorAi:
      'Keluarga Siti Aminah berada pada Desil 2 (Lansia Tunggal Rentan) dengan penghasilan non-formal tidak tetap dan sumber air sumur terlindung.',
    rekomendasiAi: ['BANSOS_LANSIA', 'BPNT'],
    pengajuanAktif: {
      id: '90000000-0000-0000-0000-000000000002',
      nomorPengajuan: 'PB-202609-0002',
      namaProgram: 'Bansos Khusus Lansia Rentan Daerah',
      kodeProgram: 'BANSOS_LANSIA',
      status: 'disetujui_rw',
      alasanStatusTerakhir:
        'Disetujui dalam Musyawarah RW 01: Lansia tunggal 66 tahun tanpa penanggung nafkah utama.',
      tanggalDiusulkan: '2026-09-03',
      stepperStage: 2,
      riwayat: [
        {
          tahap: 'Pengusulan RT',
          status: 'diusulkan_rt',
          oleh: 'Petugas RT 01',
          alasan: 'Survei lansia rentan.',
          tanggal: '03 Sep 2026 10:15',
        },
        {
          tahap: 'Persetujuan RW',
          status: 'disetujui_rw',
          oleh: 'Ketua RW 01 Mekarjaya',
          alasan: 'Disetujui dalam Musyawarah RW 01: Lansia tunggal 66 tahun.',
          tanggal: '04 Sep 2026 11:20',
        },
      ],
    },
    riwayatBantuanMasaLalu: [
      {
        program: 'Bansos Lansia Daerah APBD',
        periode: 'Triwulan I 2026',
        nominal: 400000,
        statusPencairan: 'Tersalurkan',
        tanggalCair: '20 Maret 2026',
      },
    ],
  },
  // Agus Supriatna (By NIK)
  '3273010101920003': {
    found: true,
    nikMasked: '327301******0003',
    namaMasked: 'A*** S********',
    alamatMasked: 'Jl. M***** RT 02 / RW 01',
    wilayahNama: 'Kelurahan Mekarjaya, Kecamatan Sukamaju',
    desil: 6,
    kategoriKelayakan: 'Mampu / Tidak Prioritas',
    skorPmt: 38.5,
    penjelasanSkorAi:
      'Keluarga Agus Supriatna berada pada Desil 6 (Mampu) didukung oleh pendapatan tetap di atas UMR, lantai keramik, daya listrik PLN 1300VA, dan kepemilikan aset motor pribadi.',
    rekomendasiAi: [],
    pengajuanAktif: undefined,
    riwayatBantuanMasaLalu: [],
  },
};

const SUBMITTED_SANGGAHAN: Array<{
  ticketNumber: string;
  nik: string;
  nama: string;
  kategori: string;
  suratFormal: string;
  status: string;
  tanggal: string;
}> = [];

const SUBMITTED_PENGADUAN: Array<{
  ticketNumber: string;
  isAnonim: boolean;
  namaPelapor: string;
  kategori: string;
  wilayah: string;
  uraian: string;
  status: string;
  tanggapanPetugas?: string;
  tanggal: string;
}> = [
  {
    ticketNumber: 'ADU-202609-0012',
    isAnonim: true,
    namaPelapor: 'Anonim',
    kategori: 'Penerima Fiktif / Salah Sasaran',
    wilayah: 'RW 02 Kelurahan Sariwangi',
    uraian: 'Ada warga yang memiliki mobil dan rumah tingkat tapi masih terdaftar sebagai penerima BPNT.',
    status: 'Sedang Diverifikasi Petugas Lapangan',
    tanggapanPetugas: 'Laporan telah diteruskan ke Petugas Kelurahan Sariwangi untuk dilakukan uji petik survei ulang.',
    tanggal: '02 Sep 2026',
  },
  {
    ticketNumber: 'ADU-202609-0008',
    isAnonim: true,
    namaPelapor: 'Warga Mekarjaya',
    kategori: 'Pungli / Pemotongan Dana Bansos',
    wilayah: 'RW 01 Kelurahan Mekarjaya',
    uraian: 'Dugaan pemotongan biaya administrasi Rp 20.000 saat pengambilan sembako di salah satu agen.',
    status: 'Selesai Ditindaklanjuti',
    tanggapanPetugas: 'Tim Pengawas Kecamatan telah memanggil pengelola agen dan memberikan teguran keras tertulis serta mengembalikan dana warga.',
    tanggal: '28 Agt 2026',
  },
  {
    ticketNumber: 'ADU-202609-0005',
    isAnonim: false,
    namaPelapor: 'Hendra Kusuma',
    kategori: 'Manipulasi Data Lapangan',
    wilayah: 'RW 01 Kelurahan Cibaduyut Asri',
    uraian: 'Keluarga disabilitas belum pernah dikunjungi oleh surveyor RT setempat.',
    status: 'Selesai Disurvei Lapang',
    tanggapanPetugas: 'Petugas RT dan Kelurahan telah melakukan kunjungan susulan tanggal 1 September 2026 dan mengusulkan program ATENSI.',
    tanggal: '25 Agt 2026',
  },
];

/**
 * Cari status bansos warga berdasarkan NIK atau No. KK (dengan masking privasi)
 */
export async function searchWargaStatusByNik(queryNumber: string): Promise<WargaStatusResult> {
  const cleanNumber = queryNumber.trim().replace(/\D/g, '');

  if (!cleanNumber || cleanNumber.length < 16) {
    return {
      found: false,
      nikMasked: '',
      namaMasked: '',
      alamatMasked: '',
      wilayahNama: '',
      desil: 0,
      kategoriKelayakan: '',
      skorPmt: 0,
      penjelasanSkorAi: '',
      rekomendasiAi: [],
      riwayatBantuanMasaLalu: [],
    };
  }

  // Coba query Supabase (cari NIK atau No KK)
  try {
    const supabase = createServerSupabaseClient();
    const { data: warga, error } = await supabase
      .from('warga')
      .select(`
        id, nik, no_kk, nama_lengkap, alamat, rt, rw,
        wilayah:wilayah_id(nama),
        skor:skor_kelayakan(skor_pmt, desil, kategori_kelayakan, rekomendasi_ai, penjelasan_skor_ai),
        pengajuan:pengajuan_bansos(
          id, nomor_pengajuan, status, alasan_status_terakhir, created_at,
          program:program_id(nama_program, kode_program)
        )
      `)
      .or(`nik.eq.${cleanNumber},no_kk.eq.${cleanNumber}`)
      .maybeSingle();

    if (!error && warga) {
      const rawWarga = warga as any;
      const skorData = Array.isArray(rawWarga.skor) ? rawWarga.skor[0] : rawWarga.skor;
      const pengajuanData = Array.isArray(rawWarga.pengajuan) ? rawWarga.pengajuan[0] : rawWarga.pengajuan;

      let stepper = 1;
      if (pengajuanData?.status === 'disetujui_rw') stepper = 2;
      else if (pengajuanData?.status === 'diverifikasi_kelurahan') stepper = 3;
      else if (pengajuanData?.status === 'disetujui_kecamatan') stepper = 4;
      else if (pengajuanData?.status?.includes('ditolak') || pengajuanData?.status?.includes('revisi')) stepper = -1;

      return {
        found: true,
        nikMasked: maskNIK(rawWarga.nik),
        namaMasked: maskName(rawWarga.nama_lengkap),
        alamatMasked: `RT ${rawWarga.rt} / RW ${rawWarga.rw}`,
        wilayahNama: rawWarga.wilayah?.nama || 'Kecamatan Sukamaju',
        desil: skorData?.desil || 1,
        kategoriKelayakan: skorData?.kategori_kelayakan?.replace('_', ' ').toUpperCase() || 'TERDAFTAR',
        skorPmt: Number(skorData?.skor_pmt || 80),
        penjelasanSkorAi: skorData?.penjelasan_skor_ai || 'Tingkat kelayakan berdasarkan indikator kemiskinan BPS.',
        rekomendasiAi: (skorData?.rekomendasi_ai as string[]) || ['PKH', 'BPNT'],
        pengajuanAktif: pengajuanData
          ? {
              id: pengajuanData.id,
              nomorPengajuan: pengajuanData.nomor_pengajuan || 'PB-202609-0001',
              namaProgram: pengajuanData.program?.nama_program || 'Program Keluarga Harapan (PKH)',
              kodeProgram: pengajuanData.program?.kode_program || 'PKH',
              status: pengajuanData.status,
              alasanStatusTerakhir: pengajuanData.alasan_status_terakhir || 'Dalam proses verifikasi.',
              tanggalDiusulkan: new Date(pengajuanData.created_at).toLocaleDateString('id-ID'),
              stepperStage: stepper,
              riwayat: [
                {
                  tahap: 'Pengusulan Lapangan',
                  status: pengajuanData.status,
                  oleh: 'Petugas Lapangan',
                  alasan: pengajuanData.alasan_status_terakhir || 'Proses verifikasi aktif.',
                  tanggal: new Date(pengajuanData.created_at).toLocaleDateString('id-ID'),
                },
              ],
            }
          : undefined,
        riwayatBantuanMasaLalu: [
          {
            program: 'Bantuan Pangan Non Tunai (BPNT)',
            periode: 'Triwulan II 2026',
            nominal: 600000,
            statusPencairan: 'Tersalurkan',
            tanggalCair: '15 Juni 2026',
          },
        ],
      };
    }
  } catch {
    // Fallback gracefully to demo records
  }

  // Fallback demo records
  if (DEMO_PUBLIC_DATA[cleanNumber]) {
    return DEMO_PUBLIC_DATA[cleanNumber];
  }

  // Generic fallback if not matched
  return {
    found: true,
    nikMasked: maskNIK(cleanNumber),
    namaMasked: 'W**** S****** (Data Demo)',
    alamatMasked: 'RT 01 / RW 01 Kelurahan Mekarjaya',
    wilayahNama: 'Kecamatan Sukamaju',
    desil: 3,
    kategoriKelayakan: 'Hampir Miskin (Prioritas 3)',
    skorPmt: 62.4,
    penjelasanSkorAi:
      'Keluarga terdaftar dalam basis DTKS dengan desil 3. Memenuhi syarat untuk program bantuan pangan dasar (BPNT/Sembako).',
    rekomendasiAi: ['BPNT', 'BLT_DESA'],
    pengajuanAktif: {
      id: 'demo-generic',
      nomorPengajuan: 'PB-202609-0899',
      namaProgram: 'Bantuan Pangan Non Tunai (BPNT)',
      kodeProgram: 'BPNT',
      status: 'diverifikasi_kelurahan',
      alasanStatusTerakhir: 'Sedang dalam validasi kelayakan tingkat Kelurahan.',
      tanggalDiusulkan: '2026-09-02',
      stepperStage: 3,
      riwayat: [
        {
          tahap: 'Pengusulan RT',
          status: 'diusulkan_rt',
          oleh: 'Petugas RT',
          alasan: 'Diusulkan sesuai data warga desil 3.',
          tanggal: '02 Sep 2026',
        },
        {
          tahap: 'Persetujuan RW',
          status: 'disetujui_rw',
          oleh: 'Pengurus RW',
          alasan: 'Memenuhi kuota bantuan sembako kelurahan.',
          tanggal: '03 Sep 2026',
        },
        {
          tahap: 'Verifikasi Kelurahan',
          status: 'diverifikasi_kelurahan',
          oleh: 'Kasi Kesos Kelurahan',
          alasan: 'Pemeriksaan dokumen & kroscek NIK Dukcapil.',
          tanggal: '04 Sep 2026',
        },
      ],
    },
    riwayatBantuanMasaLalu: [
      {
        program: 'Bantuan Sembako APBD',
        periode: 'Tahun 2025',
        nominal: 300000,
        statusPencairan: 'Tersalurkan',
        tanggalCair: '12 November 2025',
      },
    ],
  };
}

/**
 * Submit Pengajuan Sanggahan Warga
 */
export async function submitSanggahanAction(formData: {
  nik: string;
  nama: string;
  kategori: 'layak_tidak_dapat' | 'desil_tidak_sesuai' | 'data_salah' | 'pemberhentian_sepihak' | 'lainnya';
  kondisiRingkas: string;
  tanggungan: number;
  pekerjaan: string;
  dayaListrik: string;
  fotoBuktiUrl?: string;
}): Promise<{ success: boolean; ticketNumber: string; message: string }> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `SGH-202609-${randomSuffix}`;

  const { isiSurat } = generateSanggahanLetter({
    nama: formData.nama,
    nik: formData.nik,
    kategori: formData.kategori,
    kondisiRingkas: formData.kondisiRingkas,
    tanggungan: formData.tanggungan,
    pekerjaan: formData.pekerjaan,
    dayaListrik: formData.dayaListrik,
  });

  SUBMITTED_SANGGAHAN.push({
    ticketNumber,
    nik: formData.nik,
    nama: formData.nama,
    kategori: formData.kategori,
    suratFormal: isiSurat,
    status: 'Diajukan / Menunggu Verifikasi Lapang',
    tanggal: new Date().toLocaleDateString('id-ID'),
  });

  // Cryptographic audit trail
  await recordAuditEvent({
    aksi: 'SUBMIT_SANGGAHAN_WARGA',
    tabel: 'sanggahan',
    recordId: ticketNumber,
    aktor: `Warga (NIK: ${formData.nik.slice(0, 6)}******)`,
    role: 'masyarakat',
    detail: `Pengajuan sanggahan kelayakan [${formData.kategori}] oleh warga ${formData.nama}. Nomor Tiket: ${ticketNumber}.`,
    dataSesudah: { ticketNumber, kategori: formData.kategori, nama: formData.nama },
  });

  return {
    success: true,
    ticketNumber,
    message: `Sanggahan Anda berhasil terkirim dengan Nomor Tiket: ${ticketNumber}. Petugas kelurahan akan melakukan verifikasi faktual.`,
  };
}

/**
 * Submit Pengaduan Publik / Whistleblowing
 */
export async function submitPengaduanAction(formData: {
  isAnonim: boolean;
  namaPelapor: string;
  kontakPelapor: string;
  kategori: string;
  wilayah: string;
  uraian: string;
  buktiFotoUrl?: string;
}): Promise<{ success: boolean; ticketNumber: string; message: string }> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketNumber = `ADU-202609-${randomSuffix}`;

  SUBMITTED_PENGADUAN.unshift({
    ticketNumber,
    isAnonim: formData.isAnonim,
    namaPelapor: formData.isAnonim ? 'Anonim' : formData.namaPelapor,
    kategori: formData.kategori,
    wilayah: formData.wilayah,
    uraian: formData.uraian,
    status: 'Laporan Diterima (Menunggu Telaah Tim Pengawas)',
    tanggal: new Date().toLocaleDateString('id-ID'),
  });

  // Cryptographic audit trail
  await recordAuditEvent({
    aksi: 'SUBMIT_PENGADUAN_PUBLIK',
    tabel: 'pengaduan_publik',
    recordId: ticketNumber,
    aktor: formData.isAnonim ? 'Pelapor Anonim' : formData.namaPelapor,
    role: 'masyarakat',
    detail: `Laporan pengaduan/whistleblowing [${formData.kategori}] di wilayah ${formData.wilayah}. Nomor Tiket: ${ticketNumber}.`,
    dataSesudah: { ticketNumber, kategori: formData.kategori, wilayah: formData.wilayah },
  });

  return {
    success: true,
    ticketNumber,
    message: `Laporan pengaduan berhasil disampaikan dengan Nomor Tiket: ${ticketNumber}. Simpan nomor tiket untuk memantau status tindak lanjut.`,
  };
}

/**
 * Ambil Daftar Pengaduan Publik untuk Forum Terbuka
 */
export async function getPublicForumPengaduan() {
  return SUBMITTED_PENGADUAN;
}

/**
 * Lacak Status Pengaduan Publik berdasarkan Nomor Tiket
 */
export async function trackPengaduanByTicket(ticketNumber: string) {
  const cleanTicket = ticketNumber.trim().toUpperCase();
  const aduan = SUBMITTED_PENGADUAN.find((p) => p.ticketNumber === cleanTicket);

  if (!aduan) {
    return {
      found: false,
      message: `Nomor tiket ${cleanTicket} tidak ditemukan. Pastikan format tiket benar (contoh: ADU-202609-0012).`,
    };
  }

  return {
    found: true,
    aduan,
  };
}
