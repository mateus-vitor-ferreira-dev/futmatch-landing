'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { ArrowRight, BarChart2, LayoutGrid, Users, MapPin, Package, ClipboardList, CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * A lista dizia "métricas de ocupação e receita" e "agenda integrada". Nenhuma
 * das duas existe: `getStats` do painel do dono devolve contagem de espaços,
 * quadras, partidas ativas e solicitações pendentes — e não há tela de agenda.
 * Prometer relatório de receita para quem vai *pagar assinatura* é a pior
 * versão do erro que a #15 pegou na prova social, então cada item aqui aponta
 * para uma tela que existe no painel.
 */
/*
 * A turma e o day use SAÍRAM daqui na #87, e viraram seção própria.
 *
 * Elas entraram como duas linhas no levantamento da #79, que tapou o pior
 * buraco — a página não mencionava dois dos três jeitos de a quadra vender — e
 * registrou que o resto era trabalho de outro tamanho.
 *
 * Saem agora pela mesma decisão que a #63 tomou com o card de torneios da
 * `FeaturesSection`: item de uma linha existe para o que **não** tem seção
 * própria. Mantê-las seria um resumo do que o leitor encontra na rolagem
 * seguinte.
 *
 * O que fica aqui é o que não tem seção: painel, cadastro de quadra, estoque,
 * equipamentos, visibilidade e perfil público. Cada um aponta para tela que
 * existe no painel — a lista já dizia "métricas de ocupação e receita" e
 * "agenda integrada" quando nenhuma das duas existia, e prometer relatório de
 * receita a quem vai pagar assinatura é a pior versão do erro que a #15 pegou.
 */
const benefits = [
  { Icon: BarChart2,     text: 'Painel com seus espaços, quadras e partidas ativas' },
  { Icon: LayoutGrid,    text: 'Cadastro de quadras por modalidade, com preço e status' },
  { Icon: Package,       text: 'Controle de estoque do bar, com alerta de estoque baixo' },
  { Icon: ClipboardList, text: 'Controle de equipamentos emprestados, da saída à devolução' },
  { Icon: Users,         text: 'Visibilidade para todos os jogadores da plataforma' },
  { Icon: MapPin,        text: 'Perfil público do espaço com todas as quadras' },
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
  }, [sectionRef])

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

            {/*
              O jogador não paga; o dono paga. A landing dizia isso em lugar
              nenhum, e omitir o modelo de negócio inteiro só adia a conversa
              para depois do cadastro (landing#44).

              Sem tabela de preço aqui de propósito: `GET /plans` exige
              autenticação, então a landing não tem como ler os valores do banco
              como faz com `/stats`, e preço escrito no código desatualiza na
              primeira mudança. Quem quiser o número vê a grade no painel.
            */}
            <p className="text-gray-500 text-sm pt-1">
              O painel do parceiro é uma assinatura mensal — jogar no Só+1 segue gratuito para
              os jogadores.{' '}
              <a
                href="https://app.so-mais-um.com/owner/plans"
                className="text-green-400 underline underline-offset-4 hover:text-green-300 transition-colors"
              >
                Ver os planos
              </a>
              .
            </p>
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

              {/*
                Os valores são ilustrativos — é um desenho de tela, não uma
                afirmação sobre a plataforma. Os *rótulos*, não: eles precisam
                existir no produto. Antes eram "Jogadores únicos" e "Taxa de
                ocupação", que o painel não calcula; agora são os três
                contadores que o `/owner/stats` devolve de verdade.
              */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Espaços', value: '1' },
                  { label: 'Quadras', value: '3' },
                  { label: 'Partidas ativas', value: '5' },
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
                  // `Court.status` é OPEN ou CLOSED — não existe reserva de
                  // quadra no produto, e "Reservada" sugeria um módulo inteiro
                  // que ninguém construiu.
                  { name: 'Quadra 1 — Society', status: 'Partida em 2h', dot: 'bg-yellow-400' },
                  { name: 'Quadra 2 — Futsal',  status: 'Aberta',        dot: 'bg-green-400' },
                  { name: 'Quadra 3 — Beach Tennis', status: 'Fechada',  dot: 'bg-red-400' },
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
