/**
 * A seção da escolinha e do day use (#87), e o card da rede social (#88).
 *
 * O teste que carrega este arquivo é o do **que a página não promete**. As duas
 * issues nasceram de um levantamento cuja regra é a mesma que a #15 e a #64
 * custaram caro para estabelecer: **rota viva na api não é funcionalidade
 * entregue**. Se não há tela, o visitante não consegue fazer aquilo, e a página
 * mente.
 *
 * `GET /me/turmas` e `GET /me/aulas` respondem em produção hoje. **Nenhuma tela
 * do web as consome** — o que existe fora do painel do dono é a área do
 * *professor*. Uma frase dirigida ao aluno seria falsa, e é exatamente o tipo
 * de frase que entra sem ninguém notar quando a seção cresce.
 *
 * Os outros dois prendem a âncora — seção sem `id` é seção que o menu não
 * alcança — e a decisão da #88 sobre onde a rede é contada.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('gsap', () => {
  const gsap = {
    set: vi.fn(), to: vi.fn(), fromTo: vi.fn(), from: vi.fn(), registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => { fn(); return { revert: vi.fn() } }),
  }
  return { gsap, default: gsap }
})
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

import EscolinhaEDayUseSection from './EscolinhaEDayUseSection'
import FeaturesSection from './FeaturesSection'

describe('seção da escolinha e do day use', () => {
  it('conta os dois formatos, e diz que a agenda é compartilhada', () => {
    const { container } = render(<EscolinhaEDayUseSection />)
    const texto = container.textContent ?? ''

    expect(screen.getByRole('heading', { level: 3, name: /turma que acontece toda semana/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /entrada avulsa do dia/i })).toBeInTheDocument()
    // É a agenda única que impede vender a mesma sexta duas vezes — o que
    // distingue os três formatos de três produtos separados.
    expect(texto).toMatch(/mesma agenda/i)
  })

  it('não promete nada ao aluno — a tela dele não existe', () => {
    const { container } = render(<EscolinhaEDayUseSection />)
    const texto = container.textContent ?? ''

    expect(texto).not.toMatch(/suas aulas|minhas aulas.*aluno|acompanhe suas|área do aluno/i)
    expect(texto).not.toMatch(/matricule-se|inscreva-se na turma/i)
  })

  it('a chamada é atribuída ao professor, que é quem tem tela para fazê-la', () => {
    const { container } = render(<EscolinhaEDayUseSection />)

    expect(container.textContent).toMatch(/chamada/i)
    expect(container.textContent).toMatch(/professor/i)
  })

  it('tem âncora própria, para link direto e para o menu', () => {
    const { container } = render(<EscolinhaEDayUseSection />)

    expect(container.querySelector('section')?.id).toBe('escolinha')
  })

  it('o visual da agenda é decoração, e não é lido em voz alta', () => {
    const { container } = render(<EscolinhaEDayUseSection />)

    // Ele repete, em forma, o que o texto ao lado já diz. Sem `aria-hidden`
    // viraria uma lista de horários sem contexto para quem ouve.
    expect(container.querySelector('.esc-agenda')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('a rede social na página (#88)', () => {
  it('é contada como coisa de usar, e não só como cadeado', () => {
    const { container } = render(<FeaturesSection />)
    const texto = container.textContent ?? ''

    // A `AcessoSection` já dizia que uma partida PODE EXIGIR que você siga o
    // organizador. O que faltava era dizer que seguir existe.
    expect(texto).toMatch(/segu/i)
    expect(texto).toMatch(/amigo/i)
  })

  it('diz que seguir não pede aceite — é o que distingue de solicitação de amizade', () => {
    const { container } = render(<FeaturesSection />)

    expect(container.textContent).toMatch(/sem pedir aceite/i)
  })
})
