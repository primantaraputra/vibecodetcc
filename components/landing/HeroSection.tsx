import { CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  children?: React.ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-b from-brand-50/70 via-white to-slate-50 py-12 sm:py-20 px-4 border-b border-slate-100">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 text-brand-800 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-brand-600" />
          <span>Transparansi Penyaluran Bansos Berbasis Data & AI Explainability</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Sistem Cek Kelayakan & Pendataan Terpadu Bansos Kecamatan
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Mewujudkan transparansi status bantuan sosial, pendataan akurat oleh RT/RW/Kelurahan,
          verifikasi geolokasi lapangan, dan saluran sanggahan yang adil bagi masyarakat.
        </p>

        {children}
      </div>
    </section>
  );
}
