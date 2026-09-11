'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { localStorageManager } from '@/lib/storage/localStorageManager';
import { UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (nik.length !== 16) {
      setErrorMsg('NIK harus berjumlah tepat 16 digit (gunakan NIK dummy/sintetis).');
      setLoading(false);
      return;
    }

    try {
      // 1. Simpan Akun ke LocalStorage
      const newUser = localStorageManager.registerUser({
        nama_lengkap: namaLengkap,
        nik,
        email,
        telepon,
        password,
        role: 'masyarakat',
      });

      // 2. Set demo session cookie agar middleware mengizinkan akses ke /profil
      document.cookie = `demo_session=${encodeURIComponent(
        JSON.stringify(newUser)
      )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      // 3. Coba kirim ke Supabase jika terhubung (opsional)
      try {
        const supabase = createClient();
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nama_lengkap: namaLengkap,
              nik,
              role: 'masyarakat',
            },
          },
        });
      } catch {
        // Fallback LocalStorage sudah aktif
      }

      setSuccessMsg('Pendaftaran akun berhasil disimpan di LocalStorage! Mengalihkan ke dashboard warga...');
      setTimeout(() => {
        router.push('/profil');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-civic-600 flex items-center justify-center text-white mb-3 shadow-sm">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daftar Akun Warga</h1>
          <p className="text-sm text-slate-500 mt-1">
            Untuk transparansi cek status bansos & sanggahan mandiri
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-emerald-700 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="nama">
              Nama Lengkap (Sesuai KTP Dummy)
            </label>
            <input
              id="nama"
              type="text"
              required
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="nik">
              NIK (16 Digit Sintetis/Dummy)
            </label>
            <input
              id="nik"
              type="text"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
              placeholder="327301xxxxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warga@email.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="telepon">
              Nomor WhatsApp / HP (Opsional)
            </label>
            <input
              id="telepon"
              type="tel"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-civic-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-civic-600 hover:bg-civic-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition disabled:opacity-50 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
          <p>
            Sudah memiliki akun?{' '}
            <Link href="/login" className="text-civic-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
