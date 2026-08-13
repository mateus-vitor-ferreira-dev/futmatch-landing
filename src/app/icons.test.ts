import { describe, expect, it, vi } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// `next/font` só existe dentro do build do Next: importado pelo Vitest, o
// `Inter()` do layout estoura em "Inter is not a function" antes de o teste
// começar. O mock devolve o mínimo que o layout usa — a variável CSS.
vi.mock('next/font/google', () => ({
  Inter: () => ({ variable: '--font-inter', className: 'inter' }),
}))

const { metadata } = await import('./layout')

/**
 * Guarda do favicon (#41).
 *
 * O ícone do Vercel ficou no ar porque três declarações concorriam — o
 * `favicon.ico` do template, o `metadata.icons` e uns `<link>` escritos à mão
 * no `<head>` — e ninguém notava, porque cada uma delas, olhada sozinha,
 * parecia certa. Quem vencia era o `.ico`, o único que não era nosso.
 *
 * Estes testes existem para que a próxima pessoa que adicionar um ícone tenha
 * que escolher: ou a convenção de arquivo, ou o `metadata`. Não as duas.
 */

const APP = join(process.cwd(), 'src/app')
const PUBLIC = join(process.cwd(), 'public')

/** md5 do `app/favicon.ico` que veio do `create-next-app` (commit 759d3b0). */
const FAVICON_DO_TEMPLATE = 'c30c7d42707a47a3f4591831641e50dc'

/** Verde da marca, como sai do Figma nos arquivos de ícone. */
const VERDE_DA_MARCA = '#3BAA34'

function md5(caminho: string): string {
  return createHash('md5').update(readFileSync(caminho)).digest('hex')
}

describe('ícones da landing', () => {
  it('serve os três ícones pela convenção de arquivo do App Router', () => {
    for (const arquivo of ['favicon.ico', 'icon.svg', 'apple-icon.png']) {
      expect(existsSync(join(APP, arquivo)), `falta src/app/${arquivo}`).toBe(true)
    }
  })

  it('não voltou a servir o favicon do create-next-app', () => {
    expect(md5(join(APP, 'favicon.ico'))).not.toBe(FAVICON_DO_TEMPLATE)
  })

  it('usa a arte do Só+1, com fundo escuro para sobreviver à aba clara', () => {
    const svg = readFileSync(join(APP, 'icon.svg'), 'utf8')

    expect(svg).toContain(VERDE_DA_MARCA)
    // A placa escura é o que mantém o "1" — quase branco — visível numa aba de
    // tema claro. Sem ela, sobra só o contorno verde.
    expect(svg).toContain('#030712')
  })

  it('não declara ícones no metadata, para haver uma fonte de verdade só', () => {
    expect(metadata.icons).toBeUndefined()

    const layout = readFileSync(join(APP, 'layout.tsx'), 'utf8')
    expect(layout).not.toMatch(/<link\s+rel=["'](icon|shortcut icon|apple-touch-icon)/)
  })

  it('não guarda mais os assets do template em public/', () => {
    const sobras = ['next.svg', 'vercel.svg', 'file.svg', 'globe.svg', 'window.svg']
    const presentes = readdirSync(PUBLIC)

    expect(presentes.filter((arquivo) => sobras.includes(arquivo))).toEqual([])
  })
})
