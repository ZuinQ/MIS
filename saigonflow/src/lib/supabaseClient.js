import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy123.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

if (supabaseUrl === 'https://dummy123.supabase.co') {
  console.warn('Supabase credentials missing. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
