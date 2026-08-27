/**
 * O roadmap tem uma regra própria, e ela já foi quebrada em silêncio.
 *
 * A seção promete "as próximas, com card aberto no board público". A #62 achou
 * os **cinco** itens dela entregues e ainda rotulados como "Planejado": a
 * página prometendo menos do que o produto entrega, que é o inverso da #15 e
 * custa igual.
 *
 * Quem confere isso contra o board é o
 * `scripts/verifica-contrato-com-o-produto.mjs`, que pergunta ao GitHub se cada
 * issue continua aberta. O que ele **não** pode conferir é o passo anterior: um
 * item sem `issue` nenhuma some do radar dele sem deixar rastro — e é assim que
 * a lista volta a nascer de ideia solta.
 *
 * É essa metade que este arquivo guarda, e por isso ele olha o texto do módulo
 * em vez da tela: o `issue` não é renderizado, é a âncora que torna a
 * conferência possível.
 */

import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'

// Caminho relativo à raiz do projeto, e não `import.meta.url`: sob o Vitest o
// módulo nem sempre tem URL de arquivo, e `new URL(...)` estoura com "The URL
// must be of scheme file".
const FONTE = readFileSync('src/components/landing/RoadmapSection.tsx', 'utf8')

/** O bloco `const itens = [...]`, sem o resto do componente junto. */
const listaDeItens = FONTE.slice(FONTE.indexOf('const itens = ['), FONTE.indexOf('export default function'))

const cartoes = [...listaDeItens.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1])
const issues = [...listaDeItens.matchAll(/issue:\s*'([\w.-]+#\d+)'/g)].map((m) => m[1])

describe('a lista do roadmap', () => {
  it('tem item — seção vazia passaria por todas as regras abaixo', () => {
    expect(cartoes.length).toBeGreaterThan(0)
  })

  /**
   * A regra escrita no topo do componente desde sempre: "se não tem issue, não
   * entra na lista". Até a #62 ela dependia de disciplina.
   */
  it('cada item declara a issue que o sustenta', () => {
    expect(issues).toHaveLength(cartoes.length)
  })

  it('aponta para issue de verdade, com repositório e número', () => {
    for (const issue of issues) {
      expect(issue, issue).toMatch(/^so-mais-um-(api|web|landing|marketing|api-collection)#\d+$/)
    }
  })

  it('não repete a mesma issue em dois cartões', () => {
    expect(new Set(issues).size).toBe(issues.length)
  })

  /**
   * O status é o que separa esta seção da `FeaturesSection` para quem lê rápido.
   * Um valor fora do vocabulário — "Entregue", "Pronto" — transformaria o
   * roadmap em vitrine, que é exatamente a mistura que a seção existe para
   * evitar.
   */
  it('usa só os status que significam futuro', () => {
    const status = [...listaDeItens.matchAll(/status:\s*'([^']+)'/g)].map((m) => m[1])

    expect(status).toHaveLength(cartoes.length)
    for (const s of status) expect(['Planejado', 'Em estudo'], s).toContain(s)
  })
})
