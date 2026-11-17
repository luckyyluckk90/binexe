import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { services } from '../content/site'

export function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="A full suite of professional services."
        lead="Company formations, citizenship and residency, human resources, tax and accounting, and regulated licensing — organised for clarity."
      />

      <section className="section section--paper">
        <div className="wrap">
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.slug}>
                <div>
                  <p className="eyebrow">{service.eyebrow}</p>
                  <h3 style={{ marginTop: '0.35rem' }}>{service.navLabel}</h3>
                </div>
                <p>{service.summary}</p>
                <Link
                  className="service-row__link"
                  to={`/services/${service.slug}`}
                >
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Need help choosing a path?"
        text="Tell us your goal and we will point you to the right service line."
        actionLabel="Make an enquiry"
      />
    </>
  )
}
