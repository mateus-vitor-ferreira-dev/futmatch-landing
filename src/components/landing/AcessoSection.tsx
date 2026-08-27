'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Globe, Link2, Lock, CalendarCheck, Star, Award, Users } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Quem vê e quem entra (épico api#219).
 *
 * Segunda das quatro seções de profundidade da #63. Layout de três cartões em
 * linha, com uma faixa de requisitos embaixo — diferente da grade de duas
 * colunas da `TimesSection` logo acima, de propósito.
 *
 * As três visibilidades saem do enum `MatchVisibility`, e a diferença entre
 * elas é o que o endereço sozinho faz. O `visibility.ts` da api registra:
 * *"ter o id **é** a credencial"* na `LINK`, e em `PRIVATE` a resposta a quem
 * está de fora é 404 e não 403, porque *"403 confirma que aquela partida
 * existe"*.
 *
 * Os requisitos saem de `MatchRequirementType`. Eles são cinco — presença,
 * nota, partidas jogadas, selo e time —, e a copy os **enumera em vez de
 * contá-los**: número escrito à mão envelhece calado, e este já envelheceu uma
 * vez (a #63 pedia "quatro tipos", contando antes de o `BADGE` entrar na
 * api#380). A regra da casa é que o lado que fornece a verdade seja executável,
 * e o `verifica-contrato-com-o-produto.mjs` não confere este enum — então
 * melhor não afirmar um total.
 *
 * O convite por link é revogável, tem validade e limite de uso: são os três
 * jeitos de ele parar de valer, e a tela de detalhe do app trata cada um com
 * mensagem própria (web#229).
 */
const visibilidades = [
  {
    Icon: Globe,
    titulo: 'Pública',
    texto: 'Aparece na busca. Quem encontra, entra — se passar nos requisitos.',
    cor: 'text-green-400',
    fundo: 'bg-green-500/10',
    borda: 'border-green-500/20',
  },
  {
    Icon: Link2,
    titulo: 'Por link',
    texto: 'Fora da busca. Quem recebe o endereço abre e entra, e pode repassá-lo.',
    cor: 'text-blue-400',
    fundo: 'bg-blue-500/10',
    borda: 'border-blue-500/20',
  },
  {
    Icon: Lock,
    titulo: 'Privada',
    texto: 'Fora da busca, e o endereço sozinho não abre. Só entra quem você convidar.',
    cor: 'text-amber-400',
    fundo: 'bg-amber-500/10',
    borda: 'border-amber-500/20',
  },
]

const requisitos = [
  { Icon: CalendarCheck, texto: 'Taxa de presença' },
  { Icon: Star, texto: 'Nota média' },
  { Icon: CalendarCheck, texto: 'Partidas já jogadas' },
  { Icon: Award, texto: 'Selo conquistado' },
  { Icon: Users, texto: 'Ser do time' },
]

export default function AcessoSection() {
  const sectionRef = useMobileScrollAnimation('.acesso-title, .acesso-card, .acesso-chip', { staggerMs: 60 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.acesso-title')
    const cards = sectionRef.current?.querySelectorAll('.acesso-card')
    const chips = sectionRef.current?.querySelectorAll('.acesso-chip')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (cards?.length) gsap.set(Array.from(cards), { autoAlpha: 0, y: 40 })
    if (chips?.length) gsap.set(Array.from(chips), { autoAlpha: 0, y: 16 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (cards?.length) gsap.to(Array.from(cards), {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      if (chips?.length) gsap.to(Array.from(chips), {
        autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="acesso" ref={sectionRef} className="bg-gray-900 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="acesso-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Quem vê e quem entra</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            A partida é sua.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Quem entra também
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Escolha quem enxerga a pelada e quem pode entrar nela. Do jogo aberto para a cidade
            inteira ao fechado só para quem você chamar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {visibilidades.map(({ Icon, titulo, texto, cor, fundo, borda }) => (
            <div
              key={titulo}
              className={`acesso-card rounded-2xl border ${borda} bg-gray-950/40 p-6 transition-colors duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl ${fundo} border ${borda} flex items-center justify-center mb-4`}>
                <Icon size={22} className={cor} />
              </div>
              <h3 className="text-white font-bold mb-2">{titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{texto}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-gray-950/40 p-6 md:p-8">
          <p className="text-gray-300 font-medium mb-1">E dá para exigir mais do que o convite</p>
          <p className="text-gray-500 text-sm mb-5 max-w-2xl">
            Requisitos de entrada barram quem não atende antes do clique — e o app diz o motivo,
            em vez de deixar a pessoa tomar erro.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {requisitos.map(({ Icon, texto }) => (
              <span
                key={texto}
                className="acesso-chip inline-flex items-center gap-2 text-sm text-gray-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
              >
                <Icon size={14} className="text-green-400" />
                {texto}
              </span>
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-5">
            O convite por link é revogável, tem validade e limite de uso.
          </p>
        </div>
      </div>
    </section>
  )
}
