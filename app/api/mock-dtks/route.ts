import { NextResponse } from 'next/server';

/**
 * Mock API DTKS (Data Terpadu Kesejahteraan Sosial Pusat)
 * Mensimulasikan rekonsiliasi data antara lapangan kecamatan dengan database pusat
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

  // Data tiruan DTKS pusat
  const mockDtksDatabase: Record<
    string,
    { desil_pusat: number; bansos_aktif: string[]; status_dtks: string }
  > = {
    '3273010101850001': {
      desil_pusat: 1,
      bansos_aktif: ['PKH'],
      status_dtks: 'TERDAFTAR_AKTIF',
    },
    '3273010101600002': {
      desil_pusat: 2,
      bansos_aktif: ['BPNT'],
      status_dtks: 'TERDAFTAR_AKTIF',
    },
    '3273010101920003': {
      desil_pusat: 6,
      bansos_aktif: [],
      status_dtks: 'TIDAK_TERMASUK_KUOTA',
    },
  };

  const record = mockDtksDatabase[nik] || {
    desil_pusat: 5,
    bansos_aktif: [],
    status_dtks: 'BELUM_TERDAFTAR_DTKS',
  };

  return NextResponse.json({
    success: true,
    data: {
      nik,
      ...record,
      timestamp: new Date().toISOString(),
    },
    message: 'Data simulasi DTKS pusat berhasil diambil',
  });
}
