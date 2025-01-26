import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from "@/types/supabase"

export const createClient = createClientComponentClient

// If you need to pass config:
// export const createClient = () => createClientComponentClient({
//   supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
//   supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
// })

