import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { brand, nav } from '../content/site'

function navItemActive(to: string, pathname: string, hash: string) {
  if (to === '/') return pathname === '/'
  if (to === '/about#services') {
    return (
      (pathname === '/about' && hash === '#services') ||
      pathname.startsWith('/services/')
    )
  }
  if (to === '/about') {
    return pathname === '/about' && hash !== '#services'
  }
  if (to === '/blog') {
    return pathname === '/blog' || pathname.startsWith('/blog/')
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { confirmed, loading, user } = useAuth()

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
          {nav.map((item) => {
            const active = navItemActive(
              item.to,
              location.pathname,
              location.hash,
            )
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={active ? 'active' : undefined}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}

          {!loading && confirmed && user ? (
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className={
                location.pathname === '/profile'
                  ? 'active nav-user-link'
                  : 'nav-user-link'
              }
              aria-current={
                location.pathname === '/profile' ? 'page' : undefined
              }
              title={user.email ?? undefined}
            >
              Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={
                  location.pathname === '/login' ? 'active' : undefined
                }
                aria-current={
                  location.pathname === '/login' ? 'page' : undefined
                }
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className={
                  location.pathname === '/signup' ? 'active' : undefined
                }
                aria-current={
                  location.pathname === '/signup' ? 'page' : undefined
                }
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
      <span className="sr-only">{brand.domain}</span>
    </header>
  )
}
