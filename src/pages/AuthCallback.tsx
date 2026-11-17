import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { isEmailConfirmed, supabase } from '../lib/supabase'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function AuthCallback() {
  const navigate = useNavigate()
  const { notify } = useToast()
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

      // PKCE / magic-link flows may still be settling the session.
      const { data, error } = await supabase.auth.getSession()
      if (!active) return

      if (error) {
        setFailed(true)
        setMessage(error.message)
        notify('error', 'Doğrulama başarısız', error.message)
        return
      }

      if (data.session && isEmailConfirmed(data.session.user)) {
        setMessage('Email confirmed. Taking you to the homepage…')
        notify(
          'success',
          'E-posta doğrulandı',
          'Hesabınız aktif. Ana sayfaya yönlendiriliyorsunuz.',
        )
        await wait(1400)
        if (!active) return
        navigate('/', { replace: true })
        return
      }

      if (data.session && !isEmailConfirmed(data.session.user)) {
        await supabase.auth.signOut()
        setFailed(true)
        setMessage(
          'Email is still unconfirmed. Open the latest verification link from your inbox.',
        )
        notify(
          'error',
          'Doğrulama tamamlanmadı',
          'Lütfen gelen kutunuzdaki doğrulama linkini açın.',
        )
        return
      }

      setFailed(true)
      setMessage(
        'No confirmed session found. Try the verification link again, then log in.',
      )
      notify(
        'error',
        'Doğrulama başarısız',
        'Linki yeniden deneyin veya giriş sayfasından devam edin.',
      )
    }

    void finish()
    return () => {
      active = false
    }
  }, [navigate, notify])

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
