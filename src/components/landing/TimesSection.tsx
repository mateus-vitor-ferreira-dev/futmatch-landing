'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Crown, Clock, History, UserPlus } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * O grupo que joga toda quarta (épico api#202).
 *
 * Primeira das quatro seções de profundidade. A `FeaturesSection` cobre bem o
 * produto de antes — o racha avulso, nove cards de um parágrafo no mesmo peso —
 * e é rasa demais para o que entrou depois, que muda **quem** o produto atende
 * (#63).
 *
 * Cada afirmação daqui aponta para o que a sustenta, como o resto do
 * repositório faz:
 *
 * - **capitão** — `Team.captainId` no schema, e ele responde sozinho pelas
 *   rotas de edição e remoção;
 * - **convite com aceite** — `TeamInviteStatus` é `PENDING | ACCEPTED |
 *   DECLINED | EXPIRED`: entrar num time é decisão de quem entra, não do
 *   capitão;
 * - **vaga garantida por uma janela** — `Match.priorityUntil`, que nasce de
 *   `priorityWindowHours` na criação da partida e reserva as vagas para o time
 *   até uma hora absoluta;
 * - **histórico próprio** — o módulo `teamStats` da api.
 *
 * Layout de duas colunas com o cartão à direita, no partido que a
 * `OwnerSection` já usa. As quatro seções novas não repetem grade entre si de
 * propósito: quatro grades iguais em sequência viram parede.
 */
const pilares = [
  {
    Icon: Crown,
    titulo: 'Alguém manda',
    texto: 'O capitão convida, remove e edita o time. O resto joga.',
  },
  {
    Icon: UserPlus,
    titulo: 'Convite com aceite',
    texto: 'Entrar é decisão de quem entra — o convite espera resposta, e vence sozinho.',
  },
  {
    Icon: Clock,
    titulo: 'Vaga reservada',
    texto: 'A partida do time abre primeiro para o time, por uma janela que o organizador define.',
  },
  {
    Icon: History,
    titulo: 'Histórico do grupo',
    texto: 'Quantas vezes vocês jogaram, quem apareceu, como foi. Não recomeça do zero toda semana.',
  },
]

export default function TimesSection() {
  const sectionRef = useMobileScrollAnimation('.times-title, .times-pilar, .times-card', { staggerMs: 80 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.times-title')
    const left = sectionRef.current?.querySelector('.times-left')
    const right = sectionRef.current?.querySelector('.times-right')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (left) gsap.set(left, { autoAlpha: 0, x: -60 })
    if (right) gsap.set(right, { autoAlpha: 0, x: 60 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      const lados = [left, right].filter(Boolean) as Element[]
      if (lados.length) gsap.to(lados, {
        autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="times" ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="times-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Times fixos</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            O grupo da quarta{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              vira time de verdade
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Antes, cada semana começava do zero: chamar todo mundo de novo, torcer para dar dez.
            Agora o time existe entre uma pelada e a outra.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="times-left space-y-5">
            {pilares.map(({ Icon, titulo, texto }) => (
              <div key={titulo} className="times-pilar flex items-start gap-4 group">
                <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Icon size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{texto}</p>
                </div>
              </div>
            ))}
          </div>

          {/*
            Visual leve, e não print: a `AppPreviewSection` logo acima já mostra
            o app de verdade, e repetir captura em cada seção nova pesaria a
            página. Aqui basta a forma de um time para o texto não virar quatro
            blocos seguidos.
          */}
          <div className="times-right" aria-hidden="true">
            <div className="times-card rounded-2xl border border-white/10 bg-gray-900/60 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-white font-bold">Quarta dos Guerreiros</p>
                  <p className="text-gray-500 text-xs">Futsal · 14 membros</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                  <Crown size={12} /> Capitão
                </span>
              </div>

              <div className="space-y-3">
                {['Mateus V.', 'Fernanda L.', 'Rafael S.'].map((nome, i) => (
                  <div key={nome} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] text-gray-400 font-semibold">
                      {nome.slice(0, 1)}
                    </div>
                    <span className="text-gray-300 text-sm">{nome}</span>
                    {i === 0 && <span className="text-[10px] text-gray-500 ml-auto">organiza</span>}
                  </div>
                ))}
                <p className="text-gray-600 text-xs pl-11">e mais 11</p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                <Clock size={13} className="text-green-400" />
                Vagas reservadas ao time até quarta, 12h
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
