// src/lib/supabase/client.ts
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-react';
import type { Database } from '@/types/supabase';

export const supabase = createBrowserSupabaseClient<Database>();