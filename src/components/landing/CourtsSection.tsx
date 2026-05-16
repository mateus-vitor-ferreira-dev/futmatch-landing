'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

// Espelha o enum CourtType do backend (src/constants/sports.js)
const sports = [
  { icon: '⚽', name: 'Society',           desc: 'Campo society — grama sintética',   color: 'from-green-600 to-green-800',   from: { x: -100, y: 0 } },
  { icon: '🏟️', name: 'Futebol de Campo',  desc: 'Campo convencional',                color: 'from-emerald-600 to-emerald-800', from: { x: 0, y: -80 } },
  { icon: '👟', name: 'Futsal',            desc: 'Quadra de futsal coberta',           color: 'from-blue-600 to-blue-800',     from: { x: 100, y: 0 } },
  { icon: '🏖️', name: 'Futevôlei',         desc: 'Quadra de areia',                   color: 'from-orange-500 to-orange-700', from: { x: -100, y: 0 } },
  { icon: '🏐', name: 'Vôlei',             desc: 'Quadra de vôlei indoor',             color: 'from-yellow-500 to-yellow-700', from: { x: 0, y: 80 } },
  { icon: '🌊', name: 'Vôlei de Areia',    desc: 'Quadra de vôlei de areia',           color: 'from-cyan-500 to-cyan-700',     from: { x: 100, y: 0 } },
  { icon: '🤾', name: 'Handebol',          desc: 'Quadra de handebol',                 color: 'from-red-500 to-red-700',       from: { x: -100, y: 0 } },
  { icon: '🖐️', name: 'Peteca',            desc: 'Quadra de peteca',                   color: 'from-pink-500 to-pink-700',     from: { x: 0, y: -80 } },
  { icon: '🎾', name: 'Beach Tennis',      desc: 'Quadra de beach tennis',             color: 'from-lime-500 to-lime-700',     from: { x: 100, y: 0 } },
  { icon: '🏀', name: 'Basquete',          desc: 'Quadra de basquete',                 color: 'from-orange-600 to-red-700',    from: { x: -100, y: 0 } },
  { icon: '🎾', name: 'Tênis',             desc: 'Quadra de tênis',                    color: 'from-purple-500 to-purple-700', from: { x: 0, y: 80 } },
]

export default function CourtsSection() {
  const sectionRef = useMobileScrollAnimation('.courts-title, .sport-card', { staggerMs: 80 })
  const fieldRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw field markings on scroll
      const paths = fieldRef.current?.querySelectorAll('path, circle, line, ellipse')
      if (paths) {
        paths.forEach((path) => {
          const length = (path as SVGGeometryElement).getTotalLength?.() ?? 200
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        })
        gsap.to(Array.from(paths), {
          strokeDashoffset: 0,
          duration: 2.5,
          stagger: 0.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }

      if (window.matchMedia('(min-width: 768px)').matches) {
        const cards = sectionRef.current?.querySelectorAll('.sport-card')
        cards?.forEach((card, i) => {
          const dir = sports[i].from
          gsap.from(card, {
            x: dir.x,
            y: dir.y,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          })
        })
        gsap.from('.courts-title', {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="courts" ref={sectionRef} className="relative bg-gray-950 py-12 md:py-24 overflow-hidden">
      {/* Animated field lines background */}
      <svg
        ref={fieldRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path d="M60 40 H1140 V660 H60 Z" stroke="#22c55e" strokeWidth="2" />
        <line x1="600" y1="40" x2="600" y2="660" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="600" cy="350" r="100" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="600" cy="350" r="5" fill="#22c55e" />
        <path d="M60 260 H180 V440 H60" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M1140 260 H1020 V440 H1140" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M60 300 H120 V400 H60" stroke="#22c55e" strokeWidth="1" />
        <path d="M1140 300 H1080 V400 H1140" stroke="#22c55e" strokeWidth="1" />
        <ellipse cx="60" cy="350" rx="40" ry="70" stroke="#22c55e" strokeWidth="1" />
        <ellipse cx="1140" cy="350" rx="40" ry="70" stroke="#22c55e" strokeWidth="1" />
        <circle cx="220" cy="350" r="5" fill="#22c55e" />
        <circle cx="980" cy="350" r="5" fill="#22c55e" />
        <path d="M350 40 A 250 250 0 0 1 350 660" stroke="#22c55e" strokeWidth="1" strokeDasharray="6 4" />
        <path d="M850 40 A 250 250 0 0 0 850 660" stroke="#22c55e" strokeWidth="1" strokeDasharray="6 4" />
      </svg>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(34,197,94,0.06),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="courts-title text-center mb-8 md:mb-16">
          <Badge variant="dark" className="mb-4">Modalidades</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Quadras para todos os{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              esportes
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Espaços parceiros em diversas modalidades. Encontre a quadra ideal e reserve com poucos cliques.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sports.map((sport, i) => (
            <div
              key={i}
              className="sport-card group relative bg-gray-900 border border-white/10 hover:border-green-500/40 rounded-3xl p-6 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10"
            >
              {/* Card gradient glow on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />

              <div className="relative z-10">
                <div className="mb-4">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">
                    {sport.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{sport.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{sport.desc}</p>
              </div>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${sport.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
