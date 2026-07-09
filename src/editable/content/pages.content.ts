import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A quiet directory & editorial platform',
      description:
        'An independent directory of places worth knowing, paired with a slow-moving editorial shelf of guides and long-reads.',
      openGraphTitle: 'Directory & editorial, on one calm surface',
      openGraphDescription:
        'Discover independent places, small studios and slow-form writing — all in one place, no shouting.',
      keywords: ['directory', 'editorial', 'long-form writing', 'local guides', 'independent places'],
    },
    hero: {
      badge: 'Directory & editorial',
      title: ['A directory of places', 'worth knowing — and the writing to match.'],
      description:
        'An independently maintained shelf of small studios, workshops and independent places, next to a quieter editorial column of guides and long-reads.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Read the shelf', href: '/article' },
      searchPlaceholder: 'Search places, guides, categories…',
      focusLabel: 'This week',
      featureCardBadge: 'On the shelf',
      featureCardTitle: 'The latest additions, curated by hand.',
      featureCardDescription:
        'Nothing here appears through an algorithm. Every place and every guide is added, edited, and shelved by a small team.',
    },
    intro: {
      badge: 'What this is',
      title: 'A quiet directory paired with a slower editorial column.',
      paragraphs: [
        'A single, well-kept shelf of independent places worth visiting, paired with a slow-moving editorial column of guides and long-reads.',
        'Curated by hand, shortlisted by editors, and shelved with intent — nothing here appears because it paid to.',
        'One team, one voice, on one calm surface.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Hand-picked directory of places worth knowing.',
        'A slower editorial column of guides and long-reads.',
        'One unified visual language across the site.',
        'Independently run.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listing' },
      secondaryLink: { label: 'Read the shelf', href: '/article' },
    },
    manifesto: {
      eyebrow: 'What this is',
      lines: [
        'We keep it quiet.',
        'We keep it useful.',
        'We keep it independent.',
      ],
      body: 'A single, well-kept shelf of independent places worth visiting and slow writing worth reading. Curated by hand. Updated with intent.',
    },
    services: {
      eyebrow: 'How we shelve it',
      title: 'Two shelves. One editorial hand.',
      items: [
        {
          number: '01',
          title: 'Local Directory',
          body: 'Independent studios, workshops and small businesses — with the phone, hours and address you actually need on the card.',
          href: '/listing',
        },
        {
          number: '02',
          title: 'Stories & Guides',
          body: 'Field notes, guides and long-reads written to be read once well, not scrolled past.',
          href: '/article',
        },
        {
          number: '03',
          title: 'Search & connect',
          body: 'Search across both shelves in one place, or write in with a place, story or resource we should add next.',
          href: '/search',
        },
      ],
    },
    statement: {
      eyebrow: 'The mood',
      linesA: ['Quiet.'],
      linesB: ['Considered.'],
      linesC: ['Independent.'],
    },
    testimonials: {
      eyebrow: 'Quiet endorsements',
      title: 'What people say about the shelf.',
      items: [
        {
          quote:
            'The pace is different here. The stories linger, and the directory only lists places I would actually send a friend to.',
          attribution: 'A reader, via email',
        },
        {
          quote:
            'Feels like a bookshop of the internet. Slow, tidy, and full of things worth picking up.',
          attribution: 'A subscriber, on the newsletter',
        },
      ],
    },
    faq: {
      eyebrow: 'Common questions',
      title: 'Small answers to small questions.',
      items: [
        {
          q: 'Who decides what gets listed?',
          a: 'A small editorial team. Places are shortlisted by hand and verified before publishing.',
        },
        {
          q: 'How often is the site updated?',
          a: 'New entries land on a rolling basis. There is no publishing calendar and no daily quota.',
        },
        {
          q: 'Can I submit a place or a story?',
          a: 'Yes, please. Send a note through the contact page with a link, address, or short pitch.',
        },
        {
          q: 'Is there a newsletter?',
          a: 'A quiet one. Introduce yourself through contact and we will get you on the list.',
        },
      ],
    },
    cta: {
      badge: 'Publish with us',
      title: 'A place, a story, or a resource to add?',
      description:
        'Introduce yourself and the work through a short note. Rolling submissions, no calendar, no template — just a real read.',
      primaryCta: { label: 'Get in touch', href: '/contact' },
      secondaryCta: { label: 'Start an account', href: '/signup' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Recently added to this shelf.',
    },
  },
  about: {
    badge: 'About',
    title: 'An independent shelf — quietly maintained.',
    description: `${slot4BrandConfig.siteName} is a small, hand-kept directory of independent places, paired with a slow-moving editorial column. It is run by one team, in one voice.`,
    paragraphs: [
      'We started this because most of what we love about the internet — small directories, honest reviews, considered writing — has been pushed off the front pages of the web. So we made a shelf of our own.',
      'The directory is added to by hand. The stories are written to be read, not scrolled. Everything on the site is here on purpose, and nothing here is here because it paid to be.',
    ],
    values: [
      {
        title: 'Kept by hand',
        description:
          'No algorithmic feed. Every place is shortlisted, verified and shelved by a person. Every story is edited before it lands.',
      },
      {
        title: 'One voice',
        description:
          'The directory and the writing share an editorial hand, so the site reads as one continuous thing instead of two disconnected products.',
      },
      {
        title: 'Slow on purpose',
        description:
          'There is no publishing quota and no daily deadline. Fewer, better entries. That is the whole model.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A short form, read by a real person.',
    description:
      'Introduce yourself and the reason for the note. Submissions, corrections, partnerships and quiet questions all land in the same inbox.',
    formTitle: 'Write in',
  },
  search: {
    metadata: {
      title: 'Search the shelf',
      description: 'Search across the directory and the editorial column in one place.',
    },
    hero: {
      badge: 'Search the shelf',
      title: 'Look up places, guides and everything in between.',
      description:
        'Type what you are looking for. Results span the directory, the editorial column and everything else on the shelf.',
      placeholder: 'Search places, guides, keywords…',
    },
    resultsTitle: 'Recently on the shelf',
  },
  create: {
    metadata: {
      title: 'Submit to the shelf',
      description: 'Draft a new entry for the site — a place, a story, or a resource.',
    },
    locked: {
      badge: 'Contributors only',
      title: 'Sign in to draft an entry.',
      description:
        'The submission workspace opens after you sign in. Start an account in a minute and pick up where you left off.',
    },
    hero: {
      badge: 'Contributor workspace',
      title: 'Draft an entry for the shelf.',
      description:
        'Pick a shelf, add the essentials and save. Nothing is published automatically — the editorial team reads every draft first.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Save draft',
    successTitle: 'Draft saved. We will read it soon.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Members',
      title: 'Welcome back.',
      description: 'Sign in to pick up a draft, follow a comment thread or submit a new entry to the shelf.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'We could not find an account with those details. Start a new one and try again.',
      success: 'Signed in. One moment…',
      createCta: 'Start an account',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'New here',
      title: 'Start an account in a minute.',
      description:
        'An account lets you submit entries, save drafts and follow the comment thread on any guide.',
      formTitle: 'Start an account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least four characters for the password.',
      success: 'Account created. One moment…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the shelf',
      fallbackTitle: 'Story',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More frames',
      fallbackTitle: 'Frame',
    },
    profile: {
      relatedTitle: 'More profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
