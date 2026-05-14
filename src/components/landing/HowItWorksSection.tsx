'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    icon: '📲',
    title: 'Crie sua conta',
    description: 'Cadastre-se em segundos com e-mail ou Google. Sem burocracia.',
  },
  {
    number: '02',
    icon: '🔍',
    title: 'Encontre ou crie uma pelada',
    description: 'Descubra partidas abertas perto de você ou monte a sua própria do zero.',
  },
  {
    number: '03',
    icon: '🥅',
    title: 'Jogue!',
    description: 'Confirme presença, saiba onde jogar e apareça. O resto é com a bola.',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useMobileScrollAnimation('.hiw-title, .step-card', { staggerMs: 150 })
  const lineRef = useRef<SVGLineElement>(null)

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength()
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length })
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        })
      }
      gsap.from('.step-card', {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'back.out(1.4)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      gsap.from('.hiw-title', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-gray-50 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="hiw-title text-center mb-10 md:mb-20">
          <Badge className="mb-4">Como funciona</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Três passos para a{' '}
            <span className="text-green-500">próxima pelada</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Simples, rápido e sem complicação. Como deve ser.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-16 left-0 right-0 px-32">
            <svg className="w-full" height="4" viewBox="0 0 800 4" preserveAspectRatio="none">
              <line
                ref={lineRef}
                x1="0" y1="2" x2="800" y2="2"
                stroke="#22c55e"
                strokeWidth="2"
                strokeDasharray="8 6"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, i) => (
              <div key={i} className="step-card flex flex-col items-center text-center">
                {/* Number badge */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-green-500/30 relative z-10">
                    {step.number}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-green-400 blur-md opacity-40 scale-110" />
                </div>

                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
