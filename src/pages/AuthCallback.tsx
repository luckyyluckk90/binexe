import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { isEmailConfirmed, supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Confirming your email…')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true

    async function finish() {
      if (!supabase) {
        if (!active) return
        setFailed(true)
        setMessage('Authentication is not configured.')
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (!active) return

      if (error) {
        setFailed(true)
        setMessage(error.message)
        return
      }

      if (data.session && isEmailConfirmed(data.session.user)) {
        setMessage('Email confirmed. Redirecting…')
        navigate('/', { replace: true })
        return
      }

      if (data.session && !isEmailConfirmed(data.session.user)) {
        await supabase.auth.signOut()
        setFailed(true)
        setMessage(
          'Email is still unconfirmed. Open the latest verification link from your inbox.',
        )
        return
      }

      setFailed(true)
      setMessage(
        'No confirmed session found. Try the verification link again, then log in.',
      )
    }

    void finish()
    return () => {
      active = false
    }
  }, [navigate])

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Email confirmation"
        lead="Finishing verification for your Binexe account."
      />
      <section className="section section--paper">
        <div className="wrap auth-shell">
          <p className="lede" style={failed ? { color: '#8b1e1e' } : undefined}>
            {message}
          </p>
          {failed ? (
            <div className="cta-row">
              <Link className="btn btn--primary" to="/login">
                Log in
              </Link>
              <Link className="btn btn--ghost" to="/signup">
                Sign up
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
