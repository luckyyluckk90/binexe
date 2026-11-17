import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

async function requestConfirmationEmail(email: string, fullName: string) {
  const response = await fetch('/api/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName }),
  })
  const payload = (await response.json().catch(() => ({}))) as {
    ok?: boolean
    error?: string
    provider?: string
  }
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || 'Confirmation email could not be sent.')
  }
  return payload
}

export function Signup() {
  const {
    configured,
    confirmed,
    loading,
    signUp,
    resendConfirmation,
    user,
  } = useAuth()
  const { notify } = useToast()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [awaitingEmail, setAwaitingEmail] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  // Stay on this page while waiting for email confirmation.
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
      await signUp(trimmedEmail, password, trimmedName)

      // Prefer our mailer (Resend) so confirmation is delivered reliably.
      // Fallback to Supabase resend if custom mail is not configured yet.
      try {
        await requestConfirmationEmail(trimmedEmail, trimmedName)
        setInfo(
          'Doğrulama maili gönderildi. Gelen kutusu ve spam klasörünü kontrol edin. Onay linkine tıkladıktan sonra anasayfaya yönlendirileceksiniz.',
        )
        notify(
          'success',
          'Kayıt başarılı',
          'Doğrulama maili gönderildi. Maildeki linke tıklayın.',
        )
      } catch {
        await resendConfirmation(trimmedEmail)
        setInfo(
          'Doğrulama maili gönderildi. Gelen kutusu ve spam klasörünü kontrol edin. Onay linkine tıkladıktan sonra anasayfaya yönlendirileceksiniz.',
        )
        notify(
          'success',
          'Kayıt başarılı',
          'Doğrulama maili gönderildi. Maildeki linke tıklayın.',
        )
      }
    } catch (err) {
      setAwaitingEmail(false)
      const message = err instanceof Error ? err.message : 'Kayıt başarısız.'
      const lower = message.toLowerCase()
      const friendly =
        lower.includes('rate limit') || lower.includes('after')
          ? 'Çok sık mail istendi. Bir dakika bekleyip tekrar deneyin; spam klasörünü de kontrol edin.'
          : message
      setError(friendly)
      notify('error', 'Kayıt başarısız', friendly)
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
      try {
        await requestConfirmationEmail(email.trim(), fullName.trim())
      } catch {
        await resendConfirmation(email.trim())
      }
      setInfo('Doğrulama maili tekrar gönderildi. Gelen kutusu ve spam’i kontrol edin.')
      notify(
        'info',
        'Doğrulama maili gönderildi',
        'Gelen kutusu ve spam klasörünü kontrol edin.',
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Mail gönderilemedi.'
      const lower = message.toLowerCase()
      const friendly =
        lower.includes('rate limit') || lower.includes('after')
          ? 'Mail limiti aşıldı. Biraz bekleyip tekrar deneyin.'
          : message
      setError(friendly)
      notify('error', 'Mail gönderilemedi', friendly)
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
