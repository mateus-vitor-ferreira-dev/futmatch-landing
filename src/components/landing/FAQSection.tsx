'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'O Só+1 é gratuito para jogadores?',
    a: 'Sim, 100% gratuito. Jogadores criam conta, entram em peladas e usam todas as funcionalidades sem pagar nada. O valor que aparece na pelada é o custo da quadra cobrado pelo organizador.',
  },
  {
    q: 'Como funciona o sorteio de times?',
    a: 'O organizador clica em "Sortear times" com os participantes confirmados. O sistema usa o algoritmo Fisher-Yates para distribuição aleatória, garantindo grupos com diferença máxima de 1 jogador entre times.',
  },
  {
    q: 'Posso criar uma pelada sem ter uma quadra cadastrada?',
    a: 'A pelada precisa ser vinculada a uma quadra cadastrada na plataforma. Se a quadra do seu racha ainda não está no Só+1, entre em contato com o dono do espaço para solicitar o cadastro — ou cadastre você mesmo pelo portal de parceiros.',
  },
  {
    q: 'Como funcionam os badges de reputação?',
    a: 'Após cada pelada finalizada, os participantes se avaliam com estrelas (1–5) e tags como Craque, Fair Play e Pontual. O sistema calcula automaticamente os badges com base no histórico acumulado.',
  },
  {
    q: 'Sou dono de uma quadra. Como cadastro meu espaço?',
    a: 'Acesse o portal de parceiros em app.so-mais-um.com/seja-parceiro. Após aprovação pelo nosso time, você gerencia suas quadras, visualiza estatísticas e pode criar torneios pelo painel de parceiro.',
  },
  {
    q: 'As notificações funcionam sem recarregar a página?',
    a: 'Sim. Usamos SSE (Server-Sent Events) — uma conexão persistente entre o app e o servidor. Quando alguém entra na pelada, lota ou cancela, você recebe a notificação em tempo real sem precisar recarregar.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen]      = useState(false)
  const contentRef           = useRef<HTMLDivElement>(null)

  const toggle = () => {
    const el = contentRef.current
    if (!el) { setOpen(o => !o); return }

    if (!open) {
      setOpen(true)
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    } else {
      gsap.to(el, {
        height: 0, opacity: 0, duration: 0.22, ease: 'power2.in',
        onComplete: () => setOpen(false),
      })
    }
  }

  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${open ? 'border-green-500/20 bg-gray-900/80' : 'border-white/5 hover:border-white/10 bg-gray-900/40'}`}>
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="text-white font-semibold pr-4 text-sm md:text-base group-hover:text-green-400 transition-colors duration-200">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 transition-all duration-300 ${open ? 'rotate-180 text-green-400' : 'text-gray-500 group-hover:text-green-400'}`}
        />
      </button>

      {/* Animated content wrapper */}
      <div ref={contentRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <div className="px-5 pb-5">
          <p className="text-gray-400 leading-relaxed text-sm pt-3 border-t border-white/5">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const sectionRef = useMobileScrollAnimation('.faq-title, .faq-item', { staggerMs: 60 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.faq-title')
    const items = sectionRef.current?.querySelectorAll('.faq-item')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (items?.length) gsap.set(Array.from(items), { autoAlpha: 0, y: 30 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (items?.length) gsap.to(Array.from(items), {
        autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="faq-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Dúvidas frequentes</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Perguntas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              frequentes
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Tudo que você precisa saber antes de entrar na pelada.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
            <div key={i} className="faq-item">
              <FAQItem q={item.q} a={item.a} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
