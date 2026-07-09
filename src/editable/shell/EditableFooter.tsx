'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session } = useEditableLocalAuthSession()

  const columns = globalContent.footer.columns.map((column) => {
    if (column.title !== 'Account') return column
    return {
      ...column,
      links: session
        ? [
            { label: 'Submit', href: '/create' },
            { label: 'Sign out', href: '#signout' },
          ]
        : column.links,
    }
  })

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      {/* Vantis-style CTA band */}
      <section className="border-b border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-8 px-5 py-24 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-32 lg:px-10">
          <div className="max-w-2xl">
            <p className="editable-kicker text-white/60">{globalContent.footer.ctaEyebrow}</p>
            <h2 className="editable-display mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-5xl lg:text-[4.5rem]">
              {globalContent.footer.ctaTitle}
            </h2>
            <p className="mt-6 max-w-lg text-base leading-[1.7] text-white/70">{globalContent.footer.ctaBody}</p>
          </div>
          <Link
            href={globalContent.footer.ctaButton.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-page-bg)] px-8 py-4 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-transparent hover:text-[var(--slot4-page-bg)] hover:shadow-[inset_0_0_0_1px_var(--slot4-page-bg)]"
          >
            {globalContent.footer.ctaButton.label} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="editable-display inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-page-bg)]">
              <img src="/favicon.ico" alt={SITE_CONFIG.name} className="h-7 w-7 object-contain" />
            </span>
            <span className="text-xl font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-[1.7] text-white/60">{globalContent.footer.description}</p>
          
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="editable-kicker text-white/50">{column.title}</p>
            <div className="mt-6 grid gap-3">
              {column.links.map((link) =>
                link.href === '#signout' ? (
                  <span key={link.label} className="text-sm font-medium text-white/60">
                    {link.label}
                  </span>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="editable-link w-fit text-sm font-medium text-white/80 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col-reverse items-start justify-between gap-4 px-5 py-8 text-xs text-white/50 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <p>
            © {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
          </p>
          <p className="editable-kicker text-white/40">{globalContent.footer.tagline}</p>
        </div>
      </section>
    </footer>
  )
}
