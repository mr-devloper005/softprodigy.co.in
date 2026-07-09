import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Vantis-inspired studio surfaces.

  Every task surface shares one visual language (monochrome ink-on-paper,
  hairline liners, pill CTAs, Manrope). Only kicker/note copy varies per
  task so each section keeps a little voice. Tokens delivered as `--tk-*`
  CSS vars so downstream components stay style-agnostic.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const STUDIO_FONT = "'Manrope', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: STUDIO_FONT,
  fontBody: STUDIO_FONT,
  bg: '#f5f5f3',
  surface: '#ffffff',
  raised: '#efefec',
  text: '#0a0a0a',
  muted: '#5a5a58',
  line: '#d9d9d5',
  accent: '#0a0a0a',
  accentSoft: '#e6e6e2',
  onAccent: '#f5f5f3',
  glow: 'rgba(10,10,10,0.04)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

// Kickers + notes rewritten for the renamed pair:
//   listing → "Local Directory"
//   article → "Stories & Guides"
export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Stories & Guides',
    note: 'Long-reads, guides and field notes worth the time it takes to read them.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Independent places, studios and workshops — vetted, listed, and easy to reach.',
  },
  classified: {
    ...base,
    kicker: 'Notice board',
    note: 'Fresh offers and time-sensitive posts, ready to act on.',
  },
  image: {
    ...base,
    kicker: 'Visual feed',
    note: 'A gallery of standout images and photo essays.',
  },
  sbm: {
    ...base,
    kicker: 'Saved shelf',
    note: 'Curated resources and links worth keeping.',
  },
  pdf: {
    ...base,
    kicker: 'Document library',
    note: 'Downloadable guides, reports and reference material.',
  },
  profile: {
    ...base,
    kicker: 'Directory of people',
    note: 'Discover creators, studios and independent operators.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
