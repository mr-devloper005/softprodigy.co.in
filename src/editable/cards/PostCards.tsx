import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  Vantis-style card treatments:
    - Off-white surface with hairline liner (or flat paper).
    - 16px card radius.
    - Hover: image scale 1.03 over 800ms + underline slide on title.
    - Kicker is uppercase, tracked, hairline-colored.
  Card component signatures + prop names are unchanged.
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured',
}: {
  post: SitePost
  href: string
  label?: string
}) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[620px] lg:p-14">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover opacity-60 ${dc.motion.zoom}`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.85)_100%)]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className="editable-kicker text-white/70">{label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl lg:text-[4rem]">
            {post.title}
          </h3>
          <p className="mt-6 max-w-2xl text-base leading-[1.7] text-white/70 sm:text-lg">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition group-hover:bg-transparent group-hover:text-white group-hover:shadow-[inset_0_0_0_1px_white]">
            Read the piece <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block min-w-0`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-5">
        <p className="editable-kicker text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p>
        <h3
          className={`editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] ${pal.panelText}`}
        >
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 135)}</p>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 border-t border-[var(--editable-border)] py-6`}>
      <div className="flex items-start gap-6">
        <span
          className={`editable-kicker mt-2 shrink-0 tabular-nums ${pal.mutedText}`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p>
          <h3
            className={`editable-display mt-3 line-clamp-2 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] ${pal.panelText}`}
          >
            {post.title}
          </h3>
          <p className={`mt-3 line-clamp-2 text-sm leading-[1.65] ${pal.mutedText}`}>
            {getEditableExcerpt(post, 130)}
          </p>
        </div>
        <ArrowUpRight
          className={`mt-2 h-5 w-5 shrink-0 ${pal.mutedText} transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-page-text)]`}
        />
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-8 border-t border-[var(--editable-border)] py-10 sm:grid-cols-[280px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
        />
      </div>
      <div className="min-w-0">
        <p className="editable-kicker text-[var(--slot4-muted-text)]">
          No. {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}
        </p>
        <h2
          className={`editable-display mt-4 line-clamp-3 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] ${pal.panelText} sm:text-4xl lg:text-[2.75rem]`}
        >
          {post.title}
        </h2>
        <p className={`mt-5 line-clamp-3 text-base leading-[1.7] ${pal.mutedText}`}>
          {getEditableExcerpt(post, 220)}
        </p>
        <span className={`editable-link mt-6 inline-flex items-center gap-2 text-sm font-medium ${pal.panelText}`}>
          Read the piece <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}
