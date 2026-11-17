import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null

export type EnquiryPayload = {
  full_name: string
  email: string
  interest: string
  message: string
  source?: string
  user_agent?: string
}

export async function submitEnquiry(payload: EnquiryPayload) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const { error } = await supabase.from('enquiries').insert({
    full_name: payload.full_name,
    email: payload.email,
    interest: payload.interest,
    message: payload.message,
    source: payload.source ?? 'binexe.com',
    user_agent: payload.user_agent ?? navigator.userAgent,
  })

  if (error) {
    throw error
  }
}
