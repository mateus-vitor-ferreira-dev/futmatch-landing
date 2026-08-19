'use client'

import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import type { NumerosPublicos } from '@/lib/stats'

gsap.registerPlugin(ScrollTrigger)

/**
 * Todo número aqui precisa ser verificável — é afirmação pública sobre o
 * produto, num domínio de produção.
 *
 * Os que mudam vêm da API (`GET /stats`), que os conta no banco. Os que não
 * mudam continuam aqui, porque são fato de produto e não medição: a lista de
 * modalidades e a gratuidade para jogadores não dependem de quantas pessoas se
 * cadastraram.
 *
 * **Sem indicador de "ao vivo".** A resposta é revalidada a cada 5 minutos, e
 * bolinha piscando ao lado de dado de 5 minutos atrás é a mesma promessa falsa
 * que derrubou a primeira versão desta seção.
 */
interface Cartao {
  target: number
  suffix: string
  label: string
  icon: string
  /** Linha de apoio, só onde acrescenta — nem todo cartão precisa. */
  description?: string
  /**
   * Abaixo disto o cartão não entra. Ausente nos fixos, que não são medição:
   * "12 modalidades" não fica mais ou menos verdade conforme a base cresce.
   */
  minimo?: number
}

/**
 * Quanto cada número precisa valer para sustentar a afirmação que ele faz.
 *
 * Esconder o zero não bastou (#36). Prova social existe para responder "outras
 * pessoas usam isso?", e respondida com **2** ela chama atenção justamente para
 * a falta de tração que deveria disfarçar — na primeira dobra, para todo
 * visitante. O número é verdadeiro; o problema é que exibi-lo custa mais do que
 * omiti-lo. Sem o cartão, quem visita não conclui nada. Com ele, conclui que
 * ninguém usa.
 *
 * Os valores são por cartão porque convencem em escalas diferentes: "3 cidades
 * atendidas" é plausível, "3 jogadores" é constrangedor. Não existe cálculo por
 * trás — é julgamento, e revisá-lo é mudar um número aqui.
 *
 * O mesmo limiar vale no painel de login do app, em
 * `so-mais-um-web/src/components/AuthLayout/index.tsx`: é a mesma afirmação,
 * dita ao mesmo visitante, e as duas telas não podem discordar.
 */
const LIMIARES = {
  jogadores:      50,
  peladasAbertas:  5,
  cidades:         3,
  arenas:          3,
}

const FIXOS: Cartao[] = [
  { target: 12,  suffix: '',  label: 'Modalidades esportivas',  icon: '🏅', description: 'do futsal ao poker' },
  { target: 100, suffix: '%', label: 'Gratuito para jogadores', icon: '🆓', description: 'sem taxas, para sempre' },
]

/**
 * Quando a API não responde, sobram só os fixos — nunca um zero no lugar.
 *
 * E o mesmo vale para o cartão que **veio** fraco. O guarda de `null` cobre a
 * API fora do ar; não cobre o caso que a produção mostra hoje, em que a rota
 * responde 200 com números que ainda não sustentam a afirmação. "0 jogadores
 * na plataforma" é verdade e ainda assim é o pior cartaz possível numa
 * landing — e o contador animando de 0 até 0 parece defeito, não dado. Cartão
 * abaixo do `minimo` some; os fixos seguram a seção de pé.
 */
function montarCartoes(numeros: NumerosPublicos | null): Cartao[] {
  if (!numeros) return FIXOS

  const doDado: Cartao[] = [
    { target: numeros.arenas,         suffix: '', label: 'Arenas parceiras',    icon: '🏟️', minimo: LIMIARES.arenas },
    { target: numeros.jogadores,      suffix: '', label: 'Jogadores na plataforma', icon: '👥', minimo: LIMIARES.jogadores },
    // O rótulo virou "Partidas" (web#245), mas a chave continua
    // `peladasAbertas`: é o nome do campo em `GET /stats`, e renomear aqui
    // quebraria o contrato com a API sem trocar uma letra do que se lê na tela.
    { target: numeros.peladasAbertas, suffix: '', label: 'Partidas abertas',    icon: '⚽', description: 'atualizado a cada 5 minutos', minimo: LIMIARES.peladasAbertas },
    { target: numeros.cidades,        suffix: '', label: 'Cidades atendidas',   icon: '📍', minimo: LIMIARES.cidades },
  ]

  return [...doDado.filter(cartao => cartao.target >= (cartao.minimo ?? 1)), ...FIXOS]
}

export interface StatsSectionProps {
  /** Números da API. `null` quando ela não respondeu — ver getNumerosPublicos. */
  numeros: NumerosPublicos | null
}

export default function StatsSection({ numeros }: StatsSectionProps) {
  // useMemo para o efeito abaixo não rodar de novo a cada render: sem isso, o
  // array seria novo toda vez e a animação reiniciaria sozinha.
  const highlights = useMemo(() => montarCartoes(numeros), [numeros])

  /**
   * Grade do tamanho do que há para mostrar.
   *
   * Fixa em três colunas, a seção com só os dois cartões fixos — o caso de hoje,
   * e o mesmo de quando a API não responde — deixa um vão à direita que lê como
   * defeito de layout. Duas colunas para dois cartões, três a partir daí.
   */
  const colunas = highlights.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'

  const sectionRef = useMobileScrollAnimation('.stat-card', { staggerMs: 120 })
  const countRefs  = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches

      if (!isMobile) {
        gsap.from('.stat-card', {
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'back.out(1.1)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }

      // Counter animation
      highlights.forEach((item, i) => {
        const el = countRefs.current[i]
        if (!el) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: item.target,
          duration: isMobile ? 1 : 1.6,
          ease: 'power2.out',
          delay: i * 0.15,
          onUpdate() {
            el.textContent = Math.ceil(obj.val) + item.suffix
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [highlights, sectionRef])

  return (
    <section ref={sectionRef} className="relative bg-gray-950 py-8 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(34,197,94,0.05),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className={`grid grid-cols-1 ${colunas} gap-4`}>
          {highlights.map((item, i) => (
            <div
              key={i}
              className="stat-card group relative bg-gray-900/60 border border-white/5 hover:border-green-500/25 rounded-2xl p-8 flex items-center gap-6 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(34,197,94,0.06)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/[0.03] group-hover:from-green-500/[0.03] group-hover:to-green-500/[0.06] transition-all duration-500 pointer-events-none" />
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 leading-none mb-1">
                  <span ref={el => { countRefs.current[i] = el }}>0{item.suffix}</span>
                </div>
                <p className="text-gray-300 text-sm font-semibold">{item.label}</p>
                {item.description && (
                  <p className="text-gray-600 text-xs mt-0.5">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
