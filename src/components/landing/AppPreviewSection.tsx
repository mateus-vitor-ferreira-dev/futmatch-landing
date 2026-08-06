'use client'

import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Star, Users, Trophy, Bell, MapPin, Calendar } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ALL_PELADAS = [
  { name: 'Society da Quinta',   local: 'Arena Sul Lavras',       time: 'Qui 19h', price: 'R$ 30', vagas: 4,  total: 12, type: 'Society',     icon: '⚽' },
  { name: 'Beach Tennis Livre',  local: 'Quadra de Areia Centro', time: 'Sáb 08h', price: 'R$ 25', vagas: 2,  total: 4,  type: 'Beach Tennis', icon: '🎾' },
  { name: 'Racha de Futsal',     local: 'Arena Indoor Lavras',    time: 'Sex 20h', price: 'R$ 20', vagas: 7,  total: 10, type: 'Futsal',       icon: '👟' },
  { name: 'Futebol de Campo',    local: 'Campo Municipal Lavras', time: 'Dom 08h', price: 'R$ 15', vagas: 3,  total: 22, type: 'Campo',        icon: '🏟️' },
  { name: 'Vôlei Indoor',        local: 'Ginásio UFLA',           time: 'Ter 19h', price: 'R$ 18', vagas: 5,  total: 12, type: 'Vôlei',        icon: '🏐' },
  { name: 'Torneio de Poker',    local: 'Arena Poker Lavras',     time: 'Sáb 14h', price: 'R$ 50', vagas: 8,  total: 20, type: 'Poker',        icon: '🃏' },
]

const ALL_NOTIFS = [
  { text: 'Lucas entrou na Society da Quinta',    time: 'agora', dot: 'bg-green-500' },
  { text: 'Racha de Futsal está quase lotando!',  time: '2min',  dot: 'bg-yellow-500' },
  { text: 'Você recebeu uma avaliação ⭐⭐⭐⭐⭐', time: '1h',   dot: 'bg-blue-500' },
  { text: 'Pedro entrou no Beach Tennis Livre',   time: '5min',  dot: 'bg-green-500' },
  { text: 'Society da Quinta está quase cheia!',  time: '8min',  dot: 'bg-yellow-500' },
  { text: 'Novo torneio disponível na sua cidade',time: '30min', dot: 'bg-purple-500' },
]

function useCycler<T>(items: T[], interval: number, count: number) {
  const [idx, setIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const active = useRef(false)

  useEffect(() => {
    if (!active.current) return
    const t = setInterval(() => {
      setIdx(i => (i + 1) % items.length)
      setAnimKey(k => k + 1)
    }, interval)
    return () => clearInterval(t)
  }, [items.length, interval])

  const visible = Array.from({ length: count }, (_, i) => items[(idx + i) % items.length])
  return { visible, animKey, activate: () => { active.current = true } }
}

export default function AppPreviewSection() {
  const sectionRef = useMobileScrollAnimation('.preview-title, .preview-left, .preview-right', { staggerMs: 100 })
  const peladas = useCycler(ALL_PELADAS, 3200, 3)
  const notifs  = useCycler(ALL_NOTIFS,  2400, 3)

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.preview-title')
    const left  = sectionRef.current?.querySelector('.preview-left')
    const right = sectionRef.current?.querySelector('.preview-right')

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
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            peladas.activate()
            notifs.activate()
          },
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section ref={sectionRef} className="bg-gray-900 py-12 md:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="preview-title text-center mb-10 md:mb-16">
          <Badge variant="dark" className="mb-4">Plataforma</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Tudo que você precisa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              em um lugar
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Interface limpa, tema escuro, dados em tempo real. Projetado para quem está no campo, não na frente do computador.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Pelada list — cycles automatically */}
          <div className="preview-left flex flex-col gap-3">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-1">Peladas abertas</p>
            <div className="flex flex-col gap-3 flex-1">
              {peladas.visible.map((p, i) => (
                <div
                  key={`${peladas.animKey}-${i}`}
                  className="anim-slide-up bg-gray-800/60 border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors duration-200 flex-1"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs text-gray-500 mb-1 flex items-center gap-1.5">
                        <span>{p.icon}</span> {p.type}
                      </span>
                      <h4 className="text-white font-bold text-base">{p.name}</h4>
                    </div>
                    <span className="text-green-400 font-bold text-sm bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {p.price}<span className="text-gray-500 font-normal">/p.</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5"><Calendar size={11} />{p.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={11} />{p.local}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                      <span>Vagas</span>
                      <span className="text-green-400 font-semibold">{p.vagas} restantes</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        style={{ width: `${((p.total - p.vagas) / p.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Profile + notifications */}
          <div className="preview-right flex flex-col gap-4">
            {/* Profile card */}
            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-6">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold mb-4">Perfil do jogador</p>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                  M
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-bold text-base">Mateus F.</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={11} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-gray-500 text-xs ml-1">4.9 · 38 jogos</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">⭐ Craque</span>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">🤝 Confiável</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Peladas',    value: '38', Icon: Users },
                  { label: 'Torneios',   value: '3',  Icon: Trophy },
                  { label: 'Avaliações', value: '24', Icon: Star },
                ].map(({ label, value, Icon }, i) => (
                  <div key={i} className="bg-gray-900/60 rounded-xl p-3 text-center">
                    <div className="flex justify-center mb-1">
                      <Icon size={14} className="text-green-400" />
                    </div>
                    <div className="text-white font-black text-lg">{value}</div>
                    <div className="text-gray-600 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications — cycles automatically */}
            <div className="bg-gray-800/60 border border-white/5 rounded-2xl p-5 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={14} className="text-green-400" />
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Notificações</p>
                <span className="ml-auto w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black">3</span>
              </div>
              <div className="space-y-3.5">
                {notifs.visible.map((n, i) => (
                  <div
                    key={`${notifs.animKey}-${i}`}
                    className="anim-slide-down flex items-start gap-3"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.dot}`} />
                    <p className="text-gray-400 text-xs leading-relaxed flex-1">{n.text}</p>
                    <span className="text-gray-600 text-[10px] flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
