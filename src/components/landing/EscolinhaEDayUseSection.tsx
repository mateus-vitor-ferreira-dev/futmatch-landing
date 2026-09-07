'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { CalendarDays, ClipboardCheck, GraduationCap, Ticket, Users, Wallet } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Os outros dois jeitos de a quadra vender (épicos api#444 e api#505, #87).
 *
 * ## Por que esta seção existe
 *
 * O README da api abre dizendo que **a quadra se vende de três jeitos, não de
 * um** — partida, turma e day use —, e a landing contava um. O levantamento da
 * #79 mediu o buraco: `escolinha`, `aula`, `professor`, `mensalidade`,
 * `day use` e `chamada` apareciam em **zero** seções, enquanto 26 das 148 rotas
 * que a api publica em produção serviam esses dois formatos.
 *
 * A #79 tapou o pior — duas linhas na lista da `OwnerSection` — e disse que o
 * resto era trabalho de outro tamanho. É esta seção.
 *
 * ## As duas linhas da OwnerSection saíram
 *
 * Mesma decisão que a #63 tomou com o card de torneios da `FeaturesSection`:
 * *"cards de um parágrafo existem para o que não tem seção própria"*. Mantê-las
 * seria um resumo do que o leitor encontra logo em seguida.
 *
 * ## O que cada afirmação aqui sustenta
 *
 * Todas apontam para tela que existe **em produção**, e não na `develop` — que
 * é a regra que a #79 estabeleceu depois de a #15 e a #64 custarem caro:
 *
 * - **turma com dia, horário, vagas e mensalidade** — `/owner/turmas`
 * - **matrícula, e o aluno sem conta** — `/owner/turmas/:id/alunos`;
 *   `Matricula.userId` é anulável de propósito (api#474)
 * - **mensalidade por competência** — `/owner/turmas/:id/mensalidades`
 * - **professor com vínculo por espaço** — `/owner/professores`, e a área dele
 *   em `/professor` (api#451, #484)
 * - **chamada** — `/professor`, dentro de cada aula, e `/owner/.../chamada`
 * - **day use com entrada avulsa** — `/owner/day-uses` e as entradas de cada um
 * - **o jogador encontra o day use** — `components/DayUsesDoDia`, no Quero Jogar
 *
 * ## A âncora existe, e o menu não ganha item
 *
 * A seção tem `id="escolinha"` para link direto, e **não** entra na navbar. É
 * a mesma decisão da #63, que agrupou quatro seções sob um `#recursos` só:
 * *"o que a pessoa procura no menu é o assunto, não cada seção"*.
 *
 * Aqui o assunto já está lá. Esta seção vem imediatamente depois da
 * `OwnerSection`, que é o destino de **"Para espaços"** — quem clica no menu
 * cai no pitch do dono e rola direto para os três jeitos de vender. Um sétimo
 * item apontaria para 300px abaixo do sexto.
 *
 * ## O que NÃO está aqui, e não pode entrar
 *
 * **Nada dirigido ao aluno.** `GET /me/turmas` e `GET /me/aulas` respondem em
 * produção e **nenhuma tela do web as consome** — o que existe fora do painel
 * do dono é a área do *professor*. Prometer "acompanhe suas aulas" seria
 * exatamente a #64 de novo: rota viva não é funcionalidade entregue.
 */
const formatos = [
  {
    Icon: GraduationCap,
    badge: 'Escolinha',
    titulo: 'A turma que acontece toda semana',
    texto:
      'Mesmo dia, mesmo horário, mesma quadra. O espaço cadastra a turma com as vagas e o valor, ' +
      'e ela ocupa a agenda sozinha — sem alguém remarcar toda segunda.',
    pontos: [
      { Icon: Users,          texto: 'Matrícula com ou sem conta: quem faz aula de vôlei na terça raramente baixou o app' },
      { Icon: Wallet,         texto: 'Mensalidade por mês de competência — quem pagou, quem falta' },
      { Icon: ClipboardCheck, texto: 'Chamada na aula, feita pelo professor no celular, em quadra' },
    ],
  },
  {
    Icon: Ticket,
    badge: 'Day use',
    titulo: 'A entrada avulsa do dia',
    texto:
      'O espaço abre uma janela, põe o preço, e quem chegar paga por pessoa. ' +
      'Sem mensalidade, sem combinar time — e com preço próprio para quem já é aluno.',
    pontos: [
      { Icon: CalendarDays, texto: 'Quem entrou, quem já pagou e quanto ainda cabe' },
      { Icon: Users,        texto: 'Entrada de quem não tem conta, registrada no balcão' },
      { Icon: Ticket,       texto: 'E o jogador encontra os day uses do dia dentro do Quero Jogar' },
    ],
  },
]

export default function EscolinhaEDayUseSection() {
  const sectionRef = useMobileScrollAnimation('.esc-title, .esc-card, .esc-agenda', { staggerMs: 90 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.esc-title')
    const cards = sectionRef.current?.querySelectorAll('.esc-card')
    const agenda = sectionRef.current?.querySelector('.esc-agenda')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (cards?.length) gsap.set(cards, { autoAlpha: 0, y: 40 })
    if (agenda) gsap.set(agenda, { autoAlpha: 0, y: 40 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (cards?.length) gsap.to(cards, {
        autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
      if (agenda) gsap.to(agenda, {
        autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="escolinha" ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="esc-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Escolinha e day use</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            A quadra vende de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              três jeitos
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A partida é combinada e rateada entre quem joga. Os outros dois são do espaço —
            e dividem a mesma agenda, que é o que impede vender a mesma sexta duas vezes.
          </p>
        </div>

        {/* Duas colunas de peso igual: nenhum dos dois formatos é o principal. */}
        <div className="grid md:grid-cols-2 gap-6">
          {formatos.map(({ Icon, badge, titulo, texto, pontos }) => (
            <article
              key={badge}
              className="esc-card rounded-2xl border border-white/10 bg-gray-900/60 p-7 hover:border-green-500/25 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <Icon size={22} className="text-green-400" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-green-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-green-500/20">
                  {badge}
                </span>
              </div>

              <h3 className="text-white text-xl font-bold mb-2">{titulo}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{texto}</p>

              <ul className="space-y-3">
                {pontos.map(({ Icon: Ponto, texto: t }) => (
                  <li key={t} className="flex items-start gap-3">
                    <Ponto size={16} className="text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-400 text-sm leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/*
          A agenda do professor, que é a ponta menos óbvia dos dois formatos: a
          turma não é só cadastro do dono — alguém dá a aula, e essa pessoa tem
          onde ver o que dá e marcar quem veio.

          Visual leve, e não print, pela mesma razão da `TimesSection`: a
          `AppPreviewSection` já mostra o app de verdade.
        */}
        <div className="esc-agenda mt-8 rounded-2xl border border-white/10 bg-gray-900/60 p-6" aria-hidden="true">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap size={16} className="text-green-400" />
            <p className="text-white font-bold text-sm">Minhas aulas · hoje</p>
            <span className="text-gray-600 text-xs ml-auto">o professor, em duas academias</span>
          </div>

          <div className="space-y-3">
            {[
              { hora: '18:00–19:00', turma: 'Beach Tennis', onde: 'Na Praia · Quadra 1' },
              { hora: '20:00–21:00', turma: 'Vôlei',        onde: 'Sunset · Quadra A' },
            ].map(({ hora, turma, onde }) => (
              <div key={hora} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <span className="text-white font-bold text-sm tabular-nums">{hora}</span>
                <div className="min-w-0">
                  <p className="text-gray-300 text-sm">{turma}</p>
                  <p className="text-gray-600 text-xs truncate">{onde}</p>
                </div>
                <span className="ml-auto text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Fazer chamada
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
