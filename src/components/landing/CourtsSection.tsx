'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Badge } from '@/components/ui/badge'
import { useMobileScrollAnimation } from '@/lib/useMobileScrollAnimation'

gsap.registerPlugin(ScrollTrigger)

/**
 * Três modalidades não têm emoji, e não é questão de procurar melhor.
 *
 * O Unicode não tem peteca, não tem bola de futevôlei e não separa vôlei de
 * praia de vôlei de quadra:
 *
 * - **Peteca** — não existe peteca sozinha. O mais perto é `🏸`, que é
 *   "badminton racquet and shuttlecock" (U+1F3F8): vem com raquete junto, e
 *   peteca se joga com a mão. Antes estava `🖐️`, uma mão, que dizia metade
 *   da coisa.
 * - **Futevôlei** — não existe bola de futevôlei. `⚽` já é do Society, e
 *   repetir apagaria a diferença entre as duas. Antes estava `🏖️`, um
 *   guarda-sol, que descreve a areia e não o esporte.
 * - **Vôlei de areia** — `🏐` já é do Vôlei de quadra. Antes estava `🌊`,
 *   uma onda, pelo mesmo motivo do guarda-sol.
 *
 * Como a landing não usa imagem raster, os três viram SVG inline desenhado a
 * partir da bola/peteca real. Os outros nove continuam emoji: onde o emoji
 * acerta, ele é mais leve e mais consistente entre plataformas que um desenho
 * nosso.
 *
 * Três coisas fazem esses três sentarem na mesma fileira sem denunciar a
 * origem, e as três vieram de comparar lado a lado com os emojis vizinhos:
 *
 * 1. **Volume.** A primeira versão era chapada, e ao lado de nove ilustrações
 *    com sombra e brilho ficava evidente qual card tinha ícone de verdade.
 *    Daí o gradiente radial com a luz vindo de cima à esquerda, mais a camada
 *    `-esfera` por cima, que escurece a borda oposta.
 * 2. **Enquadramento.** O emoji preenche a caixa inteira; um `viewBox` de
 *    `0 0 32 32` com a bola em `r=13` deixava 20% de margem morta, e o ícone
 *    parecia menor — e portanto pior — que os vizinhos. Os `viewBox` abaixo
 *    são apertados no desenho de propósito.
 * 3. **A silhueta é intocável, e o desenho vem depois dela** (#46). Era o que
 *    faltava: a bola de futevôlei tinha losangos grandes o bastante para
 *    encostar na borda a leste e a oeste, e o preto comia o contorno — a 30px
 *    ela não lia como bola, lia como um losango amarelo. A de vôlei de areia
 *    tinha as calotas fechadas em linha reta, então as faixas cruzavam a bola
 *    chapadas e o resultado parecia um botão listrado, não uma esfera.
 *
 *    As duas foram refeitas com a mesma regra: **nada de cor escura toca a
 *    borda**, e toda linha interna acompanha a curvatura, do polo ao polo. É o
 *    que os emojis vizinhos fazem — a costura da 🏐 e as linhas da 🏀 são
 *    curvas, e é delas que vem a leitura de volume num desenho de 30px.
 *
 * A decisão de escopo está registrada na #46: seguimos pelo caminho **A**, os
 * três redesenhados por nós, sem partir de arte de terceiro. O caminho **C** —
 * substituir as doze por um conjunto único — continua sendo o único que resolve
 * a inconsistência entre plataformas de emoji, e continua em aberto: enquanto
 * nove ícones vierem da fonte de quem visita, a fileira tem uma cara no iPhone
 * e outra no Android, e nenhum desenho nosso muda isso.
 */
function IconePeteca() {
  return (
    <svg viewBox="2.5 1.6 27 27" width="30" height="30" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="peteca-pena" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#efece0" />
          <stop offset="100%" stopColor="#cbc7b6" />
        </linearGradient>
        <linearGradient id="peteca-base" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a4a52" />
          <stop offset="38%" stopColor="#2d2d33" />
          <stop offset="100%" stopColor="#141418" />
        </linearGradient>
        <linearGradient id="peteca-fita" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffdc5e" />
          <stop offset="45%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#c08d05" />
        </linearGradient>
      </defs>
      {/* quatro penas abertas em leque */}
      <g stroke="#b8b4a3" strokeWidth="0.25" fill="url(#peteca-pena)">
        <path d="M16 19 C13.4 13 13.2 7.5 16 2.8 C18.8 7.5 18.6 13 16 19 Z" transform="rotate(-17 16 19)" />
        <path d="M16 19 C13.4 13 13.2 7.5 16 2.8 C18.8 7.5 18.6 13 16 19 Z" transform="rotate(17 16 19)" />
        <path d="M16 19 C13.4 13 13.2 7.5 16 2.8 C18.8 7.5 18.6 13 16 19 Z" transform="rotate(-6 16 19)" />
        <path d="M16 19 C13.4 13 13.2 7.5 16 2.8 C18.8 7.5 18.6 13 16 19 Z" transform="rotate(6 16 19)" />
      </g>
      {/* etiqueta e base de borracha */}
      <path d="M12.2 17.6 h7.6 v3.4 h-7.6 z" fill="url(#peteca-fita)" />
      <ellipse cx="16" cy="21.2" rx="6.4" ry="2.3" fill="#4d4d56" />
      <path d="M9.6 21.2 h12.8 v4.4 h-12.8 z" fill="url(#peteca-base)" />
      <ellipse cx="16" cy="25.6" rx="6.4" ry="2.3" fill="#141418" />
      <path d="M9.6 24.3 h12.8 v1.5 h-12.8 z" fill="url(#peteca-fita)" />
    </svg>
  )
}

function IconeFutevolei() {
  return (
    <svg viewBox="2.6 2.6 26.8 26.8" width="30" height="30" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="futevolei-couro" cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffe273" />
          <stop offset="45%" stopColor="#f5c518" />
          <stop offset="100%" stopColor="#b8860a" />
        </radialGradient>
        <radialGradient id="futevolei-esfera" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
        <clipPath id="futevolei-recorte">
          <circle cx="16" cy="16" r="13" />
        </clipPath>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#futevolei-couro)" />
      {/*
        Os losangos da bola de futevôlei, em coluna do polo ao polo.
        Antes havia dois deles a leste e a oeste, na parte mais larga da bola, e
        o preto encostava na borda: a 30px o contorno redondo sumia e sobrava um
        losango amarelo. Aqui a coluna atravessa a bola pelo eixo curto, onde a
        ponta do losango é estreita e a silhueta sobrevive.
      */}
      <g clipPath="url(#futevolei-recorte)" fill="#1e1e1e">
        <path d="M16 11.4 L19.6 16 L16 20.6 L12.4 16 Z" />
        <path d="M16 2.6 L19.6 7.2 L16 11.8 L12.4 7.2 Z" />
        <path d="M16 20.2 L19.6 24.8 L16 29.4 L12.4 24.8 Z" />
      </g>
      {/* costura clara acompanhando a curvatura, como a da bola de vôlei */}
      <g clipPath="url(#futevolei-recorte)" fill="none" stroke="#7a5c07" strokeWidth="0.7" opacity="0.55">
        <path d="M7.4 4.4 C10.6 10.4 10.6 21.6 7.4 27.6" />
        <path d="M24.6 4.4 C21.4 10.4 21.4 21.6 24.6 27.6" />
      </g>
      <circle cx="16" cy="16" r="13" fill="url(#futevolei-esfera)" />
    </svg>
  )
}

function IconeVoleiDeAreia() {
  return (
    <svg viewBox="2.6 2.6 26.8 26.8" width="30" height="30" role="img" aria-hidden="true">
      <defs>
        <radialGradient id="volei-areia-couro" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f2f2f2" />
          <stop offset="100%" stopColor="#b9bcc4" />
        </radialGradient>
        <radialGradient id="volei-areia-esfera" cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
        <clipPath id="volei-areia-recorte">
          <circle cx="16" cy="16" r="13" />
        </clipPath>
      </defs>
      <circle cx="16" cy="16" r="13" fill="url(#volei-areia-couro)" />
      {/*
        Gomos curvos de polo a polo, o desenho da bola de praia.
        Antes eram duas calotas fechadas em linha reta mais uma elipse no
        equador: as faixas cruzavam a bola chapadas e ela lia como um botão
        listrado. Cada gomo aqui é a área entre dois meridianos, então a linha
        acompanha a curvatura e é ela que entrega o volume a 30px.
      */}
      <g clipPath="url(#volei-areia-recorte)">
        <path d="M16 3 C0 9, 0 23, 16 29 C8 23, 8 9, 16 3 Z" fill="#2a5fe0" />
        <path d="M16 3 C12 9, 12 23, 16 29 C20 23, 20 9, 16 3 Z" fill="#f5c518" />
        <path d="M16 3 C24 9, 24 23, 16 29 C32 23, 32 9, 16 3 Z" fill="#2a5fe0" />
      </g>
      <circle cx="16" cy="16" r="13" fill="url(#volei-areia-esfera)" />
    </svg>
  )
}

interface Sport {
  icon: ReactNode
  name: string
  desc: string
  color: string
  from: { x: number; y: number }
}

const sports: Sport[] = [
  { icon: '👟', name: 'Futsal',            desc: 'Quadra coberta',               color: 'from-blue-600 to-blue-800',     from: { x: -100, y: 0 } },
  { icon: '⚽', name: 'Society',           desc: 'Grama sintética',              color: 'from-green-600 to-green-800',   from: { x: 0, y: -80 } },
  { icon: '🏟️', name: 'Futebol de Campo',  desc: 'Campo convencional',           color: 'from-emerald-600 to-emerald-800', from: { x: 100, y: 0 } },
  { icon: '🏀', name: 'Basquete',          desc: 'Quadra de basquete',           color: 'from-orange-600 to-red-700',    from: { x: -100, y: 0 } },
  { icon: '🏐', name: 'Vôlei',             desc: 'Quadra indoor',                color: 'from-yellow-500 to-yellow-700', from: { x: 0, y: 80 } },
  { icon: '🎾', name: 'Beach Tennis',      desc: 'Quadra de areia',              color: 'from-lime-500 to-lime-700',     from: { x: 100, y: 0 } },
  { icon: <IconeFutevolei />, name: 'Futevôlei', desc: 'Quadra de areia',        color: 'from-orange-500 to-orange-700', from: { x: -100, y: 0 } },
  { icon: '🃏', name: 'Poker',             desc: 'Torneios e cash games',        color: 'from-purple-600 to-purple-800', from: { x: 0, y: -80 } },
  { icon: '🎾', name: 'Tênis',             desc: 'Quadra de tênis',              color: 'from-violet-500 to-violet-700', from: { x: 100, y: 0 } },
  { icon: '🤾', name: 'Handebol',          desc: 'Quadra de handebol',           color: 'from-red-500 to-red-700',       from: { x: -100, y: 0 } },
  { icon: <IconeVoleiDeAreia />, name: 'Vôlei de Areia', desc: 'Quadra de vôlei de areia', color: 'from-cyan-500 to-cyan-700', from: { x: 0, y: 80 } },
  { icon: <IconePeteca />, name: 'Peteca',    desc: 'Quadra de peteca',             color: 'from-pink-500 to-pink-700',     from: { x: 100, y: 0 } },
]

export default function CourtsSection() {
  const sectionRef = useMobileScrollAnimation('.courts-title, .sport-card', { staggerMs: 80 })
  const fieldRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const paths = fieldRef.current?.querySelectorAll('path, circle, line, ellipse')
      if (paths) {
        paths.forEach((path) => {
          const length = (path as SVGGeometryElement).getTotalLength?.() ?? 200
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        })
        gsap.to(Array.from(paths), {
          strokeDashoffset: 0,
          duration: 2.5,
          stagger: 0.1,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }

      if (window.matchMedia('(min-width: 768px)').matches) {
        const cards = sectionRef.current?.querySelectorAll('.sport-card')
        cards?.forEach((card, i) => {
          const dir = sports[i].from
          gsap.from(card, {
            x: dir.x,
            y: dir.y,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 90%', once: true },
          })
        })
        gsap.from('.courts-title', {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <section id="courts" ref={sectionRef} className="relative bg-gray-950 py-12 md:py-24 overflow-hidden">
      <svg
        ref={fieldRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path d="M60 40 H1140 V660 H60 Z" stroke="#22c55e" strokeWidth="2" />
        <line x1="600" y1="40" x2="600" y2="660" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="600" cy="350" r="100" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="600" cy="350" r="5" fill="#22c55e" />
        <path d="M60 260 H180 V440 H60" stroke="#22c55e" strokeWidth="1.5" />
        <path d="M1140 260 H1020 V440 H1140" stroke="#22c55e" strokeWidth="1.5" />
        <circle cx="220" cy="350" r="5" fill="#22c55e" />
        <circle cx="980" cy="350" r="5" fill="#22c55e" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(34,197,94,0.06),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="courts-title text-center mb-8 md:mb-16">
          <Badge variant="dark" className="mb-4">Modalidades</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            12 modalidades,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              uma plataforma
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            De futebol a poker — organize qualquer tipo de partida ou campeonato.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sports.map((sport, i) => (
            <div
              key={i}
              className="sport-card group relative bg-gray-900 border border-white/10 hover:border-green-500/40 rounded-2xl p-5 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sport.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
              <div className="relative z-10">
                {/*
                  Altura fixa e centralização vertical porque a linha agora
                  mistura emoji e SVG: emoji ocupa a caixa de linha inteira do
                  `text-3xl` (36px) e o SVG ocupa só os 30px dele, o que
                  desalinharia os títulos entre cartões vizinhos.
                */}
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300 inline-flex h-9 items-center mb-3">
                  {sport.icon}
                </span>
                <h3 className="text-base font-bold text-white mb-1">{sport.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{sport.desc}</p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${sport.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
