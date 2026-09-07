/**
 * A lista de benefícios do dono, e o que ela promete (#79).
 *
 * Esta lista já teve um acidente: dizia *"métricas de ocupação e receita"* e
 * *"agenda integrada"*, e nenhuma das duas existia. Prometer relatório de
 * receita para quem vai **pagar assinatura** é a pior versão do erro que a #15
 * pegou na prova social — e é por isso que cada item aponta, em comentário,
 * para a tela de produção que o sustenta.
 *
 * O levantamento da #79 achou o buraco inverso: a quadra se vende de três
 * jeitos — partida, turma e day use — e a página contava **um**. As duas
 * ausências valiam 26 das 148 rotas que a api publica em produção.
 *
 * O que este arquivo prende é o resultado desse levantamento: as três formas
 * de venda ficam ditas, e nenhuma promessa nova entra sem tela. O teste não
 * consegue conferir a segunda metade sozinho — nenhum teste confere se uma
 * frase é verdade — mas prende a primeira, que é a que regride em silêncio
 * quando alguém reescreve a seção.
 *
 * O dublê de GSAP é o mesmo do `secoes-dos-epicos.test.tsx`, e pelo mesmo
 * motivo: `autoAlpha` é opacidade **mais** `visibility`, não há scroll no
 * jsdom, e sem ele tudo sumiria da árvore de acessibilidade.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('gsap', () => {
  const gsap = {
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    from: vi.fn(),
    registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn()
      return { revert: vi.fn() }
    }),
  }
  return { gsap, default: gsap }
})
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

import OwnerSection from './OwnerSection'

describe('OwnerSection — os três jeitos de a quadra vender', () => {
  it('conta a turma da escolinha, com o que a tela do dono realmente tem', () => {
    render(<OwnerSection />)

    // `/owner/turmas`, na `main` do web: dia da semana, professor e valor da
    // mensalidade são campos daquela tela.
    expect(screen.getByText(/Turmas da escolinha/)).toBeInTheDocument()
    expect(screen.getByText(/mensalidade por aluno/)).toBeInTheDocument()
  })

  it('conta o day use, e diz que o jogador o encontra', () => {
    render(<OwnerSection />)

    // É o único dos dois formatos com as duas pontas em produção:
    // `/owner/day-uses` do lado do dono e `DayUsesDoDia` dentro do Quero Jogar.
    expect(screen.getByText(/Day use por entrada avulsa/)).toBeInTheDocument()
    expect(screen.getByText(/Quero Jogar/)).toBeInTheDocument()
  })

  it('não promete a área do aluno, que não existe', () => {
    const { container } = render(<OwnerSection />)
    const texto = container.textContent ?? ''

    // `GET /me/turmas` e `GET /me/aulas` respondem em produção e **nenhuma
    // tela do web as consome**. Chamada, matrícula e mensalidade como ação têm
    // telas só na `develop`. Prometer qualquer uma seria a #64 de novo.
    expect(texto).not.toMatch(/minhas aulas|área do aluno|faça sua matrícula/i)
    expect(texto).not.toMatch(/chamada/i)
  })

  it('continua sem prometer receita e agenda, que nunca existiram', () => {
    const { container } = render(<OwnerSection />)
    const texto = container.textContent ?? ''

    // O acidente original desta lista. `getStats` do painel devolve contagem
    // de espaços, quadras, partidas ativas e solicitações — não receita.
    expect(texto).not.toMatch(/receita|faturamento|agenda integrada/i)
  })
})
