/**
 * Falha quando a landing afirma sobre o produto algo que a api desmente.
 *
 * Por que isto existe
 * -------------------
 * A landing#47 corrigiu quatro afirmações falsas de uma vez — "painel com
 * métricas de ocupação e receita", "agenda integrada", uma quadra "Reservada"
 * num mockup, "controle de inscrições" em torneios. Nenhuma delas veio de
 * descuido: vieram de ninguém ler a landing **contra o código**, que é uma
 * revisão que ninguém faz de rotina.
 *
 * A landing#44, escrita olhando só a página, errou nos dois sentidos ao mesmo
 * tempo: passou direto por uma promessa de relatório de receita — a afirmação
 * mais cara da página, feita para quem vai pagar assinatura — e inventou um
 * erro que não existia, dizendo que "Fair Play" e "Pontual" não eram tags do
 * sistema. São.
 *
 * Este script cobre a fatia que é **enumerável**, e só ela. Frase solta como
 * "métricas de receita" continua sendo trabalho de quem revisa — para essa
 * metade existe o item no `pull_request_template.md`. Ver landing#49.
 *
 * De onde vem a verdade
 * ---------------------
 * Das rotas públicas de catálogo da api: `GET /sports` e `GET /review-tags`.
 * Não é uma segunda fonte que pode divergir — as duas servem constantes que o
 * TypeScript obriga a cobrir o enum do Prisma, e a api tem teste próprio para
 * isso. Conferir contra elas é conferir contra o schema.
 *
 * A landing é o lado lido como **texto**, e isso é de propósito: aqui o que
 * está sendo conferido é a copy, e a copy é texto. A regra do
 * `verifica-numeros-do-readme.mjs` continua valendo — o lado que fornece a
 * verdade é executável.
 *
 * Uso
 * ---
 *   node scripts/verifica-contrato-com-o-produto.mjs
 *   node scripts/verifica-contrato-com-o-produto.mjs --api http://localhost:3000
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const API = (() => {
  const i = process.argv.indexOf('--api')
  return i > -1 ? process.argv[i + 1] : 'https://api.so-mais-um.com'
})()

/** Numeral por extenso, para a copy que escreve "seis" em vez de "6". */
const POR_EXTENSO = { seis: 6, doze: 12 }

const arquivo = (caminho) => readFileSync(join(RAIZ, caminho), 'utf8')

/**
 * O arquivo sem os comentários.
 *
 * **Não é zelo, é a diferença entre pegar e não pegar.** Os comentários destes
 * componentes citam nominalmente as tags e os rótulos antigos, explicando erros
 * passados — é bom comentário e deve continuar lá. Mas procurar "Fair Play" no
 * arquivo inteiro encontra o comentário e dá a conferência por satisfeita,
 * mesmo com a tag sumida da resposta que vai para a tela. Pego testando o
 * script contra exatamente o erro da landing#44.
 */
const copyDe = (caminho) =>
  arquivo(caminho)
    .split('\n')
    .filter((l) => {
      const t = l.trim()
      return !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*')
    })
    .join('\n')

async function catalogo(rota) {
  let resposta
  try {
    resposta = await fetch(`${API}${rota}`, { signal: AbortSignal.timeout(20_000) })
  } catch (erro) {
    console.error(`\n✗ Não consegui falar com a api em ${API}${rota}: ${erro.message}`)
    console.error('  A conferência não roda sem ela — a api é a fonte da verdade aqui.\n')
    // 2, e não 1: "api fora do ar" não é "a landing está errada".
    process.exit(2)
  }
  if (!resposta.ok) {
    console.error(`\n✗ ${API}${rota} respondeu ${resposta.status}\n`)
    process.exit(2)
  }
  return (await resposta.json()).data
}

const problemas = []
const conferido = []

const sports = await catalogo('/sports')
const tags = await catalogo('/review-tags')

// ── 1. O total de modalidades, onde quer que a copy o repita ────────────────
{
  const fontes = ['src/components/landing/HeroSection.tsx', 'src/components/landing/CourtsSection.tsx', 'src/app/layout.tsx']
  let mencoes = 0
  for (const f of fontes) {
    for (const m of arquivo(f).matchAll(/(\d+|doze) modalidades/gi)) {
      mencoes++
      const n = POR_EXTENSO[m[1].toLowerCase()] ?? Number(m[1])
      if (n !== sports.length) {
        problemas.push(`${f}: diz "${m[0]}" e a api serve ${sports.length}`)
      }
    }
  }
  if (mencoes === 0) {
    problemas.push('nenhuma menção a "N modalidades" foi encontrada — a copy mudou e saiu do radar deste script')
  }
  conferido.push(`${sports.length} modalidades em ${mencoes} menção(ões)`)
}

// ── 2. Os nomes das modalidades da vitrine ──────────────────────────────────
//
// A `CourtsSection` não mostra uma amostra: mostra as doze. Então o conjunto
// tem que ser igual, e não apenas estar contido — modalidade nova na api que
// não aparecesse aqui deixaria a página dizendo "12" e listando onze.
{
  const fonte = 'src/components/landing/CourtsSection.tsx'
  const naLanding = [...arquivo(fonte).matchAll(/name: '([^']+)'/g)].map((m) => m[1])
  const naApi = sports.map((s) => s.label)

  const faltando = naApi.filter((l) => !naLanding.includes(l))
  const sobrando = naLanding.filter((l) => !naApi.includes(l))

  for (const l of faltando) problemas.push(`${fonte}: a api serve "${l}" e a vitrine não mostra`)
  for (const l of sobrando) problemas.push(`${fonte}: a vitrine mostra "${l}", que a api não serve`)
  conferido.push(`${naLanding.length} nomes de modalidade`)
}

// ── 3. As tags de avaliação, nomeadas uma a uma no FAQ ──────────────────────
{
  const fonte = 'src/components/landing/FAQSection.tsx'
  const copy = copyDe(fonte)
  const naApi = tags.map((t) => t.label)

  const ausentes = naApi.filter((l) => !copy.includes(l))
  for (const l of ausentes) problemas.push(`${fonte}: a tag "${l}" existe na api e o FAQ não a cita`)

  conferido.push(`${naApi.length} tags citadas`)
}

// ── 4. O total de tags, onde a copy o afirma ────────────────────────────────
{
  const fontes = ['src/components/landing/FAQSection.tsx', 'src/components/landing/FeaturesSection.tsx']
  let mencoes = 0
  for (const f of fontes) {
    // Só a copy: a linha que começa com `//` é comentário de código, e
    // comentário não vai para a tela.
    for (const m of copyDe(f).matchAll(/(\d+|seis) tags/gi)) {
      mencoes++
      const n = POR_EXTENSO[m[1].toLowerCase()] ?? Number(m[1])
      if (n !== tags.length) problemas.push(`${f}: diz "${m[0]}" e a api serve ${tags.length}`)
    }
  }
  if (mencoes === 0) problemas.push('nenhuma menção a "N tags" na copy — a frase mudou e saiu do radar')
  conferido.push(`${tags.length} tags em ${mencoes} menção(ões)`)
}

if (problemas.length > 0) {
  console.error(`\n✗ A landing diverge do produto em ${problemas.length} ponto(s):\n`)
  for (const p of problemas) console.error(`  ${p}`)
  console.error(
    '\n  A api é a fonte: corrija a landing, ou corrija a api se ela é que está errada.\n' +
      '  Afirmação que este script não alcança — promessa em prosa — é o item do pull_request_template.md.\n',
  )
  process.exit(1)
}

console.warn(`\n✓ A landing bate com o produto: ${conferido.join(' · ')}\n`)
