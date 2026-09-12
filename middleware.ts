import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isPetugas } from '@/lib/auth/roles';
import { UserRole } from '@/lib/types';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');
  const isPetugasRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/survei') ||
    path.startsWith('/approval') ||
    path.startsWith('/analitik') ||
    path.startsWith('/audit-log');
  const isMasyarakatRoute =
    path.startsWith('/profil') ||
    path.startsWith('/sanggahan') ||
    path.startsWith('/beranda');

  // Khusus saat logout, hapus cookie dan jangan redirect kembali ke dashboard/beranda
  if (isAuthRoute && request.nextUrl.searchParams.get('logout') === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('demo_session');
    response.cookies.set('demo_session', '', { path: '/', maxAge: 0 });
    return response;
  }

  // 1. Cek Demo Session Cookie
  const demoCookie = request.cookies.get('demo_session')?.value;
  if (demoCookie && demoCookie.trim() !== '') {
    try {
      let rawCookie = demoCookie;
      try {
        rawCookie = decodeURIComponent(demoCookie);
      } catch {}
      const demoProfile = JSON.parse(rawCookie) as { role?: UserRole };
      const role = demoProfile?.role;

      if (isAuthRoute || path === '/') {
        if (isPetugas(role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/beranda', request.url));
        }
      }

      if (isPetugasRoute && !isPetugas(role)) {
        return NextResponse.redirect(new URL('/beranda', request.url));
      }

      return NextResponse.next();
    } catch {
      // Continue to Supabase check
    }
  }

  // 2. Supabase Auth Check
  let response = NextResponse.next();
  let user = null;
  let supabase = null;

  try {
    const sessionRes = await updateSession(request);
    response = sessionRes.response;
    user = sessionRes.user;
    supabase = sessionRes.supabase;
  } catch {
    // If Supabase is unreachable and no demo cookie exists
    if (isPetugasRoute || isMasyarakatRoute) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    if (path === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  // If user is not authenticated and trying to access protected routes
  if (!user && (isPetugasRoute || isMasyarakatRoute)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated via Supabase, check role
  if (user && supabase && (isPetugasRoute || isMasyarakatRoute || isAuthRoute || path === '/')) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = (profile as { role?: UserRole } | null)?.role;

      if (isAuthRoute || path === '/') {
        if (isPetugas(role)) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } else {
          return NextResponse.redirect(new URL('/beranda', request.url));
        }
      }

      if (isPetugasRoute && !isPetugas(role)) {
        return NextResponse.redirect(new URL('/beranda', request.url));
      }
    } catch {
      // Continue
    }
  }

  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public static assets (svg, png, jpg, css, js, fonts)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2|ttf|eot|ico)$).*)',
  ],
};
