export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  imageAlt: string
  body: string[]
}

export const blogIntro = {
  title: 'Insights from Binexe',
  lead: 'Latest perspective on residency and citizenship, company structuring, licensing and tax — written for decision-makers.',
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'what-is-an-offshore-company',
    title: 'What is an offshore company?',
    excerpt:
      'A clear primer on offshore entities: when they make sense, what “offshore” actually means, and the practical steps before you incorporate.',
    date: '2025-11-12',
    category: 'Company formations',
    image: '/blog-corporate.jpg',
    imageAlt: 'Professional reviewing corporate documents at a desk',
    body: [
      'An offshore company is simply a company registered outside the country where its owners live or do most of their business. The label is geographic — not a synonym for secrecy or non-compliance.',
      'Businesses use offshore structures for international contracting, holding intellectual property, separating operating risk, or aligning with a jurisdiction that fits their banking and administrative needs.',
      'Before incorporating, map the purpose, tax residency of the owners, banking requirements and ongoing filing duties. Binexe helps clients choose jurisdictions that stay usable in practice — not only attractive on paper.',
    ],
  },
  {
    slug: 'residency-or-citizenship-by-investment',
    title: 'Residency or citizenship by investment?',
    excerpt:
      'Know what each pathway offers before you decide — timelines, mobility, family coverage and long-term planning differ more than marketing suggests.',
    date: '2025-10-28',
    category: 'Citizenship & residency',
    image: '/blog-travel.jpg',
    imageAlt: 'Airplane wing above clouds during international travel',
    body: [
      'Residency by investment usually grants the right to live in a country, often with Schengen or regional travel benefits, while citizenship programmes deliver a second passport and broader political membership.',
      'The right choice depends on lifestyle goals, tax planning, education plans for children and how quickly you need a result. Thresholds and processing times vary widely by programme.',
      'We shortlist options against your priorities first — then guide documentation and application sequencing so expectations stay grounded.',
    ],
  },
  {
    slug: 'crypto-and-investment-migration',
    title: 'Crypto wealth and second citizenship planning',
    excerpt:
      'As digital-asset holders look for jurisdictional clarity, investment migration is increasingly part of broader tax and mobility planning.',
    date: '2025-10-04',
    category: 'Citizenship & residency',
    image: '/blog-crypto.jpg',
    imageAlt: 'Modern candlestick chart on a digital trading screen',
    body: [
      'Crypto-native wealth creates familiar needs: banking access, travel freedom and a coherent tax residency story. Second residency or citizenship can be one tool in that toolkit — never a shortcut around compliance.',
      'Programme rules, source-of-funds evidence and valuation of digital assets require careful preparation. Early briefing avoids stalled applications later.',
      'Binexe coordinates migration options with tax and structuring advice so the overall plan remains coherent.',
    ],
  },
  {
    slug: 'emi-vs-psp-whats-the-difference',
    title: 'EMI vs PSP — what is the difference?',
    excerpt:
      'Electronic money institutions and payment service providers sit in related but distinct regulatory lanes. Choosing the wrong path costs time.',
    date: '2025-09-18',
    category: 'Licensing',
    image: '/blog-licensing.jpg',
    imageAlt: 'Contactless payment at a modern POS terminal',
    body: [
      'A payment service provider (PSP) typically enables payment execution and related services under a payments licence. An electronic money institution (EMI) can issue electronic money and often sits under a heavier prudential and safeguarding framework.',
      'Product design, safeguarding model, target markets and capital requirements should drive the licence path — not competitor marketing slides.',
      'Our licensing team helps fintech founders map the operating model to the correct authorisation before documentation begins.',
    ],
  },
  {
    slug: 'portugal-golden-visa-changes',
    title: 'Changes to Portugal’s Golden Visa pathway',
    excerpt:
      'Programme adjustments reshaped popular investment routes. Here is how to read the changes without the noise.',
    date: '2025-08-30',
    category: 'Citizenship & residency',
    image: '/blog-lisbon.jpg',
    imageAlt: 'Yellow tram on a sunlit street near Praça do Comércio in Lisbon',
    body: [
      'Portugal’s Golden Visa has been among the most discussed European residency-by-investment options. Rule changes over recent years have shifted emphasis away from certain real-estate routes toward other qualifying investments.',
      'Applicants should verify current eligible categories, minimums and processing expectations with up-to-date advice — archived articles and social posts go stale quickly.',
      'If Portugal remains on your shortlist, we compare it against other European residency options using today’s rules, not last year’s headlines.',
    ],
  },
  {
    slug: 'tax-efficient-business-basics',
    title: 'Making a business tax-efficient — the basics',
    excerpt:
      'Useful management information and proportionate tax planning beat complex structures that nobody can operate.',
    date: '2025-08-09',
    category: 'Tax & accounting',
    image: '/blog-tax.jpg',
    imageAlt: 'Calculator and financial paperwork on a wooden desk',
    body: [
      'Tax efficiency starts with clarity: where the company is resident, where value is created, and which filings keep the house in order.',
      'Cross-border structures only help when banking, substance and reporting can keep up. Otherwise they become expensive friction.',
      'Binexe tax and accounting support focuses on timely numbers and plans that leadership can actually run.',
    ],
  },
]

export const getPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug)
