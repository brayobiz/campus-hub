import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log('📡 [supabaseClient] Checking Supabase credentials...');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Found' : '✗ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Found' : '✗ Missing');

// Gracefully handle missing credentials for development
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
    console.log('📡 [supabaseClient] Creating Supabase client...');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ [supabaseClient] Supabase client created successfully');
} else {
    console.error('❌ [supabaseClient] Supabase credentials not found. App will not work properly.');
    // Create a dummy client that won't crash the app
    supabase = {
        auth: { 
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: (callback: any) => {
                callback('INITIAL_SESSION', null);
                return { data: { subscription: { unsubscribe: () => {} } } };
            },
            signUp: async () => ({ error: new Error('Supabase not configured') }) as any,
        },
        from: () => ({ select: async () => ({ data: null, error: null }) }),
    };
}

export { supabase };