import Link from 'next/link';
import { Search, Map, Calculator, MessageSquareWarning } from 'lucide-react';

export function QuickActionGrid() {
  const actions = [
    {
      href: '/cek-status',
      title: 'Cek Status Bansos',
      description: 'Cek transparansi kelayakan dengan NIK atau No. KK',
      icon: Search,
      bgClass: 'bg-civic-50 text-civic-600',
    },
    {
      href: '/peta-transparansi',
      title: 'Peta Transparansi',
      description: 'Data sebaran anggaran agregat per kelurahan',
      icon: Map,
      bgClass: 'bg-emerald-50 text-emerald-600',
    },
    {
      href: '/simulasi',
      title: 'Simulasi Mandiri',
      description: 'Kuesioner edukatif estimasi desil kesejahteraan',
      icon: Calculator,
      bgClass: 'bg-brand-50 text-brand-600',
    },
    {
      href: '/pengaduan',
      title: 'Forum Pengaduan',
      description: 'Lapor bansos anonim & pantau tindak lanjut',
      icon: MessageSquareWarning,
      bgClass: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-4xl mx-auto">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.href}
            href={act.href}
            className="flex flex-col items-center p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-500 hover:shadow-md transition text-center group"
          >
            <div
              className={`w-12 h-12 rounded-xl ${act.bgClass} flex items-center justify-center mb-3 group-hover:scale-110 transition`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-slate-900 text-sm mb-1">{act.title}</h2>
            <p className="text-[11px] text-slate-500">{act.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
