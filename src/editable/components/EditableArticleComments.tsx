'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-20 border-t border-[var(--tk-line)] pt-12">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageCircle className="h-5 w-5" /> Comments
        <span className="text-[var(--tk-muted)]">({all.length})</span>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-12 w-full rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-5 text-sm text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts…"
          rows={4}
          maxLength={1500}
          className="mt-3 w-full resize-y rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-bg)] px-5 py-4 text-sm leading-6 text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-text)]"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-[var(--tk-on-accent)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Post
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-6">
        {all.map((comment) => (
          <div key={comment.id} className="border-t border-[var(--tk-line)] pt-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tk-text)] text-sm font-semibold text-[var(--tk-on-accent)]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--tk-text)]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? (
                  <p className="editable-kicker text-[var(--tk-muted)]">{timeAgo(comment.createdAt)}</p>
                ) : null}
              </div>
            </div>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.7] text-[var(--tk-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="text-sm text-[var(--tk-muted)]">Be the first to comment.</p> : null}
      </div>
    </section>
  )
}
