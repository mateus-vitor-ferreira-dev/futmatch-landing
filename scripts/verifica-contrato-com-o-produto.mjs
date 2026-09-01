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

/** Dono dos repositórios, para montar a URL da issue do roadmap. */
const DONO = 'mateus-vitor-ferreira-dev'

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

/**
 * O estado de uma issue no GitHub: `open` ou `closed`.
 *
 * Segunda fonte de verdade deste script, e por um motivo diferente da api. A
 * api diz o que o produto **faz**; o board diz o que ele **ainda não faz**, e é
 * essa metade que a `RoadmapSection` afirma. Não há como conferir roadmap
 * contra código: a ausência de uma funcionalidade não deixa rastro em lugar
 * nenhum — o que existe é o card aberto.
 *
 * **Precisa de token**, e não por causa de limite: o repositório da api é
 * privado, então sem credencial o GitHub responde 404 — indistinguível de
 * "issue não existe". Localmente o `gh auth token` resolve; no CI é preciso um
 * PAT com leitura do repo da api, porque o `GITHUB_TOKEN` que o Actions injeta
 * sozinho só enxerga o repositório onde o workflow roda.
 */
async function estadoDaIssue({ repo, numero }) {
  const url = `https://api.github.com/repos/${DONO}/${repo}/issues/${numero}`
  const headers = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

  let resposta
  try {
    resposta = await fetch(url, { headers, signal: AbortSignal.timeout(20_000) })
  } catch (erro) {
    console.error(`\n✗ Não consegui falar com o GitHub sobre ${repo}#${numero}: ${erro.message}`)
    console.error('  A conferência do roadmap não roda sem ele — o board é a fonte da verdade aqui.\n')
    // 2 pelo mesmo motivo da api: "GitHub fora do ar" não é "a landing está errada".
    process.exit(2)
  }
  if (!resposta.ok) {
    console.error(`\n✗ ${url} respondeu ${resposta.status}`)
    if (resposta.status === 403) console.error('  Provavelmente limite de requisições. Defina GITHUB_TOKEN.')
    console.error('')
    process.exit(2)
  }
  return (await resposta.json()).state
}

const problemas = []
const conferido = []
/** O que este script deveria ter conferido e não conseguiu. Não reprova, mas aparece. */
const naoConferido = []

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

// ── 3. Os ícones das modalidades ────────────────────────────────────────────
//
// A conferência de nomes acima passava com o tênis errado: a landing mostrava
// 🎾 — o mesmo emoji do Beach Tennis, no cartão ao lado — enquanto a api servia
// 🥎. Nome batendo e ícone divergindo foi o estado que a #440 encontrou, e não
// havia nada aqui que o pegasse.
//
// Quem decide é `src/constants/sports.ts` da api: `icon` é um identificador
// estável e `iconFallback` é o emoji, ou `null` para as três que o Unicode não
// representa. `null` quer dizer "esta é desenhada pelo cliente" — e na landing
// isso é um componente SVG, nunca um emoji aproximado, que foi de onde vieram o
// guarda-sol e a raquete de badminton que a #46 removeu por escrito.
{
  const fonte = 'src/components/landing/CourtsSection.tsx'

  // Cada entrada de `sports` abre com `id` e `icon`, nesta ordem. O `icon` é
  // ou um emoji entre aspas, ou um componente JSX.
  const cartoes = [
    ...arquivo(fonte).matchAll(/\{\s*id: '([A-Z_]+)',\s*icon: (?:'([^']*)'|<(\w+)\s*\/>)/g),
  ].map((m) => ({ id: m[1], emoji: m[2], componente: m[3] }))

  // Sem isto, uma mudança de formatação na lista faria o regex achar zero
  // cartões e a seção inteira aprovaria em silêncio — o mesmo modo de falha que
  // as contagens de menção acima existem para evitar.
  if (cartoes.length !== sports.length) {
    problemas.push(
      `${fonte}: li ${cartoes.length} cartões com \`id\` e a api serve ${sports.length} modalidades — ` +
        'a forma da lista mudou e este script deixou de enxergá-la',
    )
  }

  for (const cartao of cartoes) {
    const naApi = sports.find((s) => s.id === cartao.id)
    if (!naApi) {
      problemas.push(`${fonte}: o cartão \`${cartao.id}\` não é uma modalidade que a api serve`)
      continue
    }

    if (naApi.iconFallback === null) {
      if (!cartao.componente) {
        problemas.push(
          `${fonte}: ${naApi.label} mostra o emoji ${cartao.emoji} e a api serve \`iconFallback: null\` — ` +
            'esta modalidade não tem emoji correto e precisa do SVG desenhado',
        )
      }
    } else if (cartao.emoji !== naApi.iconFallback) {
      const mostrado = cartao.componente ? `<${cartao.componente} />` : cartao.emoji
      problemas.push(`${fonte}: ${naApi.label} mostra ${mostrado} e a api serve ${naApi.iconFallback}`)
    }
  }

  // Ícone repetido é o defeito da #440 na forma genérica: dois cartões lado a
  // lado, visualmente idênticos, com nomes diferentes. Conferir um a um contra
  // a api já impede isso enquanto a api estiver certa; esta checagem é o que
  // faz a colisão aparecer AQUI, na tela onde ela machuca.
  const vistos = new Map()
  for (const cartao of cartoes) {
    const chave = cartao.componente ? `<${cartao.componente} />` : cartao.emoji
    if (vistos.has(chave)) {
      problemas.push(`${fonte}: ${vistos.get(chave)} e ${cartao.id} mostram o mesmo ícone ${chave}`)
    }
    vistos.set(chave, cartao.id)
  }

  conferido.push(`${cartoes.length} ícones de modalidade`)
}

// ── 4. As tags de avaliação, nomeadas uma a uma no FAQ ──────────────────────
{
  const fonte = 'src/components/landing/FAQSection.tsx'
  const copy = copyDe(fonte)
  const naApi = tags.map((t) => t.label)

  const ausentes = naApi.filter((l) => !copy.includes(l))
  for (const l of ausentes) problemas.push(`${fonte}: a tag "${l}" existe na api e o FAQ não a cita`)

  conferido.push(`${naApi.length} tags citadas`)
}

// ── 5. O total de tags, onde a copy o afirma ────────────────────────────────
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

// ── 6. O roadmap ainda é futuro ─────────────────────────────────────────────
//
// A #62 achou os cinco itens da seção **todos entregues**, com a página ainda
// chamando cada um de "Planejado" — a landing prometendo menos do que o produto
// dá. Foi a terceira deriva do tipo, e a primeira que ninguém acharia lendo a
// página: só aparece comparando a seção com o board.
//
// A regra da seção sempre foi "se não tem issue, não entra". Ela agora está
// escrita no código, item por item, e é o que torna a conferência possível:
// issue fechada quer dizer funcionalidade no ar, e funcionalidade no ar não é
// roadmap.
{
  const fonte = 'src/components/landing/RoadmapSection.tsx'
  const refs = [...copyDe(fonte).matchAll(/issue: '([\w.-]+)#(\d+)'/g)].map((m) => ({
    repo: m[1],
    numero: Number(m[2]),
  }))

  // A seção tem itens e nenhum deles declara issue: ou o campo foi removido, ou
  // a lista voltou a nascer de ideia solta. Nos dois casos, esta conferência
  // passaria a aprovar qualquer coisa em silêncio.
  const cartoes = (copyDe(fonte).match(/^\s{4}title:/gm) ?? []).length
  if (cartoes > refs.length) {
    problemas.push(`${fonte}: ${cartoes} cartões e ${refs.length} com \`issue\` — item sem issue não entra no roadmap`)
  }

  // Sem token não dá para ler issue de repositório privado, e o GitHub
  // responde 404 — que é indistinguível de "issue não existe". Aqui a escolha
  // é anunciar que NÃO conferiu, em vez de reprovar (deixaria o CI vermelho por
  // falta de segredo, não por erro na página) ou de aprovar em silêncio (uma
  // conferência que não roda e diz que rodou é pior do que nenhuma).
  if (!process.env.GITHUB_TOKEN) {
    naoConferido.push(
      `${refs.length} itens de roadmap — sem GITHUB_TOKEN, e o repo da api é privado.\n` +
        `    Local:  GITHUB_TOKEN=$(gh auth token) npm run contrato:check\n` +
        `    No CI:  um PAT com leitura do repo da api, em secrets.BOARD_TOKEN`,
    )
  } else {
    for (const ref of refs) {
      if ((await estadoDaIssue(ref)) === 'closed') {
        problemas.push(
          `${fonte}: ${ref.repo}#${ref.numero} está fechada — o item já foi ao ar e a seção ainda o chama de futuro`,
        )
      }
    }
    conferido.push(`${refs.length} itens de roadmap ainda abertos`)
  }
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

console.warn(`\n✓ A landing bate com o produto: ${conferido.join(' · ')}`)
for (const n of naoConferido) console.warn(`\n⚠️  Não conferido: ${n}`)
console.warn('')
