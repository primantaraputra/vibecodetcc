'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'header' | 'sidebar';
  className?: string;
}

export function LogoutButton({ variant = 'header', className = '' }: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 1. Hapus cookie di sisi klien
      document.cookie = 'demo_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax';

      // 2. Panggil API route logout di server dan tunggu hingga selesai
      await fetch('/api/auth/logout', { method: 'POST' });

      // 3. Arahkan ke halaman login dengan query logout=true
      window.location.href = '/login?logout=true';
    } catch {
      window.location.href = '/login?logout=true';
    }
  };

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      >
        {isLoggingOut ? (
          <>
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <span>Mengeluarkan Sesi...</span>
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Keluar Sesi</span>
          </>
        )}
      </button>
    );
  }

  // Header variant
  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded transition flex items-center gap-1.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      title="Keluar dari akun"
    >
      {isLoggingOut ? (
        <>
          <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <span className="text-[11px] font-medium">Keluar...</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">Keluar</span>
        </>
      )}
    </button>
  );
}
