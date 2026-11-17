type PageHeroProps = {
  eyebrow?: string
  title: string
  lead: string
}

export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero__inner">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="lede">{lead}</p>
      </div>
    </section>
  )
}
