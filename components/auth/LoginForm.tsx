'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { loginUser } from '@/lib/actions/auth';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { isPetugas } from '@/lib/auth/roles';
import { DEMO_USERS } from '@/lib/auth/demo-users';
import { QuickLoginRolePicker } from './QuickLoginRolePicker';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingRoleEmail, setLoadingRoleEmail] = useState<string | null>(null);
  const [showDemoRoles, setShowDemoRoles] = useState(true);

  useEffect(() => {
    localStorageManager.init();
  }, []);

  const handleLoginSubmit = async (emailToUse: string, passwordToUse: string) => {
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = emailToUse.trim().toLowerCase();

    // 1. Instant Demo Login Mode (<30ms instant response)
    const matchedDemo = DEMO_USERS[cleanEmail];
    if (matchedDemo) {
      document.cookie = `demo_session=${encodeURIComponent(
        JSON.stringify(matchedDemo)
      )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      // Call Server Action asynchronously to sync HTTP-only server cookie
      loginUser(cleanEmail, passwordToUse).catch(() => {});

      const redirectUrl = isPetugas(matchedDemo.role) ? '/dashboard' : '/beranda';
      window.location.href = redirectUrl;
      return;
    }

    // 2. Check LocalStorage registered accounts
    const localUser = localStorageManager.authenticateUser(cleanEmail);
    if (localUser) {
      document.cookie = `demo_session=${encodeURIComponent(
        JSON.stringify(localUser)
      )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      const redirectUrl = isPetugas(localUser.role) ? '/dashboard' : '/beranda';
      window.location.href = redirectUrl;
      return;
    }

    // 3. Fallback to Server Action
    try {
      const result = await loginUser(cleanEmail, passwordToUse);

      if (result.success) {
        if (result.user) {
          document.cookie = `demo_session=${encodeURIComponent(
            JSON.stringify(result.user)
          )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        }
        window.location.href = result.redirectUrl || '/dashboard';
        return;
      }

      setErrorMsg(result.message || 'Gagal masuk. Periksa kembali email dan kata sandi Anda.');
      setLoading(false);
      setLoadingRoleEmail(null);
    } catch {
      setErrorMsg('Terjadi kendala koneksi saat memproses proses masuk.');
      setLoading(false);
      setLoadingRoleEmail(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLoginSubmit(email, password);
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setLoadingRoleEmail(quickEmail);
    await handleLoginSubmit(quickEmail, quickPass);
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs shadow-xs animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-3.5">
        {/* Input Email / No. Kontak */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <input
            id="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email atau Nomor Telepon"
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
          />
        </div>

        {/* Input Kata Sandi */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <Lock className="w-5 h-5" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata Sandi"
            className="w-full pl-11 pr-11 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-600 transition"
            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Lupa Kata Sandi Link */}
        <div className="flex justify-end pt-0.5">
          <button
            type="button"
            onClick={() =>
              alert(
                'Lupa kata sandi? Silakan hubungi admin RT/RW setempat atau gunakan akun pengujian demo di bawah.'
              )
            }
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition hover:underline"
          >
            Lupa Kata Sandi?
          </button>
        </div>

        {/* Tombol Masuk Utama (Nature Green Pill Button) */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#0f766e] via-[#15803d] to-[#166534] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sedang Memproses...</span>
            </div>
          ) : (
            <span>Masuk</span>
          )}
        </button>
      </form>

      {/* 1-Click Role Testing Switcher Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowDemoRoles(!showDemoRoles)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-800 transition"
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Pilihan Akun Demo & Simulasi Peran Petugas / Warga</span>
          </div>
          {showDemoRoles ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDemoRoles && (
          <div className="pt-2">
            <QuickLoginRolePicker
              onSelectRole={handleQuickLogin}
              disabled={loading}
              loadingEmail={loadingRoleEmail}
            />
          </div>
        )}
      </div>

      {/* Footer Text Link: Belum punya akun? Daftar sekarang */}
      <div className="pt-3 text-center text-xs text-slate-500">
        <span>Belum memiliki akun warga? </span>
        <Link
          href="/register"
          className="font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}
