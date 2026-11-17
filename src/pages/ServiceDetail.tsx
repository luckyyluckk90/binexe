import { Link, Navigate, useParams } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import {
  citizenshipPrograms,
  getService,
  residencyPrograms,
  services,
} from '../content/site'

export function ServiceDetail() {
  const { slug = '' } = useParams()
  const service = getService(slug)

  if (!service) {
    return <Navigate to="/services" replace />
  }

  return (
    <>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        lead={service.lead}
      />

      <section className="section section--paper">
        <div className="wrap">
          <div className="prose">
            {service.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="detail-points">
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className="cta-row" style={{ marginTop: '1.75rem' }}>
            <Link className="btn btn--primary" to="/contact">
              {service.cta}
            </Link>
            <Link className="btn btn--ghost" to="/services">
              All services
            </Link>
          </div>
        </div>
      </section>

      {service.slug === 'citizenship-residency' ? (
        <>
          <section className="section section--muted">
            <div className="wrap">
              <div className="section__head">
                <p className="eyebrow">Residency by investment</p>
                <h2>Selected residency programmes.</h2>
                <p className="lede">
                  Indicative timelines and thresholds for planning conversations.
                  Final eligibility depends on programme rules and personal
                  circumstances.
                </p>
              </div>
              <div className="program-grid">
                {residencyPrograms.map((program) => (
                  <article key={program.name}>
                    <h3>{program.name}</h3>
                    <p>{program.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section section--paper">
            <div className="wrap">
              <div className="section__head">
                <p className="eyebrow">Citizenship by investment</p>
                <h2>Selected citizenship programmes.</h2>
                <p className="lede">
                  A concise view of commonly requested pathways. We refine the
                  shortlist after understanding your priorities.
                </p>
              </div>
              <div className="program-grid">
                {citizenshipPrograms.map((program) => (
                  <article key={program.name}>
                    <h3>{program.name}</h3>
                    <p>{program.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : null}

      <section className="section section--muted">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">Related services</p>
            <h2>Continue exploring.</h2>
          </div>
          <div className="service-list">
            {services
              .filter((item) => item.slug !== service.slug)
              .slice(0, 3)
              .map((item) => (
                <article className="service-row" key={item.slug}>
                  <h3>{item.navLabel}</h3>
                  <p>{item.summary}</p>
                  <Link
                    className="service-row__link"
                    to={`/services/${item.slug}`}
                  >
                    Learn more
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>

      <CtaBand
        tone="ink"
        title={service.cta}
        text="Share a short brief and we will respond with the practical next step."
        actionLabel="Contact us"
      />
    </>
  )
}
