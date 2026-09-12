import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ActiveApplicationBannerProps {
  programName?: string;
  statusText?: string;
  timelineHref?: string;
}

export function ActiveApplicationBanner({
  programName = 'Program Keluarga Harapan (PKH)',
  statusText = 'Diusulkan RT (Menunggu Verifikasi RW)',
  timelineHref = '/cek-status',
}: ActiveApplicationBannerProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div>
        <span className="font-bold text-slate-900 block">Pengajuan Berjalan: {programName}</span>
        <span className="text-slate-500">Status saat ini: {statusText}</span>
      </div>
      <Link
        href={timelineHref}
        className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition text-center flex items-center justify-center gap-1 shadow-xs"
      >
        <span>Lihat Timeline Detail</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
