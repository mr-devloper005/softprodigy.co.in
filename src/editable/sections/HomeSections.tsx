import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { taskDisplayLabel } from '@/editable/content/task-pages.content'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

function dedupe(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* --------------------------------- HERO --------------------------------- */
export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupe([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImage =
    pool.map(getEditablePostImage).find((image) => image && !image.includes('placeholder')) ||
    (pool[0] ? getEditablePostImage(pool[0]) : '')
  const heroTitle = pagesContent.home.hero.title
  const total = pool.length

  return (
    <section className="relative border-b border-[var(--editable-border)]">
      <div className={`${container} pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.home.hero.badge}</p>
        </EditableReveal>

        <EditableReveal index={1}>
          <h1
            className={`editable-display mt-8 max-w-[18ch] text-balance ${dc.type.heroTitle} text-[var(--slot4-page-text)]`}
          >
            {heroTitle[0]}
            {heroTitle[1] ? (
              <>
                {' '}
                <span className="italic text-[var(--slot4-muted-text)]">{heroTitle[1]}</span>
              </>
            ) : null}
          </h1>
        </EditableReveal>

        <EditableReveal index={2}>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <p className="max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
              {pagesContent.home.hero.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={pagesContent.home.hero.primaryCta.href} className={dc.button.primary}>
                {pagesContent.home.hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.hero.secondaryCta.href} className={dc.button.secondary}>
                {pagesContent.home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </EditableReveal>

        {heroImage ? (
          <EditableReveal index={3}>
            <div className={`${dc.media.frame} mt-16 aspect-[16/9] lg:mt-24`}>
              <img src={heroImage} alt="" className="h-full w-full object-cover" loading="eager" />
            </div>
          </EditableReveal>
        ) : null}

        {/* Under-hero meta strip — count · task shortcuts (footer-style discovery, not nav) */}
        <EditableReveal index={4}>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--editable-border)] pt-8">
            <p className="editable-kicker text-[var(--slot4-muted-text)]">
              {total > 0 ? `${total} entries on the shelf` : 'Independent shelf'}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/listing" className="editable-link text-sm font-medium text-[var(--slot4-page-text)]">
                {taskDisplayLabel('listing')}
              </Link>
              <Link href="/article" className="editable-link text-sm font-medium text-[var(--slot4-page-text)]">
                {taskDisplayLabel('article')}
              </Link>
              <Link href={primaryRoute} className="editable-link hidden text-sm font-medium text-[var(--slot4-muted-text)] sm:inline-flex">
                Latest {taskDisplayLabel(primaryTask).toLowerCase()}
              </Link>
            </div>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

/* ------------------------------ MANIFESTO ------------------------------- */
export function EditableStoryRail(_: HomeSectionProps) {
  const manifesto = pagesContent.home.manifesto
  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{manifesto.eyebrow}</p>
        </EditableReveal>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {manifesto.lines.map((line, index) => (
              <EditableReveal key={line} index={index + 1}>
                <p className="editable-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-5xl lg:text-[4.5rem]">
                  {line}
                </p>
              </EditableReveal>
            ))}
          </div>
          <EditableReveal index={manifesto.lines.length + 1}>
            <p className="max-w-md self-end text-lg leading-[1.65] text-[var(--slot4-muted-text)] sm:text-xl">
              {manifesto.body}
            </p>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------ WORK / FEATURE ------------------------- */
export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feature = dedupe([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 4)
  if (!feature.length) return null

  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">On the shelf</p>
              <h2 className={`editable-display mt-6 max-w-3xl ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>
                Recently added, carefully picked.
              </h2>
            </div>
            <Link href={primaryRoute} className={`${dc.button.secondary} shrink-0`}>
              See everything <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
          {feature.map((post, index) => (
            <EditableReveal key={post.id || post.slug} index={index}>
              <FeatureTile post={post} href={postHref(primaryTask, post, primaryRoute)} number={index + 1} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureTile({ post, href, number }: { post: SitePost; href: string; number: number }) {
  const category = getEditableCategory(post)
  return (
    <Link href={href} className="group block min-w-0">
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
          loading="lazy"
        />
      </div>
      <div className="mt-6 flex items-baseline gap-6">
        <span className="editable-kicker shrink-0 tabular-nums text-[var(--slot4-muted-text)]">
          {String(number).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{category}</p>
          <h3 className="editable-display mt-3 line-clamp-2 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-3xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-[1.7] text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 140)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------- SERVICES / "WHAT WE DO" -------------------- */
export function EditableServices() {
  const services = pagesContent.home.services
  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{services.eyebrow}</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2
            className={`editable-display mt-6 max-w-4xl ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}
          >
            {services.title}
          </h2>
        </EditableReveal>

        <div className="mt-16 divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
          {services.items.map((item, index) => (
            <EditableReveal key={item.number} index={index}>
              <Link
                href={item.href}
                className="group grid gap-6 py-10 sm:grid-cols-[80px_1fr_auto] sm:items-center sm:gap-10"
              >
                <span className="editable-kicker tabular-nums text-[var(--slot4-muted-text)]">{item.number}</span>
                <div>
                  <h3 className="editable-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-[1.7] text-[var(--slot4-muted-text)]">{item.body}</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--slot4-page-text)]" />
              </Link>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- BIG STATEMENT ---------------------------- */
export function EditableStatement() {
  const s = pagesContent.home.statement
  return (
    <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
      <div className={`${container} py-32 sm:py-40 lg:py-56`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-white/50">{s.eyebrow}</p>
        </EditableReveal>
        <div className="mt-12">
          {[s.linesA, s.linesB, s.linesC].map((group, groupIdx) => (
            <EditableReveal key={groupIdx} index={groupIdx + 1}>
              {group.map((line) => (
                <p
                  key={line}
                  className="editable-display text-[15vw] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[12vw] lg:text-[10rem]"
                >
                  {line}
                </p>
              ))}
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------- TESTIMONIALS ------------------------------ */
export function EditableTestimonials() {
  const t = pagesContent.home.testimonials
  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{t.eyebrow}</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className={`editable-display mt-6 max-w-3xl ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>
            {t.title}
          </h2>
        </EditableReveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          {t.items.map((item, index) => (
            <EditableReveal key={item.attribution} index={index + 2}>
              <figure className="border-t border-[var(--editable-border)] pt-10">
                <blockquote className="editable-display text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-4xl">
                  “{item.quote}”
                </blockquote>
                <figcaption className="editable-kicker mt-8 text-[var(--slot4-muted-text)]">
                  — {item.attribution}
                </figcaption>
              </figure>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- FAQ ---------------------------------- */
export function EditableFaq() {
  const f = pagesContent.home.faq
  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <EditableReveal index={0}>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">{f.eyebrow}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h2 className={`editable-display mt-6 ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>{f.title}</h2>
            </EditableReveal>
          </div>
          <div>
            {f.items.map((item, index) => (
              <EditableReveal key={item.q} index={index + 2}>
                <details className="group border-t border-[var(--editable-border)] py-6 [&_summary::-webkit-details-marker]:hidden last:border-b">
                  <summary className="flex cursor-pointer items-center justify-between gap-6 text-left">
                    <span className="editable-display text-xl font-semibold tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-2xl">
                      {item.q}
                    </span>
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] transition group-open:bg-[var(--slot4-page-text)] group-open:border-[var(--slot4-page-text)]">
                      <span className="h-px w-3 bg-current" />
                      <span className="absolute h-3 w-px bg-current transition group-open:opacity-0" />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-2xl text-base leading-[1.75] text-[var(--slot4-muted-text)]">{item.a}</p>
                </details>
              </EditableReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------- FROM THE STUDIO (blog / posts grid) --------------- */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupe([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!pool.length) return null

  return (
    <section className="border-b border-[var(--editable-border)]">
      <div className={`${container} py-24 sm:py-32 lg:py-40`}>
        <EditableReveal index={0}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">Fresh on the shelf</p>
              <h2 className={`editable-display mt-6 max-w-3xl ${dc.type.sectionTitle} text-[var(--slot4-page-text)]`}>
                Recently added.
              </h2>
            </div>
            <Link href={primaryRoute} className={dc.button.ghost}>
              {globalContent.commonLabels.viewAll} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </EditableReveal>

        <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {pool.map((post, index) => (
            <EditableReveal key={post.id || post.slug} index={index}>
              <FreshCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FreshCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block min-w-0">
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`}
          loading="lazy"
        />
      </div>
      <p className="editable-kicker mt-6 text-[var(--slot4-muted-text)]">{getEditableCategory(post)}</p>
      <h3 className="editable-display mt-3 line-clamp-2 text-xl font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--slot4-page-text)] sm:text-2xl">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-2 text-sm leading-[1.7] text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 130)}
      </p>
    </Link>
  )
}

/* -------------------------------- CTA ---------------------------------- */
export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-in-touch" className="scroll-mt-24 border-b border-[var(--editable-border)]">
      <div className={`${container} py-32 sm:py-40 lg:py-56 text-center`}>
        <EditableReveal index={0}>
          <p className="editable-kicker text-[var(--slot4-muted-text)]">{cta.badge}</p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h2 className="editable-display mx-auto mt-8 max-w-5xl text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[4.5rem] lg:text-[6.5rem]">
            {cta.title}
          </h2>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
            {cta.description}
          </p>
        </EditableReveal>
        <EditableReveal index={3}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href={cta.primaryCta.href} className={dc.button.primary}>
              {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={cta.secondaryCta.href} className={dc.button.secondary}>
              {cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}
// Keep SITE_CONFIG import to avoid unused warnings across tree-shaken variants.
export const _siteName = SITE_CONFIG.name
