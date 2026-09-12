import Link from 'next/link';
import { User, FileText, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { maskNIK } from '@/lib/utils';

interface WargaProfileHeaderProps {
  profile: UserProfile;
}

export function WargaProfileHeader({ profile }: WargaProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900">{profile.nama_lengkap}</h1>
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
          <span className="font-medium text-slate-800 truncate block">{profile.email}</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <span className="text-slate-400 block text-[11px]">Nomor Kontak</span>
          <span className="font-medium text-slate-800">
            {profile.nomor_telepon || '0812-3456-7890'}
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
          <span className="text-slate-400 block text-[11px]">Status Kependudukan</span>
          <span className="font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aktif di DTKS Daerah
          </span>
        </div>
      </div>
    </div>
  );
}
