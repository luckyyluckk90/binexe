import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { CtaBand } from '../components/CtaBand'
import { brand, sectors, services } from '../content/site'

const ease = [0.22, 1, 0.36, 1] as const

export function Home() {
  const reduceMotion = useReducedMotion()

  const rise = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease },
        }

  return (
    <>
      <header className="hero">
        <motion.div
          className="hero__media"
          aria-hidden="true"
          initial={reduceMotion ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease }}
        >
          <img
            src="/hero-corporate.jpg"
            alt=""
            width={2400}
            height={1600}
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero__veil" />
        </motion.div>

        <div className="wrap hero__content">
          <motion.p className="brand-mark" {...rise(0.05)}>
            {brand.name}
          </motion.p>
          <motion.h1 {...rise(0.16)}>
            Intelligent solutions for companies and individuals.
          </motion.h1>
          <motion.p className="lede" {...rise(0.28)}>
            Company formations, investment migration, HR, tax and regulated
            licensing — delivered with calm, corporate clarity.
          </motion.p>
          <motion.div className="cta-row" {...rise(0.4)}>
            <Link className="btn btn--primary" to="/services">
              Explore services
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              Request a call back
            </Link>
          </motion.div>
        </div>
      </header>

      <section className="section section--paper">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">Our suite of services</p>
            <h2>More than a single practice.</h2>
            <p className="lede">
              From formation and licensing to people, tax and mobility, Binexe
              supports the practical work behind ambitious plans.
            </p>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.slug}>
                <h3>{service.navLabel}</h3>
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

      <section className="section section--muted">
        <div className="wrap split">
          <div className="split__media">
            <img
              src="/services-desk.jpg"
              alt="Professional desk with documents and planning materials"
              width={1600}
              height={1068}
              loading="lazy"
            />
          </div>
          <div className="split__copy">
            <p className="eyebrow">Who we help</p>
            <h2>Built for employers, candidates and private clients.</h2>
            <div className="audience-grid" style={{ marginTop: '0.5rem' }}>
              <article>
                <h3>For companies</h3>
                <p>
                  We learn your history, culture and hiring or structuring needs
                  before introducing candidates, jurisdictions or licence paths.
                </p>
              </article>
              <article>
                <h3>For individuals</h3>
                <p>
                  Career moves and investment-migration decisions receive
                  personal attention — clear advice, honest timelines, steady
                  support.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">Specialist sectors</p>
            <h2>Recruitment where demand is sharpest.</h2>
            <p className="lede">
              Our HR practice focuses on connecting people and employers in
              sought-after UK markets.
            </p>
          </div>
          <div className="sector-grid">
            {sectors.map((sector) => (
              <article key={sector.title}>
                <h3>{sector.title}</h3>
                <p>{sector.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="wrap split split--reverse">
          <div className="split__copy">
            <p className="eyebrow">Citizenship solutions</p>
            <h2>Selected residency and citizenship pathways.</h2>
            <p className="lede">
              We shortlist programmes that balance lifestyle, travel freedom,
              legal protection and tax considerations — then guide the process
              with precision.
            </p>
            <ul>
              <li>Residency by investment across leading European options</li>
              <li>Citizenship programmes with clear thresholds and timelines</li>
              <li>Private briefings before any commitment</li>
            </ul>
            <div className="cta-row">
              <Link
                className="btn btn--primary"
                to="/services/citizenship-residency"
              >
                View migration services
              </Link>
            </div>
          </div>
          <div className="split__media">
            <img
              src="/about-office.jpg"
              alt="Bright contemporary office interior"
              width={1800}
              height={1202}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <CtaBand
        tone="ink"
        title="Ready for a clear next step?"
        text="Share your objective and we will outline the most practical route — formation, licensing, talent, tax or mobility."
        actionLabel="Contact Binexe"
      />
    </>
  )
}
