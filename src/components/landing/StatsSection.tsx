'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

/**
 * Todo número aqui precisa ser verificável — é afirmação pública sobre o
 * produto, num domínio de produção. Contagem de jogadores e "peladas
 * acontecendo agora" ficaram de fora de propósito: são dados que mudam, e
 * constante no código vira mentira na primeira semana. Quando existir rota
 * na API que devolva isso, dá para trazer de volta lendo de lá.
 */
const highlights = [
  { target: 26,  suffix: '+', label: 'Arenas parceiras em Lavras', icon: '🏟️' },
  { target: 12,  suffix: '',  label: 'Modalidades esportivas',     icon: '🏅', description: 'do futsal ao poker' },
  { target: 100, suffix: '%', label: 'Gratuito para jogadores',    icon: '🆓', description: 'sem taxas, para sempre' },
]

export default function StatsSection() {
  const sectionRef = useMobileScrollAnimation('.stat-card', { staggerMs: 120 })
  const countRefs  = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches

      if (!isMobile) {
        gsap.from('.stat-card', {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.1)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }

      // Counter animation
      highlights.forEach((item, i) => {
        const el = countRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: item.target,
          duration: isMobile ? 1 : 1.6,
          ease: 'power2.out',
          delay: i * 0.15,
          onUpdate() {
            el.textContent = Math.ceil(obj.val) + item.suffix
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-gray-950 py-8 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(34,197,94,0.05),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="stat-card group relative bg-gray-900/60 border border-white/5 hover:border-green-500/25 rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(34,197,94,0.06)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/[0.03] group-hover:from-green-500/[0.03] group-hover:to-green-500/[0.06] transition-all duration-500 pointer-events-none" />
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 leading-none mb-1">
                  <span ref={el => { countRefs.current[i] = el }}>0{item.suffix}</span>
                </div>
                <p className="text-gray-300 text-sm font-semibold">{item.label}</p>
                {item.description && (
                  <p className="text-gray-600 text-xs mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
