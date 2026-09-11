import { NextResponse } from 'next/server';

/**
 * Mock API Dukcapil (Interoperabilitas Kependudukan)
 * Mensimulasikan validasi format NIK & status terdaftar penduduk
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nik = searchParams.get('nik');

  if (!nik) {
    return NextResponse.json(
      { success: false, message: 'Parameter NIK diperlukan' },
      { status: 400 }
    );
  }

  if (nik.length !== 16 || !/^\d+$/.test(nik)) {
    return NextResponse.json(
      {
        success: false,
        valid: false,
        message: 'Format NIK tidak valid (harus 16 digit numerik)',
      },
      { status: 422 }
    );
  }

  // Response simulasi Dukcapil
  return NextResponse.json({
    success: true,
    valid: true,
    data: {
      nik,
      status_rekam: 'TERCATAT_AKTIF',
      provinsi: 'JAWA BARAT',
      kabupaten_kota: 'KOTA BANDUNG',
      kecamatan: 'KECAMATAN SUKAMAJU',
      is_valid_ktp_el: true,
      last_sync: new Date().toISOString(),
    },
    message: 'Data kependudukan valid (Mock Dukcapil API)',
  });
}
