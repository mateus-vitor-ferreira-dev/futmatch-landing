/**
 * O README anuncia "11 seções". Este teste confere isso contra a página.
 *
 * Por que um teste, e não um script como o da api
 * -----------------------------------------------
 * O número depende de **render**, não de contagem de arquivo. A
 * `PlanosSection` some sozinha quando a API não responde — está escrito no
 * comentário da própria `page.tsx` —, então contar `<XSection />` no
 * código-fonte daria 11 para uma página que às vezes mostra 10, e renderizar
 * sem dado daria 10 para uma página que anuncia 11.
 *
 * O que o README conta é a página **como ela é quando tudo responde**. Isso é
 * exatamente um render com os dois carregadores devolvendo dado, que é o que
 * o vitest já sabe fazer e um script solto não faria sem remontar meia
 * infraestrutura.
 *
 * A regra continua sendo a do `verifica-numeros-do-readme.ts` da api: o número
 * vem de uma fonte executável, e o README é o único lado lido como texto.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

vi.mock('@/lib/stats', () => ({
    getNumerosPublicos: vi.fn(),
}))
vi.mock('@/lib/planos', () => ({
    getGradeDePlanos: vi.fn(),
}))
vi.mock('@/lib/sports', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/lib/sports')>()
    return { ...original, getSports: vi.fn() }
})

import { getNumerosPublicos } from '@/lib/stats'
import { getGradeDePlanos, type GradeDePlanos } from '@/lib/planos'
import { FALLBACK_SPORTS, getSports } from '@/lib/sports'
import LandingPage from './page'

/**
 * O jsdom não implementa a geometria de SVG, e o `HowItWorksSection` mede a
 * linha com `getTotalLength()` para animar o traço. Sem isto o GSAP recebe
 * `undefined` e derruba o render da página inteira.
 *
 * Fica aqui, e não no `src/test/setup.ts`: aquele arquivo é para o que TODA
 * seção usa, e esta é a única que mede caminho. Este é também o único teste
 * que renderiza a página inteira.
 */
if (!('getTotalLength' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'getTotalLength', { value: () => 100, writable: true })
}
if (!('getPointAtLength' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'getPointAtLength', {
        value: () => ({ x: 0, y: 0 }),
        writable: true,
    })
}

const NUMEROS = { jogadores: 128, matchesAbertas: 9, cidades: 4, arenas: 26 }
const GRADE: GradeDePlanos = {
    parceiroUrl: 'https://app.so-mais-um.com/seja-parceiro',
    planos: [{ nome: 'Só+1 Pro', funcionalidades: ['ESTOQUE'] }],
}

async function renderizaPagina() {
    // Server Component: o default export é async e devolve JSX já resolvido.
    const arvore = await LandingPage()
    return render(arvore)
}

function numeroNoReadme(padrao: RegExp): number[] {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8')
    return [...readme.matchAll(padrao)].map((m) => Number(m[1]))
}

describe('os números do README', () => {
    beforeEach(() => {
        vi.mocked(getNumerosPublicos).mockResolvedValue(NUMEROS)
        vi.mocked(getGradeDePlanos).mockResolvedValue(GRADE)
        vi.mocked(getSports).mockResolvedValue(FALLBACK_SPORTS)
    })

    it('o total de seções bate com o que a página renderiza', async () => {
        const { container } = await renderizaPagina()

        const secoes = container.querySelectorAll('section').length
        const anunciados = numeroNoReadme(/São \*\*(\d+) seções\*\*/g)

        // A contagem de menções importa tanto quanto o valor: uma frase
        // reescrita que escape do padrão é um número que ninguém mais confere.
        expect(anunciados).toHaveLength(1)
        expect(anunciados[0]).toBe(secoes)
    })

    /**
     * A contrapartida do caso acima: se a `PlanosSection` deixar de sumir sem
     * dado, o comentário da `page.tsx` vira mentira e o número do README passa
     * a valer para os dois estados — o que ninguém iria reparar.
     */
    it('sem a API, a página mostra uma seção a menos', async () => {
        vi.mocked(getGradeDePlanos).mockResolvedValue(null)

        const { container } = await renderizaPagina()

        const comDado = numeroNoReadme(/São \*\*(\d+) seções\*\*/g)[0]
        expect(container.querySelectorAll('section')).toHaveLength(comDado - 1)
    })
})
