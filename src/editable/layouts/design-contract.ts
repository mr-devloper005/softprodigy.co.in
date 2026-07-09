import type { CSSProperties } from 'react'

/*
  Vantis-inspired studio contract. Every downstream component consumes CSS
  variables from `editableRootStyle` — no hardcoded colors in JSX. The visual
  language is: off-white paper, near-black ink, hairline liners, pill CTAs,
  16px card radii, generous section rhythm.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f5f5f3',
  '--slot4-page-text': '#0a0a0a',
  '--slot4-panel-bg': '#efefec',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#5a5a58',
  '--slot4-soft-muted-text': '#8a8a86',
  '--slot4-accent': '#0a0a0a',
  '--slot4-accent-fill': '#0a0a0a',
  '--slot4-accent-soft': '#e6e6e2',
  '--slot4-on-accent': '#f5f5f3',
  '--slot4-dark-bg': '#0a0a0a',
  '--slot4-dark-text': '#f5f5f3',
  '--slot4-media-bg': '#e6e6e2',
  '--slot4-cream': '#faf9f7',
  '--slot4-warm': '#efefec',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#efefec',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f5f5f3',
  '--editable-page-text': '#0a0a0a',
  '--editable-container': '1280px',
  '--editable-border': '#d9d9d5',
  '--editable-liner-dark': '#242424',
  '--editable-nav-bg': 'rgba(245,245,243,0.85)',
  '--editable-nav-text': '#0a0a0a',
  '--editable-nav-active': '#0a0a0a',
  '--editable-nav-active-text': '#f5f5f3',
  '--editable-cta-bg': '#0a0a0a',
  '--editable-cta-text': '#f5f5f3',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0a0a0a',
  '--editable-footer-text': '#f5f5f3',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-soft-muted-text)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-[0_1px_0_rgba(0,0,0,0.04)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0)_40%,rgba(0,0,0,0.75)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
    sectionYLg: 'py-24 sm:py-32 lg:py-40',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    // Small caps label with 0.14em tracking — the reference's eyebrow signature.
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    // Massive display headline — reference h1 hits 120px on desktop. Scaled here.
    heroTitle: 'text-[3.25rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]',
    sectionTitle: 'text-4xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[3.75rem]',
    subTitle: 'text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl',
    body: 'text-base leading-[1.7]',
    emphasis: 'text-lg leading-[1.55] tracking-[-0.005em] sm:text-xl',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-2xl border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText}`,
    flat: `rounded-2xl ${editablePalette.surfaceBg}`,
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-xs font-medium text-[var(--slot4-page-text)]',
    accentPill: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-1.5 text-xs font-medium text-[var(--slot4-page-bg)]',
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium tracking-[0.01em] text-[var(--slot4-page-bg)] transition-all duration-500 hover:bg-transparent hover:text-[var(--slot4-page-text)] hover:shadow-[inset_0_0_0_1px_var(--slot4-page-text)]`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-transparent px-7 py-3.5 text-sm font-medium tracking-[0.01em] text-[var(--slot4-page-text)] transition-all duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] hover:border-[var(--slot4-page-text)]`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium tracking-[0.01em] text-[var(--slot4-page-bg)] transition-all duration-500 hover:opacity-90`,
    ghost: `inline-flex items-center justify-center gap-2 text-sm font-medium tracking-[0.01em] text-[var(--slot4-page-text)] transition-opacity duration-300 hover:opacity-60`,
    onDark: `inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-7 py-3.5 text-sm font-medium tracking-[0.01em] text-[var(--slot4-page-text)] transition-all duration-500 hover:bg-transparent hover:text-[var(--slot4-page-bg)] hover:shadow-[inset_0_0_0_1px_var(--slot4-page-bg)]`,
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    ratioHero: 'aspect-[16/9]',
    ratioSquare: 'aspect-square',
    ratioLandscape: 'aspect-[3/2]',
  },
  motion: {
    // Card hover: image-zoom (not translate) — the reference's signature.
    lift: 'transition-transform duration-[800ms] group-hover:scale-[1.03]',
    fade: 'transition-opacity duration-500 hover:opacity-70',
    zoom: 'transition-transform duration-[900ms] group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'All colors, fonts, radii and container widths live in editableRootStyle; never hardcode them inside JSX.',
  'Buttons are pill-shaped (rounded-full). Cards use rounded-2xl (16px) with hairline liners.',
  'Section rhythm is generous: dc.shell.sectionY = py-32 desktop. Do not compress.',
  'Card hover is image-zoom (dc.motion.lift/zoom) — no translate lifts.',
  'Wrap section headers and grid items in EditableReveal with index={i} for stagger.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
