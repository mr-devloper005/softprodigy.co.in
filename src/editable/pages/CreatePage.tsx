'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { taskDisplayLabel } from '@/editable/content/task-pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3.5 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main>
          <section className="border-b border-[var(--editable-border)]">
            <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.85fr_1fr] lg:gap-24 lg:px-10 lg:py-32">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]">
                <Lock className="h-16 w-16 opacity-80" />
              </div>
              <div>
                <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.create.locked.badge}</p>
                <h1 className="editable-display mt-8 text-[3rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[4.5rem]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.locked.description}
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90"
                  >
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-7 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-page-bg)]"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main>
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
              <aside>
                <p className="editable-kicker text-[var(--slot4-muted-text)]">{pagesContent.create.hero.badge}</p>
                <h1 className="editable-display mt-8 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[3.5rem]">
                  {pagesContent.create.hero.title}
                </h1>
                <p className="mt-6 max-w-md text-lg leading-[1.6] text-[var(--slot4-muted-text)]">
                  {pagesContent.create.hero.description}
                </p>
                <div className="mt-10 grid gap-3">
                  {enabledTasks.map((item) => {
                    const active = item.key === task
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setTask(item.key)}
                        className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
                          active
                            ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-[var(--slot4-page-bg)]'
                            : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-page-text)]'
                        }`}
                      >
                        <div>
                          <span className="editable-kicker opacity-70">{item.description}</span>
                          <span className="mt-1 block text-sm font-semibold">{taskDisplayLabel(item.key)}</span>
                        </div>
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    )
                  })}
                </div>
              </aside>

              <form
                onSubmit={submit}
                className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 sm:p-10"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="editable-kicker text-[var(--slot4-muted-text)]">
                      Draft · {taskDisplayLabel(activeTask?.key || 'article', 'singular')}
                    </p>
                    <h2 className="editable-display mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
                      {pagesContent.create.formTitle}
                    </h2>
                  </div>
                  <span className="editable-kicker text-[var(--slot4-muted-text)]">{session.name}</span>
                </div>

                <div className="mt-8 grid gap-4">
                  <input
                    className={fieldClass}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Title"
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      className={fieldClass}
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      placeholder="Category"
                    />
                    <input
                      className={fieldClass}
                      value={url}
                      onChange={(event) => setUrl(event.target.value)}
                      placeholder="Website or source URL"
                    />
                  </div>
                  <input
                    className={fieldClass}
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="Featured image URL"
                  />
                  <textarea
                    className={`${fieldClass} min-h-24 resize-y`}
                    value={summary}
                    onChange={(event) => setSummary(event.target.value)}
                    placeholder="Short summary"
                    required
                  />
                  <textarea
                    className={`${fieldClass} min-h-48 resize-y`}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Main body, details, notes"
                    required
                  />
                </div>

                {created ? (
                  <div className="mt-6 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-5">
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                    </p>
                    <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3.5 text-sm font-medium text-[var(--slot4-page-bg)] transition hover:opacity-90"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
