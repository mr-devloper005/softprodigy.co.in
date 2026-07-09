import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent directory & editorial',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Directory & editorial',
    // The navbar no longer renders task-page redirect links; these entries
    // are retained only as generic references.
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Sign in', href: '/login' },
    },
  },
  footer: {
    tagline: 'Directory & editorial, on one calm surface.',
    description:
      'An independent directory of places worth knowing, paired with a slow-moving editorial shelf. No feed shouting, no infinite scroll — just what has actually been published.',
    ctaEyebrow: 'Publish with us',
    ctaTitle: 'Have a place, story or resource to add?',
    ctaBody: 'We accept quiet submissions on a rolling basis. Introduce yourself and the work, and we will get back.',
    ctaButton: { label: 'Get in touch', href: '/contact' },
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listing' },
          { label: 'Stories & Guides', href: '/article' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
          { label: 'Submit', href: '/create' },
        ],
      },
    ],
    social: [
      { label: 'Instagram', href: '#' },
      { label: 'X', href: '#' },
      { label: 'Newsletter', href: '/contact' },
    ],
    bottomNote: 'Independently run.',
  },
  commonLabels: {
    readMore: 'Read on',
    viewAll: 'See everything',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
