'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'
import { Navigation, MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

/**
 * Peladas perto de você (épico api#211).
 *
 * Terceira das quatro seções de profundidade da #63. O partido é o inverso da
 * `TimesSection` — visual à esquerda, texto à direita —, para as quatro não
 * caírem no mesmo desenho.
 *
 * O que a copy afirma, e onde isso vive:
 *
 * - **busca por raio** — `GET /events/recommended` recebe `latitude`,
 *   `longitude` e `radiusKm`; o app manda os três juntos a partir do filtro de
 *   distância;
 * - **a distância em cada partida** — a resposta traz a distância calculada,
 *   e a lista a mostra em cada cartão;
 * - **de onde a pessoa está** — a origem preferida é a do navegador, e o
 *   endereço salvo é a rede de segurança para quem negou a permissão ou abre no
 *   computador (`useOrigemDeLocalizacao`, web#222).
 *
 * **Sem número de raio escrito aqui.** Os valores oferecidos pelo filtro moram
 * no app e mudam sem passar por esta página; os anéis abaixo são desenho, não
 * tabela — daí serem `aria-hidden` e não citarem quilometragem no texto lido.
 */
export default function PertoSection() {
  const sectionRef = useMobileScrollAnimation('.perto-title, .perto-texto, .perto-visual', { staggerMs: 80 })

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) return

    const title = sectionRef.current?.querySelector('.perto-title')
    const left = sectionRef.current?.querySelector('.perto-visual')
    const right = sectionRef.current?.querySelector('.perto-texto')

    if (title) gsap.set(title, { autoAlpha: 0, y: 30 })
    if (left) gsap.set(left, { autoAlpha: 0, scale: 0.9 })
    if (right) gsap.set(right, { autoAlpha: 0, x: 60 })

    const ctx = gsap.context(() => {
      if (title) gsap.to(title, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      if (left) gsap.to(left, {
        autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
      if (right) gsap.to(right, {
        autoAlpha: 1, x: 0, duration: 0.9, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="perto" ref={sectionRef} className="bg-gray-950 py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="perto-title text-center mb-10 md:mb-14">
          <Badge variant="dark" className="mb-4">Peladas perto de você</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Quem mora na divisa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              para de perder o jogo da esquina
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A busca mede a partir de onde você está, e não do nome do bairro. O jogo do outro lado
            da rua deixa de ser o jogo de outra cidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Os anéis são desenho, não medida — ver o comentário do módulo. */}
          <div className="perto-visual flex justify-center" aria-hidden="true">
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-green-500/10" />
              <div className="absolute inset-8 rounded-full border border-dashed border-green-500/20" />
              <div className="absolute inset-16 rounded-full border border-dashed border-green-500/30" />

              <div className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center">
                <Navigation size={20} className="text-green-400" />
              </div>

              <span className="absolute top-6 right-10 inline-flex items-center gap-1.5 text-[11px] text-gray-300 bg-gray-900/90 border border-white/10 px-2.5 py-1 rounded-full">
                <MapPin size={11} className="text-green-400" /> Society
              </span>
              <span className="absolute bottom-10 left-6 inline-flex items-center gap-1.5 text-[11px] text-gray-300 bg-gray-900/90 border border-white/10 px-2.5 py-1 rounded-full">
                <MapPin size={11} className="text-green-400" /> Beach tennis
              </span>
              <span className="absolute bottom-20 right-4 inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-900/70 border border-white/10 px-2.5 py-1 rounded-full">
                <MapPin size={11} className="text-gray-500" /> Futsal
              </span>
            </div>
          </div>

          <div className="perto-texto space-y-6">
            <div>
              <h3 className="text-white font-bold mb-2">Distância, não endereço</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Escolha até onde você topa ir. A lista volta ordenada por perto, com a distância
                escrita em cada partida — dá para decidir sem abrir o mapa.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Um toque, e pronto</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A localização do navegador resolve na hora, sem digitar nada. Quem preferir não
                liberar salva o endereço no perfil, e a busca passa a medir de lá.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-2">Serve para quem chegou agora</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mudou de cidade e não conhece ninguém? A proximidade é o único filtro que não
                depende de você já ter uma turma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
