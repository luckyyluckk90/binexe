import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHero } from '../components/PageHero'
import { useToast } from '../components/Toast'
import { useAuth } from '../auth/AuthContext'

function formatDate(value?: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function Profile() {
  const { confirmed, loading, signOut, updatePassword, updateProfile, user } =
    useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const currentName = String(user?.user_metadata?.full_name || '').trim()
  const [fullName, setFullName] = useState(currentName)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    setFullName(String(user?.user_metadata?.full_name || '').trim())
  }, [user])

  if (!loading && (!confirmed || !user)) {
    return <Navigate to="/login" replace />
  }

  if (loading || !user) {
    return (
      <>
        <PageHero
          eyebrow="Account"
          title="Profile"
          lead="Loading your Binexe account…"
        />
        <section className="section section--paper">
          <div className="wrap auth-shell">
            <p className="lede">Please wait…</p>
          </div>
        </section>
      </>
    )
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileError(null)
    setSavingProfile(true)
    try {
      await updateProfile(fullName.trim())
      notify('success', 'Profil güncellendi', 'Adınız kaydedildi.')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Profile could not be updated.'
      setProfileError(message)
      notify('error', 'Profil güncellenemedi', message)
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError(null)

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setPasswordError('Passwords do not match.')
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword(password)
      setPassword('')
      setConfirm('')
      notify('success', 'Şifre güncellendi', 'Yeni şifreniz kaydedildi.')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Password could not be updated.'
      setPasswordError(message)
      notify('error', 'Şifre güncellenemedi', message)
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    notify('info', 'Signed out', 'See you soon.')
    navigate('/', { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Profile"
        lead="Manage your Binexe account details and password."
      />

      <section className="section section--paper">
        <div className="wrap profile-shell">
          <div className="profile-summary">
            <div className="profile-identity">
              <Avatar
                size="lg"
                name={currentName}
                email={user.email}
                className="profile-avatar"
              />
              <div className="profile-identity__copy">
                <p className="profile-presence">
                  <span className="profile-presence__dot" aria-hidden="true" />
                  Signed in now
                </p>
                <h2>{currentName || 'Binexe member'}</h2>
                <p className="lede">{user.email}</p>
              </div>
            </div>
            <dl className="profile-meta">
              <div>
                <dt>Email status</dt>
                <dd>Confirmed</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{formatDate(user.created_at)}</dd>
              </div>
              <div>
                <dt>Last sign-in</dt>
                <dd>{formatDate(user.last_sign_in_at)}</dd>
              </div>
            </dl>
          </div>

          <form className="contact-form" onSubmit={handleProfileSubmit}>
            <h3 className="profile-form__title">Display name</h3>
            <div className="field">
              <label htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {profileError ? (
              <p className="form-note form-note--error" role="alert">
                {profileError}
              </p>
            ) : null}
            <button
              className="btn btn--primary"
              type="submit"
              disabled={savingProfile}
            >
              {savingProfile ? 'Saving…' : 'Save name'}
            </button>
          </form>

          <form className="contact-form" onSubmit={handlePasswordSubmit}>
            <h3 className="profile-form__title">Password</h3>
            <div className="field">
              <label htmlFor="profile-password">New password</label>
              <input
                id="profile-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="profile-confirm">Confirm password</label>
              <input
                id="profile-confirm"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            {passwordError ? (
              <p className="form-note form-note--error" role="alert">
                {passwordError}
              </p>
            ) : null}
            <button
              className="btn btn--primary"
              type="submit"
              disabled={savingPassword}
            >
              {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => void handleSignOut()}
            >
              Sign out
            </button>
            <Link className="btn btn--ghost" to="/contact">
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
