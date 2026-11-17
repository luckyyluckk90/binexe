import { useState } from 'react'
import type { FormEvent } from 'react'
import { PageHero } from '../components/PageHero'
import { brand, contactContent } from '../content/site'
import { isSupabaseConfigured, submitEnquiry } from '../lib/supabase'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const form = event.currentTarget
    const data = new FormData(form)
    const interest = String(data.get('interest') || 'General enquiry')
    const name = String(data.get('name') || '')
    const email = String(data.get('email') || '')
    const message = String(data.get('message') || '')

    if (isSupabaseConfigured) {
      try {
        setSubmitting(true)
        await submitEnquiry({
          full_name: name,
          email,
          interest,
          message,
        })
        setSent(true)
        form.reset()
      } catch (err) {
        const detail =
          err instanceof Error ? err.message : 'Unable to send enquiry right now.'
        setError(detail)
      } finally {
        setSubmitting(false)
      }
      return
    }

    const subject = encodeURIComponent(`Binexe enquiry — ${interest}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\n${message}`,
    )
    setSent(true)
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={contactContent.title}
        lead={contactContent.lead}
      />

      <section className="section section--paper">
        <div className="wrap contact-layout">
          <div>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
              How to reach us
            </h2>
            <p className="lede">
              Use the form or email us directly. We review enquiries across
              company formations, licensing, HR, tax, and citizenship or
              residency planning.
            </p>
            <dl className="channel-list">
              {contactContent.channels.map((channel) => (
                <div key={channel.label}>
                  <dt>{channel.label}</dt>
                  <dd>
                    {channel.href ? (
                      <a href={channel.href}>{channel.value}</a>
                    ) : (
                      channel.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            {sent ? (
              <div className="form-success">
                <h2 style={{ fontSize: '1.45rem' }}>Thank you</h2>
                <p className="lede">
                  {isSupabaseConfigured
                    ? 'Your enquiry has been received. We will get back to you shortly.'
                    : `Your email client should open with the enquiry details. If it does not, write to ${brand.email}.`}
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" autoComplete="name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="interest">Looking for</label>
                  <select id="interest" name="interest" defaultValue="" required>
                    <option value="" disabled>
                      Select a service
                    </option>
                    {contactContent.interests.map((interest) => (
                      <option key={interest} value={interest}>
                        {interest}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required />
                </div>
                <p className="form-note">
                  {isSupabaseConfigured
                    ? 'Messages are stored securely for the Binexe team to review.'
                    : `Supabase is not connected yet — submit opens an email to ${brand.email}.`}
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
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
