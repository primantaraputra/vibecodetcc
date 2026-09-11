import { SurveiFormData, PMTScoreResult } from '@/lib/types/survei';
import { KategoriKelayakan } from '@/lib/types/database.types';

/**
 * Algoritma Proxy Means Testing (PMT)
 * Mengukur tingkat kemiskinan/kesejahteraan rumah tangga secara objektif berbasis 14 indikator BPS/Kemensos
 */
export function calculatePMTScore(data: SurveiFormData): PMTScoreResult {
  let score = 50; // Base baseline score (0 = Sangat Mampu/Kaya, 100 = Sangat Miskin/Miskin Ekstrem)
  const faktorKunci: Record<string, string | number> = {};

  // 1. Kondisi Fisik Rumah & Bangunan
  switch (data.jenis_lantai) {
    case 'tanah':
      score += 12;
      faktorKunci['Lantai Rumah'] = 'Tanah (Kondisi Sangat Sederhana)';
      break;
    case 'kayu_kualitas_rendah':
      score += 8;
      break;
    case 'semen':
      score += 3;
      break;
    case 'keramik':
      score -= 10;
      break;
    case 'marmer_granit':
      score -= 22;
      faktorKunci['Lantai Rumah'] = 'Marmer/Granit (Bangunan Mewah)';
      break;
  }

  switch (data.jenis_dinding) {
    case 'bambu_gedek':
      score += 10;
      faktorKunci['Dinding Rumah'] = 'Bambu Gedek (Kerentanan Tinggi)';
      break;
    case 'kayu_kualitas_rendah':
      score += 6;
      break;
    case 'tembok_tanpa_plester':
      score += 3;
      break;
    case 'tembok_plester':
      score -= 8;
      break;
  }

  switch (data.jenis_atap) {
    case 'rumbia_ijuk':
      score += 10;
      break;
    case 'seng':
      score += 4;
      break;
    case 'asbes':
      score += 2;
      break;
    case 'genteng_biasa':
      score -= 4;
      break;
    case 'genteng_keramik_beton':
      score -= 12;
      break;
  }

  // Luas lantai per kapita
  const tanggungan = Math.max(1, data.jumlah_tanggungan || 1);
  const luasPerKapita = (data.luas_lantai || 36) / tanggungan;
  if (luasPerKapita < 8) {
    score += 8;
    faktorKunci['Kepadatan Hunian'] = `Luas sempit (${luasPerKapita.toFixed(1)} m²/jiwa)`;
  } else if (luasPerKapita > 25) {
    score -= 10;
  }

  // 2. Sanitasi & Air Minum
  if (data.jenis_jamban === 'tidak_ada' || data.jenis_jamban === 'bersama_umum') {
    score += 8;
    faktorKunci['Fasilitas Sanitasi'] = 'Tidak Memiliki Jamban Pribadi';
  } else if (data.jenis_jamban === 'sendiri_leher_angsa') {
    score -= 6;
  }

  if (['sumur_tak_terlindung', 'sungai_danau', 'air_hujan', 'mata_air'].includes(data.sumber_air_minum)) {
    score += 7;
    faktorKunci['Sumber Air Minum'] = 'Air Tak Terlindung / Alami';
  } else if (data.sumber_air_minum === 'air_kemasan') {
    score -= 8;
  }

  // 3. Daya Listrik & Bahan Bakar
  switch (data.daya_listrik) {
    case 'non_pln':
      score += 12;
      faktorKunci['Daya Listrik'] = 'Non-PLN (Menumpang/Genset)';
      break;
    case 'pln_450va':
      score += 8;
      faktorKunci['Daya Listrik'] = 'PLN 450 VA (Bersubsidi Penuh)';
      break;
    case 'pln_900va':
      score += 0;
      break;
    case 'pln_1300va':
      score -= 12;
      break;
    case 'pln_gt_1300va':
      score -= 25;
      faktorKunci['Daya Listrik'] = 'PLN > 1300 VA (Daya Menengah-Atas)';
      break;
  }

  if (data.bahan_bakar_memasak === 'kayu_bakar' || data.bahan_bakar_memasak === 'minyak_tanah') {
    score += 6;
  }

  // 4. Aset Kepemilikan
  if (data.aset_kendaraan === 'tidak_ada') {
    score += 6;
  } else if (data.aset_kendaraan === 'motor') {
    score -= 4;
  } else if (data.aset_kendaraan === 'mobil') {
    score -= 30;
    faktorKunci['Kepemilikan Aset'] = 'Memiliki Mobil Pribadi';
  }

  if (data.aset_tanah) {
    score -= 10;
  }

  // 5. Pengeluaran Rumah Tangga per Kapita
  const pengeluaranTotal = Number(data.pengeluaran_per_bulan) || 800000;
  const pengeluaranPerKapita = pengeluaranTotal / tanggungan;

  if (pengeluaranPerKapita < 350000) {
    score += 15;
    faktorKunci['Pengeluaran per Kapita'] = `Sangat Rendah (< Rp 350.000/bln)`;
  } else if (pengeluaranPerKapita < 650000) {
    score += 8;
  } else if (pengeluaranPerKapita > 1500000) {
    score -= 18;
  } else if (pengeluaranPerKapita > 3000000) {
    score -= 35;
  }

  // 6. Kerentanan Sosial & Perlindungan Khusus (Bonus Kerentanan)
  if (data.anggota_disabilitas_berat > 0) {
    score += 12;
    faktorKunci['Disabilitas Berat'] = `${data.anggota_disabilitas_berat} Jiwa`;
  }
  if (data.anggota_lansia > 0) {
    score += 8;
    faktorKunci['Lansia Rentan'] = `${data.anggota_lansia} Jiwa`;
  }
  if (data.anggota_anak_sekolah > 0) {
    score += Math.min(10, data.anggota_anak_sekolah * 4);
    faktorKunci['Anak Usia Sekolah'] = `${data.anggota_anak_sekolah} Anak`;
  }
  if (data.anggota_balita > 0) {
    score += 5;
  }
  if (data.anggota_penyakit_kronis > 0) {
    score += 7;
  }

  // Clamp Score between 0.00 and 100.00
  const finalScore = Math.max(0, Math.min(100, Math.round(score * 100) / 100));

  // Pemetaan ke Desil 1–10
  let desil = 1;
  let kategori: KategoriKelayakan = 'sangat_miskin';

  if (finalScore >= 80) {
    desil = 1;
    kategori = 'sangat_miskin';
  } else if (finalScore >= 70) {
    desil = 2;
    kategori = 'miskin';
  } else if (finalScore >= 60) {
    desil = 3;
    kategori = 'hampir_miskin';
  } else if (finalScore >= 48) {
    desil = 4;
    kategori = 'rentan_miskin';
  } else if (finalScore >= 38) {
    desil = 5;
    kategori = 'mampu';
  } else if (finalScore >= 28) {
    desil = 6;
    kategori = 'mampu';
  } else if (finalScore >= 20) {
    desil = 7;
    kategori = 'mampu';
  } else if (finalScore >= 12) {
    desil = 8;
    kategori = 'mampu';
  } else if (finalScore >= 6) {
    desil = 9;
    kategori = 'mampu';
  } else {
    desil = 10;
    kategori = 'mampu';
  }

  // 7. Rekomendasi Program Bansos Otomatis
  const rekomendasi: string[] = [];
  if (desil <= 2 && (data.anggota_anak_sekolah > 0 || data.anggota_lansia > 0 || data.anggota_disabilitas_berat > 0)) {
    rekomendasi.push('PKH');
  }
  if (desil <= 3) {
    rekomendasi.push('BPNT');
  }
  if (desil <= 4) {
    rekomendasi.push('BLT_DESA');
  }
  if (data.anggota_lansia > 0 && desil <= 4) {
    rekomendasi.push('BANSOS_LANSIA');
  }
  if (data.anggota_disabilitas_berat > 0 && desil <= 4) {
    rekomendasi.push('ATENSI_DISABILITAS');
  }

  // 8. Deteksi Anomali Data Sederhana (Flag Otomatis)
  let flagAnomali = false;
  let pesanAnomali: string | undefined = undefined;

  if (data.aset_kendaraan === 'mobil' && pengeluaranTotal < 1000000) {
    flagAnomali = true;
    pesanAnomali = 'Anomali: Memiliki kendaraan mobil namun pengeluaran keluarga tercatat di bawah Rp 1.000.000/bulan.';
  } else if (data.jenis_lantai === 'marmer_granit' && data.daya_listrik === 'pln_450va') {
    flagAnomali = true;
    pesanAnomali = 'Anomali: Lantai rumah marmer/granit tetapi daya listrik terpasang 450VA bersubsidi.';
  } else if (data.anggota_disabilitas_berat > 0 && data.jumlah_tanggungan === 0) {
    flagAnomali = true;
    pesanAnomali = 'Anomali: Tercatat ada anggota disabilitas berat namun jumlah tanggungan 0.';
  }

  // 9. Deteksi Potensi Tumpang Tindih Program
  let flagTumpangTindih = false;
  let pesanTumpangTindih: string | undefined = undefined;

  if (data.program_bansos_id === 'PKH' && rekomendasi.includes('BLT_DESA')) {
    flagTumpangTindih = true;
    pesanTumpangTindih = 'Perhatian: Warga memenuhi kriteria PKH & BLT-DD. Sesuai regulasi, penerima PKH tidak diperkenankan merangkap BLT Dana Desa.';
  }

  // 10. Generate AI Explanation (Human-Readable Explainability)
  const penjelasan = generateNarrativeExplanation(data, finalScore, desil, kategori, faktorKunci);

  return {
    skor_pmt: finalScore,
    desil,
    kategori_kelayakan: kategori,
    penjelasan_skor_ai: penjelasan,
    rekomendasi_program: rekomendasi.length > 0 ? rekomendasi : ['TIDAK_REKOMENDASI'],
    faktor_kunci: faktorKunci,
    anomali: {
      flag_anomali: flagAnomali,
      pesan_anomali: pesanAnomali,
    },
    tumpang_tindih: {
      flag_tumpang_tindih: flagTumpangTindih,
      pesan_tumpang_tindih: pesanTumpangTindih,
    },
  };
}

function generateNarrativeExplanation(
  data: SurveiFormData,
  score: number,
  desil: number,
  kategori: KategoriKelayakan,
  faktorKunci: Record<string, string | number>
): string {
  const faktorList = Object.entries(faktorKunci)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const kategoriStr = {
    sangat_miskin: 'Sangat Miskin (Prioritas 1)',
    miskin: 'Miskin (Prioritas 2)',
    hampir_miskin: 'Hampir Miskin (Prioritas 3)',
    rentan_miskin: 'Rentan Miskin (Prioritas 4)',
    mampu: 'Menengah / Mampu (Non-Prioritas)',
  }[kategori];

  let narasi = `Berdasarkan kalkulasi Proxy Means Testing (PMT), rumah tangga ${data.nama_lengkap} memperoleh skor kesejahteraan ${score.toFixed(1)}/100 dan dipetakan ke dalam Desil ${desil} (${kategoriStr}). `;

  if (desil <= 2) {
    narasi += `Faktor utama penentu desil adalah kondisi hunian fisik yang sangat terbatas (${data.jenis_lantai === 'tanah' ? 'lantai tanah' : 'lantai sederhana'}, dinding ${data.jenis_dinding.replace('_', ' ')}), daya listrik bersubsidi ${data.daya_listrik.replace('_', ' ').toUpperCase()}, serta beban ekonomi keluarga dengan ${data.jumlah_tanggungan} tanggungan. `;
  } else if (desil <= 4) {
    narasi += `Keluarga berada pada tingkat rentan miskin dengan kemampuan memenuhi kebutuhan dasar pokok, namun rentan terhadap guncangan ekonomi. `;
  } else {
    narasi += `Keluarga dinilai memiliki kapasitas ekonomi mandiri (lantai ${data.jenis_dinding.replace('_', ' ')}, listrik ${data.daya_listrik.replace('_', ' ')}, kepemilikan aset) sehingga berada di luar prioritas penerima bansos bersyarat. `;
  }

  if (data.anggota_anak_sekolah > 0 || data.anggota_disabilitas_berat > 0 || data.anggota_lansia > 0) {
    narasi += `Terdapat komponen kerentanan khusus yang memperkuat prioritas bantuan: ${[
      data.anggota_anak_sekolah > 0 ? `${data.anggota_anak_sekolah} anak usia sekolah` : null,
      data.anggota_disabilitas_berat > 0 ? `${data.anggota_disabilitas_berat} penyandang disabilitas` : null,
      data.anggota_lansia > 0 ? `${data.anggota_lansia} lansia` : null,
    ]
      .filter(Boolean)
      .join(', ')}.`;
  }

  return narasi;
}
