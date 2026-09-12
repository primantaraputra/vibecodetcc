/**
 * Helper untuk mengecek apakah Supabase terkonfigurasi dengan kredensial nyata
 * atau masih menggunakan dummy fallback URL.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) return false;
  if (
    url.includes('dummy-bansos.supabase.co') ||
    url.includes('dummy') ||
    url.includes('example') ||
    url.trim() === ''
  ) {
    return false;
  }

  if (
    anonKey.includes('dummy-anon-key') ||
    anonKey.includes('dummy') ||
    anonKey.includes('example') ||
    anonKey.trim() === ''
  ) {
    return false;
  }

  return true;
}
