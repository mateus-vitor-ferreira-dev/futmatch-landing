/**
 * As quatro seções de profundidade da #63, e o que nelas quebra calado.
 *
 * O que a revisão visual pega — se o texto está bonito, se o cartão está
 * alinhado — não precisa de teste. O que ela não pega é o que este arquivo
 * guarda:
 *
 * 1. **Âncora.** Seção sem `id` é seção que o menu não alcança, e o menu é
 *    onde a pessoa procura o assunto. O erro não aparece na tela: aparece num
 *    clique que não leva a lugar nenhum.
 * 2. **A contradição com o roadmap.** As quatro anunciam como pronto
 *    exatamente o que a `RoadmapSection` listava como "Planejado" até a #62. Se
 *    algum épico voltar para lá, a página se contradiz dentro de uma rolagem —
 *    e é o tipo de coisa que ninguém vê lendo de cima para baixo, porque as
 *    duas seções ficam longe uma da outra.
 * 3. **Decoração na árvore de acessibilidade.** Os visuais leves — cartão de
 *    time, anéis de distância — são desenho. Sem `aria-hidden` eles viram
 *    nomes falsos lidos em voz alta.
 *
 * O GSAP fica de fora pelo mesmo motivo do `FAQSection.test.tsx`: `autoAlpha`
 * é opacidade **mais** `visibility`, não existe scroll no jsdom, e sem o dublê
 * tudo o que este arquivo verifica sumiria da árvore de acessibilidade.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('gsap', () => {
  const gsap = {
    set: vi.fn(),
    to: vi.fn((_alvo: unknown, vars?: { onComplete?: () => void }) => {
      vars?.onComplete?.()
      return {}
    }),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn()
      return { revert: vi.fn() }
    }),
  }
  return { gsap, default: gsap }
})
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

import TimesSection from './TimesSection'
import AcessoSection from './AcessoSection'
import PertoSection from './PertoSection'
import CampeonatosSection from './CampeonatosSection'

const SECOES = [
  { nome: 'Times fixos', id: 'times', Componente: TimesSection },
  { nome: 'Quem vê e quem entra', id: 'acesso', Componente: AcessoSection },
  { nome: 'Peladas perto de você', id: 'perto', Componente: PertoSection },
  { nome: 'Campeonatos jogáveis', id: 'campeonatos', Componente: CampeonatosSection },
]

describe('as quatro seções dos épicos', () => {
  it.each(SECOES)('$nome tem âncora própria, para link direto', ({ id, Componente }) => {
    const { container } = render(<Componente />)

    const secao = container.querySelector('section')
    expect(secao).not.toBeNull()
    expect(secao?.id).toBe(id)
  })

  /**
   * Uma seção por vez tem um título de nível 2 — é o que dá à página um
   * sumário legível por leitor de tela, e o que separa "seção" de "bloco solto".
   */
  it.each(SECOES)('$nome anuncia um h2, e um só', ({ Componente }) => {
    render(<Componente />)

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
  })

  it.each(SECOES)('$nome esconde a decoração do leitor de tela', ({ Componente }) => {
    const { container } = render(<Componente />)

    // Nomes próprios de exemplo e rótulos de desenho não podem ser lidos como
    // conteúdo — dentro de `aria-hidden` eles somem da árvore.
    for (const decorativo of container.querySelectorAll('[aria-hidden="true"]')) {
      expect(decorativo.closest('[aria-hidden="true"]')).toBe(decorativo)
    }
  })
})

/**
 * O contrato com o roadmap, do outro lado.
 *
 * A `RoadmapSection` só pode listar o que **não** está pronto. Estas quatro
 * anunciam quatro épicos prontos; se um deles reaparecer lá, a página promete e
 * nega a mesma coisa. A conferência é sobre o fonte porque o `issue` de cada
 * item do roadmap não é renderizado — é a âncora que o
 * `verifica-contrato-com-o-produto.mjs` usa para perguntar ao GitHub.
 */
describe('nada aqui é roadmap', () => {
  const EPICOS_ANUNCIADOS = [
    'so-mais-um-api#202', // times fixos
    'so-mais-um-api#203', // campeonatos jogáveis
    'so-mais-um-api#211', // peladas perto
    'so-mais-um-api#219', // quem vê e quem entra
  ]

  it('o roadmap não lista nenhum dos épicos que estas seções dão como prontos', async () => {
    const { readFileSync } = await import('node:fs')
    const roadmap = readFileSync('src/components/landing/RoadmapSection.tsx', 'utf8')

    for (const epico of EPICOS_ANUNCIADOS) {
      expect(roadmap, epico).not.toContain(epico)
    }
  })
})

/**
 * O menu e as âncoras, conferidos um contra o outro.
 *
 * Link de menu que aponta para um id inexistente **não quebra nada**: ele
 * simplesmente não rola, e a pessoa conclui que o site travou. É o defeito mais
 * barato de criar — basta renomear um `id` — e o mais caro de notar, porque só
 * aparece clicando item por item.
 *
 * A conferência é sobre o fonte porque os dois lados são estáticos, e porque
 * montar a página inteira aqui exigiria a API que o Server Component consulta.
 */
/**
 * As âncoras da página, na ordem em que aparecem.
 *
 * Lidas do `page.tsx`, pelo mesmo motivo das conferências abaixo: montar a
 * página exigiria a API. Cada `<XSection` vale o `id` da `<section>` no arquivo
 * do componente, e o `<div id="...">` que agrupa seções vale o próprio id.
 * Seção sem id não entra, porque não há como o menu apontar para ela.
 */
function ancorasNaOrdemDaPagina(ler: (caminho: string) => string): string[] {
  const ordem: string[] = []

  for (const m of ler('src/app/page.tsx').matchAll(/<(\w+Section)\b|<div id="([\w-]+)"/g)) {
    if (m[2]) {
      ordem.push(m[2])
      continue
    }
    const secao = ler(`src/components/landing/${m[1]}.tsx`).match(/<section\b[^>]*\bid="([\w-]+)"/)
    if (secao) ordem.push(secao[1])
  }

  return ordem
}

describe('o menu e as âncoras', () => {
  it('todo link do menu tem uma seção com aquele id', async () => {
    const { readFileSync, readdirSync } = await import('node:fs')

    const navbar = readFileSync('src/components/landing/Navbar.tsx', 'utf8')
    const alvos = [...navbar.matchAll(/href: '#([\w-]+)'/g)].map((m) => m[1])

    expect(alvos.length).toBeGreaterThan(0)

    const fontes = [
      ...readdirSync('src/components/landing')
        .filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))
        .map((f) => readFileSync(`src/components/landing/${f}`, 'utf8')),
      readFileSync('src/app/page.tsx', 'utf8'),
    ].join('\n')

    for (const alvo of alvos) {
      expect(fontes, `#${alvo} não existe em nenhuma seção`).toContain(`id="${alvo}"`)
    }
  })

  /**
   * A ordem do menu é a da página (#97).
   *
   * Fora de ordem, clicar no menu da esquerda para a direita desce e sobe a
   * página, e o destaque da seção ativa anda para trás ao rolar. O defeito
   * cresceu por mudanças que nem tocaram o menu — cada seção nova do `page.tsx`
   * entrou entre "Para espaços" e "Modalidades" —, e é por isso que a
   * conferência lê a ordem do `page.tsx`, e não só o `Navbar`.
   */
  it.each([
    { nome: 'menu', arquivo: 'src/components/landing/Navbar.tsx' },
    { nome: 'rodapé', arquivo: 'src/components/landing/Footer.tsx' },
  ])('o $nome segue a ordem das seções na página', async ({ arquivo }) => {
    const { readFileSync } = await import('node:fs')
    const ler = (caminho: string) => readFileSync(caminho, 'utf8')

    const pagina = ancorasNaOrdemDaPagina(ler)
    const alvos = [...ler(arquivo).matchAll(/href: '#([\w-]+)'/g)].map((m) => m[1])

    expect(alvos.length).toBeGreaterThan(1)
    for (const alvo of alvos) {
      expect(pagina, `#${alvo} não é âncora de nenhuma seção do page.tsx`).toContain(alvo)
    }

    // Comparar com a lista reordenada, e não posição a posição, faz a falha
    // mostrar a ordem certa inteira — que é a correção a aplicar.
    const naOrdemDaPagina = [...alvos].sort((a, b) => pagina.indexOf(a) - pagina.indexOf(b))
    expect(alvos).toEqual(naOrdemDaPagina)
  })

  it('as quatro seções novas são alcançáveis pelo bloco que entrou no menu', async () => {
    const { readFileSync } = await import('node:fs')
    const pagina = readFileSync('src/app/page.tsx', 'utf8')

    // Uma entrada de menu para as quatro: cada uma guarda o id próprio para
    // link direto, e o bloco é o que o menu alcança.
    expect(pagina).toContain('id="recursos"')
    for (const secao of ['TimesSection', 'AcessoSection', 'PertoSection', 'CampeonatosSection']) {
      expect(pagina, secao).toContain(`<${secao} />`)
    }
  })
})
