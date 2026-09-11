'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Shield,
  Send,
  Upload,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  EyeOff,
  MessageCircle,
  Building,
  Check,
} from 'lucide-react';
import {
  submitPengaduanAction,
  trackPengaduanByTicket,
  getPublicForumPengaduan,
} from '@/lib/actions/public';
import { localStorageManager } from '@/lib/storage/localStorageManager';

export default function PengaduanWhistleblowingForm() {
  const [activeTab, setActiveTab] = useState<'lapor' | 'forum' | 'lacak'>('forum');

  // Lapor State
  const [isAnonim, setIsAnonim] = useState(true);
  const [namaPelapor, setNamaPelapor] = useState('');
  const [kontakPelapor, setKontakPelapor] = useState('');
  const [kategori, setKategori] = useState('Pungli / Pemotongan Dana Bansos');
  const [wilayah, setWilayah] = useState('Kelurahan Mekarjaya');
  const [uraian, setUraian] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Forum State
  const [forumReports, setForumReports] = useState<any[]>([]);
  const [isLoadingForum, setIsLoadingForum] = useState(false);

  // Lacak State
  const [ticketQuery, setTicketQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const fetchForum = () => {
    localStorageManager.init();
    const localAduan = localStorageManager.getPengaduanList();
    if (localAduan && localAduan.length > 0) {
      setForumReports(localAduan);
    }
  };

  useEffect(() => {
    fetchForum();
    const unsubscribe = localStorageManager.subscribe(() => {
      fetchForum();
    });
    return () => unsubscribe();
  }, []);

  const handleSubmitLaporan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uraian.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Simpan ke LocalStorage
      const localRes = localStorageManager.savePengaduan({
        isAnonim,
        namaPelapor: isAnonim ? 'Anonim' : namaPelapor,
        kontakPelapor,
        kategori,
        wilayah,
        uraian,
      });

      // 2. Background sync
      try {
        await submitPengaduanAction({
          isAnonim,
          namaPelapor: isAnonim ? 'Anonim' : namaPelapor,
          kontakPelapor,
          kategori,
          wilayah,
          uraian,
        });
      } catch {
        // LocalStorage is already saved
      }

      setSubmittedTicket(localRes.ticketNumber);
      fetchForum();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketQuery.trim()) return;

    setIsTracking(true);
    setTrackingError(null);
    setTrackingResult(null);

    try {
      // 1. Cari di LocalStorage
      const localMatch = localStorageManager.findPengaduanByTicket(ticketQuery);
      if (localMatch) {
        setTrackingResult(localMatch);
        setIsTracking(false);
        return;
      }

      // Fallback
      const res = await trackPengaduanByTicket(ticketQuery);
      if (res.found) {
        setTrackingResult(res.aduan);
      } else {
        setTrackingError(res.message || 'Nomor tiket tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setTrackingError('Terjadi kesalahan saat melacak tiket.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
          <MessageSquareWarning className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Kanal Pengaduan & Forum Whistleblowing Publik
          </h1>
          <p className="text-xs text-slate-500">
            Laporkan dugaan penyimpangan bantuan sosial secara anonim dan pantau keterbukaan tindak lanjut pengawas
          </p>
        </div>
      </div>

      {/* 3 Tab Switcher */}
      <div className="flex border-b border-slate-200 text-xs sm:text-sm font-medium overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('forum')}
          className={`py-2.5 px-4 border-b-2 font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'forum'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Forum Pengaduan Publik ({forumReports.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lapor')}
          className={`py-2.5 px-4 border-b-2 font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lapor'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lacak')}
          className={`py-2.5 px-4 border-b-2 font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'lacak'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Lacak Tiket Saya</span>
        </button>
      </div>

      {/* Tab 1: Forum Pengaduan Publik */}
      {activeTab === 'forum' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Keterbukaan Publik:</strong> Daftar di bawah merupakan pengaduan warga yang telah
              diverifikasi dan ditindaklanjuti oleh Tim Pengawas Bansos Kecamatan Sukamaju. Identitas pelapor
              disamarkan untuk perlindungan privasi.
            </p>
          </div>

          <div className="space-y-4">
            {forumReports.map((report, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3 hover:border-amber-200 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {report.ticketNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{report.kategori}</span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                      report.status.includes('Selesai')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {report.status}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-2">
                    <span>Pelapor: {report.namaPelapor}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {report.wilayah}
                    </span>
                    <span>•</span>
                    <span>{report.tanggal}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{report.uraian}"
                  </p>
                </div>

                {report.tanggapanPetugas && (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Tanggapan Tim Pengawas Kecamatan:</span>
                    </div>
                    <p className="text-emerald-800 leading-relaxed text-[11px]">
                      {report.tanggapanPetugas}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Buat Laporan Baru */}
      {activeTab === 'lapor' &&
        (submittedTicket ? (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Laporan Pengaduan Berhasil Dikirim</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Laporan Anda telah diteruskan ke Tim Pengawas Bansos Kecamatan untuk dilakukan penelaahan.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
              <span className="text-xs text-slate-500 block mb-1">Nomor Tiket Pengaduan:</span>
              <span className="text-lg font-mono font-bold text-amber-700">{submittedTicket}</span>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  setUraian('');
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg"
              >
                Buat Laporan Lain
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('forum')}
                className="px-4 py-2 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
              >
                Lihat Forum Publik
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitLaporan} className="space-y-5 animate-fadeIn">
            {/* Whistleblower Protection Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Perlindungan Kerahasiaan Pelapor:</strong> Anda dapat memilih opsi pelaporan
                secara <strong>Anonim</strong>. Identitas pelapor dienkripsi dan tidak akan pernah
                diberitahukan kepada pihak yang dilaporkan.
              </p>
            </div>

            {/* Anonim Toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <EyeOff className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Kirim Sebagai Anonim</span>
                  <span className="text-[11px] text-slate-500">
                    Sembunyikan nama dan kontak Anda dari catatan publik
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isAnonim}
                onChange={(e) => setIsAnonim(e.target.checked)}
                className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {!isAnonim && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pelapor
                  </label>
                  <input
                    type="text"
                    value={namaPelapor}
                    onChange={(e) => setNamaPelapor(e.target.value)}
                    placeholder="Nama lengkap..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Kontak (Opsional)
                  </label>
                  <input
                    type="text"
                    value={kontakPelapor}
                    onChange={(e) => setKontakPelapor(e.target.value)}
                    placeholder="08123456789..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Dugaan Pelanggaran
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
                >
                  <option value="Pungli / Pemotongan Dana Bansos">
                    Pungli / Pemotongan Dana Bantuan (Tidak Utuh)
                  </option>
                  <option value="Penerima Fiktif / Salah Sasaran">
                    Penerima Bansos Mampu / Salah Sasaran
                  </option>
                  <option value="Manipulasi Data Lapangan">
                    Manipulasi Data / Kondisi Rumah oleh Oknum
                  </option>
                  <option value="Diskriminasi & Intimidasi">
                    Diskriminasi / Petugas Tidak Netral
                  </option>
                  <option value="Lainnya">Pelanggaran Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi Kejadian (Kelurahan / RW)
                </label>
                <select
                  value={wilayah}
                  onChange={(e) => setWilayah(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white"
                >
                  <option value="Kelurahan Mekarjaya">Kelurahan Mekarjaya</option>
                  <option value="Kelurahan Sariwangi">Kelurahan Sariwangi</option>
                  <option value="Kelurahan Cibaduyut Asri">Kelurahan Cibaduyut Asri</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Uraian Lengkap Kejadian / Dugaan Penyimpangan
              </label>
              <textarea
                rows={4}
                value={uraian}
                onChange={(e) => setUraian(e.target.value)}
                placeholder="Jelaskan secara rinci siapa pihak yang dilaporkan, kapan kejadian terjadi, dan apa bentuk penyimpangan yang ditemukan..."
                required
                className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unggah Bukti Foto / Dokumen / Tangkapan Layar (Opsional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-slate-400 transition cursor-pointer bg-slate-50">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-600 block">
                  Klik untuk memilih file bukti (Foto/PDF/Screenshot)
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !uraian.trim()}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Pengaduan</span>
                </>
              )}
            </button>
          </form>
        ))}

      {/* Tab 3: Lacak Status Pengaduan */}
      {activeTab === 'lacak' && (
        <div className="space-y-5 animate-fadeIn">
          <form onSubmit={handleTrackTicket} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Masukkan Nomor Tiket Pengaduan (Contoh: ADU-202609-0012)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ticketQuery}
                onChange={(e) => setTicketQuery(e.target.value)}
                placeholder="ADU-YYYYMM-XXXX..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono uppercase text-slate-800"
              />
              <button
                type="submit"
                disabled={isTracking || !ticketQuery.trim()}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                {isTracking ? 'Mencari...' : <><Search className="w-4 h-4" /><span>Lacak</span></>}
              </button>
            </div>
          </form>

          {/* Demo Ticket Quick Fill */}
          <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 flex items-center justify-between">
            <span>Contoh tiket demo aktif:</span>
            <button
              type="button"
              onClick={() => setTicketQuery('ADU-202609-0012')}
              className="font-mono font-bold text-amber-700 underline"
            >
              ADU-202609-0012
            </button>
          </div>

          {trackingError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {trackingResult && (
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {trackingResult.ticketNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{trackingResult.kategori}</h3>
                  <span className="text-[11px] text-slate-500">
                    Lokasi: {trackingResult.wilayah} • Tanggal: {trackingResult.tanggal}
                  </span>
                </div>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {trackingResult.status}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-1">Uraian Laporan:</span>
                <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  {trackingResult.uraian}
                </p>
              </div>

              {trackingResult.tanggapanPetugas && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tindak Lanjut Tim Pengawas Kecamatan:</span>
                  </span>
                  <p className="text-emerald-800 leading-relaxed">
                    {trackingResult.tanggapanPetugas}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
