'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickRoleItem {
  label: string;
  email: string;
  password: string;
  badge: string;
}

const QUICK_ROLES: QuickRoleItem[] = [
  {
    label: 'Super Admin',
    email: 'admin@bansos.gov',
    password: 'Password123!',
    badge: '👑 Admin Utama',
  },
  {
    label: 'Petugas Kecamatan',
    email: 'kecamatan@bansos.gov',
    password: 'Password123!',
    badge: '🏢 Kecamatan',
  },
  {
    label: 'Petugas Kelurahan',
    email: 'kelurahan@bansos.gov',
    password: 'Password123!',
    badge: '🏛️ Kelurahan',
  },
  {
    label: 'Petugas RW 01',
    email: 'rw01@bansos.gov',
    password: 'Password123!',
    badge: '🏘️ Rukun Warga',
  },
  {
    label: 'Petugas RT 01',
    email: 'rt01@bansos.gov',
    password: 'Password123!',
    badge: '📋 Rukun Tetangga',
  },
  {
    label: 'Warga (Budi Santoso)',
    email: 'budi.santoso@warga.id',
    password: 'Password123!',
    badge: '👤 Warga Terverifikasi',
  },
];

interface QuickLoginRolePickerProps {
  onSelectRole: (email: string, pass: string) => void;
  disabled?: boolean;
  loadingEmail?: string | null;
}

export function QuickLoginRolePicker({
  onSelectRole,
  disabled = false,
  loadingEmail = null,
}: QuickLoginRolePickerProps) {
  return (
    <div className="pt-2 pb-1 space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-800 tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>1-KLIK MASUK CEPAT (UJI COBA DEMO)</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {QUICK_ROLES.map((role) => {
          const isThisLoading = loadingEmail === role.email;
          return (
            <button
              key={role.email}
              type="button"
              disabled={disabled}
              onClick={() => onSelectRole(role.email, role.password)}
              className={`p-2 rounded-xl border text-left transition flex items-center justify-between gap-1.5 cursor-pointer ${
                isThisLoading
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-400 scale-[0.98]'
                  : 'bg-white/80 hover:bg-emerald-50 border-emerald-100/90 text-slate-700 hover:text-emerald-900 shadow-2xs hover:border-emerald-300'
              } disabled:opacity-50`}
            >
              <div className="truncate">
                <span className="font-bold text-[11px] block text-emerald-950 truncate">
                  {role.badge}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {role.label}
                </span>
              </div>
              {isThisLoading && (
                <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
