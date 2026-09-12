import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST(request: Request) {
  const cookieStore = cookies();

  // Explicitly wipe demo_session cookie
  cookieStore.delete('demo_session');
  cookieStore.set('demo_session', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  });

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);
    } catch {
      // Ignore
    }
  }

  const response = NextResponse.json({ success: true, message: 'Berhasil keluar' });
  response.cookies.delete('demo_session');
  response.cookies.set('demo_session', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}

export async function GET(request: Request) {
  await POST(request);
  const redirectUrl = new URL('/login?logout=true', request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete('demo_session');
  response.cookies.set('demo_session', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}
