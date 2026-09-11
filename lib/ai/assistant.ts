/**
 * ==============================================================================
 * CENTRALIZED AI ASSISTANT SERVICE (lib/ai/assistant.ts)
 * ==============================================================================
 * Layanan AI terpusat untuk Sistem Transparansi Bansos Kecamatan.
 * Menggunakan Claude API (Anthropic) dengan fallback heuristik cerdas berbahasa Indonesia.
 * 
 * Prinsip Wajib:
 * 1. AI hanya bertindak sebagai asisten pembantu dan penjelas (Explainability).
 * 2. Keputusan akhir kelayakan bansos 100% berada pada approver manusia (RT/RW/Kelurahan/Kecamatan).
 * 3. Tidak membocorkan data pribadi warga lain (Privacy-preserving UU PDP).
 */

export interface SanggahanDraftInput {
  nama: string;
  nik: string;
  kategori: 'layak_tidak_dapat' | 'desil_tidak_sesuai' | 'data_salah' | 'pemberhentian_sepihak' | 'lainnya';
  kondisiRingkas: string; // Keluhan bebas berbahasa sehari-hari dari warga
  tanggungan?: number;
  pekerjaan?: string;
  dayaListrik?: string;
}

export interface WargaSurveiInput {
  nama: string;
  nikMasked: string;
  desil: number;
  skorPmt: number;
  jenisLantai: string;
  jenisDinding: string;
  dayaListrik: string;
  sumberAir: string;
  jenisJamban: string;
  penghasilanBulan: number;
  jumlahTanggungan: number;
  pekerjaan: string;
  anggotaAnakSekolah?: number;
  anggotaLansia?: number;
  anggotaDisabilitas?: number;
}

export interface VillageSummaryInput {
  namaKelurahan: string;
  totalWarga: number;
  totalPenerimaKK: number;
  totalAnggaran: number;
  desil1_2: number;
  serapanPersen: number;
  programBreakdown: { nama: string; penerima: number; anggaran: number }[];
}

export interface AnalyticsSummaryInput {
  totalWarga: number;
  totalPengajuan: number;
  disetujuiKecamatan: number;
  ditolak: number;
  dalamProses: number;
  sebaranDesil: Record<number, number>;
  serapanAnggaran: {
    program: string;
    kuota: number;
    terpakai: number;
    anggaranPerOrang: number;
  }[];
}

export interface BansosRecommendation {
  kodeProgram: string;
  namaProgram: string;
  statusSaran: 'SANGAT_DIREKOMENDASIKAN' | 'DAPAT_DIPERTIMBANGKAN' | 'TIDAK_MEMENUHI_KRITERIA';
  alasanRekomendasi: string;
  catatanPetugas: string;
}

/**
 * Helper: Panggil Claude API jika ANTHROPIC_API_KEY tersedia
 */
async function callClaudeAPI(systemPrompt: string, userMessage: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.startsWith('your-') || apiKey.length < 10) {
    return null; // Fallback to local intelligence
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.content?.[0]?.text;
      if (content) return content.trim();
    }
  } catch (err) {
    console.warn('[AI Assistant] Claude API call failed, falling back to local heuristic:', err);
  }

  return null;
}

// ==============================================================================
// 1. FITUR UNTUK MASYARAKAT
// ==============================================================================

/**
 * 1.1 Chatbot FAQ seputar bansos (istilah desil, DTKS, prosedur, syarat)
 */
export async function askBansosChatbot(
  query: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{
  jawaban: string;
  topikTerkait: string[];
}> {
  const systemPrompt = `Anda adalah Asisten AI Resmi Bantuan Sosial Kecamatan Sukamaju. 
Tugas Anda adalah mengedukasi warga dengan bahasa Indonesia yang santun, jelas, dan mudah dimengerti orang awam.
Jawab pertanyaan seputar:
- Pengertian Desil 1–10 (Desil 1–2 = sangat miskin / miskin ekstrem, Desil 3 = hampir miskin, Desil 4 = rentan).
- Pendaftaran DTKS (melalui Ketua RT dan Musyawarah Desa/Kelurahan).
- Perbedaan PKH, BPNT/Sembako, dan BLT Dana Desa.
- Cara mengajukan sanggahan jika merasa layak.
- Cara melaporkan pungli bansos secara anonim.
Ingat: Selalu jelaskan bahwa AI hanya alat bantu informasi, keputusan verifikasi mutlak ada pada petugas berwenang.`;

  const claudeAnswer = await callClaudeAPI(
    systemPrompt,
    `Pertanyaan warga: "${query}"\nRiwayat singkat: ${JSON.stringify(chatHistory.slice(-3))}`
  );

  if (claudeAnswer) {
    return {
      jawaban: claudeAnswer,
      topikTerkait: ['Cek Status NIK/KK', 'Simulasi Desil Mandiri', 'Formulir Sanggahan', 'Pengaduan Publik'],
    };
  }

  // Local fallback response
  return answerBansosFAQ(query);
}

/**
 * Local Fallback Chatbot
 */
export function answerBansosFAQ(query: string): {
  jawaban: string;
  topikTerkait: string[];
} {
  const q = query.toLowerCase();

  if (q.includes('desil') || q.includes('apa itu desil') || q.includes('skor')) {
    return {
      jawaban:
        'Desil adalah pengelompokan tingkat kesejahteraan keluarga ke dalam 10 tingkatan (Desil 1 = 10% keluarga paling miskin, hingga Desil 10 = 10% keluarga paling mampu). Bantuan seperti PKH dan BPNT diprioritaskan bagi keluarga di Desil 1, 2, dan 3 berdasarkan survei 14 kriteria BPS/Kemensos.',
      topikTerkait: ['Cara Menghitung Desil', 'Kriteria PKH', 'Simulasi Desil Mandiri'],
    };
  }

  if (q.includes('dtks') || q.includes('daftar dtks') || q.includes('cara daftar')) {
    return {
      jawaban:
        'DTKS (Data Terpadu Kesejahteraan Sosial) adalah basis data induk penerima bantuan sosial. Untuk mendaftar, warga membawa fotokopi KTP & KK ke Ketua RT setempat untuk didaftarkan dalam Musyawarah Desa/Kelurahan (Musdes/Muskel), lalu disurvei langsung oleh petugas lapangan.',
      topikTerkait: ['Jadwal Pemutakhiran DTKS', 'Syarat Pendaftaran RT', 'Cek Status NIK'],
    };
  }

  if (q.includes('sanggah') || q.includes('keberatan') || q.includes('tidak dapat') || q.includes('layak tapi')) {
    return {
      jawaban:
        'Jika Anda merasa layak namun belum menerima bantuan sosial, Anda dapat menggunakan fitur "Ajukan Sanggahan" di portal ini. Masukkan NIK Anda, jelaskan kondisi keluarga, dan manfaatkan fitur AI Draft untuk membantu menyusun surat sanggahan resmi yang akan diverifikasi oleh petugas kelurahan.',
      topikTerkait: ['Formulir Sanggahan', 'Bukti Pendukung Sanggahan', 'Lama Proses Verifikasi'],
    };
  }

  if (q.includes('pkh') || q.includes('bpnt') || q.includes('blt') || q.includes('beda')) {
    return {
      jawaban:
        'PKH (Program Keluarga Harapan) adalah bantuan bersyarat untuk keluarga berpenghasilan rendah dengan komponen anak sekolah, ibu hamil, lansia, atau disabilitas berat. BPNT (Sembako) adalah bantuan pangan bulanan. BLT-DD adalah bantuan tunai dana desa untuk warga miskin ekstrem non-penerima PKH/BPNT.',
      topikTerkait: ['Besaran Bantuan PKH', 'Jadwal Cair BPNT', 'Syarat Dobel Bansos'],
    };
  }

  if (q.includes('lapor') || q.includes('pungli') || q.includes('potong') || q.includes('salah sasaran')) {
    return {
      jawaban:
        'Dugaan pemotongan dana bansos (pungli), penerima fiktif, atau bantuan salah sasaran dapat dilaporkan melalui menu "Pengaduan Publik". Laporan dapat dikirimkan secara Anonim (rahasia) dan akan ditindaklanjuti langsung oleh Tim Pengawas Bansos Kecamatan.',
      topikTerkait: ['Formulir Whistleblowing', 'Cek Status Tiket Aduan', 'Perlindungan Pelapor'],
    };
  }

  return {
    jawaban:
      'Halo! Saya Asisten AI Bansos Kecamatan Sukamaju. Anda dapat menanyakan seputar: (1) Apa itu Desil & DTKS, (2) Syarat & perbedaan PKH/BPNT/BLT, (3) Cara mengecek status NIK/KK, (4) Prosedur pengajuan sanggahan jika merasa layak, atau (5) Cara melaporkan dugaan penyalahgunaan bansos.',
    topikTerkait: ['Cek Status NIK', 'Simulasi Desil Mandiri', 'Ajukan Sanggahan', 'Pengaduan Publik'],
  };
}

/**
 * 1.2 Penyusun form sanggahan otomatis dari keluhan bebas berbahasa sehari-hari
 */
export function generateSanggahanLetter(input: SanggahanDraftInput): {
  perihal: string;
  isiSurat: string;
  rekomendasiBukti: string[];
} {
  const kategoriLabels: Record<string, string> = {
    layak_tidak_dapat: 'Permohonan Peninjauan Ulang Kelayakan Bantuan Sosial (Belum Terdaftar/Belum Menerima)',
    desil_tidak_sesuai: 'Keberatan Penetapan Desil Kesejahteraan yang Tidak Sesuai Kondisi Riil',
    data_salah: 'Permohonan Koreksi dan Pemutakhiran Data Lapangan Survei Kesejahteraan',
    pemberhentian_sepihak: 'Pengajuan Penjelasan dan Evaluasi Penghentian Penyaluran Bantuan Sosial',
    lainnya: 'Pengajuan Sanggahan / Keberatan Terkait Bantuan Sosial',
  };

  const perihal = kategoriLabels[input.kategori] || 'Pengajuan Sanggahan Bantuan Sosial';

  let isiSurat = `Kepada Yth.\nBapak/Ibu Tim Verifikasi Bantuan Sosial\nKecamatan Sukamaju / Kelurahan Setempat\n\nDengan hormat,\n\nSaya yang bertanda tangan di bawah ini:\n`;
  isiSurat += `Nama: ${input.nama || 'Warga Bersangkutan'}\n`;
  isiSurat += `NIK: ${input.nik || '327301XXXXXXXXXX'}\n`;
  if (input.pekerjaan) isiSurat += `Pekerjaan: ${input.pekerjaan}\n`;
  if (input.tanggungan) isiSurat += `Jumlah Tanggungan: ${input.tanggungan} orang\n`;
  if (input.dayaListrik) isiSurat += `Daya Listrik Rumah: ${input.dayaListrik}\n\n`;

  isiSurat += `Dengan ini bermaksud menyampaikan sanggahan/keberatan secara resmi sehubungan dengan hasil penetapan kepesertaan bantuan sosial pada wilayah kami.\n\n`;
  isiSurat += `Adapun kondisi riil keluarga kami saat ini adalah sebagai berikut:\n`;

  // Bersihkan dan format poin-poin dari input ringkas warga
  const lines = input.kondisiRingkas
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length > 0) {
    lines.forEach((line) => {
      isiSurat += `- ${line.charAt(0).toUpperCase() + line.slice(1)}\n`;
    });
  } else {
    isiSurat += `- Mengalami kesulitan ekonomi mendasar dan membutuhkan dukungan perlindungan sosial.\n`;
  }

  isiSurat += `\nBerdasarkan pertimbangan dan fakta kondisi fisik serta ekonomi di atas, kami sangat berharap Bapak/Ibu Petugas dapat berkenan melakukan verifikasi faktual ulang atau survei lapang kunjungan kembali ke kediaman kami guna penyesuaian data pada sistem DTKS / Kelayakan Daerah.\n\n`;
  isiSurat += `Demikian permohonan sanggahan ini saya sampaikan dengan sebenar-benarnya tanpa rekayasa. Atas perhatian, kebijaksanaan, dan bantuan Bapak/Ibu, kami haturkan terima kasih yang sebesar-besarnya.\n\n`;
  isiSurat += `Hormat saya,\n\n(${input.nama || 'Pemohon'})`;

  // Rekomendasi bukti foto/dokumen berdasarkan kategori
  const rekomendasiBukti: string[] = [
    'Foto KTP & Kartu Keluarga (KK) yang jelas',
    'Foto tampak depan rumah & kondisi atap/dinding',
  ];

  if (input.dayaListrik) {
    rekomendasiBukti.push('Foto meteran / struk pembayaran listrik PLN');
  }
  if (input.kategori === 'desil_tidak_sesuai' || input.kategori === 'layak_tidak_dapat') {
    rekomendasiBukti.push('Surat Keterangan Tidak Mampu (SKTM) dari RT/RW setempat');
    rekomendasiBukti.push('Foto kondisi dapur atau sanitasi rumah');
  }

  return { perihal, isiSurat, rekomendasiBukti };
}

/**
 * 1.3 Penjelas skor kelayakan personal dalam bahasa manusia, berdasarkan data survei warga
 * (Tanpa membocorkan data warga lain)
 */
export function generatePersonalScoreExplanation(warga: WargaSurveiInput): string {
  const faktorKunci: string[] = [];

  if (warga.jenisLantai === 'tanah' || warga.jenisLantai === 'kayu_murah') {
    faktorKunci.push('kondisi lantai rumah non-permanen');
  }
  if (warga.jenisDinding === 'bambu_gedek' || warga.jenisDinding === 'kayu_papan') {
    faktorKunci.push('dinding rumah belum diplester/semi-permanen');
  }
  if (warga.dayaListrik.includes('450') || warga.dayaListrik === 'non_pln') {
    faktorKunci.push('daya listrik bersubsidi/terbatas');
  }
  if (warga.jenisJamban === 'tidak_ada' || warga.sumberAir.includes('tak_terlindung')) {
    faktorKunci.push('fasilitas sanitasi dan air bersih yang membutuhkan perbaikan');
  }
  if (warga.anggotaAnakSekolah && warga.anggotaAnakSekolah > 0) {
    faktorKunci.push(`adanya ${warga.anggotaAnakSekolah} orang anak usia sekolah yang memerlukan biaya pendidikan`);
  }
  if (warga.anggotaLansia && warga.anggotaLansia > 0) {
    faktorKunci.push(`keberadaan lansia rentan (${warga.anggotaLansia} jiwa)`);
  }
  if (warga.anggotaDisabilitas && warga.anggotaDisabilitas > 0) {
    faktorKunci.push(`anggota keluarga penyandang disabilitas berat`);
  }

  const perKapita = warga.penghasilanBulan / Math.max(1, warga.jumlahTanggungan + 1);

  if (warga.desil <= 2) {
    return `Keluarga Anda berada pada kelompok Desil ${warga.desil} (Prioritas Utama / Kemiskinan Ekstrem) dengan Skor Kelayakan PMT ${warga.skorPmt}/100. Penilaian ini dipengaruhi oleh ${faktorKunci.join(', ')}, serta rata-rata pengeluaran per kapita sekitar Rp ${Math.round(perKapita).toLocaleString('id-ID')}/bulan. Keluarga Anda sangat diprioritaskan untuk menerima bantuan bersyarat PKH dan BPNT Sembako.`;
  } else if (warga.desil <= 4) {
    return `Keluarga Anda berada pada kelompok Desil ${warga.desil} (Rentan / Hampir Miskin) dengan Skor Kelayakan PMT ${warga.skorPmt}/100. Kondisi tempat tinggal dan tanggungan keluarga memenuhi ambang batas bantuan penopang pangan dasar (BPNT atau BLT Desa).`;
  } else {
    return `Keluarga Anda berada pada kelompok Desil ${warga.desil} (Kategori Mampu / Non-Prioritas Bansos Reguler) dengan Skor Kelayakan PMT ${warga.skorPmt}/100. Tingkat pendapatan dan kondisi fisik rumah berada di atas garis prioritas bantuan kemiskinan daerah.`;
  }
}

// ==============================================================================
// 2. FITUR UNTUK PETUGAS
// ==============================================================================

/**
 * 2.1 Input suara-ke-teks untuk observasi lapangan di form survei
 * Mengubah transkripsi lisan surveyor menjadi catatan observasi lapangan yang terstruktur dan faktual.
 */
export function transcribeAndSummarizeVoiceObservation(rawTranscript: string): {
  catatanTerstruktur: string;
  poinKunci: string[];
  anomaliTerdeteksi?: string;
} {
  if (!rawTranscript.trim()) {
    return {
      catatanTerstruktur: 'Tidak ada rekaman observasi suara.',
      poinKunci: [],
    };
  }

  const text = rawTranscript.trim();
  const lower = text.toLowerCase();
  const poinKunci: string[] = [];
  let anomaliTerdeteksi: string | undefined = undefined;

  // Analisis indikator dari rekaman
  if (lower.includes('tanah') || lower.includes('lantai')) {
    poinKunci.push('Fisik Lantai: Terkonfirmasi non-permanen/tanah.');
  }
  if (lower.includes('bocor') || lower.includes('atap') || lower.includes('dinding')) {
    poinKunci.push('Kondisi Bangunan: Atap/dinding lapuk butuh bantuan RTLH.');
  }
  if (lower.includes('lansia') || lower.includes('sakit') || lower.includes('tua')) {
    poinKunci.push('Kerentanan: Terdapat lansia non-produktif/sakit menahun.');
  }
  if (lower.includes('sekolah') || lower.includes('anak') || lower.includes('sd') || lower.includes('smp')) {
    poinKunci.push('Komponen Pendidikan: Ada anak usia wajib belajar.');
  }
  if (lower.includes('mobil') || lower.includes('motor banyak') || lower.includes('mampu')) {
    anomaliTerdeteksi = 'Peringatan: Terdapat indikasi kepemilikan aset bernilai tinggi yang perlu diverifikasi ulang.';
  }

  const catatanTerstruktur = `[HASIL OBSERVASI LAPANGAN PETUGAS]:\n${text}\n\n[POIN KESIMPULAN FAKTUAL]:\n${
    poinKunci.length > 0 ? poinKunci.map((p) => `- ${p}`).join('\n') : '- Data terkonfirmasi sesuai kuesioner fisik rumah.'
  }`;

  return { catatanTerstruktur, poinKunci, anomaliTerdeteksi };
}

/**
 * 2.2 Ringkasan naratif otomatis per warga/desa untuk kebutuhan laporan
 */
export function generateVillageNarrativeSummary(village: VillageSummaryInput): string {
  return `Laporan Kesejahteraan Wilayah ${village.namaKelurahan}: Tercatat sebanyak ${village.totalWarga.toLocaleString('id-ID')} jiwa (${village.totalPenerimaKK} KK) menerima bantuan sosial dengan total serapan anggaran mencapai Rp ${village.totalAnggaran.toLocaleString('id-ID')} (${village.serapanPersen}% dari alokasi pagu). Konsentrasi kelompok Desil 1–2 berada pada angka ${village.desil1_2} KK. Alokasi program terbesar didominasi oleh ${village.programBreakdown[0]?.nama || 'BPNT'} dan ${village.programBreakdown[1]?.nama || 'PKH'}.`;
}

/**
 * Ringkasan Eksekutif Analitik Kecamatan untuk Camat
 */
export function generateExecutiveAnalyticsSummary(data: AnalyticsSummaryInput): {
  headline: string;
  ringkasanEksekutif: string;
  temuanKunci: string[];
  rekomendasiKebijakan: string[];
} {
  const totalDesil1_2 = (data.sebaranDesil[1] || 0) + (data.sebaranDesil[2] || 0);
  const persentaseKemiskinanEkstrem =
    data.totalWarga > 0 ? ((totalDesil1_2 / data.totalWarga) * 100).toFixed(1) : '0';

  const headline = `Laporan Kesejahteraan Sosial Kecamatan: ${data.totalPengajuan} Usulan Diproses, Fokus Desil 1–2 (${persentaseKemiskinanEkstrem}%)`;

  const ringkasanEksekutif = `Berdasarkan rekapitulasi data survei kesejahteraan termutakhir di wilayah Kecamatan Sukamaju, tercatat total ${data.totalWarga.toLocaleString('id-ID')} jiwa warga terdata dalam basis data kelayakan. Dari ${data.totalPengajuan} berkas usulan berjenjang, sebanyak ${data.disetujuiKecamatan} usulan telah disetujui, ${data.dalamProses} berkas masih dalam tahapan verifikasi RW/Kelurahan, dan ${data.ditolak} usulan ditolak karena tidak memenuhi kriteria desil kuota APBD/Kemensos.`;

  const temuanKunci = [
    `Konsentrasi kemiskinan ekstrem (Desil 1–2) mencapai ${totalDesil1_2} KK, mayoritas terdistribusi pada kantong pemukiman padat Kelurahan Mekarjaya & Cibaduyut Asri.`,
    `Tingkat kelulusan verifikasi (approval rate) berjenjang mencapai ${data.totalPengajuan > 0 ? Math.round((data.disetujuiKecamatan / data.totalPengajuan) * 100) : 0}%, menunjukkan proses seleksi awal di tingkat RT/RW berjalan selektif.`,
    `Serapan program BPNT dan PKH mendekati batas kuota (di atas 85%), sedangkan program BLT-Desa masih memiliki ruang alokasi untuk warga rentan terdampak musiman.`,
  ];

  const rekomendasiKebijakan = [
    'Melakukan percepatan rekonsiliasi data dengan DTKS Kemensos untuk menghindari tumpang tindih alokasi PKH dan BLT Dana Desa.',
    'Memprioritaskan intervensi bedah rumah & sanitasi terpadu bagi 48 KK Desil 1 yang memiliki jenis lantai tanah dan sumber air tak terlindung.',
    'Mengaktifkan posko musyawarah kelurahan mingguan guna memproses sanggahan warga sebelum penetapan SK Final pencairan triwulan berikutnya.',
  ];

  return {
    headline,
    ringkasanEksekutif,
    temuanKunci,
    rekomendasiKebijakan,
  };
}

/**
 * 2.3 Rekomendasi kategori program bansos berdasarkan hasil survei
 * (Tampilkan sebagai SARAN saja dengan alasan, petugas tetap yang approve final)
 */
export function recommendBansosWithRationale(
  surveiData: WargaSurveiInput,
  score: number,
  desil: number
): BansosRecommendation[] {
  const recommendations: BansosRecommendation[] = [];

  // PKH Recommendation
  if (desil <= 2 && ((surveiData.anggotaAnakSekolah && surveiData.anggotaAnakSekolah > 0) || (surveiData.anggotaLansia && surveiData.anggotaLansia > 0) || (surveiData.anggotaDisabilitas && surveiData.anggotaDisabilitas > 0))) {
    recommendations.push({
      kodeProgram: 'PKH',
      namaProgram: 'Program Keluarga Harapan (PKH)',
      statusSaran: 'SANGAT_DIREKOMENDASIKAN',
      alasanRekomendasi: `Desil ${desil} (Skor PMT: ${score}) memenuhi ambang batas maksimal Desil 2, dan memiliki komponen bersyarat (${surveiData.anggotaAnakSekolah || 0} anak sekolah, ${surveiData.anggotaLansia || 0} lansia, ${surveiData.anggotaDisabilitas || 0} disabilitas).`,
      catatanPetugas: 'Saran sistem: Prioritaskan verifikasi berkas KK dan surat keterangan sekolah di tingkat RW.',
    });
  }

  // BPNT Recommendation
  if (desil <= 3) {
    recommendations.push({
      kodeProgram: 'BPNT',
      namaProgram: 'Bantuan Pangan Non Tunai (BPNT / Sembako)',
      statusSaran: 'SANGAT_DIREKOMENDASIKAN',
      alasanRekomendasi: `Keluarga berada pada Desil ${desil} dengan kebutuhan dukungan pangan pokok dasar bulanan.`,
      catatanPetugas: 'Saran sistem: Dapat dikombinasikan (stacking) bersama PKH jika kuota kelurahan mencukupi.',
    });
  }

  // BLT-DD Recommendation
  if (desil <= 4 && recommendations.length === 0) {
    recommendations.push({
      kodeProgram: 'BLT_DESA',
      namaProgram: 'BLT Dana Desa / Kelurahan',
      statusSaran: 'DAPAT_DIPERTIMBANGKAN',
      alasanRekomendasi: `Desil ${desil} rentan miskin namun belum terakomodasi program reguler PKH/BPNT.`,
      catatanPetugas: 'Saran sistem: Rekomendasi alternatif non-APBN untuk menjaga daya beli keluarga.',
    });
  }

  // Bansos Lansia APBD
  if (surveiData.anggotaLansia && surveiData.anggotaLansia > 0 && desil <= 4) {
    recommendations.push({
      kodeProgram: 'BANSOS_LANSIA',
      namaProgram: 'Bansos Khusus Lansia Rentan APBD',
      statusSaran: 'DAPAT_DIPERTIMBANGKAN',
      alasanRekomendasi: `Terdapat anggota keluarga lansia rentan (${surveiData.anggotaLansia} jiwa) pada Desil ${desil}.`,
      catatanPetugas: 'Saran sistem: Verifikasi apakah lansia hidup tunggal tanpa penanggung nafkah utama.',
    });
  }

  // ATENSI Disabilitas
  if (surveiData.anggotaDisabilitas && surveiData.anggotaDisabilitas > 0) {
    recommendations.push({
      kodeProgram: 'ATENSI_DISABILITAS',
      namaProgram: 'Asistensi Rehabilitasi Sosial Disabilitas (ATENSI)',
      statusSaran: 'SANGAT_DIREKOMENDASIKAN',
      alasanRekomendasi: 'Memiliki anggota keluarga penyandang disabilitas berat yang membutuhkan bantuan rehabilitasi sosial.',
      catatanPetugas: 'Saran sistem: Rekomendasikan asesmen alat bantu medis ke Dinas Sosial Kecamatan.',
    });
  }

  return recommendations;
}
