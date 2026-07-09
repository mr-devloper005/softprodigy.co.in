import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices, taskDisplayLabel } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-16 pb-16 sm:pt-24 sm:pb-20 lg:pt-32`}>
        <p className="editable-kicker text-[var(--slot4-muted-text)]">{voice.eyebrow}</p>
        <h1 className={`editable-display mt-8 max-w-5xl ${dc.type.heroTitle}`}>{voice.headline}</h1>
        <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">{voice.description}</p>
        <form action={basePath} className="mt-12 flex max-w-xl flex-col gap-3 sm:flex-row">
          <select
            name="category"
            defaultValue={category || 'all'}
            className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-medium outline-none"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
          <button className="rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90">
            Filter
          </button>
        </form>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionYSm}`}>
        {posts.length ? (
          <div className="divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
            {posts.map((post, index) => (
              <ArticleListCard
                key={post.id}
                post={post}
                href={postHref('article', post, basePath)}
                index={index + (page - 1) * pagination.limit}
              />
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} p-10 text-center`}>
            <h2 className="editable-display text-3xl font-semibold tracking-[-0.02em]">Nothing here yet</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--slot4-muted-text)]">
              Try another category or return to the full shelf.
            </p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? (
            <Link
              href={pageHref(page - 1)}
              className="rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-medium transition hover:border-[var(--slot4-page-text)]"
            >
              Previous
            </Link>
          ) : null}
          <span className="editable-kicker text-[var(--slot4-muted-text)]">
            Page {page} of {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage ? (
            <Link
              href={pageHref(page + 1)}
              className="rounded-full border border-[var(--editable-border)] px-6 py-3 text-sm font-medium transition hover:border-[var(--slot4-page-text)]"
            >
              Next
            </Link>
          ) : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 pb-10 sm:pt-20`}>
        <Link
          href="/article"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium transition hover:border-[var(--slot4-page-text)]"
        >
          <ChevronLeft className="h-4 w-4" /> {taskDisplayLabel('article')}
        </Link>
        <p className="editable-kicker mt-10 text-[var(--slot4-muted-text)]">{voice.eyebrow}</p>
        <h1 className="editable-display mt-4 max-w-4xl text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
          {post?.title || pagesContent.detailPages.article.fallbackTitle}
        </h1>
      </section>
      <section className={`${dc.shell.section} pb-20`}>
        <div className="max-w-3xl">
          <p className="text-lg leading-[1.8] text-[var(--slot4-muted-text)]">
            {post?.summary || `Content for ${slug} will render through the detail page.`}
          </p>
          <Link href="/contact" className={`${dc.button.primary} mt-10`}>
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
