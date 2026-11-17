import { Link } from 'react-router-dom'
import { brand, legalEntity, services } from '../content/site'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div>
            <h2>{brand.name}</h2>
            <p>{brand.tagline}</p>
            <p className="footer-legal">
              {legalEntity.name} · Company No. {legalEntity.number}
              <br />
              {legalEntity.registeredOffice}
            </p>
          </div>
          <div>
            <h2>Services</h2>
            <ul>
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`}>{service.navLabel}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/about#services">Services</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <a
                  href={legalEntity.companiesHouseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Companies House
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__base">
          <span>
            <strong>{brand.name}</strong> · {brand.domain}
          </span>
          <span>
            <Link to="/privacy-policy">Privacy policy</Link>
            {' · '}
            <Link to="/terms">Terms &amp; conditions</Link>
            {' · '}
            <Link to="/cookie-policy">Cookie policy</Link>
            {' · '}© {new Date().getFullYear()} {legalEntity.name}
          </span>
        </div>
      </div>
    </footer>
  )
}
