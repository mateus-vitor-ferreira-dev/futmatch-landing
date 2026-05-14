'use client'

import { useEffect, useRef } from 'react'

interface Options {
  threshold?: number
  staggerMs?: number
}

export function useMobileScrollAnimation(selector: string, options: Options = {}) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return

    const { threshold = 0.1, staggerMs = 100 } = options
    const container = containerRef.current
    if (!container) return

    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector))
    elements.forEach((el) => el.classList.add('scroll-hidden'))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const targets = Array.from(entry.target.querySelectorAll<HTMLElement>(selector))
          targets.forEach((el, i) => {
            setTimeout(() => el.classList.add('is-visible'), i * staggerMs)
          })
          observer.unobserve(entry.target)
        })
      },
      { threshold }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [selector, options.threshold, options.staggerMs])

  return containerRef
}
