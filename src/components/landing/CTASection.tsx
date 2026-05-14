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
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center cta-content">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-green-500/20">
          {/* Field pattern inside CTA */}
          <svg
            className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            viewBox="0 0 600 300"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <circle cx="300" cy="150" r="80" stroke="white" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="300" stroke="white" strokeWidth="1.5" />
            <path d="M20 20 H580 V280 H20 Z" stroke="white" strokeWidth="2" />
          </svg>

          <div className="relative z-10">
            <span className="text-5xl mb-6 block">🏆</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Pronto para a próxima pelada?
            </h2>
            <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
              Junte-se a centenas de jogadores que já usam o FutMatch para organizar suas partidas. Grátis para sempre.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://futmatch-web.vercel.app/register">
                <Button variant="secondary" size="xl" className="group font-bold">
                  Criar conta gratuita
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="https://futmatch-web.vercel.app/login">
                <Button
                  size="xl"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold"
                >
                  Já tenho conta
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
