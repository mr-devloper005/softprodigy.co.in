import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 lg:px-10 lg:pt-40 lg:pb-40">
            <EditableReveal index={0}>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.about.badge}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className="editable-display mt-8 max-w-[18ch] text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
                {pagesContent.about.title}
              </h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className="mt-10 max-w-2xl text-xl leading-[1.6] text-[var(--slot4-muted-text)] sm:text-2xl">
                {pagesContent.about.description}
              </p>
            </EditableReveal>
          </div>
        </section>

        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[1fr_1.2fr] lg:px-10 lg:py-40">
            <EditableReveal index={0}>
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="editable-kicker text-[var(--slot4-muted-text)]">The story</p>
                <h2 className="editable-display mt-6 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-5xl">
                  Made by hand, in one voice.
                </h2>
              </div>
            </EditableReveal>
            <div className="space-y-8">
              {pagesContent.about.paragraphs.map((paragraph, index) => (
                <EditableReveal key={paragraph} index={index + 1}>
                  <p className="text-lg leading-[1.75] text-[var(--slot4-muted-text)] sm:text-xl">{paragraph}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
            <EditableReveal index={0}>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">What we hold to</p>
            </EditableReveal>
            <div className="mt-14 divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
              {pagesContent.about.values.map((value, index) => (
                <EditableReveal key={value.title} index={index}>
                  <div className="grid gap-6 py-12 sm:grid-cols-[80px_1fr] sm:gap-10">
                    <span className="editable-kicker tabular-nums text-[var(--slot4-muted-text)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="editable-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-4xl">
                        {value.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-lg leading-[1.7] text-[var(--slot4-muted-text)]">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <p className="mt-16 max-w-md text-sm text-[var(--slot4-muted-text)]">— The {SITE_CONFIG.name} team</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
