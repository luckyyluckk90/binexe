import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && anonKey)

export const siteUrl =
  import.meta.env.VITE_SITE_URL?.trim() ||
  (typeof window !== 'undefined' ? window.location.origin : '')

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Admin generate_link (Resend) returns implicit #access_token redirects,
        // not PKCE ?code= exchanges.
        flowType: 'implicit',
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

export function isEmailConfirmed(user: {
  email_confirmed_at?: string | null
  confirmed_at?: string | null
  user_metadata?: { email_verified?: boolean } | null
} | null) {
  if (!user) return false
  // Prefer the explicit auth confirmation timestamp only.
  return Boolean(user.email_confirmed_at)
}

/** Parse auth redirect errors from hash or query string. */
export function readAuthRedirectError(href = window.location.href): string | null {
  try {
    const url = new URL(href)
    const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
    const query = url.searchParams
    const description =
      hash.get('error_description') ||
      query.get('error_description') ||
      hash.get('error') ||
      query.get('error')
    return description ? description.replace(/\+/g, ' ') : null
  } catch {
    return null
  }
}

/** Recover an implicit-flow session from the URL hash if present. */
export async function recoverSessionFromUrl() {
  if (!supabase || typeof window === 'undefined') {
    return { session: null, error: null as Error | null }
  }

  const redirectError = readAuthRedirectError()
  if (redirectError) {
    return { session: null, error: new Error(redirectError) }
  }

  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const accessToken = hash.get('access_token')
  const refreshToken = hash.get('refresh_token')

  if (accessToken && refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (error) return { session: null, error }
    // Clear tokens from the address bar after a successful recovery.
    window.history.replaceState({}, document.title, window.location.pathname)
    return { session: data.session, error: null }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) return { session: null, error }
  return { session: data.session, error: null }
}
