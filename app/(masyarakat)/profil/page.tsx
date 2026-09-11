import { requireMasyarakatAuth } from '@/lib/auth/session';
import { maskNIK } from '@/lib/utils';
import { User, ShieldCheck, Clock, FileText, ArrowRight, Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Profil Warga | SI-BANSOS Kecamatan',
};

export default async function WargaProfilPage() {
  const profile = await requireMasyarakatAuth();

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shadow-sm">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{profile.nama_lengkap}</h1>
                <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                  Warga Terverifikasi
                </span>
              </div>
              <p className="text-xs font-mono text-slate-500">NIK: {maskNIK(profile.nik)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sanggahan"
              className="px-3.5 py-2 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ajukan Sanggahan</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <span className="text-slate-400 block text-[11px]">Email Terdaftar</span>
            <span className="font-medium text-slate-800">{profile.email}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <span className="text-slate-400 block text-[11px]">Nomor Kontak</span>
            <span className="font-medium text-slate-800">{profile.nomor_telepon || '0812-3456-7890'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <span className="text-slate-400 block text-[11px]">Status Kependudukan</span>
            <span className="font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Aktif di DTKS Daerah
            </span>
          </div>
        </div>
      </div>

      {/* Status Kelayakan & Desil */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Hasil Penilaian Kelayakan & Desil Personal</span>
          </h2>
          <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
            Desil 1 (Sangat Miskin)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
          <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Penjelasan Kecerdasan Buatan (AI Explainability):</span>
          </div>
          <p>
            Keluarga Anda tercatat pada Desil 1 berdasarkan hasil survei lapangan verifikasi RT: kondisi
            rumah lantai tanah, dinding bambu, daya listrik bersubsidi 450VA, dan 2 orang anak usia sekolah.
            Keluarga Anda berhak atas alokasi bansos PKH dan BPNT.
          </p>
        </div>

        {/* Active Application Stepper Link */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-900 block">Pengajuan Berjalan: Program Keluarga Harapan (PKH)</span>
            <span className="text-slate-500">Status saat ini: Diusulkan RT (Menunggu Verifikasi RW)</span>
          </div>
          <Link
            href="/cek-status"
            className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition text-center flex items-center justify-center gap-1"
          >
            <span>Lihat Timeline Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notifications Inbox */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Pemberitahuan Terkini</span>
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">
                Survei Lapangan Telah Selesai Dilakukan
              </span>
              <p className="text-slate-500 mt-0.5">
                Petugas RT 01 telah menyelesaikan input kuesioner kesejahteraan dan foto geolokasi rumah Anda.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">04 Sep 2026</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
            <div>
              <span className="font-semibold text-slate-800 block">
                Penyaluran BPNT Triwulan II Berhasil
              </span>
              <p className="text-slate-500 mt-0.5">
                Dana bantuan sembako telah disalurkan melalui rekening e-Warong terdaftar.
              </p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">15 Jun 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
