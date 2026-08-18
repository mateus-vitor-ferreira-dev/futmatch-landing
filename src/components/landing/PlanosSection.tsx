'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { ArrowRight, BarChart3, Building2, Dumbbell, Package, Volleyball } from 'lucide-react'
import type { GradeDePlanos, PlanoPublico } from '@/lib/planos'

gsap.registerPlugin(ScrollTrigger)

/**
 * "O que eu ganho em cada degrau?" — e não "quanto custa" nem "cabe no meu espaço".
 *
 * A rota que alimenta esta seção não devolve preço, de propósito: o valor é
 * conversa do painel, depois da decisão de virar parceiro.
 *
 * Até a api#278 a comparação era por **quantidade** — quantos espaços, quantas
 * quadras, quantas modalidades. Aquele eixo media o tamanho de quem lia e não o
 * que ele ganhava ao subir: uma arena de duas quadras nunca encostava no teto do
 * plano de entrada e por isso nunca tinha motivo para pagar mais. Agora cada
 * degrau abre uma parte do painel, e é isso que a seção compara.
 *
 * Nenhum plano é destacado como recomendado. Recomendar exigiria saber algo
 * sobre o negócio de quem lê.
 *
 * **Nenhum plano dá direito a quadra.** A armadilha que a #36 pegou continua de
 * pé, só mudou de forma: o que se assina é o painel, e um cartão que insinuasse
 * "quadras inclusas" prometeria o que a plataforma não entrega.
 */

/** O que todo degrau inclui, inclusive o de entrada. */
const INCLUSO_EM_TODO_PLANO = [
  { chave: 'cadastro',  Icon: Building2,  texto: 'Cadastrar a arena e as quadras' },
  { chave: 'partidas',  Icon: Volleyball, texto: 'Receber e administrar as partidas' },
] as const

/** Rótulo de cada funcionalidade, na ordem em que os degraus as abrem. */
const FUNCIONALIDADES = [
  { chave: 'ESTATISTICAS', Icon: BarChart3, texto: 'Estatísticas do espaço' },
  { chave: 'EQUIPAMENTOS', Icon: Dumbbell,  texto: 'Controle de equipamento' },
  { chave: 'ESTOQUE',      Icon: Package,   texto: 'Controle de estoque' },
] as const

/**
 * As linhas de um cartão: o incluso primeiro, o que o degrau abre depois.
 *
 * Sem as duas primeiras, o plano de entrada apareceria como um cartão vazio —
 * ele é o degrau de entrada, não um plano que não faz nada, e cartão vazio não
 * vende nem descreve o produto.
 *
 * A `chave` é o nome do campo e não o texto: dois planos podem repetir rótulo, e
 * texto como `key` dá children com a mesma chave e o React passa a omitir linha.
 */
function linhasDoPlano(plano: PlanoPublico) {
  return [
    ...INCLUSO_EM_TODO_PLANO,
    ...FUNCIONALIDADES.filter(f => plano.funcionalidades.includes(f.chave)),
  ]
}

export interface PlanosSectionProps {
  /** `null` quando a API não respondeu — ver `getGradeDePlanos`. */
  grade: GradeDePlanos | null
}

export default function PlanosSection({ grade }: PlanosSectionProps) {
  const sectionRef = useMobileScrollAnimation('.planos-title, .plano-card, .planos-cta', {
    staggerMs: 90,
  })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.planos-title')
    const cards = sectionRef.current?.querySelectorAll('.plano-card')
    const cta   = sectionRef.current?.querySelector('.planos-cta')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (cards?.length) gsap.set(Array.from(cards), { autoAlpha: 0, y: 40 })
    if (cta) gsap.set(cta, { autoAlpha: 0 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (cards?.length) gsap.to(Array.from(cards), {
        autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      if (cta) gsap.to(cta, {
        autoAlpha: 1, duration: 0.6, delay: 0.25, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  // Sem dado, sem seção. Grade parcial ou vazia faria o dono concluir que o
  // produto não serve para o tamanho dele — pior do que não dizer nada.
  if (!grade) return null

  return (
    <section id="planos" ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="planos-title text-center mb-8 md:mb-14">
          <Badge variant="dark" className="mb-4">Planos</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            O que cada plano{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              abre no painel
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sem limite de quadras, espaços ou modalidades em nenhum plano. Jogar segue
            gratuito para os jogadores — o painel do parceiro é uma assinatura mensal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {grade.planos.map(plano => (
            <div
              key={plano.nome}
              className="plano-card bg-gray-900/60 border border-white/5 hover:border-green-500/30 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <h3 className="text-lg font-bold text-white mb-5">{plano.nome}</h3>

              <ul className="space-y-3.5">
                {linhasDoPlano(plano).map(({ chave, Icon, texto }) => (
                  <li key={chave} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={17} className="text-green-400" />
                    </span>
                    <span className="text-gray-300 text-sm">{texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="planos-cta text-center mt-10">
          {/* A URL vem da própria api, montada a partir do `APP_URL` dela: cravar
              o domínio aqui mandaria quem abre um preview para produção. */}
          <a href={grade.parceiroUrl}>
            <Button size="lg" className="group">
              Cadastrar meu espaço
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <p className="text-gray-600 text-sm mt-4">
            Você escolhe o plano no painel, depois de cadastrar o espaço.
          </p>
        </div>
      </div>
    </section>
  )
}
