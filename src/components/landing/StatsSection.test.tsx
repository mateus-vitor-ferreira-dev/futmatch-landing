/**
 * A primeira versão desta seção foi removida em produção por trazer números
 * escritos no código — a landing é pública, e número inventado é afirmação
 * falsa para quem visita.
 *
 * O que estes testes protegem é a regra que veio no lugar: número que muda vem
 * da API, e quando a API não responde a seção **encolhe** em vez de mostrar
 * zero. Zero é um número, e um número errado.
 */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsSection from './StatsSection'
import type { NumerosPublicos } from '@/lib/stats'

const NUMEROS: NumerosPublicos = {
  arenas: 26,
  jogadores: 128,
  matchesAbertas: 9,
  cidades: 4,
}

describe('StatsSection com números da API', () => {
  it('mostra os cartões que dependem do dado', () => {
    render(<StatsSection numeros={NUMEROS} />)

    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
    expect(screen.getByText('Jogadores na plataforma')).toBeInTheDocument()
    expect(screen.getByText('Partidas abertas')).toBeInTheDocument()
    expect(screen.getByText('Cidades atendidas')).toBeInTheDocument()
  })

  it('mantém os fatos de produto, que não dependem de medição', () => {
    render(<StatsSection numeros={NUMEROS} />)

    expect(screen.getByText('Modalidades esportivas')).toBeInTheDocument()
    expect(screen.getByText('Gratuito para jogadores')).toBeInTheDocument()
  })

  it('não promete tempo real — o dado é revalidado a cada 5 minutos', () => {
    const { container } = render(<StatsSection numeros={NUMEROS} />)

    expect(screen.getByText('atualizado a cada 5 minutos')).toBeInTheDocument()
    // Nada de "ao vivo" nem bolinha pulsando: foi o que derrubou a primeira
    // versão da seção.
    expect(screen.queryByText(/ao vivo/i)).not.toBeInTheDocument()
    expect(container.querySelector('.animate-pulse')).toBeNull()
  })
})

describe('StatsSection sem resposta da API', () => {
  it('esconde os cartões que dependem do dado, em vez de mostrar zero', () => {
    render(<StatsSection numeros={null} />)

    expect(screen.queryByText('Arenas parceiras')).not.toBeInTheDocument()
    expect(screen.queryByText('Jogadores na plataforma')).not.toBeInTheDocument()
    expect(screen.queryByText('Partidas abertas')).not.toBeInTheDocument()
    expect(screen.queryByText('Cidades atendidas')).not.toBeInTheDocument()
  })

  it('continua mostrando o que é verdade sem a API', () => {
    render(<StatsSection numeros={null} />)

    expect(screen.getByText('Modalidades esportivas')).toBeInTheDocument()
    expect(screen.getByText('Gratuito para jogadores')).toBeInTheDocument()
  })

  it('não deixa nenhum "0" solto na tela', () => {
    const { container } = render(<StatsSection numeros={null} />)

    // Os contadores nascem em "0" e o GSAP os anima até o alvo. Com dois
    // cartões fixos, são exatamente dois — nenhum zero órfão de dado ausente.
    const contadores = container.querySelectorAll('.stat-card')
    expect(contadores).toHaveLength(2)
  })
})

/**
 * A API responder é uma coisa; ter o que contar é outra. Hoje `GET /stats` em
 * produção devolve 200 com os quatro campos em zero, e o guarda de `null` não
 * pega esse caso — o cartão passaria direto, com o contador indo de 0 até 0.
 */
describe('StatsSection com número zerado', () => {
  it('esconde só o cartão sem número, e mantém os que têm', () => {
    render(<StatsSection numeros={{ ...NUMEROS, matchesAbertas: 0 }} />)

    expect(screen.queryByText('Partidas abertas')).not.toBeInTheDocument()
    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
    expect(screen.getByText('Jogadores na plataforma')).toBeInTheDocument()
    expect(screen.getByText('Cidades atendidas')).toBeInTheDocument()
  })

  it('com tudo zerado, encolhe igual à API fora do ar', () => {
    const { container } = render(
      <StatsSection numeros={{ arenas: 0, jogadores: 0, matchesAbertas: 0, cidades: 0 }} />,
    )

    expect(container.querySelectorAll('.stat-card')).toHaveLength(2)
    expect(screen.getByText('Modalidades esportivas')).toBeInTheDocument()
    expect(screen.getByText('Gratuito para jogadores')).toBeInTheDocument()
  })
})

/**
 * Esconder o zero não bastou (#36): "2 jogadores na plataforma" é verdade e
 * ainda assim prova que ninguém usa. O cartão só entra quando o número
 * sustenta a afirmação que ele faz — e o limiar é por cartão, porque "3
 * cidades atendidas" convence e "3 jogadores" não.
 */
describe('StatsSection com número abaixo do limiar', () => {
  it('esconde o cartão do número que não sustenta a afirmação', () => {
    // 49 jogadores é mais que zero e ainda assim não é prova social.
    render(<StatsSection numeros={{ ...NUMEROS, jogadores: 49 }} />)

    expect(screen.queryByText('Jogadores na plataforma')).not.toBeInTheDocument()
    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
  })

  it('o número igual ao limiar entra — o corte é "abaixo", não "até"', () => {
    render(<StatsSection numeros={{ ...NUMEROS, jogadores: 50, matchesAbertas: 5, cidades: 3, arenas: 3 }} />)

    expect(screen.getByText('Jogadores na plataforma')).toBeInTheDocument()
    expect(screen.getByText('Partidas abertas')).toBeInTheDocument()
    expect(screen.getByText('Cidades atendidas')).toBeInTheDocument()
    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
  })

  it('cada cartão tem o seu limiar: 4 cidades passa, 4 jogadores não', () => {
    render(<StatsSection numeros={{ arenas: 0, jogadores: 4, matchesAbertas: 0, cidades: 4 }} />)

    expect(screen.getByText('Cidades atendidas')).toBeInTheDocument()
    expect(screen.queryByText('Jogadores na plataforma')).not.toBeInTheDocument()
  })

  it('com o dado que a produção devolve hoje, nenhum cartão da API entra', () => {
    const { container } = render(
      <StatsSection numeros={{ arenas: 0, jogadores: 2, matchesAbertas: 0, cidades: 0 }} />,
    )

    expect(screen.queryByText('Jogadores na plataforma')).not.toBeInTheDocument()
    expect(container.querySelectorAll('.stat-card')).toHaveLength(2)
    // A seção não some: os fatos de produto continuam de pé sozinhos.
    expect(screen.getByText('Modalidades esportivas')).toBeInTheDocument()
    expect(screen.getByText('Gratuito para jogadores')).toBeInTheDocument()
  })
})

/**
 * Grade fixa em três colunas deixaria um vão à direita sempre que sobrassem só
 * os dois fixos — que é o caso de hoje e o de API fora do ar.
 */
describe('StatsSection — colunas', () => {
  function grade(container: HTMLElement) {
    return container.querySelector('.grid')?.className ?? ''
  }

  it('usa duas colunas quando sobram só os dois fixos', () => {
    const { container } = render(<StatsSection numeros={null} />)

    expect(grade(container)).toContain('md:grid-cols-2')
  })

  it('volta para três colunas assim que um cartão da API entra', () => {
    const { container } = render(
      <StatsSection numeros={{ arenas: 0, jogadores: 0, matchesAbertas: 0, cidades: 3 }} />,
    )

    expect(grade(container)).toContain('md:grid-cols-3')
  })
})
