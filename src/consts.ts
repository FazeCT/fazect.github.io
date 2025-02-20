export type Site = {
  TITLE: string
  DESCRIPTION: string
  EMAIL: string
  NUM_POSTS_ON_HOMEPAGE: number
  POSTS_PER_PAGE: number
  SITEURL: string
}

export type Link = {
  href: string
  label: string
}

export const SITE: Site = {
  TITLE: 'FazeCT',
  DESCRIPTION:
    '食べて、寝て、Reverse、繰り返す',
  EMAIL: 'ctffazect@gmail.com',
  NUM_POSTS_ON_HOMEPAGE: 3,
  POSTS_PER_PAGE: 5,
  SITEURL: 'https://fazect.github.io',
}

export const NAV_LINKS: Link[] = [
  { href: '/blog', label: 'blog' },
  { href: '/authors', label: 'authors' },
  { href: '/about', label: 'about' },
  { href: '/tags', label: 'tags' },
]

export const SOCIAL_LINKS: Link[] = [
  { href: 'https://github.com/FazeCT', label: 'GitHub' },
  { href: 'https://x.com/fazect1512', label: 'Twitter' },
  { href: 'ctffazect@gmail.com', label: 'Email' },
  { href: '/rss.xml', label: 'RSS' },
]
