import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PoliticaDePrivacidadePage from './politica-de-privacidade/page'
import TermosDeUsoPage from './termos-de-uso/page'

describe('documentos legais', () => {
  it('identifica a política, sua versão, o canal e os operadores', () => {
    render(<PoliticaDePrivacidadePage />)

    expect(screen.getByRole('heading', { name: 'Política de Privacidade', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('10 de agosto de 2026')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'contato@so-mais-um.com' })).not.toHaveLength(0)
    expect(screen.getByText('Gabriel Soares')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'gabriel.soares@so-mais-um.com' })).not.toHaveLength(0)
    expect(screen.getByText(/resposta completa em até 15 dias corridos/)).toBeInTheDocument()
    expect(screen.getByText(/Stripe para pagamentos/)).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: 'Aviso sobre revisão jurídica' })).toHaveTextContent(/não deve ser publicado em produção/i)
  })

  it('publica os termos e aponta para a política real', () => {
    render(<TermosDeUsoPage />)

    expect(screen.getByRole('heading', { name: 'Termos de Uso', level: 1 })).toBeInTheDocument()
    for (const link of screen.getAllByRole('link', { name: 'Política de Privacidade' })) {
      expect(link).toHaveAttribute('href', '/politica-de-privacidade')
    }
  })
})
