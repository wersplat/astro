import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

function getEnv(name: string): string {
  const value = process.env[name] ||
    // Fallback to Vite-style names if user keeps same envs
    process.env[name.replace('NEXT_PUBLIC_', 'PUBLIC_')] ||
    // Astro uses PUBLIC_ prefix for client-side env vars
    import.meta.env[name.replace('NEXT_PUBLIC_', 'PUBLIC_')] ||
    '';

  return value;
}

function createMockSupabaseClient() {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
          limit: () => ({ data: [], error: null }),
          order: () => ({ data: [], error: null }),
          maybeSingle: () => ({ data: null, error: null }),
        }),
        limit: () => ({ data: [], error: null }),
        order: () => ({ data: [], error: null }),
        or: () => ({ data: [], error: null }),
        range: () => ({ data: [], error: null }),
        ilike: () => ({ data: [], error: null }),
        in: () => ({ data: [], error: null }),
        gte: () => ({ data: [], error: null }),
        lte: () => ({ data: [], error: null }),
        is: () => ({ data: [], error: null }),
        not: () => ({ data: [], error: null }),
      }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      signIn: () => ({ data: null, error: null }),
      signOut: () => ({ error: null }),
    },
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: null }),
        download: () => ({ data: null, error: null }),
      }),
    },
  } as any;
}

export function createClientBrowser() {
  const url = getEnv('PUBLIC_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = getEnv('PUBLIC_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (!url || !anon || url.includes('placeholder') || anon.includes('placeholder')) {
    // Return a mock client for development
    console.warn('Supabase not configured - using mock client for development');
    return createMockSupabaseClient();
  }
  
  return createBrowserClient<Database>(url, anon);
}

export function createClientServer(cookieStore: any) {
  const url = getEnv('PUBLIC_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anon = getEnv('PUBLIC_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (!url || !anon || url.includes('placeholder') || anon.includes('placeholder')) {
    // Return a mock client for development
    console.warn('Supabase not configured - using mock client for development');
    return createMockSupabaseClient();
  }
  
  return createServerClient<Database>(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set(name, value, options);
        } catch (_) {
          // ignore in edge runtime
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        } catch (_) {
          // ignore
        }
      }
    }
  });
}
