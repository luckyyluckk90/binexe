import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { isEmailConfirmed, recoverSessionFromUrl, supabase } from '../lib/supabase'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function ResetPassword() {
  const navigate = useNavigate()
  const { notify } = useToast()
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [message, setMessage] = useState('Preparing password reset…')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function prepare() {
      if (!supabase) {
        if (!active) return
        setFailed(true)
        setMessage('Authentication is not configured.')
        return
      }

      let session = null
      let lastError: Error | null = null

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const recovered = await recoverSessionFromUrl()
        if (!active) return
        if (recovered.error) {
          lastError = recovered.error
          break
        }
        if (recovered.session) {
          session = recovered.session
          break
        }
        await wait(250)
      }

      if (!active) return

      if (lastError || !session) {
        setFailed(true)
        setMessage(
          lastError?.message ||
            'Reset link is invalid or expired. Request a new password reset from the login page.',
        )
        return
      }

      if (!isEmailConfirmed(session.user)) {
        setFailed(true)
        setMessage('Confirm your email before resetting the password.')
        return
      }

      setReady(true)
      setMessage('Choose a new password for your Binexe account.')
    }

    void prepare()
    return () => {
      active = false
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      if (updateError) throw updateError
      notify('success', 'Şifre güncellendi', 'Ana sayfaya yönlendiriliyorsunuz.')
      await wait(1200)
      navigate('/', { replace: true })
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Password update failed.'
      setError(text)
      notify('error', 'Şifre güncellenemedi', text)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Reset password"
        lead="Set a new password after opening the reset link from your email."
      />
      <section className="section section--paper">
        <div className="wrap auth-shell">
          {!ready ? (
            <>
              <p className={`lede${failed ? ' lede--error' : ''}`}>
                {message}
              </p>
              {failed ? (
                <div className="cta-row">
                  <Link className="btn btn--primary" to="/login">
                    Back to login
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <form className="contact-form auth-form" onSubmit={handleSubmit}>
              <p className="form-note">{message}</p>
              <div className="field">
                <label htmlFor="reset-password">New password</label>
                <input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="reset-confirm">Confirm password</label>
                <input
                  id="reset-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              {error ? (
                <p className="form-note form-note--error" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                className="btn btn--primary"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Save new password'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
