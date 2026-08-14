/**
 * Esta seção existe para responder "cabe no meu espaço?" — e o jeito de errar
 * essa resposta é específico.
 *
 * O limite nulo da tabela `Plan` significa **sem limite**, não zero. Se ele
 * virar `0` em qualquer ponto do caminho, a seção passa a dizer que o plano
 * mais caro não dá direito a quadra nenhuma. É o mesmo erro de leitura que a
 * #36 pegou no cartão de prova social que exibia zero, e é o que a maior parte
 * dos casos aqui protege.
 *
 * O segundo risco é grade parcial: uma comparação com um plano faltando não é
 * informação incompleta, é informação errada.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

/**
 * Mesmo dublê do `FAQSection.test.tsx`, e pelo mesmo motivo: a entrada da seção
 * usa `autoAlpha`, que é opacidade **mais** `visibility`. Sem scroll — e não
 * existe scroll no jsdom — o ScrollTrigger nunca dispara, tudo fica em
 * `visibility: hidden` e some da árvore de acessibilidade. `getByRole` deixa de
 * achar o botão do CTA, que é justamente o que este arquivo verifica.
 */
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

import PlanosSection from './PlanosSection'
import type { GradeDePlanos } from '@/lib/planos'

const GRADE: GradeDePlanos = {
  planos: [
    { nome: 'Só+1 Básico', maxEstabelecimentos: 1, maxQuadras: 3, maxModalidades: 2 },
    { nome: 'Só+1 Pro', maxEstabelecimentos: 3, maxQuadras: 10, maxModalidades: 5 },
    { nome: 'Só+1 Premium', maxEstabelecimentos: null, maxQuadras: null, maxModalidades: null },
  ],
  parceiroUrl: 'https://app.so-mais-um.com/seja-parceiro',
}

describe('PlanosSection com a grade da API', () => {
  it('mostra os três planos', () => {
    render(<PlanosSection grade={GRADE} />)

    expect(screen.getByText('Só+1 Básico')).toBeInTheDocument()
    expect(screen.getByText('Só+1 Pro')).toBeInTheDocument()
    expect(screen.getByText('Só+1 Premium')).toBeInTheDocument()
  })

  it('escreve limite sem teto como "Ilimitado", nunca como zero', () => {
    render(<PlanosSection grade={GRADE} />)

    // Os três limites do Premium são nulos.
    expect(screen.getAllByText('Ilimitado')).toHaveLength(3)
    expect(screen.queryByText(/^0 /)).not.toBeInTheDocument()
  })

  it('concorda o singular com o número', () => {
    render(<PlanosSection grade={GRADE} />)

    expect(screen.getByText('1 espaço')).toBeInTheDocument()
    expect(screen.getByText('3 espaços')).toBeInTheDocument()
    expect(screen.getByText('10 quadras')).toBeInTheDocument()
  })

  it('não anuncia preço — o valor é conversa do painel', () => {
    const { container } = render(<PlanosSection grade={GRADE} />)

    expect(container.textContent).not.toMatch(/R\$|preço|\/mês/i)
  })

  it('leva para o cadastro pela URL que a API devolveu', () => {
    render(<PlanosSection grade={GRADE} />)

    // O nome acessível do link não atravessa o `<button>` aninhado, então o
    // texto é conferido no botão e o destino no link — que é único na seção.
    expect(screen.getByRole('button', { name: /cadastrar meu espaço/i })).toBeInTheDocument()

    // Cravar o domínio aqui mandaria quem abre um preview para produção.
    expect(screen.getByRole('link')).toHaveAttribute('href', GRADE.parceiroUrl)
  })
})

describe('PlanosSection sem dado', () => {
  it('some por inteiro quando a API não responde', () => {
    const { container } = render(<PlanosSection grade={null} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('não vaza título nem CTA no HTML quando some', () => {
    render(<PlanosSection grade={null} />)

    expect(screen.queryByText(/cabe no seu espaço/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})

describe('PlanosSection com grade de um plano só', () => {
  it('renderiza o que veio, sem inventar os outros', () => {
    const umPlano: GradeDePlanos = { ...GRADE, planos: [GRADE.planos[0]] }
    render(<PlanosSection grade={umPlano} />)

    expect(screen.getByText('Só+1 Básico')).toBeInTheDocument()
    expect(screen.queryByText('Só+1 Pro')).not.toBeInTheDocument()
  })
})
