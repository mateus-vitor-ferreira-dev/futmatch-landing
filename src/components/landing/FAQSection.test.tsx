/**
 * Acessibilidade do FAQ.
 *
 * A resposta fica sempre montada no DOM, escondida por altura zero e animada
 * pelo GSAP — é o que dá a animação de abrir e o que entrega o texto ao
 * buscador. O que impede o leitor de tela de ler todas as respostas o tempo
 * todo é o `inert` no bloco fechado.
 *
 * É comportamento invisível: se o `inert` sumir num refactor, a tela continua
 * idêntica, a animação continua funcionando, e só quem usa leitor de tela
 * descobre — e não vai abrir issue. Por isso está coberto aqui.
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

/**
 * O GSAP fica de fora destes testes, e isso não é preguiça.
 *
 * A entrada da seção usa `autoAlpha`, que é opacidade **mais**
 * `visibility`. Sem scroll — e não existe scroll no jsdom — o ScrollTrigger
 * nunca dispara, os itens ficam em `visibility: hidden`, e aí some da árvore
 * de acessibilidade tudo aquilo que este arquivo existe para verificar:
 * `getByRole` deixa de achar os botões.
 *
 * O dublê abaixo tira a animação do caminho e deixa o componente renderizar o
 * estado final. O `onComplete` é chamado na hora porque o fechamento depende
 * dele para virar o estado — sem isso, fechar nunca termina.
 */
vi.mock('gsap', () => {
  const gsap = {
    set: vi.fn(),
    to: vi.fn((_alvo: unknown, vars?: { onComplete?: () => void }) => {
      vars?.onComplete?.()
      return {}
    }),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
    context: vi.fn((fn: () => void) => {
      fn()
      return { revert: vi.fn() }
    }),
  }
  return { gsap, default: gsap }
})
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

import FAQSection from './FAQSection'

/** Botões de pergunta, na ordem em que aparecem. */
function perguntas() {
  return screen.getAllByRole('button')
}

describe('FAQSection — estado inicial', () => {
  it('renderiza as oito perguntas como botões', () => {
    render(<FAQSection />)

    expect(perguntas()).toHaveLength(8)
    expect(
      screen.getByRole('button', { name: /o só\+1 é gratuito para jogadores/i }),
    ).toBeInTheDocument()
  })

  it('todas começam fechadas e anunciam isso', () => {
    render(<FAQSection />)

    for (const botao of perguntas()) {
      expect(botao).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('toda resposta fechada está fora da árvore de acessibilidade', () => {
    const { container } = render(<FAQSection />)

    const respostas = container.querySelectorAll('[role="region"]')
    expect(respostas).toHaveLength(8)
    for (const resposta of respostas) {
      // `inert` é o que tira do leitor de tela e da ordem de foco sem tirar
      // do HTML. Altura zero, sozinha, esconde só visualmente.
      expect(resposta).toHaveAttribute('inert')
    }
  })

  it('o texto das respostas continua no HTML, para o buscador', () => {
    render(<FAQSection />)

    // Removê-lo do DOM resolveria a acessibilidade e perderia o SEO — o
    // ponto do `inert` é não ter que escolher.
    expect(screen.getByText(/Fisher-Yates/)).toBeInTheDocument()
  })
})

describe('FAQSection — vínculo entre pergunta e resposta', () => {
  it('cada botão aponta para a resposta que controla', () => {
    const { container } = render(<FAQSection />)

    for (const botao of perguntas()) {
      const idResposta = botao.getAttribute('aria-controls')
      expect(idResposta).toBeTruthy()

      const resposta = container.querySelector(`#${CSS.escape(idResposta!)}`)
      expect(resposta).not.toBeNull()
      // O caminho de volta: a região é nomeada pela pergunta, senão vira um
      // marco sem nome, que alguns leitores simplesmente não anunciam.
      expect(resposta).toHaveAttribute('aria-labelledby', botao.id)
      expect(resposta).toHaveAttribute('role', 'region')
    }
  })

  it('os ids são únicos entre os oito itens', () => {
    render(<FAQSection />)

    const ids = perguntas().map(b => b.getAttribute('aria-controls'))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('FAQSection — abrir e fechar', () => {
  it('abrir anuncia o estado e devolve a resposta à árvore de acessibilidade', async () => {
    const user = userEvent.setup()
    const { container } = render(<FAQSection />)
    const primeira = perguntas()[0]

    await user.click(primeira)

    expect(primeira).toHaveAttribute('aria-expanded', 'true')
    const resposta = container.querySelector(`#${CSS.escape(primeira.getAttribute('aria-controls')!)}`)
    expect(resposta).not.toHaveAttribute('inert')
  })

  it('abrir uma não mexe nas outras', async () => {
    const user = userEvent.setup()
    render(<FAQSection />)

    await user.click(perguntas()[0])

    const demais = perguntas().slice(1)
    for (const botao of demais) {
      expect(botao).toHaveAttribute('aria-expanded', 'false')
    }
  })

  it('fechar devolve o `inert` e o estado do botão', async () => {
    const user = userEvent.setup()
    const { container } = render(<FAQSection />)
    const primeira = perguntas()[0]
    const resposta = container.querySelector(`#${CSS.escape(primeira.getAttribute('aria-controls')!)}`)!

    await user.click(primeira)
    expect(resposta).not.toHaveAttribute('inert')

    await user.click(primeira)

    // O `inert` volta só quando a animação de recolher termina — antes disso
    // o bloco ainda está visível, e sumir do leitor de tela seria errado.
    expect(primeira).toHaveAttribute('aria-expanded', 'false')
    expect(resposta).toHaveAttribute('inert')
  })

  it('a resposta aberta é anunciada com o texto da pergunta como nome', async () => {
    const user = userEvent.setup()
    render(<FAQSection />)

    await user.click(screen.getByRole('button', { name: /como funciona o sorteio de times/i }))

    const regiao = screen.getByRole('region', { name: /como funciona o sorteio de times/i })
    expect(within(regiao).getByText(/Fisher-Yates/)).toBeInTheDocument()
  })
})

describe('FAQSection — teclado', () => {
  it('a pergunta é alcançável por Tab', async () => {
    const user = userEvent.setup()
    render(<FAQSection />)

    await user.tab()

    expect(perguntas()[0]).toHaveFocus()
  })

  it('Enter abre', async () => {
    const user = userEvent.setup()
    render(<FAQSection />)

    await user.tab()
    await user.keyboard('{Enter}')

    expect(perguntas()[0]).toHaveAttribute('aria-expanded', 'true')
  })

  it('Espaço abre', async () => {
    const user = userEvent.setup()
    render(<FAQSection />)

    await user.tab()
    await user.keyboard(' ')

    expect(perguntas()[0]).toHaveAttribute('aria-expanded', 'true')
  })

  /**
   * As três promessas que a #64 tirou daqui.
   *
   * Nenhuma era descuido de redação: cada uma descrevia um produto plausível,
   * e o produto é outro. "Exporta tudo pelo perfil" — a rota existe na api, a
   * tela não; "cadastro do espaço é gratuito" — `POST /place-requests` passa
   * por `requireActiveSubscription`; e a ordem estava invertida por
   * consequência da segunda.
   *
   * O teste olha o **texto das respostas**, e não a tela montada, porque o
   * defeito é de conteúdo: uma frase reescrita que volte a prometer exportação
   * passaria por qualquer asserção de interface.
   */
  describe('as promessas que o produto precisa sustentar', () => {
    /**
     * O texto que chega à página, e não o módulo: as respostas ficam no HTML
     * mesmo fechadas — é o que o teste de SEO acima garante —, então ler o
     * `textContent` é ler exatamente o que o visitante e o buscador leem.
     */
    function respostasNaPagina() {
      const { container } = render(<FAQSection />)
      return container.textContent ?? ''
    }

    it('não promete exportar dados pelo perfil — a tela não existe', () => {
      expect(respostasNaPagina()).not.toMatch(/exporta/i)
    })

    it('não diz que cadastrar o espaço é gratuito — exige assinatura ativa', () => {
      expect(respostasNaPagina()).not.toMatch(/cadastro do espaço é grat/i)
    })

    /**
     * A ordem é o que o dono de quadra usa para se planejar. Invertida, ele
     * descobre a assinatura depois de já ter decidido entrar — e o lugar mais
     * caro para essa descoberta é depois de a pessoa já ter se convencido.
     */
    it('descreve a ordem real: assina, pede o espaço, o time analisa', () => {
      const pagina = respostasNaPagina()

      expect(pagina).toMatch(/vale desde o pedido do espaço/i)
      expect(pagina.indexOf('você assina um dos planos')).toBeLessThan(pagina.indexOf('analisa o pedido'))
    })

    /**
     * Valor, nome de plano e prazo vêm da api em runtime — ou não existem.
     * Escritos aqui, envelhecem em silêncio, que é como a #15 custou uma seção.
     */
    it('não cita valor, nome de plano nem prazo', () => {
      expect(respostasNaPagina()).not.toMatch(/R\$|Só\+1 (Básico|Pro|Premium)|\d+ dias/)
    })
  })

  it('o chevron não entra na leitura — é decorativo', () => {
    const { container } = render(<FAQSection />)

    const svgs = container.querySelectorAll('button svg')
    expect(svgs.length).toBeGreaterThan(0)
    for (const svg of svgs) {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    }
  })
})
