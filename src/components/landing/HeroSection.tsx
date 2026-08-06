'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star, Trophy, Users } from 'lucide-react'

export default function HeroSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const headlineRef  = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const fieldLinesRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Field SVG lines draw-in
      const paths = fieldLinesRef.current?.querySelectorAll('path, circle, line')
      if (paths) {
        paths.forEach((path) => {
          const length = (path as SVGGeometryElement).getTotalLength?.() ?? 300
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        })
        gsap.to(Array.from(paths), {
          strokeDashoffset: 0, duration: 2, stagger: 0.15,
          ease: 'power2.inOut', delay: 0.3,
        })
      }

      // Content entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(cardRef.current, { y: 70, opacity: 0, duration: 1.1, ease: 'back.out(1.2)' })
      tl.from(
        [headlineRef.current, subRef.current, ctaRef.current],
        { y: 40, opacity: 0, duration: 0.7, stagger: 0.12 },
        '-=0.7'
      )
    }, sectionRef)

    // Mouse parallax on card
    const section = sectionRef.current
    const card    = cardRef.current

    // Sem os dois elementos não há parallax a montar, mas o ctx do GSAP acima
    // já existe: retornar seco aqui deixaria a animação de entrada sem
    // limpeza no desmonte.
    if (!section || !card) return () => ctx.revert()

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = section.getBoundingClientRect()
      const x = ((e.clientX - left) / width  - 0.5) * 18
      const y = ((e.clientY - top)  / height - 0.5) * 12
      gsap.to(card, { x, y, duration: 0.6, ease: 'power1.out' })
    }
    const onMouseLeave = () => {
      gsap.to(card, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' })
    }

    section.addEventListener('mousemove', onMouseMove)
    section.addEventListener('mouseleave', onMouseLeave)

    return () => {
      ctx.revert()
      section.removeEventListener('mousemove', onMouseMove)
      section.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden bg-gray-950 min-h-[70vh] md:min-h-screen"
    >
      {/* Field SVG background */}
      <svg
        ref={fieldLinesRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <circle cx="600" cy="350" r="120" stroke="#22c55e" strokeWidth="1.5" opacity="0.15" />
        <circle cx="600" cy="350" r="6"   stroke="#22c55e" strokeWidth="2"   opacity="0.2" />
        <line x1="600" y1="0" x2="600" y2="700" stroke="#22c55e" strokeWidth="1.5" opacity="0.1" />
        <path d="M80 60 H1120 V640 H80 Z"     stroke="#22c55e" strokeWidth="1.5" opacity="0.1" />
        <path d="M80 260 H200 V440 H80"       stroke="#22c55e" strokeWidth="1.5" opacity="0.08" />
        <path d="M1120 260 H1000 V440 H1120"  stroke="#22c55e" strokeWidth="1.5" opacity="0.08" />
        <circle cx="230" cy="350" r="4" fill="#22c55e" opacity="0.15" />
        <circle cx="970" cy="350" r="4" fill="#22c55e" opacity="0.15" />
      </svg>

      {/* Stronger radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(34,197,94,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_75%_55%,rgba(34,197,94,0.06),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-10 md:pt-24 md:pb-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Text side */}
        <div>
          {/* Badge — sem `animate-ping`: a bolinha pulsando comunica "leitura ao
              vivo", e aqui não há nada sendo lido em tempo real. */}
          <div className="inline-flex items-center gap-2.5 bg-gray-900/80 border border-green-500/25 rounded-full px-4 py-2 mb-7 text-sm">
            <span className="inline-flex rounded-full h-2 w-2 bg-green-500" />
            <span className="text-gray-300">
              Plataforma <span className="text-green-400 font-semibold">gratuita</span> para jogadores
            </span>
          </div>

          <h1
            ref={headlineRef}
            className="text-5xl md:text-[4.5rem] font-black text-white leading-[1.05] mb-6"
          >
            Falta um?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400">
              Achou.
            </span>
            <br />
            Quer jogar?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400">
              Entrou.
            </span>
          </h1>

          <p ref={subRef} className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg">
            Encontre peladas abertas na sua cidade, entre com um clique e sorteie os times na hora. Sem grupo de WhatsApp, sem confusão — só jogo.
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <a href="https://app.so-mais-um.com/register">
              <Button size="xl" className="group btn-shimmer">
                Entrar na próxima pelada
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#how-it-works">
              <Button variant="ghost" size="xl" className="text-gray-300 hover:text-white">
                Como funciona
              </Button>
            </a>
          </div>

        </div>

        {/* Card side */}
        <div ref={cardRef} className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Green glow sphere */}
            <div className="absolute -inset-8 bg-green-500/8 rounded-full blur-3xl pointer-events-none" />

            {/* Main card */}
            <div className="relative bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pelada aberta</p>
                  <h3 className="text-white font-bold text-lg">Society da Quinta</h3>
                </div>
                <span className="text-3xl">⚽</span>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { emoji: '📅', text: 'Quinta-feira, 19h' },
                  { emoji: '📍', text: 'Quadra Arena Sul' },
                  { emoji: '💰', text: 'R$ 30 por pessoa · Pix' },
                ].map(({ emoji, text }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-base flex-shrink-0">
                      {emoji}
                    </span>
                    {text}
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Vagas preenchidas</span>
                  <span className="text-green-400 font-semibold">8 / 12</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>

              <Button className="w-full btn-shimmer" size="sm">Entrar na pelada</Button>
            </div>

            {/* Floating badges with float animation */}
            <div className="animate-float absolute -top-4 -right-4 bg-gray-800 border border-green-500/30 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-white text-sm font-semibold">Torneios</span>
            </div>

            <div className="animate-float-slow absolute -bottom-4 -left-4 bg-gray-800 border border-green-500/30 rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2" style={{ animationDelay: '1s' }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={13} className="text-green-400 fill-green-400" />
              ))}
              <span className="text-white text-sm font-semibold ml-1">Craque</span>
            </div>

            <div className="animate-float absolute top-1/2 -translate-y-1/2 -right-14 bg-gray-800 border border-white/10 rounded-2xl px-3 py-2 shadow-xl flex items-center gap-2" style={{ animationDelay: '0.5s' }}>
              <Users size={14} className="text-blue-400" />
              <span className="text-white text-xs font-semibold">12 modalidades</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}
