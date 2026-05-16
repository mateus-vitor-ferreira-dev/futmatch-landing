'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const fieldLinesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Field lines draw-in
      const paths = fieldLinesRef.current?.querySelectorAll('path, circle, line')
      if (paths) {
        paths.forEach((path) => {
          const length = (path as SVGGeometryElement).getTotalLength?.() ?? 300
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        })
        gsap.to(Array.from(paths), {
          strokeDashoffset: 0,
          duration: 2,
          stagger: 0.15,
          ease: 'power2.inOut',
          delay: 0.3,
        })
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Ball drops with bounce
      tl.from(ballRef.current, {
        y: -200,
        x: 120,
        opacity: 0,
        rotation: -720,
        duration: 1.4,
        ease: 'bounce.out',
      })

      // Badge, headline, sub, CTAs stagger in
      tl.from(
        [badgeRef.current, headlineRef.current, subRef.current, ctaRef.current],
        { y: 40, opacity: 0, duration: 0.7, stagger: 0.15 },
        '-=0.8'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden bg-gray-950 min-h-[70vh] md:min-h-screen"
    >
      {/* Field lines SVG background */}
      <svg
        ref={fieldLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Center circle */}
        <circle cx="600" cy="350" r="120" stroke="#22c55e" strokeWidth="1.5" opacity="0.15" />
        <circle cx="600" cy="350" r="6" stroke="#22c55e" strokeWidth="2" opacity="0.2" />
        {/* Half-field line */}
        <line x1="600" y1="0" x2="600" y2="700" stroke="#22c55e" strokeWidth="1.5" opacity="0.1" />
        {/* Outer boundary */}
        <path d="M80 60 H1120 V640 H80 Z" stroke="#22c55e" strokeWidth="1.5" opacity="0.1" />
        {/* Goal areas */}
        <path d="M80 260 H200 V440 H80" stroke="#22c55e" strokeWidth="1.5" opacity="0.08" />
        <path d="M1120 260 H1000 V440 H1120" stroke="#22c55e" strokeWidth="1.5" opacity="0.08" />
        {/* Penalty spots */}
        <circle cx="230" cy="350" r="4" fill="#22c55e" opacity="0.15" />
        <circle cx="970" cy="350" r="4" fill="#22c55e" opacity="0.15" />
      </svg>

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(34,197,94,0.07),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 md:pt-24 md:pb-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text side */}
        <div>
          <div ref={badgeRef}>
            <Badge variant="dark" className="mb-6 text-sm px-4 py-1.5">
              🚀 Plataforma gratuita para jogadores
            </Badge>
          </div>

          <h1
            ref={headlineRef}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
          >
            Organizar sua{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              pelada
            </span>{' '}
            nunca foi tão fácil
          </h1>

          <p ref={subRef} className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
            Conecte jogadores, reserve quadras e gerencie partidas em um único lugar. Do racha da várzea ao torneio organizado.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <a href="https://futmatch-web.vercel.app/register">
              <Button size="xl" className="group">
                Começar grátis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="ghost" size="xl" className="text-gray-300 hover:text-white gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20">
                  <Play size={14} fill="currentColor" />
                </span>
                Como funciona
              </Button>
            </a>
          </div>
        </div>

        {/* Ball side — hidden on mobile to save vertical space */}
        <div className="hidden md:flex items-center justify-center">
          <div ref={ballRef} className="relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-green-500/20 to-green-900/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_80px_rgba(34,197,94,0.15)]">
              <span className="text-[8rem] md:text-[10rem] select-none drop-shadow-2xl">⚽</span>
            </div>
            <div className="absolute -top-4 -right-4 bg-gray-900 border border-green-500/30 rounded-2xl px-4 py-2 text-white text-sm font-semibold shadow-xl">
              🏅 11 modalidades
            </div>
            <div className="absolute -bottom-4 -left-4 bg-gray-900 border border-green-500/30 rounded-2xl px-4 py-2 text-white text-sm font-semibold shadow-xl">
              🆓 100% gratuito
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}
