'use client'

import { useEffect, useRef } from 'react'

interface Options {
  threshold?: number
  staggerMs?: number
}

export function useMobileScrollAnimation(selector: string, options: Options = {}) {
  const containerRef = useRef<HTMLElement>(null)

  /**
   * Desestruturado AQUI, e não dentro do efeito, de propósito.
   *
   * Quem chama passa objeto literal (`{ threshold: 0.2 }`), que é um objeto novo
   * a cada render. Com `options` na lista de dependências — que é o que o
   * `exhaustive-deps` pede quando a leitura acontece lá dentro — o efeito
   * rodaria a cada render: desconectaria e recriaria o IntersectionObserver, e
   * as animações que já tinham disparado voltariam ao estado escondido.
   *
   * Lendo os dois valores fora, a dependência passa a ser o número e não o
   * objeto. A regra fica satisfeita de verdade, sem exceção e sem o efeito
   * colateral.
   */
  const { threshold = 0.1, staggerMs = 100 } = options

  useEffect(() => {
    if (!window.matchMedia('(max-width: 767px)').matches) return

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
  }, [selector, threshold, staggerMs])

  return containerRef
}
