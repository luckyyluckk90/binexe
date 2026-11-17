import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useAuth } from '../auth/AuthContext'

export function Login() {
  const { configured, confirmed, loading, signIn, resendConfirmation, user } =
    useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  if (!loading && confirmed && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError('Enter your email first, then resend confirmation.')
      return
    }
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await resendConfirmation(email.trim())
      setInfo('Confirmation email sent. Confirm your address, then sign in.')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not resend confirmation.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Log in"
        lead="Sign in with your confirmed email address. Unverified accounts cannot access Binexe."
      />

      <section className="section section--paper">
        <div className="wrap auth-shell">
          {!configured ? (
            <p className="lede">
              Authentication is not connected yet. Add Supabase keys to enable
              login.
            </p>
          ) : (
            <form className="contact-form auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error ? (
                <p className="form-note" role="alert" style={{ color: '#8b1e1e' }}>
                  {error}
                </p>
              ) : null}
              {info ? <p className="form-note">{info}</p> : null}
              <div className="cta-row">
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Signing in…' : 'Log in'}
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  disabled={submitting}
                  onClick={handleResend}
                >
                  Resend confirmation
                </button>
              </div>
              <p className="form-note">
                No account yet? <Link to="/signup">Sign up</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
