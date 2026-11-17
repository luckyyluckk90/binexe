import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { brand, nav } from '../content/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const { confirmed, loading, signOut, user } = useAuth()

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
          {nav.map((item) =>
            item.to === '/blog' ? (
              <NavLink
                key={item.to}
                className="btn btn--primary nav-cta"
                to={item.to}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ),
          )}

          {!loading && confirmed && user ? (
            <>
              <span className="nav-user" title={user.email ?? undefined}>
                {user.email}
              </span>
              <button
                type="button"
                className="btn btn--ghost nav-auth"
                onClick={() => {
                  void signOut()
                  setOpen(false)
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="nav-auth"
                onClick={() => setOpen(false)}
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn--ghost nav-auth"
                onClick={() => setOpen(false)}
              >
                Sign up
              </NavLink>
            </>
          )}
        </nav>
      </div>
      <span className="sr-only">{brand.domain}</span>
    </header>
  )
}
