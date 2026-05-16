'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: '⚽',
    title: 'Organize Peladas',
    description:
      'Crie partidas, defina horários, limites de jogadores e gerencie presenças com facilidade. Sem grupão de WhatsApp lotado.',
    highlight: 'Gestão completa',
  },
  {
    icon: '🏟️',
    title: 'Encontre Quadras',
    description:
      'Descubra espaços esportivos perto de você. Futebol, futsal, society e muito mais. Reserve diretamente pela plataforma.',
    highlight: 'Reserva online',
  },
  {
    icon: '👥',
    title: 'Monte seu Time',
    description:
      'Convide amigos, aceite jogadores avulsos ou sorteie times automaticamente. FutMatch cuida da burocracia para você jogar.',
    highlight: 'Sorteio automático',
  },
  {
    icon: '📊',
    title: 'Histórico e Estatísticas',
    description:
      'Acompanhe seu histórico de peladas, times favoritos e espaços mais frequentados. Dados que revelam quem realmente aparece.',
    highlight: 'Insights do time',
  },
]

export default function FeaturesSection() {
  const sectionRef = useMobileScrollAnimation('.features-title, .feature-card', { staggerMs: 100 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.features-title', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="bg-white py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="features-title text-center mb-8 md:mb-16">
          <Badge className="mb-4">Funcionalidades</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Tudo que você precisa para{' '}
            <span className="text-green-500">jogar mais</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Da organização à reserva, FutMatch centraliza tudo para que você gaste energia na pelada, não na logística.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <div
              key={i}
              className="feature-card group bg-gray-50 hover:bg-white border border-gray-100 hover:border-green-100 hover:shadow-xl hover:shadow-green-500/5 rounded-3xl p-8 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {feat.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{feat.title}</h3>
                    <span className="hidden sm:inline-block text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-100">
                      {feat.highlight}
                    </span>
                  </div>
                  <p className="text-gray-500 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
