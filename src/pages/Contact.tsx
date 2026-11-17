import { useState } from 'react'
import type { FormEvent } from 'react'
import { PageHero } from '../components/PageHero'
import { brand, contactContent } from '../content/site'

export function Contact() {
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const interest = String(data.get('interest') || 'General enquiry')
    const name = String(data.get('name') || '')
    const message = String(data.get('message') || '')
    const subject = encodeURIComponent(`Binexe enquiry — ${interest}`)
    const body = encodeURIComponent(
      `Name: ${name}\nInterest: ${interest}\n\n${message}`,
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
                  Your email client should open with the enquiry details. If it
                  does not, write to{' '}
                  <a href={`mailto:${brand.email}`}>{brand.email}</a>.
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
                  <select id="interest" name="interest" defaultValue="">
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
                  Submitting opens an email to {brand.email}. No account is
                  created and nothing is stored on this page.
                </p>
                <button className="btn btn--primary" type="submit">
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
