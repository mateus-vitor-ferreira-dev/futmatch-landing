'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { ClipboardList, Flag, GitBranch, Trophy } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Campeonatos jogáveis (épico api#203).
 *
 * Quarta e última das seções de profundidade da #63. O partido é uma linha do
 * tempo horizontal — nem grade de cards, nem duas colunas —, porque o que esta
 * seção vende é justamente a **sequência**: o campeonato deixou de parar na
 * divisão por categoria e vai até a súmula.
 *
 * Onde cada etapa vive na api:
 *
 * - **inscrição e aprovação** — `tournament-registrations`, com `register`,
 *   `approve` e `cancel`;
 * - **chaveamento** — `bracket.ts`, e a rota de leitura da chave;
 * - **placar** — `PATCH /tournaments/.../matches/:matchId/result`;
 * - **árbitro** — `GET /tournaments/matches/refereeing`, a lista de quem tem
 *   partida para apitar.
 *
 * Os cinco formatos são enumerados, e não contados: saem de `TournamentFormat`,
 * e a `FeaturesSection` já os lista pelo nome desde antes desta seção existir.
 * Repetir o total por extenso criaria um número que nada confere.
 */
const etapas = [
  {
    Icon: ClipboardList,
    titulo: 'Inscrição',
    texto: 'Times ou jogadores se inscrevem na divisão. A organização aprova, ou não.',
  },
  {
    Icon: GitBranch,
    titulo: 'Chaveamento',
    texto: 'A chave sai pronta, com os confrontos de cada rodada.',
  },
  {
    Icon: Flag,
    titulo: 'Árbitro',
    texto: 'Quem apita vê a lista das partidas dele, e só dele.',
  },
  {
    Icon: Trophy,
    titulo: 'Placar e campeão',
    texto: 'O resultado entra na partida, a chave anda, e o campeonato termina com campeã definida.',
  },
]

const formatos = ['Liga', 'Mata-mata', 'Grupos + eliminatória', 'Eliminatória dupla', 'Sistema suíço']

export default function CampeonatosSection() {
  const sectionRef = useMobileScrollAnimation('.camp-title, .camp-etapa, .camp-formato', { staggerMs: 70 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.camp-title')
    const etapasEl = sectionRef.current?.querySelectorAll('.camp-etapa')
    const formatosEl = sectionRef.current?.querySelectorAll('.camp-formato')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (etapasEl?.length) gsap.set(Array.from(etapasEl), { autoAlpha: 0, x: -30 })
    if (formatosEl?.length) gsap.set(Array.from(formatosEl), { autoAlpha: 0, y: 16 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      // Em cascata, e da esquerda para a direita: a animação conta a mesma
      // sequência que o conteúdo.
      if (etapasEl?.length) gsap.to(Array.from(etapasEl), {
        autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      if (formatosEl?.length) gsap.to(Array.from(formatosEl), {
        autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 62%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="campeonatos" ref={sectionRef} className="bg-gray-900 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="camp-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Campeonatos</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Do formato{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              até a súmula
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            O campeonato não para na inscrição. Ele é jogado dentro do Só+1, rodada por rodada,
            até sair campeão.
          </p>
        </div>

        <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* A linha que liga as etapas só existe no desktop, onde elas ficam
              lado a lado. No mobile a lista já é vertical e a linha viraria
              enfeite atravessado. */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-green-500/0 via-green-500/25 to-green-500/0"
          />
          {etapas.map(({ Icon, titulo, texto }, i) => (
            <li key={titulo} className="camp-etapa relative">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 relative z-10 bg-gray-900">
                <Icon size={22} className="text-green-400" />
              </div>
              <p className="text-[11px] font-semibold text-green-400/70 mb-1">Etapa {i + 1}</p>
              <h3 className="text-white font-bold mb-2">{titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{texto}</p>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-white/10 bg-gray-950/40 p-6 md:p-8">
          <p className="text-gray-300 font-medium mb-1">Cinco formatos, e divisões por nível</p>
          <p className="text-gray-500 text-sm mb-5 max-w-2xl">
            Do iniciante ao profissional, cada divisão com a própria chave — para o campeonato não
            virar um time de fábrica contra quatro amigos.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {formatos.map((formato) => (
              <span
                key={formato}
                className="camp-formato inline-flex items-center text-sm text-gray-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
              >
                {formato}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
