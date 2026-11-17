import { Link, Navigate, useParams } from 'react-router-dom'
import { CtaBand } from '../components/CtaBand'
import { getPost, blogPosts } from '../content/blog'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function BlogPost() {
  const { slug = '' } = useParams()
  const post = getPost(slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero__inner" style={{ maxWidth: '46rem' }}>
          <p className="eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="blog-meta">{formatDate(post.date)}</p>
          <p className="lede">{post.excerpt}</p>
        </div>
      </section>

      <section className="section section--paper">
        <div className="wrap blog-article">
          <div className="blog-article__media">
            <img
              src={post.image}
              alt={post.imageAlt}
              width={1400}
              height={900}
            />
          </div>
          <div className="prose">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <Link className="btn btn--ghost" to="/blog">
              Back to blog
            </Link>
            <Link className="btn btn--primary" to="/contact">
              Talk to Binexe
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">More insights</p>
            <h2>Continue reading</h2>
          </div>
          <div className="blog-grid">
            {related.map((item) => (
              <article key={item.slug} className="blog-card">
                <Link to={`/blog/${item.slug}`} className="blog-card__media">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    width={1400}
                    height={900}
                    loading="lazy"
                  />
                </Link>
                <div className="blog-card__body">
                  <p className="eyebrow">{item.category}</p>
                  <h3>
                    <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="blog-meta">{formatDate(item.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        tone="ink"
        title="Need advice on this topic?"
        text="Share your objective and we will outline the practical next step."
        actionLabel="Contact us"
      />
    </>
  )
}
