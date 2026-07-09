'use client'

import { Building2, FileText, Mail, MapPin, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Submit a place', body: 'Add a studio, workshop or independent business to the shelf. Rolling submissions, no template.' },
      { icon: MapPin, title: 'Corrections', body: 'Facts change. If we have something wrong, tell us and we will fix it fast.' },
      { icon: Mail, title: 'Partnerships', body: 'Slow collaborations only — projects that fit the shelf and the pace we work at.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitches', body: 'Field notes, essays, guides. Send a short outline and a link to something you have made.' },
      { icon: Mail, title: 'Newsletter', body: 'Introduce yourself, and we will get you on the quiet list.' },
      { icon: Sparkles, title: 'Corrections', body: 'Spot something wrong? We would rather hear from a reader than from a lawyer.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Submit a resource', body: 'Suggest something worth keeping on the saved shelf — tools, references, small sites.' },
    { icon: Mail, title: 'Partnerships', body: 'Slow, low-noise collaborations only.' },
    { icon: Sparkles, title: 'Corrections', body: 'Point out anything that has gone stale and we will refresh it.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto grid max-w-[var(--editable-container)] gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:px-10 lg:py-32">
            <div>
              <EditableReveal index={0}>
                <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.contact.eyebrow}</p>
              </EditableReveal>
              <EditableReveal index={1}>
                <h1 className="editable-display mt-8 text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[5.5rem]">
                  {pagesContent.contact.title}
                </h1>
              </EditableReveal>
              <EditableReveal index={2}>
                <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)] sm:text-xl">
                  {pagesContent.contact.description}
                </p>
              </EditableReveal>
              <div className="mt-12 space-y-8">
                {lanes.map((lane, index) => (
                  <EditableReveal key={lane.title} index={index + 3}>
                    <div className="border-t border-[var(--editable-border)] pt-6">
                      <div className="flex items-center gap-3">
                        <lane.icon className="h-5 w-5" />
                        <h2 className="editable-display text-xl font-semibold tracking-[-0.015em]">{lane.title}</h2>
                      </div>
                      <p className="mt-3 max-w-md text-sm leading-[1.7] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={3}>
              <div className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10 lg:sticky lg:top-24 lg:self-start">
                <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
