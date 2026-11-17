import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { brand, legalEntity } from '../content/site'

export function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        lead="How Binexe collects, uses and protects personal information."
      />

      <section className="section section--paper">
        <div className="wrap">
          <div className="prose legal-prose">
            <p>
              This privacy policy explains how {brand.name} ({legalEntity.name},
              company number {legalEntity.number}) handles personal data when you
              use {brand.domain} or contact us.
            </p>

            <h2>Who we are</h2>
            <p>
              The data controller for this website is {legalEntity.name}, a
              private limited company registered in England and Wales.
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

            <h2>Information we collect</h2>
            <p>Depending on how you use the site, we may process:</p>
            <ul>
              <li>
                Identity and contact details you submit (name, email, phone,
                company and enquiry details)
              </li>
              <li>
                Account details if you create a login (email address and
                authentication status)
              </li>
              <li>
                Technical data such as browser type, device information and
                approximate location derived from IP address
              </li>
              <li>
                Communication records when you email us or complete a form
              </li>
            </ul>

            <h2>How we use information</h2>
            <p>We use personal data to:</p>
            <ul>
              <li>Respond to enquiries and provide professional services</li>
              <li>Create and manage user accounts where you register</li>
              <li>Operate, secure and improve the website</li>
              <li>Meet legal, regulatory and accounting obligations</li>
            </ul>

            <h2>Legal bases</h2>
            <p>
              Where UK GDPR applies, we rely on one or more of: performance of a
              contract or steps prior to a contract; legitimate interests in
              running and securing our business; consent where we ask for it;
              and legal obligation where the law requires us to retain or
              disclose information.
            </p>

            <h2>Sharing</h2>
            <p>
              We may share data with trusted service providers that help us host
              the site, process forms, authenticate users or send email (for
              example infrastructure and authentication providers). We do not
              sell personal data.
            </p>

            <h2>Retention</h2>
            <p>
              We keep personal data only as long as needed for the purpose it was
              collected, including any period required for legal, tax or dispute
              purposes. Enquiry records and account data are reviewed and removed
              when no longer required.
            </p>

            <h2>Your rights</h2>
            <p>
              Subject to applicable law, you may have rights to access, correct,
              erase, restrict or object to certain processing, and to data
              portability. To exercise these rights, contact{' '}
              <a href={`mailto:${brand.email}`}>{brand.email}</a>. You may also
              complain to the UK Information Commissioner’s Office (ICO).
            </p>

            <h2>Cookies</h2>
            <p>
              Details of cookies and similar technologies are set out in our{' '}
              <Link to="/cookie-policy">Cookie policy</Link>.
            </p>

            <h2>Updates</h2>
            <p>
              We may update this policy from time to time. The latest version
              will always be published on this page.
            </p>

            <p className="form-note">Last updated: 17 November 2026</p>
          </div>

          <div className="cta-row cta-row--equal cookie-actions">
            <Link className="btn btn--primary" to="/contact">
              Contact us
            </Link>
            <Link className="btn btn--ghost" to="/terms">
              Terms &amp; conditions
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
