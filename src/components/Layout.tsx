import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { brand, getService } from '../content/site'

const titles: Record<string, string> = {
  '/': `${brand.name} — Professional Services`,
  '/services': `Services | ${brand.name}`,
  '/about': `About | ${brand.name}`,
  '/contact': `Contact | ${brand.name}`,
}

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const serviceMatch = location.pathname.match(/^\/services\/([^/]+)/)
    if (serviceMatch) {
      const service = getService(serviceMatch[1])
      document.title = service
        ? `${service.navLabel} | ${brand.name}`
        : `Services | ${brand.name}`
      return
    }
    document.title = titles[location.pathname] ?? `${brand.name}`
  }, [location.pathname])

  return (
    <div className="shell">
      <Header />
      <main className="shell__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
