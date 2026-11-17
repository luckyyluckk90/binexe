import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

async function registerWithEmail(payload: {
  email: string
  password: string
  fullName: string
}) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = (await response.json().catch(() => ({}))) as {
    ok?: boolean
    error?: string
    hint?: string
  }
  if (!response.ok || !data.ok) {
    const message = [data.error, data.hint].filter(Boolean).join(' ')
    throw new Error(message || 'Sign up failed.')
  }
}

async function resendConfirmationEmail(email: string, fullName: string) {
  const response = await fetch('/api/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName }),
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

export function Signup() {
  const { configured, confirmed, loading, user } = useAuth()
  const { notify } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [awaitingEmail, setAwaitingEmail] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  if (!loading && confirmed && user && !awaitingEmail) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    const trimmedEmail = email.trim()
    const trimmedName = fullName.trim()
    try {
      setAwaitingEmail(true)
      await registerWithEmail({
        email: trimmedEmail,
        password,
        fullName: trimmedName,
      })
      setInfo(
        'Doğrulama maili gönderildi. Gelen kutusu ve spam klasörünü kontrol edin. Maildeki linke tıkladıktan sonra anasayfaya yönlendirileceksiniz.',
      )
      notify(
        'success',
        'Kayıt başarılı',
        'Doğrulama maili gönderildi. Maildeki linke tıklayın.',
      )
    } catch (err) {
      setAwaitingEmail(false)
      const message = err instanceof Error ? err.message : 'Kayıt başarısız.'
      setError(message)
      notify('error', 'Kayıt başarısız', message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResend() {
    if (!email.trim()) {
      setError('Önce e-posta adresinizi girin, sonra tekrar gönderin.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await resendConfirmationEmail(email.trim(), fullName.trim())
      setInfo(
        'Doğrulama maili tekrar gönderildi. Gelen kutusu ve spam klasörünü kontrol edin.',
      )
      notify(
        'info',
        'Doğrulama maili gönderildi',
        'Gelen kutusu ve spam klasörünü kontrol edin.',
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Mail gönderilemedi.'
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
        title="Sign up"
        lead="Create an account. You must confirm your email before access is granted."
      />

      <section className="section section--paper">
        <div className="wrap auth-shell">
          {!configured ? (
            <p className="lede">
              Authentication is not connected yet. Add Supabase keys to enable
              sign up.
            </p>
          ) : awaitingEmail ? (
            <div className="form-success">
              <h2 style={{ fontSize: '1.45rem' }}>E-posta onayını tamamlayın</h2>
              <p className="lede">
                <strong>{email.trim()}</strong> adresine doğrulama maili
                gönderildi. Anasayfaya geçmek için maildeki onay linkine
                tıklamanız gerekir.
              </p>
              <p className="form-note">
                Mail gelmezse spam/junk klasörünü kontrol edin. Gerekirse
                aşağıdaki butonla tekrar gönderin.
              </p>
              {error ? (
                <p className="form-note" role="alert" style={{ color: '#8b1e1e' }}>
                  {error}
                </p>
              ) : null}
              {info ? <p className="form-note">{info}</p> : null}
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn--primary"
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleResend()}
                >
                  {submitting ? 'Gönderiliyor…' : 'Doğrulama mailini tekrar gönder'}
                </button>
                <Link className="btn btn--ghost" to="/login">
                  Log in
                </Link>
              </div>
            </div>
          ) : (
            <form className="contact-form auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="signup-name">Full name</label>
                <input
                  id="signup-name"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="form-note">
                Kayıttan sonra bu ekranda kalırsınız. Anasayfa yalnızca e-posta
                doğrulama linkine tıkladıktan sonra açılır.
              </p>
              {error ? (
                <p className="form-note" role="alert" style={{ color: '#8b1e1e' }}>
                  {error}
                </p>
              ) : null}
              <button
                className="btn btn--primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Creating…' : 'Create account'}
              </button>
              <p className="form-note">
                Already registered? <Link to="/login">Log in</Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
