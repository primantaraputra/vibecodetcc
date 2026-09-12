'use client';

import React from 'react';
import { History, CheckCircle2, DollarSign, Calendar, Landmark } from 'lucide-react';

export interface RiwayatPencairan {
  id: string;
  program: string;
  periode: string;
  nominal: number;
  statusPencairan: string;
  tanggalCair: string;
  penyalur: string;
}

const DEFAULT_RIWAYAT: RiwayatPencairan[] = [
  {
    id: 'cair-1',
    program: 'Bantuan Pangan Non Tunai (BPNT)',
    periode: 'Triwulan II 2026 (April - Juni)',
    nominal: 600000,
    statusPencairan: 'Tersalurkan',
    tanggalCair: '15 Juni 2026',
    penyalur: 'e-Warong Mekarjaya / Bank BRI',
  },
  {
    id: 'cair-2',
    program: 'BLT Mitigasi Risiko Pangan',
    periode: 'Tahap 1 2025',
    nominal: 400000,
    statusPencairan: 'Tersalurkan',
    tanggalCair: '10 Desember 2025',
    penyalur: 'PT Pos Indonesia Cabang Sukamaju',
  },
  {
    id: 'cair-3',
    program: 'Program Keluarga Harapan (PKH) Pendidikan',
    periode: 'Triwulan IV 2024',
    nominal: 750000,
    statusPencairan: 'Tersalurkan',
    tanggalCair: '20 November 2024',
    penyalur: 'Bank Mandiri KCP Sukamaju',
  },
];

export function RiwayatBansosMasaLaluCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-teal-600" />
          <span>Riwayat Bantuan yang Pernah Diterima (Arsip)</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          Total 3 Kali Penyaluran
        </span>
      </div>

      <div className="space-y-3">
        {DEFAULT_RIWAYAT.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{item.program}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> {item.statusPencairan}
                </span>
              </div>
              <div className="text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Periode: {item.periode}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-slate-400" />
                  <span>{item.penyalur}</span>
                </span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 flex sm:flex-col justify-between items-baseline sm:items-end">
              <div className="text-[10px] text-slate-400 font-mono">Nominal Diterima</div>
              <div className="text-emerald-700 font-bold font-mono text-sm">
                Rp {item.nominal.toLocaleString('id-ID')}
              </div>
              <div className="text-[10px] text-slate-400">Tgl Cair: {item.tanggalCair}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
