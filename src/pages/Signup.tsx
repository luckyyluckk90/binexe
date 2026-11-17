import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

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
  const [done, setDone] = useState(false)
  const [info, setInfo] = useState<string | null>(null)

  // Only leave signup once the email is actually confirmed.
  if (!loading && confirmed && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setInfo(null)
    setSubmitting(true)
    try {
      await signUp(email.trim(), password, fullName.trim())
      setDone(true)
      notify(
        'success',
        'Kayıt başarılı',
        'Doğrulama maili gönderildi. Bu ekranda kalın ve e-postanızı onaylayın.',
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kayıt başarısız.'
      setError(message)
      notify('error', 'Kayıt başarısız', message)
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
      setInfo('Confirmation email sent again. Check your inbox and spam folder.')
      notify(
        'info',
        'Doğrulama maili gönderildi',
        'Gelen kutunuzu kontrol edin.',
      )
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not resend confirmation.'
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
        lead="Create an account. Stay on this page until you confirm your email — then you will reach the homepage."
      />

      <section className="section section--paper">
        <div className="wrap auth-shell">
          {!configured ? (
            <p className="lede">
              Authentication is not connected yet. Add Supabase keys to enable
              sign up.
            </p>
          ) : done ? (
            <div className="form-success">
              <h2 style={{ fontSize: '1.45rem' }}>Confirm your email</h2>
              <p className="lede">
                Registration succeeded. We sent a verification link to{' '}
                <strong>{email.trim()}</strong>. Open that link to verify your
                account — after confirmation you will be taken to the homepage.
              </p>
              <p className="form-note">
                Keep this tab open if you like. Confirmation happens when you
                click the link in your email.
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
                After you register, stay here and confirm the email we send.
                The homepage opens only after verification.
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
