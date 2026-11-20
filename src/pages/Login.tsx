import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function requestPasswordReset(email: string) {
  const response = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean
    error?: string
    hint?: string
  }
  if (!response.ok || !data.ok) {
    const message = [data.error, data.hint].filter(Boolean).join(' ')
    throw new Error(message || 'Password reset email could not be sent.')
  }
}

async function resendConfirmationEmail(email: string) {
  const response = await fetch('/api/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean
    error?: string
    hint?: string
  }
  if (!response.ok || !data.ok) {
    const message = [data.error, data.hint].filter(Boolean).join(' ')
    throw new Error(message || 'Confirmation email could not be sent.')
  }
}

export function Login() {
  const { configured, confirmed, loading, signIn, user } = useAuth()
  const { notify } = useToast()
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
      notify('success', 'Giriş başarılı', 'Ana sayfaya yönlendiriliyorsunuz.')
      await wait(1600)
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Giriş başarısız.'
      setError(message)
      notify('error', 'Giriş başarısız', message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError('Önce e-posta adresinizi girin.')
      return
    }
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await resendConfirmationEmail(email.trim())
      setInfo('Doğrulama maili gönderildi. Onayladıktan sonra giriş yapın.')
      notify('info', 'Doğrulama maili gönderildi', 'Gelen kutunuzu kontrol edin.')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not resend confirmation.'
      setError(message)
      notify('error', 'Mail gönderilemedi', message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Şifre sıfırlamak için önce e-posta adresinizi girin.')
      return
    }
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await requestPasswordReset(email.trim())
      setInfo(
        'Şifre sıfırlama maili gönderildi. Gelen kutusu ve spam klasörünü kontrol edin.',
      )
      notify(
        'info',
        'Şifre sıfırlama maili gönderildi',
        'Maildeki linkle yeni şifre belirleyin.',
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password reset failed.'
      setError(message)
      notify('error', 'Mail gönderilemedi', message)
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
                <p className="form-note form-note--error" role="alert">
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
                  onClick={() => void handleForgotPassword()}
                >
                  Forgot password
                </button>
              </div>
              <div className="cta-row" style={{ marginTop: '0.5rem' }}>
                <button
                  className="btn btn--ghost"
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleResend()}
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
