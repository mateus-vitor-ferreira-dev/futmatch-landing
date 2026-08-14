/**
 * Grade de planos, lida da API.
 *
 * Mesmo princípio do `stats.ts`: o dado vem do banco, não do código. Aqui isso
 * pesa mais, porque a alternativa seria escrever a grade comercial numa página
 * pública — e no dia que alguém mexesse na tabela `Plan`, a landing passaria a
 * anunciar o que o produto não entrega.
 *
 * `GET /plans/public` **não devolve preço**, de propósito. A landing responde
 * "cabe no meu espaço?", que é o que dá para responder honestamente antes do
 * cadastro; o valor é conversa do painel, depois da decisão. Isso também é o
 * que desacopla esta seção da virada da Stripe para live.
 */
export interface PlanoPublico {
  nome: string
  /** `null` significa SEM LIMITE, nunca zero — ver o comentário no `schema.prisma`. */
  maxEstabelecimentos: number | null
  maxQuadras: number | null
  maxModalidades: number | null
}

export interface GradeDePlanos {
  planos: PlanoPublico[]
  /** Montada pela api a partir do `APP_URL` dela, para não divergir entre ambientes. */
  parceiroUrl: string
}

const API_URL = process.env.API_URL ?? 'https://api.so-mais-um.com'

/** Os mesmos cinco minutos que a api cacheia do lado dela. */
const REVALIDAR_SEGUNDOS = 300

/** `null` em qualquer campo esperado derruba a resposta inteira: meia grade é pior que nenhuma. */
function ehPlanoValido(valor: unknown): valor is PlanoPublico {
  const p = valor as Partial<PlanoPublico> | null

  if (typeof p?.nome !== 'string' || p.nome.length === 0) return false

  // `null` é resposta legítima — é o "ilimitado". O que não pode passar é
  // `undefined`, que viraria "NaN quadras" na tela.
  return (['maxEstabelecimentos', 'maxQuadras', 'maxModalidades'] as const).every(
    campo => p[campo] === null || typeof p[campo] === 'number'
  )
}

/**
 * Devolve `null` quando a API não responde ou responde algo inesperado.
 *
 * Quem chama esconde a seção — nunca renderiza grade parcial. Uma comparação de
 * planos com um plano faltando não é informação incompleta, é informação errada:
 * o dono conclui que o produto não serve para o tamanho dele.
 */
export async function getGradeDePlanos(): Promise<GradeDePlanos | null> {
  try {
    const resposta = await fetch(`${API_URL}/plans/public`, {
      next: { revalidate: REVALIDAR_SEGUNDOS },
    })

    if (!resposta.ok) return null

    const corpo: unknown = await resposta.json()
    const dados = (corpo as { data?: Partial<GradeDePlanos> } | null)?.data

    if (typeof dados?.parceiroUrl !== 'string') return null
    if (!Array.isArray(dados.planos) || dados.planos.length === 0) return null
    if (!dados.planos.every(ehPlanoValido)) return null

    return { planos: dados.planos, parceiroUrl: dados.parceiroUrl }
  } catch {
    // Rede fora, DNS, timeout: a landing continua de pé sem a seção.
    return null
  }
}
