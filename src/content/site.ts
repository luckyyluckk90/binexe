export type ServiceSlug =
  | 'company-formations'
  | 'citizenship-residency'
  | 'human-resources'
  | 'tax-accounting'
  | 'licensing'

export type Service = {
  slug: ServiceSlug
  navLabel: string
  title: string
  eyebrow: string
  summary: string
  lead: string
  body: string[]
  points: string[]
  cta: string
}

export const brand = {
  name: 'Binexe',
  domain: 'binexe.com',
  email: 'hello@binexe.com',
  tagline: 'Professional services for companies and private clients.',
}

export const legalEntity = {
  name: 'BX MANAGED SERVICES LIMITED',
  number: '17585013',
  registeredOffice: 'Flat 6, 50 Britannia Street, London, England, WC1X 9JH',
  status: 'Active',
  incorporatedOn: '17 November 2026',
  companiesHouseUrl:
    'https://find-and-update.company-information.service.gov.uk/company/17585013',
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/about#services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
] as const

export const services: Service[] = [
  {
    slug: 'company-formations',
    navLabel: 'Company Formations',
    title: 'Company formations worldwide',
    eyebrow: 'Corporate structuring',
    summary:
      'Onshore and offshore company setup with practical support from registration through ongoing administration.',
    lead: 'We make it straightforward to establish a company in the jurisdiction that fits your plans.',
    body: [
      'Whether you need a clean personal-services vehicle or a more complex international structure, our consultants guide formation end to end.',
      'We advise on directors and shareholders, registered addresses, banking introductions, and the administrative steps that keep a new entity usable from day one.',
    ],
    points: [
      'Onshore and offshore company registration',
      'Director, shareholder and registered-office support',
      'Banking and operational setup guidance',
      'Annual renewals and ongoing company management',
    ],
    cta: 'Discuss a formation',
  },
  {
    slug: 'citizenship-residency',
    navLabel: 'Citizenship & Residency',
    title: 'Citizenship and residency by investment',
    eyebrow: 'Investment migration',
    summary:
      'Carefully selected residency and citizenship programmes aligned to lifestyle, mobility, legal protection and tax considerations.',
    lead: 'We help individuals and families evaluate programmes that match their immigration and long-term planning goals.',
    body: [
      'Many jurisdictions offer residency or citizenship by investment. Binexe focuses on a curated set of options so advice stays clear, comparable and practical.',
      'From first briefing through application preparation, we keep requirements, timelines and investment thresholds transparent.',
    ],
    points: [
      'Residency programmes across leading European options',
      'Citizenship by investment programme comparison',
      'Document preparation and process coordination',
      'Planning that considers travel freedom and family needs',
    ],
    cta: 'Request a private briefing',
  },
  {
    slug: 'human-resources',
    navLabel: 'Human Resources',
    title: 'HR and recruitment',
    eyebrow: 'People & talent',
    summary:
      'Recruitment and HR support for growing teams — from specialist hires to leadership appointments.',
    lead: 'We source talent at every level, from early-career roles to senior leadership.',
    body: [
      'Our London-based HR and recruitment practice supports employers that need dependable shortlists and candidates who want a clear, respectful process.',
      'We take time to understand culture, role requirements and career goals before introducing people — so placements are considered, not transactional.',
    ],
    points: [
      'Permanent and contract recruitment',
      'Specialist search across IT, sales, legal and finance',
      'HR compliance and expansion support',
      'Candidate guidance from application to placement',
    ],
    cta: 'Talk about hiring needs',
  },
  {
    slug: 'tax-accounting',
    navLabel: 'Tax & Accounting',
    title: 'Tax and accounting',
    eyebrow: 'Advisory & compliance',
    summary:
      'Business and personal tax planning with accounting and compliance support that keeps decisions grounded in clear numbers.',
    lead: 'We help make structures tax-efficient while delivering timely information you can actually run a business on.',
    body: [
      'Our accountancy and tax services cover planning through execution for companies and private clients.',
      'The aim is simple: useful management information, careful compliance, and advice that stays proportionate to your situation.',
    ],
    points: [
      'Tax planning for businesses and individuals',
      'Cross-border and offshore tax strategy support',
      'Audit, accounting and statutory compliance',
      'Advisory on financing, investment and profit distribution',
    ],
    cta: 'Speak with tax advisory',
  },
  {
    slug: 'licensing',
    navLabel: 'Licensing',
    title: 'Fintech and gaming licensing',
    eyebrow: 'Regulated industries',
    summary:
      'Regulatory licensing support for fintech, banking, crypto and gaming businesses entering or expanding across jurisdictions.',
    lead: 'Deep sector experience for licensed and regulated industries.',
    body: [
      'If you are establishing or expanding in fintech, banking, crypto or gaming, our licensing specialists help pursue the authorisations your model requires.',
      'We also support ongoing compliance so regulated operations remain orderly after the licence is granted.',
    ],
    points: [
      'Banking and payments licence pathways',
      'Business and gaming licence support',
      'Multi-jurisdiction regulatory guidance',
      'Compliance as a continuing service',
    ],
    cta: 'Start a licensing enquiry',
  },
]

export const getService = (slug: string) =>
  services.find((service) => service.slug === slug)

export const sectors = [
  {
    title: 'IT',
    text: 'Connecting capable technology professionals with companies that need dependable delivery.',
  },
  {
    title: 'Sales',
    text: 'Introducing commercial talent to teams that value performance, clarity and culture fit.',
  },
  {
    title: 'Legal',
    text: 'Supporting legal hiring with careful matching for both employers and candidates.',
  },
]

export const residencyPrograms = [
  {
    name: 'Greece',
    detail:
      'Golden Visa property route: from €400,000 outside prime zones, or €800,000 in Attica, Thessaloniki, Mykonos, Santorini and larger islands. Selected conversion/restoration routes from €250,000. Typical processing about 2–4 months after a complete file. Schengen mobility.',
  },
  {
    name: 'Portugal',
    detail:
      'ARI / Golden Visa (real estate closed): fund subscriptions from €500,000, or cultural/heritage support from €250,000 (€200,000 in eligible low-density areas). Current files often take 12–24+ months. Schengen mobility.',
  },
  {
    name: 'Malta',
    detail:
      'MPRP: government administration, contribution and donation about €99,000 for the main applicant, plus property purchase from €375,000 or qualifying rent from €14,000 a year (held for five years). Typical processing about 4–8 months. Schengen mobility.',
  },
]

export const citizenshipPrograms = [
  {
    name: 'Vanuatu',
    detail:
      'Development Support Programme commonly from about $130,000 for a single applicant. Passport timeline often around 1–2 months. Travel access is more limited than Caribbean options after recent visa-policy changes.',
  },
  {
    name: 'Grenada',
    detail:
      'National Transformation Fund from about $235,000 for the applicant and up to three dependants. Passport timeline often around 4–6 months.',
  },
  {
    name: 'Saint Kitts & Nevis',
    detail:
      'Sustainable Island State Contribution from about $250,000 for a family of up to four. Passport timeline often around 4–6 months.',
  },
  {
    name: 'Dominica',
    detail:
      'Economic Diversification Fund from about $200,000 for a single applicant, or about $250,000 covering up to three dependants. Passport timeline often around 4–6 months.',
  },
  {
    name: 'Türkiye',
    detail:
      'Real-estate route from $400,000 (three-year no-sale annotation). Other capital routes are commonly from $500,000. Citizenship timeline often around 3–6+ months after a complete file.',
  },
]

export const aboutContent = {
  title: 'Corporate services with careful execution',
  lead: 'From our advisory base we help companies and private clients get established, stay organised, and move with clarity.',
  paragraphs: [
    'Binexe provides tailored professional services so leadership teams and individuals can focus on the work that matters most.',
    'We specialise in company advice, formation and management, regulated licensing, human resources, tax and accounting, and selected investment-migration pathways.',
    'Although we work extensively with UK and international clients, meetings can be arranged in person or by video — whichever suits the engagement.',
  ],
  pillars: [
    {
      title: 'Company set-up',
      items: [
        'Registering a new company',
        'Appointing directors and shareholders',
        'Banking introductions and operational basics',
        'Domain and administrative launch support',
      ],
    },
    {
      title: 'Company management',
      items: [
        'Annual renewals',
        'Asset and registry housekeeping',
        'Virtual reception options',
        'Accounting coordination and agency transfer',
      ],
    },
    {
      title: 'Planning',
      items: [
        'Jurisdiction selection',
        'Tax planning',
        'Brand and structure alignment',
        'Growth, merger and exit support when needed',
      ],
    },
  ],
}

export const contactContent = {
  title: 'Make an enquiry',
  lead: 'Tell us what you need — company formation, licensing, HR, tax, or residency and citizenship planning. We respond with a clear next step.',
  interests: [
    'Company Formations',
    'Citizenship & Residency',
    'Human Resources',
    'Tax & Accounting',
    'Licensing',
    'General enquiry',
  ],
}
