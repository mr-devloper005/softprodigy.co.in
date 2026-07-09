import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-2xl bg-[var(--slot4-panel-bg)]', className)} />
}

export function PageLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-8 lg:px-10', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <p className="editable-kicker text-[var(--slot4-muted-text)]">{label}</p>
      <PulseBlock className="mt-8 h-16 w-3/4 max-w-3xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <PulseBlock className="aspect-[4/5] w-full" />
            <PulseBlock className="mt-5 h-5 w-4/5" />
            <PulseBlock className="mt-3 h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-8 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <PulseBlock className="aspect-[4/5] w-full" />
          <PulseBlock className="mt-5 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-10', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <div>
        <p className="editable-kicker text-[var(--slot4-muted-text)]">{label}</p>
        <PulseBlock className="mt-8 h-16 w-4/5" />
        <PulseBlock className="mt-6 aspect-[21/9] w-full" />
        <PulseBlock className="mt-6 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
      </div>
      <PulseBlock className="h-80 w-full" />
    </div>
  )
}
