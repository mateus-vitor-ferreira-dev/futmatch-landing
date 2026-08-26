/**
 * Confere os números do README que saem do relatório do Vitest.
 *
 * Portado do `verifica-numeros-do-readme.ts` da api, com a mesma regra: **cada
 * número vem de uma fonte executável**, e o README é o único lado lido como
 * texto. Contar por regex sobre o código-fonte é o erro que gerou quatro
 * issues inválidas lá (#85, #87, #88, #100).
 *
 * O que NÃO está aqui, e por quê
 * ------------------------------
 * O total de seções vive em `src/app/numeros-do-readme.test.tsx`, porque
 * depende de **render**: a `PlanosSection` some sozinha quando a API não
 * responde, então contar `<XSection />` no fonte daria 11 para uma página que
 * às vezes mostra 10. Cada número mora onde está a fonte que o prova.
 *
 * Uso:
 *   npm run test:ci        # roda a suíte e grava o relatório JSON
 *   npm run readme:check   # confere os números
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const RELATORIO = join(RAIZ, '.vitest-report.json')

/**
 * Cada conferência é `{ nome, esperado, fonte, padroes, ocorrencias }`.
 *
 * `ocorrencias` é quantas menções devem existir. Menos que isso significa que
 * uma frase foi reescrita e escapou do radar — falha, porque número que
 * ninguém confere é exatamente o que envelhece.
 */

function relatorio() {
  if (!existsSync(RELATORIO)) {
    console.error(`\n✗ Relatório do Vitest não encontrado em ${RELATORIO}\n  Rode a suíte antes: npm run test:ci\n`)
    process.exit(1)
  }

  const dados = JSON.parse(readFileSync(RELATORIO, 'utf8'))

  if (!dados.success) {
    console.error('\n✗ O relatório é de uma execução que falhou — conferir números dela não diz nada.\n')
    process.exit(1)
  }

  const porArquivo = new Map()
  for (const arquivo of dados.testResults) {
    porArquivo.set(arquivo.name.split('/').pop(), arquivo.assertionResults.length)
  }
  return { porArquivo }
}

function testesDe(porArquivo, arquivo) {
  const n = porArquivo.get(arquivo)
  if (n === undefined) {
    console.error(`\n✗ ${arquivo} não aparece no relatório do Vitest — o arquivo foi renomeado?\n`)
    process.exit(1)
  }
  return n
}

const { porArquivo } = relatorio()

const conferencias = [
  {
    /**
     * O README fala da suíte de acessibilidade do FAQ, e **não** do total da
     * landing — que hoje é 45. Por isso a fonte é o arquivo, e não
     * `numTotalTests`: trocar por um faria a frase mentir sobre o que cobre.
     */
    nome: 'testes do FAQSection',
    esperado: testesDe(porArquivo, 'FAQSection.test.tsx'),
    fonte: 'assertionResults de FAQSection.test.tsx no relatório do Vitest',
    padroes: [/São (\d+) testes sobre o que a revisão visual não pega/g],
    ocorrencias: 1,
  },
]

function conferir(readme, c) {
  const achados = c.padroes.flatMap((p) => [...readme.matchAll(p)].map((m) => Number(m[1])))
  const problemas = []

  if (achados.length !== c.ocorrencias) {
    problemas.push(
      `${c.nome}: o README menciona esse número ${achados.length}× e a conferência espera ${c.ocorrencias}×.\n` +
        `    Alguma menção foi reescrita e saiu do radar — ajuste os padrões em scripts/verifica-numeros-do-readme.mjs.`,
    )
  }

  const divergentes = [...new Set(achados.filter((n) => n !== c.esperado))]
  if (divergentes.length > 0) {
    problemas.push(`${c.nome}: esperado ${c.esperado} ≠ encontrado ${divergentes.join(', ')}  (fonte: ${c.fonte})`)
  }

  return problemas
}

const readme = readFileSync(join(RAIZ, 'README.md'), 'utf8')
const problemas = conferencias.flatMap((c) => conferir(readme, c))

if (problemas.length > 0) {
  console.error(`\n✗ O README está desatualizado em ${problemas.length} ponto(s):\n`)
  for (const p of problemas) console.error(`  ${p}`)
  console.error('\n  Corrija os números no README.md — são a primeira coisa que alguém de fora lê.\n')
  process.exit(1)
}

console.warn(`\n✓ Números do README conferem: ${conferencias.map((c) => `${c.esperado} ${c.nome}`).join(' · ')}\n`)
