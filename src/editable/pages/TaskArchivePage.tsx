import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices, taskDisplayLabel } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? (content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) as string[])
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(image && isUrl(image) ? [image] : []), ...(logo && isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'divide-y divide-[var(--tk-line)] border-y border-[var(--tk-line)]',
  listing: 'grid gap-6 md:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] transition-colors duration-500 hover:border-[var(--tk-text)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const label = taskDisplayLabel(task)
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  // Ad slot per task (per brief): article archive → header, listing → in-feed.
  const archiveAdSlot: string | null = task === 'article' ? 'header' : task === 'listing' ? 'in-feed' : null
  const inFeedIndex = 2

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="border-b border-[var(--tk-line)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 pb-20 pt-16 sm:px-8 sm:pt-24 sm:pb-24 lg:px-10 lg:pt-32">
            <EditableReveal index={0}>
              <p className="editable-kicker text-[var(--tk-muted)]">{voice?.eyebrow || label}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-5xl text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
                {voice?.headline || `Browse ${label}`}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-10 max-w-2xl text-lg leading-[1.6] text-[var(--tk-muted)] sm:text-xl">
                {voice?.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <div className="mt-14 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="editable-kicker text-[var(--tk-muted)]">
                  {posts.length} {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-5 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-text)] px-6 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90">
                    Filter
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        {archiveAdSlot === 'header' ? (
          <div className="border-b border-[var(--tk-line)]">
            <div className="mx-auto max-w-[var(--editable-container)] px-5 py-8 sm:px-8 lg:px-10">
              <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel />
            </div>
          </div>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-32">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />
              ))}
              {archiveAdSlot === 'in-feed' ? (
                <div className="md:col-span-2">
                  <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--tk-muted)]">
                Try another category, or check back after new {label.toLowerCase()} are added to the shelf.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-20 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-text)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="editable-kicker text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-full border border-[var(--tk-line)] px-6 py-3 font-medium transition hover:border-[var(--tk-text)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>

        {/* Silence unused warning for inFeedIndex — retained for future placement tuning. */}
        <span className="hidden" data-in-feed-hint={inFeedIndex} />
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

/* --- Per-task archive card variants ------------------------------------ */

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, taskDisplayLabel('article', 'singular'))
  return (
    <EditableReveal index={index} as="article">
      <Link
        href={href}
        className="group grid gap-8 py-12 sm:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)]"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[var(--tk-raised)] aspect-[4/5]">
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
        </div>
        <div className="min-w-0">
          <p className="editable-kicker text-[var(--tk-muted)]">
            No. {String(index + 1).padStart(2, '0')} · {category}
          </p>
          <h2 className="editable-display mt-4 line-clamp-3 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h2>
          <p className="mt-5 line-clamp-3 text-base leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
          <span className="editable-link mt-6 inline-flex items-center gap-2 text-sm font-medium">
            Read the piece <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </EditableReveal>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Studio')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} overflow-hidden`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" />
          <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--tk-text)]">
            {category}
          </span>
        </div>
        <div className="p-7">
          <h2 className="editable-display line-clamp-1 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[var(--tk-muted)]">
            {location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {location}
              </span>
            ) : null}
            {phone ? (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {phone}
              </span>
            ) : null}
            {website ? (
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Site
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </EditableReveal>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-8`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-semibold tracking-[-0.03em]">{price || 'Open offer'}</span>
        {condition ? (
          <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">
            {condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-6 text-xl font-semibold leading-snug tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-8 flex items-center justify-between border-t border-[var(--tk-line)] pt-5 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-6 block break-inside-avoid overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)]"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.72))] opacity-80 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="editable-display line-clamp-2 text-lg font-semibold tracking-[-0.02em] text-white">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-5 p-7`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--tk-line)]">
        <Globe className="h-5 w-5 text-[var(--tk-text)]" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="editable-kicker text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-2 text-lg font-semibold leading-snug tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-medium text-[var(--tk-text)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--tk-line)]">
          <FileText className="h-6 w-6" />
        </div>
        <span className="editable-kicker text-[var(--tk-muted)]">{category}</span>
      </div>
      <h2 className="editable-display mt-8 text-xl font-semibold leading-snug tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="editable-link mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-8 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-6 text-lg font-semibold tracking-[-0.02em]">{post.title}</h2>
      {role ? <p className="editable-kicker mt-2 text-[var(--tk-muted)]">{role}</p> : null}
      <p className="mt-4 line-clamp-2 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
