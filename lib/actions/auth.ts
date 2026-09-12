'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { UserProfile } from '@/lib/types';
import { isPetugas } from '@/lib/auth/roles';
import { DEMO_USERS } from '@/lib/auth/demo-users';

export interface LoginResult {
  success: boolean;
  message?: string;
  redirectUrl?: string;
  user?: UserProfile;
}

/**
 * Server Action: Login Handler (Mendukung Supabase Auth & Instant Demo Mode)
 */
export async function loginUser(emailInput: string, passwordInput: string): Promise<LoginResult> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput;
  const cookieStore = cookies();

  // 1. Jika URL Supabase nyata terkonfigurasi, coba Supabase Auth
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userProfile = (profile as unknown as UserProfile) || {
          id: data.user.id,
          nama_lengkap: data.user.user_metadata?.nama_lengkap || email,
          email: data.user.email || email,
          role: data.user.user_metadata?.role || 'masyarakat',
          is_active: true,
        };

        const redirectUrl = isPetugas(userProfile.role) ? '/dashboard' : '/status-bansos';
        return { success: true, redirectUrl, user: userProfile };
      }
    } catch {
      // Fallback ke demo mode jika Supabase connection gagal
    }
  }

  // 2. Demo Testing Mode (Seamless out-of-the-box experience)
  const matchedUser = DEMO_USERS[email];

  if (matchedUser) {
    // Simpan session demo ke secure HTTP cookie
    cookieStore.set('demo_session', JSON.stringify(matchedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    const redirectUrl = isPetugas(matchedUser.role) ? '/dashboard' : '/status-bansos';
    return {
      success: true,
      redirectUrl,
      user: matchedUser,
    };
  }

  // Jika email tidak ada di daftar demo
  return {
    success: false,
    message: 'Email atau password salah. Silakan klik tombol Quick-Fill untuk memilih akun testing.',
  };
}

/**
 * Server Action: Logout Handler
 */
export async function logoutUser() {
  const cookieStore = cookies();

  // Hapus demo cookie
  cookieStore.delete('demo_session');

  // Hapus Supabase session hanya jika Supabase nyata aktif terkonfigurasi
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    } catch {
      // Ignore error
    }
  }

  redirect('/login');
}
