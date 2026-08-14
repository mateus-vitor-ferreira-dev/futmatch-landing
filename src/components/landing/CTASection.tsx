'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useMobileScrollAnimation('.cta-content')

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.cta-content', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center cta-content">
        <div className="relative bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 rounded-3xl p-10 md:p-20 overflow-hidden shadow-2xl shadow-green-500/25">
          {/* Field SVG overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <circle cx="300" cy="150" r="80" stroke="white" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="white" strokeWidth="1.5" />
            <path d="M20 20 H580 V280 H20 Z" stroke="white" strokeWidth="2" />
            <path d="M20 110 H100 V190 H20" stroke="white" strokeWidth="1.5" />
            <path d="M580 110 H500 V190 H580" stroke="white" strokeWidth="1.5" />
          </svg>

          {/* Glow orbs */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Animated trophy */}
            <div className="animate-float-slow inline-block mb-4">
              <span className="text-5xl">🏆</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
              Sua próxima partida começa aqui
            </h2>
            <p className="text-green-100/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Crie sua conta gratuita e encontre uma partida hoje. Times sorteados, vagas controladas, reputação garantida.
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              <a href="https://app.so-mais-um.com/register">
                <Button
                  variant="secondary"
                  size="xl"
                  className="group font-bold bg-white text-green-700 hover:bg-white/90 btn-shimmer"
                >
                  Criar conta gratuita
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a
                href="https://app.so-mais-um.com/login"
                className="text-green-100/70 hover:text-white text-sm font-medium transition-colors underline underline-offset-4"
              >
                Já tenho conta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
