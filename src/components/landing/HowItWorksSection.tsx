'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { UserPlus, Search, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    Icon: UserPlus,
    title: 'Crie sua conta',
    description:
      'Cadastre-se em segundos com e-mail/senha ou Google. Sem formulário longo, sem burocracia.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    glow: 'shadow-green-500/20',
  },
  {
    number: '02',
    Icon: Search,
    title: 'Encontre ou crie uma pelada',
    description:
      'Filtre por modalidade e cidade ou monte sua própria partida vinculada a uma quadra específica.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    glow: 'shadow-blue-500/20',
  },
  {
    number: '03',
    Icon: Star,
    title: 'Jogue e avalie',
    description:
      'Confirme presença, sorteie os times na hora e avalie os jogadores após a pelada. Sua reputação cresce.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    glow: 'shadow-yellow-500/20',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useMobileScrollAnimation('.hiw-title, .step-card', { staggerMs: 150 })
  const lineRef    = useRef<SVGLineElement>(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength()
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(lineRef.current, {
          strokeDashoffset: 0, duration: 1.5, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
      }

      const stepCards = sectionRef.current?.querySelectorAll('.step-card')
      const hiwTitle  = sectionRef.current?.querySelector('.hiw-title')

      if (stepCards?.length) gsap.set(Array.from(stepCards), { autoAlpha: 0, y: 50 })
      if (hiwTitle) gsap.set(hiwTitle, { autoAlpha: 0, y: 30 })

      if (stepCards?.length) gsap.to(Array.from(stepCards), {
        autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      if (hiwTitle) gsap.to(hiwTitle, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-gray-900 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="hiw-title text-center mb-10 md:mb-20">
          <Badge variant="dark" className="mb-4">Como funciona</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Três passos para a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              próxima pelada
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Simples, rápido e sem complicação. Como deve ser.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-14 left-0 right-0 px-36">
            <svg className="w-full" height="4" viewBox="0 0 800 4" preserveAspectRatio="none">
              <line
                ref={lineRef}
                x1="0" y1="2" x2="800" y2="2"
                stroke="#22c55e" strokeWidth="1.5"
                strokeDasharray="8 6" opacity="0.4"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((step, i) => (
              <div key={i} className="step-card group flex flex-col items-center text-center">
                <div className="relative mb-8">
                  {/* Large background number */}
                  <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-8xl font-black ${step.color} opacity-[0.06] select-none pointer-events-none leading-none`}>
                    {step.number}
                  </span>

                  <div className={`relative w-28 h-28 rounded-2xl bg-gray-800/80 border border-white/10 flex flex-col items-center justify-center gap-2 shadow-xl ${step.glow} group-hover:border-white/20 transition-all duration-300 group-hover:-translate-y-1`}>
                    <span className={`text-xs font-bold tracking-widest ${step.color} opacity-60`}>{step.number}</span>
                    <div className={`w-12 h-12 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.Icon size={22} className={step.color} />
                    </div>
                  </div>
                  <div className={`absolute inset-0 rounded-2xl blur-xl ${step.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
