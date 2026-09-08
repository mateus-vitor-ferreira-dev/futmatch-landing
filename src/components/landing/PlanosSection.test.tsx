/**
 * Esta seção existe para responder "o que eu ganho em cada degrau?" — e há dois
 * jeitos específicos de errar essa resposta.
 *
 * O primeiro é **o plano de entrada aparecer vazio**. Ele não abre funcionalidade
 * nenhuma, e um cartão só com funcionalidades ficaria em branco: o leitor conclui
 * que o degrau mais barato não faz nada, quando ele é o que cadastra a arena e
 * recebe as partidas. É o parente do erro que a #36 pegou no cartão que exibia zero.
 *
 * O segundo é grade parcial: uma comparação com um plano faltando não é informação
 * incompleta, é informação errada.
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
    { nome: 'Só+1 Básico', funcionalidades: [] },
    { nome: 'Só+1 Pro', funcionalidades: ['DAY_USE', 'ESTATISTICAS'] },
    {
      nome: 'Só+1 Premium',
      funcionalidades: ['DAY_USE', 'ESTATISTICAS', 'ESCOLINHA', 'EQUIPAMENTOS', 'ESTOQUE'],
    },
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

  it('o plano de entrada não aparece vazio — mostra o que todo degrau inclui', () => {
    render(<PlanosSection grade={GRADE} />)

    // As duas linhas do incluso saem uma vez por plano, os três inclusive.
    expect(screen.getAllByText('Cadastrar a arena e as quadras')).toHaveLength(3)
    expect(screen.getAllByText('Receber e administrar as partidas')).toHaveLength(3)
  })

  it('cada degrau mostra só o que ele abre', () => {
    render(<PlanosSection grade={GRADE} />)

    // Day use e estatística estão no Pro e no Premium; escolinha, estoque e
    // equipamento, só no Premium.
    expect(screen.getAllByText('Day use — entrada avulsa na quadra')).toHaveLength(2)
    expect(screen.getAllByText('Estatísticas do espaço')).toHaveLength(2)
    expect(
      screen.getAllByText('Escolinha — turmas, matrículas e mensalidades'),
    ).toHaveLength(1)
    expect(screen.getAllByText('Controle de estoque')).toHaveLength(1)
    expect(screen.getAllByText('Controle de equipamento')).toHaveLength(1)
  })

  it('a escolinha é uma linha só, e não uma lista de módulos', () => {
    render(<PlanosSection grade={GRADE} />)

    // A api#531 empacotou turma, matrícula, mensalidade, aula, chamada e o
    // vínculo do professor num valor só de `PlanFeature`. Se um dia alguém
    // quebrar isso em linhas separadas aqui, o cartão do Premium vira uma lista
    // de itens que ninguém compra separado — e o degrau deixa de parecer um
    // modelo de negócio.
    const premium = screen.getByText('Só+1 Premium').closest('.plano-card')

    expect(premium).not.toBeNull()
    expect(premium!.querySelectorAll('li')).toHaveLength(2 + 5)
  })

  it('não promete teto de quantidade em lugar nenhum', () => {
    const { container } = render(<PlanosSection grade={GRADE} />)

    // O eixo antigo saiu na api#278: nenhum plano limita quadra, espaço ou
    // modalidade, e insinuar limite aqui venderia um critério que não existe.
    expect(container.textContent).not.toMatch(/ilimitad/i)
    expect(container.textContent).not.toMatch(/\d+ (quadras?|espaços?|modalidades?)/i)
  })

  it('não promete quadra inclusa — o que se assina é o painel', () => {
    const { container } = render(<PlanosSection grade={GRADE} />)

    // A armadilha da #36 mudou de forma, mas continua de pé: plano dá acesso ao
    // painel, nunca direito a quadra.
    expect(container.textContent).not.toMatch(/quadras? inclus|inclui .*quadra/i)
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

    expect(screen.queryByText(/abre no painel/i)).not.toBeInTheDocument()
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
