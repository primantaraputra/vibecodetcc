import { LucideIcon } from 'lucide-react';

interface AuthCardHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconBgClass?: string;
}

export function AuthCardHeader({
  icon: Icon,
  title,
  subtitle,
  iconBgClass = 'bg-brand-600',
}: AuthCardHeaderProps) {
  return (
    <div className="flex flex-col items-center mb-6 text-center">
      <div
        className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center text-white mb-3 shadow-sm`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}
