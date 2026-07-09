import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Camera,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Navigation2,
  Phone,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { taskDisplayLabel } from '@/editable/content/task-pages.content'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>,
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------- helpers ------------------------------- */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? (content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) as string[])
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return (
    asText(content.body) ||
    asText(content.description) ||
    asText(content.details) ||
    post.summary ||
    'Details will appear here once available.'
  )
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) =>
      `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`,
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) =>
      `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`,
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}

const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const readingTime = (post: SitePost) => {
  const words = stripHtml(`${getBody(post)} ${summaryText(post)}`).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

const extractSections = (post: SitePost): string[] => {
  const body = getBody(post)
  const sections: string[] = []
  const re = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(body)) && sections.length < 8) {
    const text = stripHtml(match[1])
    if (text) sections.push(text)
  }
  return sections
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const authorOf = (post: SitePost) => getField(post, ['author', 'byline', 'writer']) || SITE_CONFIG.name

const authorBioOf = (post: SitePost) =>
  getField(post, ['authorBio', 'bio', 'byLineBio']) ||
  'Editorial team behind the shelf. Independent, hand-kept, unhurried.'

/* -------------------------------- Router ------------------------------- */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* --------------------------- Shared building blocks ------------------- */

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="editable-link inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {taskDisplayLabel(task).toLowerCase()}
    </Link>
  )
}

function Chip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
        dark ? 'border-white/25 text-white/80' : 'border-[var(--tk-line)] text-[var(--tk-muted)]'
      }`}
    >
      {children}
    </span>
  )
}

function TagChips({ post, title = 'Tagged' }: { post: SitePost; title?: string }) {
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 12) : []
  if (!tags.length) return null
  return (
    <div className="mt-12 border-t border-[var(--tk-line)] pt-8">
      <p className="editable-kicker text-[var(--tk-muted)]">{title}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-[var(--tk-line)] px-4 py-1.5 text-xs font-medium text-[var(--tk-muted)] transition hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function TrustPanel({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
      <p className="editable-kicker text-[var(--tk-muted)]">Verified</p>
      <ul className="mt-5 space-y-4">
        {items.map(([label, note]) => (
          <li key={label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--tk-text)] text-[var(--tk-on-accent)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--tk-text)]">{label}</p>
              <p className="text-xs leading-6 text-[var(--tk-muted)]">{note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--tk-line)] text-[var(--tk-text)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="editable-kicker text-[var(--tk-muted)]">{label}</p>
        <p className="mt-1 break-words text-sm font-medium leading-[1.6] text-[var(--tk-text)]">{value}</p>
      </div>
    </div>
  )
  if (!href) return inner
  return (
    <Link href={href} className="group block transition hover:opacity-70">
      {inner}
    </Link>
  )
}

function BodyContent({
  post,
  compact = false,
  dropCap = false,
}: {
  post: SitePost
  compact?: boolean
  dropCap?: boolean
}) {
  const dropCapClasses = dropCap
    ? "[&_p:first-of-type::first-letter]:mr-3 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:font-semibold [&_p:first-of-type::first-letter]:text-[5.5rem] [&_p:first-of-type::first-letter]:leading-[0.85] [&_p:first-of-type::first-letter]:tracking-[-0.04em]"
    : ''
  return (
    <div
      className={`article-content max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-[1.7]' : 'text-[17px] leading-[1.8] sm:text-[18px]'
      } ${dropCapClasses}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function _MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 border-b border-[var(--tk-line)] p-5 text-sm font-semibold">
        <MapPin className="h-4 w-4" /> {label || 'Location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

/* ============================ LISTING DETAIL =========================== */
/*
  Layout: "Studio dossier"
    1. Asymmetric editorial cover (left text column, right portrait hero)
    2. Sticky action dock rail (Call · Directions · Email · Website)
    3. Two-column body: main (Quick facts → About → Amenities → Bento
       gallery → Map + address) with sticky sidebar (Spec sheet → Contact
       card → Trust panel → Ads sidebar).
    4. Related directory strip.
*/

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const neighborhood = getField(post, ['neighborhood', 'area', 'district'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'opening', 'timings']) || 'By appointment'
  const founded = getField(post, ['founded', 'established', 'since'])
  const priceRange = getField(post, ['priceRange', 'price', 'costRange'])
  const category = categoryOf(post, taskDisplayLabel('listing', 'singular'))
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean).slice(0, 12) : []
  const directionsHref = address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
    : ''

  const specItems: Array<[string, string]> = [
    ['Hours', hours],
    ['Category', category],
    ['Neighborhood', neighborhood],
    ['Founded', founded],
    ['Price range', priceRange],
  ].filter(([, v]) => v) as Array<[string, string]>

  return (
    <>
      {/* 1. Editorial cover — asymmetric split */}
      <section className="border-b border-[var(--tk-line)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-5 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-24">
          <BackLink task="listing" />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Chip>{taskDisplayLabel('listing', 'singular')}</Chip>
                {category ? <Chip>{category}</Chip> : null}
                {neighborhood ? <Chip>{neighborhood}</Chip> : null}
              </div>

              <h1 className="editable-display mt-8 text-balance text-[3rem] font-semibold leading-[1] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]">
                {post.title}
              </h1>

              {lead ? (
                <p className="mt-8 max-w-xl text-xl leading-[1.55] text-[var(--tk-muted)] sm:text-2xl">{lead}</p>
              ) : null}

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[var(--tk-line)] pt-8">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-text)]">
                  <CheckCircle2 className="h-4 w-4" /> Verified entry
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--tk-text)]">
                  <Sparkles className="h-4 w-4" /> Independently listed
                </span>
                {address ? (
                  <span className="inline-flex items-center gap-2 text-sm text-[var(--tk-muted)]">
                    <MapPin className="h-4 w-4" /> {address}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[var(--tk-raised)] aspect-[4/5] lg:aspect-[4/5]">
              {hero ? (
                <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <MapPin className="h-16 w-16 text-[var(--tk-muted)]" />
                </div>
              )}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
                <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">Studio dossier</span>
                {founded ? <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur-sm">Est. {founded}</span> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sticky action dock */}
      <section className="sticky top-[76px] z-30 border-b border-[var(--tk-line)] bg-[var(--tk-bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[var(--editable-container)] items-center gap-3 overflow-x-auto px-5 py-3 sm:px-8 lg:px-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <p className="mr-3 hidden shrink-0 text-sm font-semibold tracking-[-0.01em] text-[var(--tk-text)] lg:block">
            {post.title}
          </p>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <ActionDockButton icon={Phone} label="Call" href={phone ? `tel:${phone}` : ''} />
            <ActionDockButton icon={Navigation2} label="Directions" href={directionsHref} />
            <ActionDockButton icon={Mail} label="Email" href={email ? `mailto:${email}` : ''} />
            <ActionDockButton icon={Globe2} label="Website" href={website} primary />
          </div>
        </div>
      </section>

      {/* 3. Main + sidebar */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="min-w-0">
            {/* Quick-facts strip */}
            <div className="grid grid-cols-2 divide-x divide-[var(--tk-line)] border-y border-[var(--tk-line)] sm:grid-cols-4">
              {[
                ['Location', address || '—'],
                ['Phone', phone || '—'],
                ['Hours', hours],
                ['Category', category],
              ].map(([label, value]) => (
                <div key={label} className="px-5 py-6 first:pl-0 sm:px-6">
                  <p className="editable-kicker text-[var(--tk-muted)]">{label}</p>
                  <p className="mt-3 line-clamp-2 text-sm font-medium leading-[1.5] text-[var(--tk-text)]">{value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="mt-16">
              <p className="editable-kicker text-[var(--tk-muted)]">About the studio</p>
              <h2 className="editable-display mt-6 text-3xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-4xl">
                A closer look at {post.title}.
              </h2>
              <div className="mt-8">
                <BodyContent post={post} />
              </div>
            </div>

            {/* Amenities / features chip cloud */}
            {tags.length ? (
              <div className="mt-16 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8">
                <p className="editable-kicker text-[var(--tk-muted)]">Amenities & signals</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-raised)] px-4 py-2 text-sm font-medium text-[var(--tk-text)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--tk-text)]" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Bento gallery — one large + five small */}
            {gallery.length ? (
              <div className="mt-16">
                <p className="editable-kicker text-[var(--tk-muted)]">Inside the space</p>
                <BentoGallery images={gallery} />
              </div>
            ) : null}

            {/* Location strip */}
            {(mapSrc || address) ? (
              <div className="mt-16">
                <p className="editable-kicker text-[var(--tk-muted)]">Where to find it</p>
                <div className="mt-6 grid gap-6 overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] lg:grid-cols-[minmax(0,1fr)_320px]">
                  {mapSrc ? (
                    <iframe
                      src={mapSrc}
                      title="Map"
                      loading="lazy"
                      className="min-h-[320px] w-full border-0 lg:border-r lg:border-[var(--tk-line)]"
                    />
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center bg-[var(--tk-raised)]">
                      <MapPin className="h-10 w-10 text-[var(--tk-muted)]" />
                    </div>
                  )}
                  <div className="p-8">
                    <p className="editable-kicker text-[var(--tk-muted)]">Address</p>
                    <p className="mt-4 text-lg font-medium leading-[1.5] text-[var(--tk-text)]">
                      {address || 'Full address on request.'}
                    </p>
                    {directionsHref ? (
                      <Link
                        href={directionsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"
                      >
                        Get directions <Navigation2 className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <TagChips post={post} title="Related to" />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-40 lg:self-start">
            {/* Spec sheet */}
            {specItems.length ? (
              <div className="overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="border-b border-[var(--tk-line)] p-5">
                  <p className="editable-kicker text-[var(--tk-muted)]">Spec sheet</p>
                </div>
                <dl className="divide-y divide-[var(--tk-line)]">
                  {specItems.map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4 px-5 py-4">
                      <dt className="editable-kicker shrink-0 text-[var(--tk-muted)]">{label}</dt>
                      <dd className="min-w-0 truncate text-right text-sm font-medium text-[var(--tk-text)]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {/* Contact card */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-kicker text-[var(--tk-muted)]">Get in touch</p>
              <div className="mt-6 space-y-5">
                {address ? <InfoRow icon={MapPin} label="Address" value={address} /> : null}
                {phone ? <InfoRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} /> : null}
                {email ? <InfoRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} /> : null}
                {website ? <InfoRow icon={Globe2} label="Website" value={website} href={website} /> : null}
                <InfoRow icon={Clock} label="Hours" value={hours} />
              </div>
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"
                >
                  Visit site <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"
                >
                  Get in touch <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <TrustPanel
              items={[
                ['Verified entry', 'Details checked by our editorial team before publishing.'],
                ['Independently listed', 'Nothing on the shelf is here because it paid to be.'],
                ['Kept current', 'Facts refreshed on a rolling basis, not by algorithm.'],
              ]}
            />

            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel />
            </div>
          </aside>
        </div>
      </section>

      <RelatedStrip task="listing" related={related} title={`More from the ${taskDisplayLabel('listing').toLowerCase()}`} />
    </>
  )
}

function ActionDockButton({
  icon: Icon,
  label,
  href,
  primary = false,
}: {
  icon: typeof Phone
  label: string
  href: string
  primary?: boolean
}) {
  const target = href.startsWith('http') ? '_blank' : undefined
  const rel = target ? 'noreferrer' : undefined
  const disabled = !href
  const base =
    'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium tracking-[0.02em] transition sm:px-5 sm:text-sm'
  const style = primary
    ? 'bg-[var(--tk-text)] text-[var(--tk-on-accent)] hover:opacity-90'
    : 'border border-[var(--tk-line)] bg-[var(--tk-surface)] text-[var(--tk-text)] hover:border-[var(--tk-text)]'
  if (disabled) {
    return (
      <span className={`${base} ${style} pointer-events-none opacity-40`}>
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </span>
    )
  }
  return (
    <Link href={href} target={target} rel={rel} className={`${base} ${style}`}>
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}

function BentoGallery({ images }: { images: string[] }) {
  const [featured, ...rest] = images
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-6 sm:grid-rows-3">
      {featured ? (
        <div className="relative overflow-hidden rounded-2xl bg-[var(--tk-raised)] sm:col-span-4 sm:row-span-3">
          <img
            src={featured}
            alt=""
            className="h-full min-h-[360px] w-full object-cover transition-transform duration-[900ms] hover:scale-[1.03]"
          />
        </div>
      ) : null}
      {rest.slice(0, 5).map((image, index) => (
        <div
          key={`${image}-${index}`}
          className={`relative overflow-hidden rounded-2xl bg-[var(--tk-raised)] ${
            index === 0
              ? 'sm:col-span-2 sm:row-span-2'
              : index === 1
              ? 'sm:col-span-1 sm:row-span-1'
              : index === 2
              ? 'sm:col-span-1 sm:row-span-1'
              : 'sm:col-span-2 sm:row-span-1'
          }`}
        >
          <img
            src={image}
            alt=""
            className="h-full min-h-[140px] w-full object-cover transition-transform duration-[900ms] hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>
  )
}

/* ============================ ARTICLE DETAIL =========================== */
/*
  Layout: "Editorial cover + reading spine"
    1. Fully centered cover — chip row → massive centered h1 → meta line
       (WRITTEN / IN / READ) → italic display-scale pull-quote lead.
    2. Commanding hero image.
    3. Reading spine — main column (drop-cap body, mid-article CTA card,
       tag chips, Ads article-bottom, comments) with sticky sidebar
       (author block, "In this piece" numbered TOC, dark subscribe card).
    4. Full-width repeated CTA band.
    5. Related strip.
*/

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  const hero = images[0]
  const inlineImages = images.slice(1, 3)
  const category = categoryOf(post, taskDisplayLabel('article', 'singular'))
  const reading = readingTime(post)
  const sections = extractSections(post)
  const author = authorOf(post)
  const bio = authorBioOf(post)
  const lead = leadText(post)

  return (
    <>
      {/* 1. Centered editorial cover */}
      <section className="border-b border-[var(--tk-line)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-5 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pt-24">
          <BackLink task="article" />

          <div className="mx-auto mt-12 max-w-5xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Chip>{taskDisplayLabel('article', 'singular')}</Chip>
              {category ? <Chip>{category}</Chip> : null}
              <Chip>
                <Clock className="h-3 w-3" /> {reading} min read
              </Chip>
            </div>

            <h1 className="editable-display mt-12 text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-[5rem] lg:text-[6.75rem]">
              {post.title}
            </h1>

            <MetaLine
              items={[
                ['Written', author],
                ['In', category],
                ['Read', `${reading} min`],
              ]}
            />

            {lead ? (
              <p className="editable-display mx-auto mt-14 max-w-3xl text-balance text-2xl font-medium italic leading-[1.4] tracking-[-0.01em] text-[var(--tk-muted)] sm:text-3xl lg:text-[2.25rem]">
                “{lead}”
              </p>
            ) : null}
          </div>
        </div>

        {/* 2. Commanding hero image */}
        {hero ? (
          <div className="mx-auto mt-16 max-w-[var(--editable-container)] px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
              <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        ) : (
          <div className="pb-16 sm:pb-24" />
        )}
      </section>

      {/* 3. Reading spine + sidebar */}
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,720px)_320px] lg:justify-center">
          <article className="mx-auto w-full min-w-0 max-w-2xl">
            <BodyContent post={post} dropCap />

            {/* Inline figure (if a second image is present) */}
            {inlineImages[0] ? (
              <figure className="my-12 overflow-hidden rounded-2xl border border-[var(--tk-line)]">
                <div className="relative aspect-[16/10] bg-[var(--tk-raised)]">
                  <img src={inlineImages[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </figure>
            ) : null}

            {/* Mid-article CTA callout */}
            <div className="my-14 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:p-10">
              <p className="editable-kicker text-[var(--tk-muted)]">A note from the shelf</p>
              <p className="editable-display mt-4 text-2xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-3xl">
                Reading pieces like this one? We only send a short note when we have something worth flagging.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"
              >
                Join the note-out list <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <TagChips post={post} title="Filed under" />

            <div className="mt-16 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel />
            </div>

            <EditableArticleComments slug={post.slug} comments={comments} />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {/* Author identity block */}
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <div className="flex items-center gap-4">
                <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--tk-text)] text-lg font-semibold text-[var(--tk-on-accent)]">
                  {author.trim().charAt(0).toUpperCase() || '·'}
                </span>
                <div className="min-w-0">
                  <p className="editable-kicker text-[var(--tk-muted)]">Written by</p>
                  <p className="mt-1 truncate text-base font-semibold text-[var(--tk-text)]">{author}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-[1.65] text-[var(--tk-muted)]">{bio}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                >
                  Get in touch <ArrowUpRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/article"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3 py-1.5 text-xs font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]"
                >
                  More pieces
                </Link>
              </div>
            </div>

            {/* In this piece TOC */}
            {sections.length ? (
              <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
                <p className="editable-kicker text-[var(--tk-muted)]">In this piece</p>
                <ol className="mt-5 space-y-4 text-sm text-[var(--tk-text)]">
                  {sections.map((section, i) => (
                    <li key={section} className="flex gap-4">
                      <span className="editable-kicker w-6 shrink-0 tabular-nums text-[var(--tk-muted)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 leading-[1.55]">{section}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {/* Dark subscribe card */}
            <div className="rounded-2xl bg-[var(--tk-text)] p-7 text-[var(--tk-on-accent)]">
              <Sparkles className="h-5 w-5" />
              <p className="editable-display mt-4 text-xl font-semibold leading-[1.25] tracking-[-0.02em]">
                Quiet notes, once in a while.
              </p>
              <p className="mt-3 text-sm leading-[1.65] text-white/70">
                A short letter when there is something on the shelf worth flagging. No cadence, no template.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[var(--tk-text)] transition hover:bg-transparent hover:text-white hover:shadow-[inset_0_0_0_1px_white]"
              >
                Subscribe <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* 4. Full-width repeated CTA band */}
      <section className="border-y border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] items-center gap-8 px-5 py-24 sm:px-8 sm:py-28 lg:grid-cols-[1.4fr_1fr] lg:px-10 lg:py-32">
          <div>
            <p className="editable-kicker text-[var(--tk-muted)]">On the shelf</p>
            <h2 className="editable-display mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[3.75rem]">
              Slow reads, quietly delivered.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/article"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-text)] bg-transparent px-7 py-3.5 text-sm font-medium text-[var(--tk-text)] transition hover:bg-[var(--tk-text)] hover:text-[var(--tk-on-accent)]"
            >
              More pieces
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90"
            >
              Subscribe <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RelatedStrip task="article" related={related} title="More from the shelf" />
    </>
  )
}

function MetaLine({ items }: { items: Array<[string, string]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      {visible.map(([label, value], index) => (
        <div key={label} className="flex items-center gap-6">
          {index > 0 ? <span className="hidden h-8 w-px bg-[var(--tk-line)] sm:block" aria-hidden /> : null}
          <div className="text-left">
            <p className="editable-kicker text-[var(--tk-muted)]">{label}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--tk-text)]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------- Preserved variants for other tasks (kept concise, on-tokens) - */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="classified" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <Chip>Notice</Chip>
            <h1 className="editable-display mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {leadText(post) ? (
              <p className="mt-8 text-xl leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p>
            ) : null}
            {images[0] ? (
              <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
                <img src={images[0]} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="mt-10">
              <BodyContent post={post} />
            </div>
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-display text-4xl font-semibold tracking-[-0.03em]">{price || 'Open offer'}</p>
              {location ? <p className="mt-3 text-sm text-[var(--tk-muted)]">{location}</p> : null}
              <div className="mt-6 space-y-3">
                {phone ? (
                  <Link
                    href={`tel:${phone}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)]"
                  >
                    <Phone className="h-4 w-4" /> Call
                  </Link>
                ) : null}
                {email ? (
                  <Link
                    href={`mailto:${email}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-medium"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="image" />
        <div className="mt-10">
          <Chip>
            <Camera className="h-3 w-3" /> Frame
          </Chip>
          <h1 className="editable-display mt-8 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            {post.title}
          </h1>
          {leadText(post) ? (
            <p className="mt-8 max-w-3xl text-xl leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p>
          ) : null}
        </div>
        <div className="mt-14 columns-1 gap-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {gallery.map((image, index) => (
            <figure
              key={`${image}-${index}`}
              className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]"
            >
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <div className="mt-14 max-w-3xl">
          <BodyContent post={post} compact />
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="sbm" />
        <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--tk-line)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <Chip>Saved</Chip>
        <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          {post.title}
        </h1>
        {leadText(post) ? <p className="mt-8 text-xl leading-[1.6] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)]"
          >
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <div className="mt-12">
          <BodyContent post={post} />
        </div>
      </section>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

function PdfDetail({ post, related: _related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
      <BackLink task="pdf" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="min-w-0">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[var(--tk-line)]">
              <FileText className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <Chip>{categoryOf(post, 'Document')}</Chip>
              <h1 className="editable-display mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
                {post.title}
              </h1>
            </div>
          </div>
          <div className="mt-10">
            <BodyContent post={post} />
          </div>
          {fileUrl ? (
            <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-5">
                <span className="text-sm font-semibold">Preview</span>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-4 py-2 text-xs font-medium text-[var(--tk-on-accent)]"
                >
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
            </div>
          ) : null}
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {fileUrl ? (
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
              <p className="editable-kicker text-[var(--tk-muted)]">Get a copy</p>
              <p className="mt-4 text-sm leading-6 text-[var(--tk-muted)]">Open in a new tab, or save it locally.</p>
              <Link
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)]"
              >
                Download <Download className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="editable-kicker mt-3 text-[var(--tk-muted)]">{role}</p> : null}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {website ? (
                  <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-4 py-2 text-xs font-medium text-[var(--tk-on-accent)]">
                    Website <ExternalLink className="h-3 w-3" />
                  </Link>
                ) : null}
                {email ? (
                  <Link href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2 text-xs font-medium">
                    <Mail className="h-3 w-3" /> Email
                  </Link>
                ) : null}
              </div>
            </div>
          </aside>
          <article className="min-w-0">
            <Chip>Profile</Chip>
            <div className="mt-8">
              <BodyContent post={post} />
            </div>
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ------------------------------ Related -------------------------------- */

function RelatedStrip({ task, related, title }: { task: TaskKey; related: SitePost[]; title?: string }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const heading = title || `More ${taskDisplayLabel(task).toLowerCase()}`
  return (
    <section className="border-t border-[var(--tk-line)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="editable-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">{heading}</h2>
          <Link
            href={taskConfig?.route || '/'}
            className="editable-link inline-flex items-center gap-1.5 text-sm font-medium"
          >
            See everything <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const category = categoryOf(post, taskDisplayLabel(task, 'singular'))
  const reading = task === 'article' ? readingTime(post) : 0
  return (
    <Link href={href} className="group block min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--tk-raised)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Tag className="h-7 w-7 text-[var(--tk-muted)]" />
          </div>
        )}
      </div>
      <p className="editable-kicker mt-5 text-[var(--tk-muted)]">
        {category}
        {reading ? ` · ${reading} min` : ''}
      </p>
      <h3 className="editable-display mt-3 line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.02em]">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-[1.6] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
    </Link>
  )
}
