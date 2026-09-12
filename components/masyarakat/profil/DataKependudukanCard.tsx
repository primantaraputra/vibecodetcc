'use client';

import React from 'react';
import { Home, Users, Briefcase, DollarSign, Zap, FileBadge2 } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { maskNIK } from '@/lib/utils';

interface DataKependudukanCardProps {
  profile: UserProfile;
}

export function DataKependudukanCard({ profile }: DataKependudukanCardProps) {
  const fields = [
    {
      icon: FileBadge2,
      label: 'Nomor Kartu Keluarga (KK)',
      value: '3273010101850000',
    },
    {
      icon: Home,
      label: 'Alamat Domisili KTP',
      value: 'Jl. Sukamaju No. 12, RT 01 / RW 01',
    },
    {
      icon: Briefcase,
      label: 'Pekerjaan Kepala Keluarga',
      value: 'Buruh Bangunan Harian Lepas',
    },
    {
      icon: DollarSign,
      label: 'Rata-rata Penghasilan Bulanan',
      value: 'Rp 750.000 / bulan',
    },
    {
      icon: Users,
      label: 'Jumlah Tanggungan Keluarga',
      value: '4 Jiwa (Istri + 2 Anak Sekolah)',
    },
    {
      icon: Zap,
      label: 'Daya Listrik & Sanitasi',
      value: '450 VA Bersubsidi • Jamban Bersama',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileBadge2 className="w-4 h-4 text-teal-600" />
          <span>Data Kependudukan & Sosial Ekonomi Terdaftar</span>
        </h2>
        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Sinkron Disdukcapil & DTKS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {fields.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                <span>{f.label}</span>
              </div>
              <div className="font-semibold text-slate-800 text-xs">{f.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
