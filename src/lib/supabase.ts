import { createClient } from '@supabase/supabase-js'
import { type Database } from './database.types'

export type DbBranch = Database['public']['Tables']['branch']['Row']
export type DbEmployee = Database['public']['Tables']['employee']['Row']
export type DbGuardian = Database['public']['Tables']['guardian']['Row']
export type DbChild = Database['public']['Tables']['child']['Row']

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabasePublishableKey = import.meta.env
  .VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey
)
