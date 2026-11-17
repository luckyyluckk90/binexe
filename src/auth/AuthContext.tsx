import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  isEmailConfirmed,
  isSupabaseConfigured,
  siteUrl,
  supabase,
} from '../lib/supabase'

type AuthContextValue = {
  configured: boolean
  loading: boolean
  session: Session | null
  user: User | null
  confirmed: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<string>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resendConfirmation: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let mounted = true

    const client = supabase

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const next = data.session
      if (next && !isEmailConfirmed(next.user)) {
        void client.auth.signOut({ scope: 'local' })
        setSession(null)
      } else {
        setSession(next)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return
      const onCallback =
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/auth/callback')
      if (next && !isEmailConfirmed(next.user) && !onCallback) {
        // Keep unconfirmed signups logged out until /auth/callback verifies.
        void client.auth.signOut({ scope: 'local' })
        setSession(null)
        setLoading(false)
        return
      }
      setSession(next)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null
    const confirmed = isEmailConfirmed(user)

    return {
      configured: isSupabaseConfigured,
      loading,
      session,
      user,
      confirmed,
      async signUp(email, password, fullName) {
        if (!supabase) {
          throw new Error('Authentication is not configured yet.')
        }

        const redirectTo = `${siteUrl || window.location.origin}/auth/callback`
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
            data: { full_name: fullName },
          },
        })

        if (error) {
          const message = error.message.toLowerCase()
          if (message.includes('rate limit') || message.includes('after')) {
            throw new Error(
              'Email rate limit reached. Wait about a minute, check spam, then use Resend confirmation.',
            )
          }
          throw error
        }

        // Supabase may return a user with empty identities when the email
        // already exists — treat that as a failed / blocked signup.
        if (
          data.user &&
          Array.isArray(data.user.identities) &&
          data.user.identities.length === 0
        ) {
          throw new Error(
            'This email is already registered. Confirm your inbox or log in.',
          )
        }

        // Always clear any signup session so the UI stays on the confirmation
        // screen until the email is verified via /auth/callback.
        await supabase.auth.signOut({ scope: 'local' })
        setSession(null)

        if (!data.user) {
          throw new Error('Sign up failed. Please try again.')
        }

        return 'confirm-email'
      },
      async signIn(email, password) {
        if (!supabase) {
          throw new Error('Authentication is not configured yet.')
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          const message = error.message.toLowerCase()
          if (
            message.includes('email not confirmed') ||
            message.includes('not confirmed')
          ) {
            throw new Error(
              'Please confirm your email before signing in. Check your inbox for the verification link.',
            )
          }
          throw error
        }

        if (!isEmailConfirmed(data.user)) {
          await supabase.auth.signOut()
          throw new Error(
            'Please confirm your email before signing in. Check your inbox for the verification link.',
          )
        }
      },
      async signOut() {
        if (!supabase) return
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      },
      async resendConfirmation(email) {
        if (!supabase) {
          throw new Error('Authentication is not configured yet.')
        }
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${siteUrl || window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          const message = error.message.toLowerCase()
          if (message.includes('rate limit') || message.includes('after')) {
            throw new Error(
              'Email rate limit reached. Wait a minute, check spam, or use the on-page confirmation link.',
            )
          }
          throw error
        }
      },
    }
  }, [loading, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
