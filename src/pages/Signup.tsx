import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

async function fetchConfirmationLink(email: string) {
  const response = await fetch('/api/confirmation-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const payload = (await response.json().catch(() => ({}))) as {
    action_link?: string
    error?: string
  }
  if (!response.ok || !payload.action_link) {
    throw new Error(payload.error || 'Confirmation link unavailable.')
  }
  return payload.action_link
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
  const [confirmLink, setConfirmLink] = useState<string | null>(null)
  const [linkLoading, setLinkLoading] = useState(false)

  // Already signed in from a previous visit — but never leave while we are
  // waiting for the new signup's email confirmation.
  if (!loading && confirmed && user && !awaitingEmail) {
    return <Navigate to="/" replace />
  }

  async function loadConfirmLink(targetEmail: string) {
    setLinkLoading(true)
    try {
      const link = await fetchConfirmationLink(targetEmail)
      setConfirmLink(link)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Confirmation link unavailable.'
      setInfo(
        `${message} You can still use Resend confirmation, then check spam.`,
      )
    } finally {
      setLinkLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setConfirmLink(null)
    setSubmitting(true)
    const trimmedEmail = email.trim()
    try {
      // Lock the page on the confirmation step before auth state can redirect.
      setAwaitingEmail(true)
      await signUp(trimmedEmail, password, fullName.trim())
      notify(
        'success',
        'Kayıt başarılı',
        'Bu ekranda kalın. E-posta onayından sonra anasayfaya gideceksiniz.',
      )
      await loadConfirmLink(trimmedEmail)
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
      setError('Enter your email first, then resend confirmation.')
      return
    }
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await resendConfirmation(email.trim())
      setInfo('Confirmation email sent again. Check inbox and spam.')
      notify(
        'info',
        'Doğrulama maili gönderildi',
        'Gelen kutusu ve spam klasörünü kontrol edin.',
      )
      await loadConfirmLink(email.trim())
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not resend confirmation.'
      const lower = message.toLowerCase()
      const friendly =
        lower.includes('rate limit') || lower.includes('after')
          ? 'Mail limiti aşıldı. Biraz bekleyin veya aşağıdaki doğrulama linkini kullanın.'
          : message
      setError(friendly)
      notify('error', 'Mail gönderilemedi', friendly)
      await loadConfirmLink(email.trim())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Sign up"
        lead="Create an account. Stay on this page until you confirm your email — then you will reach the homepage."
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
              <h2 style={{ fontSize: '1.45rem' }}>Confirm your email</h2>
              <p className="lede">
                Registration succeeded for <strong>{email.trim()}</strong>.
                Stay on this page. After you confirm your email, you will be
                taken to the homepage.
              </p>
              <p className="form-note">
                Check inbox and spam for the Supabase confirmation mail. If it
                does not arrive, use the direct link below.
              </p>
              {confirmLink ? (
                <p className="lede">
                  <a className="btn btn--primary" href={confirmLink}>
                    Confirm email and continue
                  </a>
                </p>
              ) : (
                <p className="form-note">
                  {linkLoading
                    ? 'Preparing a direct confirmation link…'
                    : 'Direct link not ready yet — try Resend confirmation.'}
                </p>
              )}
              {error ? (
                <p className="form-note" role="alert" style={{ color: '#8b1e1e' }}>
                  {error}
                </p>
              ) : null}
              {info ? <p className="form-note">{info}</p> : null}
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn--ghost"
                  type="button"
                  disabled={submitting || linkLoading}
                  onClick={() => void handleResend()}
                >
                  {submitting ? 'Sending…' : 'Resend confirmation'}
                </button>
                <Link className="btn btn--ghost" to="/login">
                  Go to log in
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
                After you register you stay on this confirmation screen. The
                homepage opens only after email verification.
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
