import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="section section--paper not-found">
      <div className="wrap not-found__inner">
        <p className="eyebrow">Error 404</p>
        <h1>Page not found</h1>
        <p className="lede">
          The page you requested does not exist or may have moved. Check the
          address, or continue from one of the links below.
        </p>
        <div className="cta-row">
          <Link className="btn btn--primary" to="/">
            Back to home
          </Link>
          <Link className="btn btn--ghost" to="/services">
            View services
          </Link>
          <Link className="btn btn--ghost" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </section>
  )
}
