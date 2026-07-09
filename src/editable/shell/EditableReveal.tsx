'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/*
  IntersectionObserver-driven scroll reveal. Fade + rise, staggered per-index.

  On mount we opt into the `.is-mounted` state (hidden by CSS). Once the
  element enters the viewport we add `.is-visible`. JS-off visitors never
  get `.is-mounted` and see content immediately. `prefers-reduced-motion`
  is honoured inside editable-global.css.
*/
export function EditableReveal({
  children,
  index = 0,
  as: Tag = 'div',
  className = '',
  delayMs,
  once = true,
}: {
  children: ReactNode
  index?: number
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'li'
  className?: string
  delayMs?: number
  once?: boolean
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const style = { transitionDelay: `${delayMs ?? Math.min(index, 12) * 70}ms` }
  const classes = [
    'editable-reveal',
    mounted ? 'is-mounted' : '',
    visible ? 'is-visible' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const Component = Tag as 'div'
  return (
    <Component ref={ref as never} className={classes} style={style}>
      {children}
    </Component>
  )
}
