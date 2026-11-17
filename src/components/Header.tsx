import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { brand, nav } from '../content/site'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link className="logo" to="/" onClick={() => setOpen(false)}>
          Bin<span>exe</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <nav
          id="site-nav"
          className={`nav${open ? ' is-open' : ''}`}
          aria-label="Primary"
        >
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            className="btn btn--primary nav-cta"
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Enquire
          </Link>
        </nav>
      </div>
      <span className="sr-only">{brand.domain}</span>
    </header>
  )
}
