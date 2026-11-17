import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

export function Signup() {
  const { configured, confirmed, loading, signUp, user } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!loading && confirmed && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await signUp(email.trim(), password, fullName.trim())
      if (result === 'confirm-email') {
        notify(
          'success',
          'Kayıt başarılı',
          'Hesabınız oluşturuldu. Giriş için e-posta adresinizi onaylayın.',
        )
      } else {
        notify('success', 'Kayıt başarılı', 'Hesabınız hazır. Ana sayfaya yönlendiriliyorsunuz.')
      }
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Kayıt başarısız.'
      setError(message)
      notify('error', 'Kayıt başarısız', message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Sign up"
        lead="Create an account. You must confirm your email before you can log in."
      />

      <section className="section section--paper">
        <div className="wrap auth-shell">
          {!configured ? (
            <p className="lede">
              Authentication is not connected yet. Add Supabase keys to enable
              sign up.
            </p>
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
                By signing up you agree to confirm your email. Login is disabled
                until verification is complete.
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
