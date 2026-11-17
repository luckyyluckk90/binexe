import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { brand, getService } from '../content/site'
import { getPost } from '../content/blog'

const titles: Record<string, string> = {
  '/': `${brand.name} — Professional Services`,
  '/about': `About | ${brand.name}`,
  '/blog': `Blog | ${brand.name}`,
  '/contact': `Contact | ${brand.name}`,
  '/cookie-policy': `Cookie policy | ${brand.name}`,
  '/privacy-policy': `Privacy policy | ${brand.name}`,
  '/terms': `Terms & conditions | ${brand.name}`,
  '/login': `Log in | ${brand.name}`,
  '/signup': `Sign up | ${brand.name}`,
  '/profile': `Profile | ${brand.name}`,
  '/auth/callback': `Confirm email | ${brand.name}`,
  '/auth/reset-password': `Reset password | ${brand.name}`,
  '/404': `Page not found | ${brand.name}`,
}

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    const serviceMatch = location.pathname.match(/^\/services\/([^/]+)/)
    if (serviceMatch) {
      const service = getService(serviceMatch[1])
      document.title = service
        ? `${service.navLabel} | ${brand.name}`
        : `Services | ${brand.name}`
      return
    }

    const blogMatch = location.pathname.match(/^\/blog\/([^/]+)/)
    if (blogMatch) {
      const post = getPost(blogMatch[1])
      document.title = post
        ? `${post.title} | ${brand.name}`
        : `Blog | ${brand.name}`
      return
    }

    if (titles[location.pathname]) {
      document.title = titles[location.pathname]
      return
    }

    // Unknown routes render the custom 404 page.
    if (
      !location.pathname.startsWith('/services/') &&
      !location.pathname.startsWith('/blog/')
    ) {
      document.title = `Page not found | ${brand.name}`
      return
    }

    document.title = `${brand.name}`
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
