import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import {
  isEmailConfirmed,
  recoverSessionFromUrl,
  supabase,
} from '../lib/supabase'

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

      // Capture auth type before recoverSessionFromUrl clears the hash.
      const initialHash = new URLSearchParams(
        window.location.hash.replace(/^#/, ''),
      )
      const authType = initialHash.get('type')

      // Implicit magic-link redirects land with #access_token=… — recover that
      // session explicitly, with a short retry while the client settles.
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

      if (lastError) {
        setFailed(true)
        setMessage(lastError.message)
        notify('error', 'Doğrulama başarısız', lastError.message)
        return
      }

      if (session && isEmailConfirmed(session.user)) {
        if (authType === 'recovery') {
          setMessage('Reset link verified. Opening password form…')
          navigate('/auth/reset-password', { replace: true })
          return
        }

        setMessage('Email confirmed. Taking you to the homepage…')
        notify(
          'success',
          'E-posta doğrulandı',
          'Hesabınız aktif. Ana sayfaya yönlendiriliyorsunuz.',
        )
        await wait(1200)
        if (!active) return
        navigate('/', { replace: true })
        return
      }

      if (session && !isEmailConfirmed(session.user)) {
        // Refresh user in case confirmation landed after the token was issued.
        const { data: userData } = await supabase.auth.getUser()
        if (!active) return
        if (isEmailConfirmed(userData.user)) {
          setMessage('Email confirmed. Taking you to the homepage…')
          notify(
            'success',
            'E-posta doğrulandı',
            'Hesabınız aktif. Ana sayfaya yönlendiriliyorsunuz.',
          )
          await wait(1200)
          if (!active) return
          navigate('/', { replace: true })
          return
        }

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
        'No confirmed session found. If you already clicked the email link, try logging in — your email may already be verified.',
      )
      notify(
        'error',
        'Oturum bulunamadı',
        'Linki yeniden deneyin veya giriş yapın.',
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
