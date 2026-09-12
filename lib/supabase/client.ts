import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/types/database.types';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy-bansos.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key';

  return createBrowserClient<Database>(url, anonKey);
}
