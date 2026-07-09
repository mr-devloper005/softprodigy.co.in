import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel } from '@/editable/content/task-pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const raw = post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''
  return stripHtml(raw).replace(/\s+/g, ' ').trim()
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post }: { post: SitePost }) {
  const task = (getPostTaskKey(post) as TaskKey | null) || 'article'
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const label = taskDisplayLabel(task, 'singular')

  return (
    <Link
      href={href}
      className="group grid gap-6 border-t border-[var(--editable-border)] py-10 sm:grid-cols-[240px_minmax(0,1fr)]"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--slot4-media-bg)]">
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Search className="h-6 w-6 text-[var(--slot4-muted-text)]" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="editable-kicker text-[var(--slot4-muted-text)]">{label}</p>
        <h2 className="editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-3xl">
          {post.title}
        </h2>
        {summary ? (
          <p className="mt-4 line-clamp-3 text-base leading-[1.65] text-[var(--slot4-muted-text)]">{summary}</p>
        ) : null}
        <span className="editable-link mt-5 inline-flex items-center gap-2 text-sm font-medium">
          Open result <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 pt-20 pb-16 sm:px-8 sm:pt-28 lg:px-10 lg:pt-32">
            <EditableReveal index={0}>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.search.hero.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-[18ch] text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
                {pagesContent.search.hero.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
                {pagesContent.search.hero.description}
              </p>
            </EditableReveal>

            <EditableReveal index={3}>
              <form
                action="/search"
                className="mt-12 grid gap-3 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 sm:grid-cols-[1fr_240px_180px_auto]"
              >
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3 text-sm font-medium outline-none"
                >
                  <option value="">All shelves</option>
                  {enabledTasks.map((item) => (
                    <option key={item.key} value={item.key}>
                      {taskDisplayLabel(item.key)}
                    </option>
                  ))}
                </select>
                <button
                  className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10 lg:pb-40">
          <div className="flex flex-wrap items-end justify-between gap-4 pt-16">
            <div>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <h2 className="editable-display mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                {query ? `“${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/listing" className="editable-link text-sm font-medium">
              Browse the directory
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 divide-y-0 border-b border-[var(--editable-border)]">
              {results.map((post) => (
                <SearchResultCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-16 rounded-2xl border border-dashed border-[var(--editable-border)] p-12 text-center">
              <p className="editable-display text-2xl font-semibold tracking-[-0.02em]">Nothing here matched.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword, shelf or category.</p>
            </div>
          )}

          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
