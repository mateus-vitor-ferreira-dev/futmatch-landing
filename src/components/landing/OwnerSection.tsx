'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { ArrowRight, BarChart2, CalendarCheck, Users, MapPin, CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const benefits = [
  { Icon: BarChart2,    text: 'Painel com métricas de ocupação e receita' },
  { Icon: CalendarCheck, text: 'Agenda de peladas e torneios integrada' },
  { Icon: Users,        text: 'Visibilidade para todos os jogadores da plataforma' },
  { Icon: MapPin,       text: 'Perfil público do espaço com todas as quadras' },
]

export default function OwnerSection() {
  const sectionRef = useMobileScrollAnimation('.owner-title, .owner-card, .owner-benefit', { staggerMs: 80 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title   = sectionRef.current?.querySelector('.owner-title')
    const left    = sectionRef.current?.querySelector('.owner-left')
    const right   = sectionRef.current?.querySelector('.owner-right')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (left)  gsap.set(left,  { autoAlpha: 0, x: -60 })
    if (right) gsap.set(right, { autoAlpha: 0, x: 60 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      const sides = [left, right].filter(Boolean) as Element[]
      if (sides.length) gsap.to(sides, {
        autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="owner" ref={sectionRef} className="bg-gray-900 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="owner-title text-center mb-10 md:mb-16">
          <Badge variant="dark" className="mb-4">Para donos de espaço</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Sua quadra cheia,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              todo fim de semana
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cadastre seu espaço, gerencie suas quadras e conecte-se com jogadores que procuram exatamente o que você oferece.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: benefits list */}
          <div className="owner-left space-y-5">
            {benefits.map(({ Icon, text }, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} className="text-green-400" />
                </div>
                <p className="text-gray-300 font-medium">{text}</p>
              </div>
            ))}

            <div className="pt-4 flex flex-wrap gap-3">
              <a href="https://app.so-mais-um.com/seja-parceiro">
                <Button size="lg" className="group">
                  Quero cadastrar meu espaço
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>

          {/* Right: owner dashboard mockup */}
          <div className="owner-right">
            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Arena Sul Lavras</p>
                  <h3 className="text-white font-bold text-lg">Painel do parceiro</h3>
                </div>
                <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg font-semibold">✓ Ativo</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Peladas este mês', value: '24' },
                  { label: 'Jogadores únicos', value: '187' },
                  { label: 'Taxa de ocupação', value: '78%' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-3 text-center">
                    <div className="text-green-400 font-black text-xl">{s.value}</div>
                    <p className="text-gray-600 text-[10px] mt-0.5 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Courts list */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 uppercase tracking-wider">Suas quadras</p>
                {[
                  { name: 'Quadra 1 — Society', status: 'Pelada em 2h', dot: 'bg-yellow-400' },
                  { name: 'Quadra 2 — Futsal',  status: 'Disponível',   dot: 'bg-green-400' },
                  { name: 'Quadra 3 — Beach Tennis', status: 'Reservada', dot: 'bg-red-400' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="text-gray-300 text-sm">{c.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{c.status}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
                <CheckCircle size={12} className="text-green-500" />
                Aprovado pelo time Só+1 · Visível para todos os jogadores
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
