import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { brand, legalEntity } from '../content/site'

export function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & conditions"
        lead="The terms that apply when you use the Binexe website and related online services."
      />

      <section className="section section--paper">
        <div className="wrap">
          <div className="prose legal-prose">
            <p>
              These terms & conditions govern access to and use of{' '}
              {brand.domain}, operated by {legalEntity.name} (company number{' '}
              {legalEntity.number}). By using the site you agree to these terms.
            </p>

            <h2>About us</h2>
            <ul>
              <li>Company: {legalEntity.name}</li>
              <li>Company number: {legalEntity.number}</li>
              <li>Registered office: {legalEntity.registeredOffice}</li>
              <li>
                Contact: <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
            </ul>

            <h2>Website use</h2>
            <p>
              The site provides general information about our professional
              services. Content is for information only and does not itself
              create a client engagement, advice relationship or offer capable of
              acceptance unless we confirm otherwise in writing.
            </p>

            <h2>Accounts</h2>
            <p>
              If you create an account you must provide accurate details, keep
              login credentials confidential, and complete email confirmation
              before access is granted. You are responsible for activity under
              your account.
            </p>

            <h2>Enquiries and services</h2>
            <p>
              Submitting an enquiry does not oblige us to accept an engagement.
              Any professional services are subject to separate scoping,
              engagement terms and applicable professional standards.
            </p>

            <h2>Acceptable use</h2>
            <p>You must not:</p>
            <ul>
              <li>Misuse the site, attempt unauthorised access, or disrupt systems</li>
              <li>Submit false, unlawful or misleading information</li>
              <li>
                Copy, scrape or redistribute site content for commercial use
                without our prior written consent
              </li>
            </ul>

            <h2>Intellectual property</h2>
            <p>
              Text, branding, layout and other materials on this site belong to{' '}
              {legalEntity.name} or its licensors. You may view pages for personal
              or internal business reference, but not reproduce them as your own
              materials without permission.
            </p>

            <h2>Disclaimer</h2>
            <p>
              We aim to keep information accurate and up to date, but we do not
              warrant that content is complete, current or suitable for every
              circumstance. You should obtain specific advice before acting.
            </p>

            <h2>Liability</h2>
            <p>
              To the fullest extent permitted by law, {legalEntity.name} is not
              liable for loss arising from use of, or inability to use, this
              website or reliance on its general content. Nothing in these terms
              excludes liability that cannot lawfully be excluded.
            </p>

            <h2>Privacy and cookies</h2>
            <p>
              Personal data is handled as described in our{' '}
              <Link to="/privacy-policy">Privacy policy</Link>. Cookie use is
              described in our <Link to="/cookie-policy">Cookie policy</Link>.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the
              site after changes are posted constitutes acceptance of the updated
              terms.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of England and Wales. The
              courts of England and Wales have exclusive jurisdiction, subject to
              any mandatory consumer protections that apply to you.
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
