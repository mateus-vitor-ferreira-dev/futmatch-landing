/**
 * Grade de planos, lida da API.
 *
 * Mesmo princípio do `stats.ts`: o dado vem do banco, não do código. Aqui isso
 * pesa mais, porque a alternativa seria escrever a grade comercial numa página
 * pública — e no dia que alguém mexesse na tabela `Plan`, a landing passaria a
 * anunciar o que o produto não entrega.
 *
 * `GET /plans/public` **não devolve preço**, de propósito. A landing responde
 * "o que eu ganho em cada degrau?", que é o que dá para responder honestamente
 * antes do cadastro; o valor é conversa do painel, depois da decisão. Isso também
 * é o que desacopla esta seção da virada da Stripe para live.
 */

/**
 * O que um degrau abre no painel do parceiro. Espelha o enum `PlanFeature` da api.
 *
 * A grade deixou de se diferenciar por quantidade — quadras, espaços e modalidades
 * — na api#278. Aquele eixo media o tamanho do cliente, não o que ele ganha ao
 * subir de plano.
 */
export type Funcionalidade = 'ESTATISTICAS' | 'EQUIPAMENTOS' | 'ESTOQUE'

export interface PlanoPublico {
  nome: string
  /**
   * **Lista vazia é o degrau de entrada, não plano quebrado.** Cadastrar a arena e
   * receber partidas não depende de funcionalidade nenhuma — é o que todo plano
   * inclui, e a seção diz isso em vez de desenhar um cartão vazio.
   */
  funcionalidades: Funcionalidade[]
}

export interface GradeDePlanos {
  planos: PlanoPublico[]
  /** Montada pela api a partir do `APP_URL` dela, para não divergir entre ambientes. */
  parceiroUrl: string
}

const API_URL = process.env.API_URL ?? 'https://api.so-mais-um.com'

/** Os mesmos cinco minutos que a api cacheia do lado dela. */
const REVALIDAR_SEGUNDOS = 300

const FUNCIONALIDADES: readonly Funcionalidade[] = ['ESTATISTICAS', 'EQUIPAMENTOS', 'ESTOQUE']

/** Campo inesperado derruba a resposta inteira: meia grade é pior que nenhuma. */
function ehPlanoValido(valor: unknown): valor is PlanoPublico {
  const p = valor as Partial<PlanoPublico> | null

  if (typeof p?.nome !== 'string' || p.nome.length === 0) return false

  // Array vazio é resposta legítima — é o plano de entrada. O que não pode passar é
  // `undefined`, nem um nome de funcionalidade que esta versão da landing não conhece:
  // renderizar um rótulo em branco seria pior do que esconder a seção.
  if (!Array.isArray(p.funcionalidades)) return false

  return p.funcionalidades.every(f => FUNCIONALIDADES.includes(f as Funcionalidade))
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
