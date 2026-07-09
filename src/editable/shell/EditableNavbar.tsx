'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Editorial-masthead navbar.

  Structure (top → bottom):
    1. Utility strip (dark, thin) — an editorial dateline. Kicker on the left,
       rotating meta on the right.
    2. Main row (tall) — bracketed monogram + wordmark on the left; a
       pill-encapsulated centered nav with a middle-dot separator; a
       segmented right group with a circular search button and either
       Sign in / Get started or Submit / Sign out.
    3. Bottom hairline.

  Behaviour:
    - Scroll-collapse: after ~40px scroll, main row tightens (h-16 → h-14)
      and the utility strip fades out for a cleaner reading experience.
    - Active state: a small ink dot sits beside the active link's label
      instead of the usual underline.
    - Mobile: main row collapses to logo + burger; menu sheet mirrors the
      same links plus an auth action row at the bottom.

  Rules from brief (unchanged):
    - No task-page redirect links anywhere. Only About + Contact.
    - Search icon → /search.
    - Right: Sign in / Get started (logged out) or Submit / Sign out (in).
*/

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Directory', href: '/listing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const UTILITY_ROMAN_YEAR = 'MMXXVI'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile sheet on route change.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      {/* 1. Utility strip — editorial dateline */}
      <div
        className={`overflow-hidden bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)] transition-[max-height,opacity] duration-500 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
        }`}
        aria-hidden={scrolled}
      >
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center justify-between gap-6 px-5 py-2 text-[10px] font-medium uppercase tracking-[0.28em] sm:px-8 lg:px-10">
          <span className="truncate">Directory &amp; Editorial · Kept by hand</span>
          <span className="hidden shrink-0 items-center gap-3 sm:inline-flex">
            <span>Shelf · Vol. IV</span>
            <span className="h-[3px] w-[3px] rounded-full bg-current opacity-60" />
            <span>{UTILITY_ROMAN_YEAR}</span>
          </span>
        </div>
      </div>

      {/* 2. Main row */}
      <nav
          className={`mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-6 px-5 transition-[height] duration-300 sm:px-8 lg:px-10 ${
            scrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Left — bracketed monogram + wordmark */}
        <Link href="/" className="editable-display group flex shrink-0 items-center gap-3" aria-label={SITE_CONFIG.name}>
          <span className="relative flex h-10 w-10 items-center justify-center">
            <img
              src="/favicon.ico"
              alt={SITE_CONFIG.name}
              className="relative h-9 w-9 object-contain"
            />
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="text-[17px] font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
              An editorial shelf
            </span>
          </span>
        </Link>

        {/* Center — pill-encapsulated nav */}
        <div className="mx-auto hidden items-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-1 lg:flex">
          {NAV_LINKS.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {index > 0 ? <span className="mx-1 h-1 w-1 rounded-full bg-[var(--editable-border)]" aria-hidden /> : null}
              <Link
                href={item.href}
                className={`relative rounded-full px-5 py-2 text-sm font-medium tracking-[-0.005em] transition ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'
                }`}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Right — segmented action group */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition ${
              isActive('/search')
                ? 'bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                : 'hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)]'
            }`}
          >
            <Search className="h-4 w-4" />
          </Link>

          <span className="hidden h-6 w-px bg-[var(--editable-border)] sm:inline-block" aria-hidden />

          {session ? (
            <>
              <button
                type="button"
                onClick={logout}
                className="hidden text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign out
              </button>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90 sm:inline-flex"
              >
                Submit <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90 sm:inline-flex"
              >
                Get started <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <div className="h-px bg-[var(--editable-border)]" />

      {/* Mobile sheet — mirror of the desktop set */}
      {open ? (
        <div className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)] lg:hidden">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-6 sm:px-8">
            <p className="editable-kicker text-[var(--slot4-muted-text)]">Navigation</p>
            <div className="mt-4 grid divide-y divide-[var(--editable-border)] border-y border-[var(--editable-border)]">
              {[...NAV_LINKS, { label: 'Search', href: '/search' }].map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-4 text-lg font-medium tracking-[-0.015em] transition ${
                      active ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {active ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--slot4-page-text)]" aria-hidden />
                      ) : null}
                      {item.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>

            <p className="editable-kicker mt-8 text-[var(--slot4-muted-text)]">Account</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {session ? (
                <>
                  <Link
                    href="/create"
                    onClick={() => setOpen(false)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-bg)]"
                  >
                    Submit <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex flex-1 items-center justify-center rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-text)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-medium text-[var(--slot4-page-bg)]"
                  >
                    Get started <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
