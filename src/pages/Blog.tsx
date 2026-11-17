import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { blogIntro, blogPosts } from '../content/blog'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function Blog() {
  const [featured, ...rest] = blogPosts

  return (
    <>
      <PageHero eyebrow="Blog" title={blogIntro.title} lead={blogIntro.lead} />

      <section className="section section--paper">
        <div className="wrap">
          <Link to={`/blog/${featured.slug}`} className="blog-featured">
            <div className="blog-featured__media">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                width={1400}
                height={900}
              />
            </div>
            <div className="blog-featured__copy">
              <p className="eyebrow">{featured.category}</p>
              <h2>{featured.title}</h2>
              <p className="lede">{featured.excerpt}</p>
              <p className="blog-meta">{formatDate(featured.date)}</p>
              <span className="service-row__link">Read article</span>
            </div>
          </Link>

          <div className="blog-grid">
            {rest.map((post) => (
              <article key={post.slug} className="blog-card">
                <Link to={`/blog/${post.slug}`} className="blog-card__media">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    width={1400}
                    height={900}
                    loading="lazy"
                  />
                </Link>
                <div className="blog-card__body">
                  <p className="eyebrow">{post.category}</p>
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <p className="blog-meta">{formatDate(post.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
