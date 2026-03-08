import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for browser/CSR usage.
 * 
 * IMPORTANT: Add your Supabase credentials to .env.local:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * Copy from .env.example and fill in your values.
 * Get credentials from: https://supabase.com/dashboard
 * Project Settings → API
 */

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
