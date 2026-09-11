'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser } from '@/lib/actions/auth';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { isPetugas } from '@/lib/auth/roles';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorageManager.init();
  }, []);

  const handleLoginSubmit = async (emailToUse: string, passwordToUse: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Coba Server Action
      const result = await loginUser(emailToUse, passwordToUse);

      if (result.success) {
        router.push(result.redirectUrl || '/dashboard');
        router.refresh();
        return;
      }

      // 2. Cek apakah user ada di LocalStorage (akun yang baru didaftarkan)
      const localUser = localStorageManager.authenticateUser(emailToUse);
      if (localUser) {
        document.cookie = `demo_session=${encodeURIComponent(
          JSON.stringify(localUser)
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        const redirectUrl = isPetugas(localUser.role) ? '/dashboard' : '/profil';
        router.push(redirectUrl);
        router.refresh();
        return;
      }

      setErrorMsg(result.message || 'Login gagal. Periksa kembali email dan password.');
      setLoading(false);
    } catch {
      // Cek fallback LocalStorage
      const localUser = localStorageManager.authenticateUser(emailToUse);
      if (localUser) {
        document.cookie = `demo_session=${encodeURIComponent(
          JSON.stringify(localUser)
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

        const redirectUrl = isPetugas(localUser.role) ? '/dashboard' : '/profil';
        router.push(redirectUrl);
        router.refresh();
        return;
      }

      setErrorMsg('Terjadi kesalahan saat memproses login.');
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLoginSubmit(email, password);
  };

  const handleQuickLogin = async (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    await handleLoginSubmit(quickEmail, quickPass);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white mb-3 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Masuk Akun</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sistem Informasi Bansos & Pendataan Kecamatan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Email Petugas / Warga
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@bansos.gov atau email@warga.id"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition disabled:opacity-50 text-sm"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Memproses Masuk...' : 'Masuk ke Sistem'}
          </button>
        </form>

        {/* Quick Testing Role Picker (1-Click Login) */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click Quick Login Testing</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@bansos.gov', 'Password123!')}
              className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('kecamatan@bansos.gov', 'Password123!')}
              className="px-2.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              🏢 Petugas Kecamatan
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('kelurahan@bansos.gov', 'Password123!')}
              className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              🏛️ Petugas Kelurahan
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('rw01@bansos.gov', 'Password123!')}
              className="px-2.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              🏘️ Petugas RW 01
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('rt01@bansos.gov', 'Password123!')}
              className="px-2.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              📋 Petugas RT 01
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('budi.santoso@warga.id', 'Password123!')}
              className="px-2.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg font-medium text-left truncate transition disabled:opacity-50"
            >
              👤 Warga (Budi)
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
          <p>
            Belum memiliki akun warga?{' '}
            <Link href="/register" className="text-brand-600 font-semibold hover:underline">
              Daftar Akun Masyarakat
            </Link>
          </p>
          <p>
            <Link href="/" className="text-slate-500 hover:text-slate-800">
              ← Kembali ke Beranda Publik
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
