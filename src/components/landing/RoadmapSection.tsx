'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Users, Scale, Navigation, Lock, Trophy } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * O que ainda não existe.
 *
 * A landing é pública e está em produção, e a #15 já custou uma seção inteira
 * por afirmar o que o produto não sustentava. Roadmap é o caso limite disso:
 * é informação verdadeira sobre o futuro que, misturada às funcionalidades,
 * vira promessa sobre o presente. Daí esta seção existir separada — e daí ela
 * ser desenhada para *não* parecer a `FeaturesSection`: borda tracejada,
 * paleta âmbar em vez do verde de marca, sem o glow de hover e com o status
 * escrito em cada cartão. Quem bate o olho tem que ver a diferença antes de
 * ler o texto.
 *
 * Os itens saem dos épicos do board, com o título derivado do card. Nada aqui
 * pode nascer de ideia solta: se não tem issue, não entra na lista.
 */
const itens = [
  {
    Icon: Users,
    title: 'Times fixos com capitão',
    description:
      'O grupo que joga toda quarta vira um time de verdade: capitão, convite, vaga garantida aos membros e histórico próprio.',
    status: 'Planejado',
  },
  {
    Icon: Scale,
    title: 'Sorteio equilibrado por nível e posição',
    description:
      'Cada jogador declara posição e nível por modalidade, e o sorteio passa a dividir por força — não mais no puro aleatório.',
    status: 'Planejado',
  },
  {
    Icon: Navigation,
    title: 'Partidas perto de você',
    description:
      'Busca por raio a partir de onde você está, em vez de nome de bairro. Quem mora na divisa para de perder o jogo do outro lado da rua.',
    status: 'Planejado',
  },
  {
    Icon: Lock,
    title: 'Partida privada, por link ou com requisitos',
    description:
      'Escolha quem enxerga a partida e quem pode entrar: pública, só por link ou fechada, com requisito de presença, nota ou selo.',
    status: 'Planejado',
  },
  {
    Icon: Trophy,
    title: 'Campeonatos jogáveis',
    description:
      'Inscrição, chaveamento, partida com placar e árbitro que lança a súmula. Hoje o campeonato só existe até a divisão por categoria.',
    status: 'Em estudo',
  },
]

export default function RoadmapSection() {
  const sectionRef = useMobileScrollAnimation('.roadmap-title, .roadmap-card', {
    staggerMs: 80,
  })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.roadmap-title')
    const cards = sectionRef.current?.querySelectorAll('.roadmap-card')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (cards?.length) gsap.set(Array.from(cards), { autoAlpha: 0, y: 40 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (cards?.length) gsap.to(Array.from(cards), {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="roadmap" ref={sectionRef} className="bg-gray-900 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="roadmap-title text-center mb-8 md:mb-14">
          <Badge variant="dark" className="mb-4 text-amber-400 border-amber-500/30">
            Em breve
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            O que ainda{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-300">
              não está pronto
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Estas não são funcionalidades do Só+1 — ainda. São as próximas, com card aberto no
            board público. Ficam aqui separadas justamente para ninguém se cadastrar esperando
            encontrá-las hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {itens.map((item, i) => (
            <div
              key={i}
              className="roadmap-card relative bg-gray-950/40 border border-dashed border-white/10 rounded-2xl p-7 transition-colors duration-300 hover:border-amber-500/30"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-dashed border-amber-500/25 flex items-center justify-center">
                  <item.Icon size={22} className="text-amber-400/80" />
                </div>
                <span className="inline-block text-[11px] font-semibold text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-200 mb-2">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
