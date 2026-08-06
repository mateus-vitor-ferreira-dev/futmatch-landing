/**
 * Roda uma vez antes de cada arquivo de teste (configurado em
 * `vitest.config.mts`).
 *
 * O que entra aqui: matcher e stub de API de navegador que TODA seção da
 * landing usa. O que não entra: mock de componente ou de dado — isso é
 * decisão de cada teste, e escondido aqui vira surpresa para quem lê o
 * arquivo de teste isolado.
 */
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

/**
 * O jsdom não implementa `matchMedia`, e praticamente toda seção da landing
 * consulta `(max-width: 767px)` para decidir entre a animação do GSAP e a
 * versão mobile por IntersectionObserver. Sem o stub, nenhuma renderiza.
 *
 * `matches: false` coloca o teste no caminho desktop, que é o que tem a
 * lógica de verdade — o mobile só troca a técnica de animação.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    // Depreciados, mas ainda usados por algumas libs.
    addListener: () => {},
    removeListener: () => {},
  }),
})

/**
 * Também ausente no jsdom. O navbar usa para destacar a seção ativa e o
 * `useMobileScrollAnimation` para revelar os blocos ao rolar.
 *
 * O dublê nunca dispara o callback de propósito: teste que dependa de "o
 * elemento entrou na viewport" deve controlar isso explicitamente, e não
 * herdar um comportamento escondido daqui.
 */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverStub,
})

afterEach(() => {
  // Desmonta o que ficou na tela. Com `globals: false` a Testing Library não
  // registra a limpeza automática, então ela é feita à mão.
  cleanup()
})
