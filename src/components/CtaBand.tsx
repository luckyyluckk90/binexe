import { Link } from 'react-router-dom'

type CtaBandProps = {
  title: string
  text: string
  actionLabel?: string
  to?: string
  tone?: 'muted' | 'ink'
}

export function CtaBand({
  title,
  text,
  actionLabel = 'Contact us',
  to = '/contact',
  tone = 'muted',
}: CtaBandProps) {
  return (
    <section className={`section section--${tone}`}>
      <div className="wrap cta-band">
        <div className="cta-band__copy">
          <h2>{title}</h2>
          <p className="lede">{text}</p>
        </div>
        <Link
          className={`btn ${tone === 'ink' ? 'btn--primary' : 'btn--dark'}`}
          to={to}
        >
          {actionLabel}
        </Link>
      </div>
    </section>
  )
}
