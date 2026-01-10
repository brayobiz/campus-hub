import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log('📡 [supabaseClient] Checking Supabase credentials...');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Found' : '✗ Missing');

// Export a permissive `supabase` that is either the real client or a safe stub to appease TypeScript
export const supabase: any = (() => {
  if (supabaseUrl && supabaseAnonKey) {
    console.log('📡 [supabaseClient] Creating Supabase client...');
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ [supabaseClient] Supabase client created successfully');
    return client;
  }

  console.error('❌ [supabaseClient] Supabase credentials not found. App will not work properly. Using stubbed client for development.');

  // Minimal stubbed client for local dev/build to avoid runtime crashes and satisfy the type checker
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: (...args: unknown[]) => void) => {
        setTimeout(() => callback('INITIAL_SESSION', null), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: new Error('Supabase not configured') }),
      refreshSession: async () => ({ data: null, error: null }),
    },
    from: () => ({ select: async () => ({ data: null, error: null }), insert: async () => ({ data: null, error: null }), update: async () => ({ data: null, error: null }) }),
    channel: () => ({ on: () => ({ subscribe: () => {} }), subscribe: () => ({}) }),
    storage: { from: () => ({ upload: async () => ({ error: new Error('Supabase not configured') }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
    removeChannel: () => {},
  };
})();