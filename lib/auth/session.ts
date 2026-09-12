import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { UserProfile, UserSession } from '@/lib/types';

/**
 * Mengambil sesi dan data profil user yang sedang login dari server-side
 */
export async function getCurrentUserSession(): Promise<UserSession> {
  const cookieStore = cookies();

  // 1. Cek Demo Session Cookie terlebih dahulu (Testing & Offline Mode)
  const demoCookie = cookieStore.get('demo_session')?.value;
  if (demoCookie) {
    try {
      let rawCookie = demoCookie;
      try {
        rawCookie = decodeURIComponent(demoCookie);
      } catch {}
      const profile = JSON.parse(rawCookie) as UserProfile;
      if (profile && profile.id && profile.role) {
        return {
          user: {
            id: profile.id,
            email: profile.email || '',
          },
          profile,
          role: profile.role,
        };
      }
    } catch {
      // JSON parse error, continue to Supabase check
    }
  }

  // 2. Supabase Auth Session
  if (!isSupabaseConfigured()) {
    return {
      user: null,
      profile: null,
      role: 'anon',
    };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        user: null,
        profile: null,
        role: 'anon',
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        user: {
          id: user.id,
          email: user.email || '',
        },
        profile: null,
        role: 'anon',
      };
    }

    const userProfile = profile as unknown as UserProfile;

    return {
      user: {
        id: user.id,
        email: user.email || '',
      },
      profile: userProfile,
      role: userProfile.role,
    };
  } catch {
    return {
      user: null,
      profile: null,
      role: 'anon',
    };
  }
}

/**
 * Memastikan user terautentikasi dan memiliki role petugas
 */
export async function requirePetugasAuth(): Promise<UserProfile> {
  const session = await getCurrentUserSession();

  if (!session.profile || session.role === 'anon' || session.role === 'masyarakat') {
    throw new Error('Akses ditolak: Hanya petugas yang berwenang mengakses halaman ini.');
  }

  return session.profile;
}

/**
 * Memastikan user terautentikasi dan memiliki role masyarakat
 */
export async function requireMasyarakatAuth(): Promise<UserProfile> {
  const session = await getCurrentUserSession();

  if (!session.profile || session.role === 'anon') {
    throw new Error('Akses ditolak: Silakan login terlebih dahulu.');
  }

  return session.profile;
}
