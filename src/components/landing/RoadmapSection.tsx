'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { CalendarX, MessageCircle, UserCheck } from 'lucide-react'

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
 *
 * O erro que esta lista já cometeu, e o que impede a repetição
 * ------------------------------------------------------------
 * Os cinco itens anteriores — times fixos, sorteio equilibrado, partidas
 * perto, partida privada e campeonatos jogáveis — **foram todos ao ar** e a
 * seção continuou chamando cada um de "Planejado". A página passou a prometer
 * *menos* do que o produto entrega, que é o inverso da #15 e custa igual: o
 * visitante decide pelo que lê, e um roadmap que lista como futuro o que já
 * existe também diz que o roadmap não anda (#62).
 *
 * Ninguém acharia isso lendo a landing — só comparando a seção com o board. Por
 * isso cada item carrega o `issue` que o sustenta: o
 * `scripts/verifica-contrato-com-o-produto.mjs` pergunta ao GitHub se ela
 * continua aberta, e o `RoadmapSection.test.tsx` garante que nenhum item entre
 * sem uma. A regra deixou de depender de disciplina.
 */
const itens = [
  {
    Icon: CalendarX,
    title: 'Partida sem gente se cancela sozinha',
    description:
      'A partida que não bate o mínimo de jogadores até a hora do jogo é cancelada sozinha, e quem tinha confirmado é avisado — em vez de todo mundo descobrir na quadra.',
    status: 'Planejado',
    issue: 'so-mais-um-api#381',
  },
  {
    Icon: MessageCircle,
    title: 'Aviso no WhatsApp, não só no e-mail',
    description:
      'Confirmação, lembrete e cancelamento chegam onde a pessoa realmente lê. Hoje tudo o que o Só+1 fala com o jogador sai por e-mail, e só por e-mail.',
    status: 'Planejado',
    issue: 'so-mais-um-api#382',
  },
  {
    Icon: UserCheck,
    title: 'Fechar a partida para quem te conhece',
    description:
      'Exigir vínculo social para entrar: só quem te segue, ou quem é seu amigo. Hoje o único vínculo entre pessoas que dá para exigir é ser do mesmo time.',
    status: 'Planejado',
    issue: 'so-mais-um-api#387',
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
  }, [sectionRef])

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
