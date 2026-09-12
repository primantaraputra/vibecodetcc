'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  CreditCard,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { localStorageManager } from '@/lib/storage/localStorageManager';

export function RegisterForm() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setErrorMsg('Nomor Induk Kependudukan (NIK) harus berjumlah tepat 16 digit.');
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

      // 2. Set demo session cookie agar middleware mengizinkan akses ke /status-bansos
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

      setSuccessMsg(
        'Pendaftaran akun warga berhasil! Mengalihkan ke halaman status bansos...'
      );
      setTimeout(() => {
        router.push('/status-bansos');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan saat memproses pendaftaran akun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs shadow-xs animate-shake">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs shadow-xs">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3">
        {/* Nama Lengkap */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <User className="w-5 h-5" />
          </div>
          <input
            id="nama"
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Nama Lengkap Sesuai KTP"
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* NIK 16 Digit */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <input
              id="nik"
              type="text"
              required
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
              placeholder="NIK 16 Digit (KTP)"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Alamat Email Aktif"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Nomor Telepon / WhatsApp */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              <Phone className="w-5 h-5" />
            </div>
            <input
              id="telepon"
              type="tel"
              required
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              placeholder="Nomor Telepon / WhatsApp"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200/90 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition duration-200"
            />
          </div>

          {/* Kata Sandi */}
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
              placeholder="Buat Kata Sandi Baru"
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
        </div>

        {/* Tombol Daftar Utama (Nature Green Pill Button) */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#0f766e] via-[#15803d] to-[#166534] hover:opacity-95 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-3"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Mendaftarkan Akun...</span>
            </div>
          ) : (
            <span>Daftar Sekarang</span>
          )}
        </button>
      </form>

      {/* Footer Text Link: Sudah punya akun? Masuk sekarang */}
      <div className="pt-3 text-center text-xs text-slate-500">
        <span>Sudah memiliki akun warga? </span>
        <Link
          href="/login"
          className="font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline"
        >
          Masuk Sekarang
        </Link>
      </div>
    </div>
  );
}
