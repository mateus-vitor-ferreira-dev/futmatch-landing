'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  { value: '100%', label: 'Gratuito para jogadores', icon: '🆓' },
  { value: '11',   label: 'modalidades esportivas',  icon: '🏅' },
  { value: '24h',  label: 'Disponível a qualquer hora', icon: '⏱️' },
]

export default function StatsSection() {
  const sectionRef = useMobileScrollAnimation('.stat-card', { staggerMs: 120 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.from('.stat-card', {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-gray-900 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="stat-card bg-gray-800/50 border border-white/5 rounded-2xl p-8 flex items-center gap-6"
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <div className="text-4xl font-black text-green-400">{item.value}</div>
                <p className="text-gray-400 text-sm mt-1">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
