import { ShieldCheck, Sparkles } from 'lucide-react';

interface KelayakanDesilCardProps {
  desilLabel?: string;
  explanation?: string;
}

export function KelayakanDesilCard({
  desilLabel = 'Desil 1 (Sangat Miskin)',
  explanation = 'Keluarga Anda tercatat pada Desil 1 berdasarkan hasil survei lapangan verifikasi RT: kondisi rumah lantai tanah, dinding bambu, daya listrik bersubsidi 450VA, dan 2 orang anak usia sekolah. Keluarga Anda berhak atas alokasi bansos PKH dan BPNT.',
}: KelayakanDesilCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Hasil Penilaian Kelayakan & Desil Personal</span>
        </h2>
        <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
          {desilLabel}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Penjelasan Kecerdasan Buatan (AI Explainability):</span>
        </div>
        <p>{explanation}</p>
      </div>
    </div>
  );
}
