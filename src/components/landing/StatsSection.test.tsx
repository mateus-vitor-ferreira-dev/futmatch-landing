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
  peladasAbertas: 9,
  cidades: 4,
}

describe('StatsSection com números da API', () => {
  it('mostra os cartões que dependem do dado', () => {
    render(<StatsSection numeros={NUMEROS} />)

    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
    expect(screen.getByText('Jogadores na plataforma')).toBeInTheDocument()
    expect(screen.getByText('Peladas abertas')).toBeInTheDocument()
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
    expect(screen.queryByText('Peladas abertas')).not.toBeInTheDocument()
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
    render(<StatsSection numeros={{ ...NUMEROS, peladasAbertas: 0 }} />)

    expect(screen.queryByText('Peladas abertas')).not.toBeInTheDocument()
    expect(screen.getByText('Arenas parceiras')).toBeInTheDocument()
    expect(screen.getByText('Jogadores na plataforma')).toBeInTheDocument()
    expect(screen.getByText('Cidades atendidas')).toBeInTheDocument()
  })

  it('com tudo zerado, encolhe igual à API fora do ar', () => {
    const { container } = render(
      <StatsSection numeros={{ arenas: 0, jogadores: 0, peladasAbertas: 0, cidades: 0 }} />,
    )

    expect(container.querySelectorAll('.stat-card')).toHaveLength(2)
    expect(screen.getByText('Modalidades esportivas')).toBeInTheDocument()
    expect(screen.getByText('Gratuito para jogadores')).toBeInTheDocument()
  })
})
