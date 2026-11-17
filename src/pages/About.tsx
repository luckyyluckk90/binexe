import { Link } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { aboutContent } from '../content/site'

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About Binexe"
        title={aboutContent.title}
        lead={aboutContent.lead}
      />

      <section className="section section--paper">
        <div className="wrap split">
          <div className="prose">
            {aboutContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="cta-row">
              <Link className="btn btn--primary" to="/services">
                View services
              </Link>
              <Link className="btn btn--ghost" to="/contact">
                Get in touch
              </Link>
            </div>
          </div>
          <div className="split__media">
            <img
              src="/about-office.jpg"
              alt="Open office space with natural light"
              width={1800}
              height={1202}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">How we support clients</p>
            <h2>Specialist services with practical follow-through.</h2>
            <p className="lede">
              Engagements stay useful after the first decision — from set-up and
              planning through management and advisory support.
            </p>
          </div>
          <div className="pillar-grid">
            {aboutContent.pillars.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Discover how we can help."
        text="Whether you are forming a company, hiring, planning tax, licensing a regulated business, or exploring mobility options — start with a conversation."
        actionLabel="Contact Binexe"
      />
    </>
  )
}
