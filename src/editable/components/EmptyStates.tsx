import Link from 'next/link'
import { ArrowUpRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing on the shelf yet',
  description = 'New entries appear here as they land. Check back — or write in and suggest one.',
  actionLabel = 'Back to the home shelf',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 text-center', className)}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--editable-border)]">
        <SearchX className="h-6 w-6" />
      </div>
      <h2 className="editable-display mt-8 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.7] text-[var(--slot4-muted-text)]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90"
      >
        {actionLabel} <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'entries', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically. The layout stays ready even when the feed is empty.`}
      actionLabel="Back to the home shelf"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for writing in. Your message has been saved to the inbox — we will read it soon."
      actionLabel="Back to the home shelf"
      actionHref="/"
    />
  )
}
