import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Get started',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.85fr_1fr] lg:gap-24 lg:px-10 lg:py-32">
            <div className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10">
              <h1 className="editable-display text-2xl font-semibold tracking-[-0.02em]">
                {pagesContent.auth.signup.formTitle}
              </h1>
              <EditableLocalSignupForm />
              <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="editable-link font-medium text-[var(--slot4-page-text)]">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
            <div>
              <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.auth.signup.badge}</p>
              <h2 className="editable-display mt-8 max-w-[16ch] text-balance text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[5.5rem]">
                {pagesContent.auth.signup.title}
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.signup.description}
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
