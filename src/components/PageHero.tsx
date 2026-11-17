type PageHeroProps = {
  eyebrow?: string
  title: string
  lead: string
  tone?: 'default' | 'blog'
}

export function PageHero({
  eyebrow,
  title,
  lead,
  tone = 'default',
}: PageHeroProps) {
  return (
    <section
      className={
        tone === 'blog' ? 'page-hero page-hero--blog' : 'page-hero'
      }
    >
      <div className="wrap page-hero__inner">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="lede">{lead}</p>
      </div>
    </section>
  )
}
