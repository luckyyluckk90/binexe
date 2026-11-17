import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { brand, legalEntity } from '../content/site'

export function CookiePolicy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Cookie policy"
        lead="How Binexe uses cookies and similar technologies on this website."
      />

      <section className="section section--paper">
        <div className="wrap">
          <div className="prose legal-prose">
          <p>
            This cookie policy explains how {brand.name} ({legalEntity.name},
            company number {legalEntity.number}) uses cookies when you visit{' '}
            {brand.domain}.
          </p>

          <h2>Who we are</h2>
          <p>
            The website is operated by {legalEntity.name}, a private limited
            company registered in England and Wales.
          </p>
          <ul>
            <li>Company number: {legalEntity.number}</li>
            <li>Registered office: {legalEntity.registeredOffice}</li>
            <li>
              Companies House profile:{' '}
              <a
                href={legalEntity.companiesHouseUrl}
                target="_blank"
                rel="noreferrer"
              >
                View company {legalEntity.number}
              </a>
            </li>
            <li>
              Contact: <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
          </ul>

          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help the site function, remember preferences, and — where
            allowed — understand how pages are used.
          </p>

          <h2>Cookies we use</h2>
          <h3>Strictly necessary</h3>
          <p>
            Required for core features such as security, session continuity and
            account authentication (for example after you log in or confirm your
            email). These cookies are needed for the service to work.
          </p>
          <h3>Functional</h3>
          <p>
            Used to remember choices that improve your experience, such as form
            state or interface preferences where enabled.
          </p>
          <h3>Analytics (if enabled)</h3>
          <p>
            If analytics tools are added later, they may place cookies to help us
            understand traffic and improve the site. Where required by law, we
            will request consent before non-essential cookies are set.
          </p>

          <h2>Managing cookies</h2>
          <p>
            You can control cookies through your browser settings. Blocking some
            cookies may affect login, forms or other features on this site.
          </p>

          <h2>Updates</h2>
          <p>
            We may update this policy from time to time. The latest version will
            always be published on this page.
          </p>

          <p className="form-note">Last updated: 17 November 2026</p>
          </div>

          <div className="cta-row cta-row--equal cookie-actions">
            <Link className="btn btn--primary" to="/contact">
              Contact us
            </Link>
            <Link className="btn btn--ghost" to="/privacy-policy">
              Privacy policy
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
