'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Search, Shuffle, Star, Zap, Trophy, BarChart2, QrCode, UserCheck, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Cada card aqui é uma afirmação pública sobre o que o produto faz, e a #15
 * já mostrou o preço de afirmar o que não se sustenta. A regra ao mexer neste
 * array: todo card precisa apontar para código que existe hoje. O que está
 * planejado mora na `RoadmapSection`, rotulado como tal.
 *
 * As classes do Tailwind são strings completas de propósito — o JIT do v4 não
 * detecta template string parcial (`bg-${cor}-500` não gera nada).
 */
const features = [
  {
    Icon: Search,
    title: 'Encontre e entre em partidas',
    description:
      'Veja partidas abertas com vagas, horário, quadra e valor. Entre com um clique — sem grupo de WhatsApp, sem planilha.',
    highlight: 'Zero burocracia',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    hoverBorder: 'hover:border-green-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(34,197,94,0.1)]',
  },
  {
    Icon: Shuffle,
    title: 'Sorteio automático de times',
    description:
      'Algoritmo Fisher-Yates: distribuição aleatória, grupos equilibrados, diferença máxima de 1 jogador entre times.',
    highlight: 'Times justos',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(59,130,246,0.1)]',
  },
  {
    Icon: Star,
    title: 'Avaliações com tags e badges',
    // As seis tags são o `enum ReviewTag` da api, não uma lista de exemplo: a
    // landing citava "Craque" (o rótulo é "Craque da Pelada") e o texto errado
    // já contaminou material de marketing uma vez (landing#44).
    description:
      'Avalie com estrelas e uma das seis tags, de Craque da Pelada a Passa de Ano. Os selos são conquistados pelo histórico, automaticamente.',
    highlight: 'Reputação real',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    hoverBorder: 'hover:border-yellow-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(234,179,8,0.1)]',
  },
  {
    Icon: Zap,
    title: 'Notificações em tempo real',
    description:
      'Seja avisado na hora quando alguém entra, a partida lota ou é cancelada. Conexão SSE persistente — sem polling.',
    highlight: 'Ao vivo',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    hoverBorder: 'hover:border-orange-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(249,115,22,0.1)]',
  },
  {
    Icon: Trophy,
    title: 'Torneios por formato e nível',
    // Dizia "controle de inscrições", que não existe: o api#203 registra que o
    // módulo hoje é casca — sem inscrição, chaveamento, partida ou placar. O
    // que falta virou item da `RoadmapSection`, em vez de promessa aqui.
    description:
      'Campeonatos com formato configurável (liga, mata-mata, grupos, dupla eliminação, suíço) e divisões por nível, do iniciante ao profissional.',
    highlight: 'Campeonatos',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.1)]',
  },
  {
    Icon: BarChart2,
    title: 'Perfil e histórico completo',
    description:
      'Partidas criadas, participadas e avaliações recebidas. Seu perfil público mostra badge, média de estrelas e estatísticas.',
    highlight: 'Histórico',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.1)]',
  },
  {
    Icon: QrCode,
    title: 'Rateio por Pix',
    description:
      'O valor total é dividido pelas vagas e a chave Pix do organizador aparece para quem está dentro. O Só+1 não fica no meio do pagamento.',
    highlight: 'Sem vaquinha',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    hoverBorder: 'hover:border-teal-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(20,184,166,0.1)]',
  },
  {
    Icon: UserCheck,
    title: 'Presença confirmada',
    description:
      'O organizador marca quem apareceu de verdade. Quem não fura acumula presença e conquista o selo Confiável.',
    highlight: 'Quem apareceu',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.1)]',
  },
  {
    Icon: ShieldCheck,
    title: 'Conta e dados sob seu controle',
    description:
      'Exporte tudo o que guardamos sobre você ou apague sua conta pelo perfil. Login com Google e sessão em cookie fora do alcance do JavaScript.',
    highlight: 'Seus dados',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    hoverBorder: 'hover:border-indigo-500/40',
    glow: 'hover:shadow-[0_0_24px_rgba(99,102,241,0.1)]',
  },
]

export default function FeaturesSection() {
  const sectionRef = useMobileScrollAnimation('.features-title, .feature-card', { staggerMs: 100 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const cards = sectionRef.current?.querySelectorAll('.feature-card')
    const title = sectionRef.current?.querySelector('.features-title')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (cards) gsap.set(cards, { autoAlpha: 0, y: 60 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (cards?.length) gsap.to(Array.from(cards), {
        autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.1)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="features" ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="features-title text-center mb-8 md:mb-16">
          <Badge variant="dark" className="mb-4">Funcionalidades</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Do racha ao torneio —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              tudo num lugar só
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Só+1 cobre o ciclo completo: descobrir a partida, entrar, dividir o valor, sortear times, jogar, avaliar e construir reputação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <div
              key={i}
              className={`feature-card group relative bg-gray-900/60 border border-white/5 ${feat.hoverBorder} rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${feat.glow} overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.02] group-hover:to-white/[0.04] transition-all duration-300 pointer-events-none" />

              <div className={`w-12 h-12 rounded-xl ${feat.bg} border ${feat.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feat.Icon size={22} className={feat.color} />
              </div>

              <span className={`inline-block text-xs font-semibold ${feat.color} bg-white/5 px-2.5 py-0.5 rounded-full border ${feat.border} mb-3`}>
                {feat.highlight}
              </span>

              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
