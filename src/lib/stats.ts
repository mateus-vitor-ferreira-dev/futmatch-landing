/**
 * Números da plataforma, lidos da API.
 *
 * A seção de prova social já existiu com os valores escritos no código e foi
 * removida na revisão da #15: a landing é pública e está em produção, e número
 * inventado é afirmação falsa para quem visita. Estes vêm de `GET /stats`, que
 * conta no banco.
 */
export interface NumerosPublicos {
  jogadores: number
  peladasAbertas: number
  cidades: number
  arenas: number
}

const API_URL = process.env.API_URL ?? 'https://api.so-mais-um.com'

/**
 * Cinco minutos, o mesmo que a API cacheia.
 *
 * Nenhum desses números muda de minuto a minuto, e a landing não pode depender
 * da API estar de pé para renderizar. Este é o modelo de cache de projeto sem
 * `cacheComponents` — ver `docs/01-app/02-guides/caching-without-cache-components.md`
 * no pacote do Next: sem opção, `fetch` não cacheia e ainda bloqueia a página.
 */
const REVALIDAR_SEGUNDOS = 300

/**
 * Devolve `null` quando a API não responde, em vez de zeros.
 *
 * Zero é um número, e um número errado: "0 jogadores" na home é pior do que não
 * dizer nada. Quem chama trata o `null` escondendo os cartões que dependem do
 * dado — nunca mostrando o dado vazio.
 */
export async function getNumerosPublicos(): Promise<NumerosPublicos | null> {
  try {
    const resposta = await fetch(`${API_URL}/stats`, {
      next: { revalidate: REVALIDAR_SEGUNDOS },
    })

    if (!resposta.ok) return null

    const corpo: unknown = await resposta.json()
    const dados = (corpo as { data?: Partial<NumerosPublicos> } | null)?.data

    // Campo faltando é resposta que não dá para exibir: melhor sumir com os
    // cartões do que renderizar `undefined` formatado como número.
    if (
      typeof dados?.jogadores !== 'number' ||
      typeof dados?.peladasAbertas !== 'number' ||
      typeof dados?.cidades !== 'number' ||
      typeof dados?.arenas !== 'number'
    ) {
      return null
    }

    return dados as NumerosPublicos
  } catch {
    // Rede fora, DNS, timeout: a landing continua de pé sem a prova social.
    return null
  }
}
