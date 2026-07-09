import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Renamed display labels — the user-facing strings for every task. The
  underlying task keys (`article`, `listing`, …) and route paths stay
  unchanged; this is a display-label rename only.
*/
export const taskDisplayLabels: Record<TaskKey, { singular: string; plural: string }> = {
  article: { singular: 'Story', plural: 'Stories & Guides' },
  listing: { singular: 'Place', plural: 'Local Directory' },
  classified: { singular: 'Notice', plural: 'Notice board' },
  image: { singular: 'Frame', plural: 'Visual feed' },
  sbm: { singular: 'Bookmark', plural: 'Saved shelf' },
  pdf: { singular: 'Document', plural: 'Document library' },
  profile: { singular: 'Profile', plural: 'Directory of people' },
}

export const taskDisplayLabel = (task: TaskKey, form: 'singular' | 'plural' = 'plural') =>
  taskDisplayLabels[task]?.[form] || taskDisplayLabels.article[form]

export const taskPageVoices = {
  article: {
    eyebrow: 'Stories & Guides',
    headline: 'Field notes, long-reads and guides worth the time.',
    description:
      'A quieter reading desk for essays, walkthroughs and reference pieces. Skim the shelf or settle in — the pacing is unhurried on purpose.',
    filterLabel: 'Choose a topic',
    secondaryNote: 'Reading surfaces need space, hierarchy and fewer distractions.',
    chips: ['Editorial pacing', 'Topic filters', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Notice board',
    headline: 'Fast-moving offers, notices and time-sensitive posts.',
    description: 'Scan quickly, act quickly. This is the shelf for anything that moves — with the essentials on top.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize urgency, short summaries and direct browsing.',
    chips: ['Fast scan', 'Offers', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Saved shelf',
    headline: 'A quiet shelf of resources worth keeping.',
    description: 'Bookmarks arranged like a real library — tools, references and collections we found useful and thought you might too.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Curated resources need grouping and calm metadata.',
    chips: ['Collections', 'Resources', 'Reference flow'],
  },
  profile: {
    eyebrow: 'Directory of people',
    headline: 'Independent operators, studios and creators.',
    description: 'Profile pages built around identity and credibility — the humans and small teams behind the places and stories on the site.',
    filterLabel: 'Filter category',
    secondaryNote: 'Identity and credibility should read before the grid begins.',
    chips: ['Identity first', 'Trust cues', 'Studio-style cards'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Downloadable guides, reports and reference material.',
    description: 'A quiet stack of documents, indexed and previewable. Read in the panel or take a copy for the road.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Documents need archive cues, file context and clear browsing.',
    chips: ['Documents', 'Guides', 'Archive ready'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'Independent places worth knowing, in one calm directory.',
    description:
      'A clean, no-noise directory of studios, workshops and small businesses — with the contact details, hours and location you actually need on the card.',
    filterLabel: 'Filter category',
    secondaryNote: 'Prioritize comparison, location and direct action paths.',
    chips: ['Directory', 'Compare', 'Studio discovery'],
  },
  image: {
    eyebrow: 'Visual feed',
    headline: 'A gallery-first browsing rhythm.',
    description: 'Frames and photo essays laid out at the pace they were shot. Longer form pieces linger; quicker ones move.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let images carry the page before long text does.',
    chips: ['Gallery', 'Visual-first', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
