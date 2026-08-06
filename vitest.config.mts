import { defineConfig, coverageConfigDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 * Configuração do Vitest.
 *
 * Diferente do `web`, aqui não há um `vite.config` para o Vitest reaproveitar
 * — a landing é Next.js, e o build é dele. Então a configuração de teste é
 * própria, seguindo o guia oficial do Next
 * (`node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`).
 *
 * `.mts` de propósito: o `package.json` não declara `"type": "module"`, então
 * um `vitest.config.ts` seria lido como CommonJS e o `import` quebraria.
 */
export default defineConfig({
  plugins: [
    // Sem isto, o alias `@/*` do tsconfig não existe dentro do teste e todo
    // import de componente falha em "Failed to resolve import".
    tsconfigPaths(),
    react(),
  ],

  test: {
    // jsdom dá ao teste um DOM de mentira — sem ele não há document para a
    // Testing Library consultar.
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],

    // Sem globals: cada teste importa describe/it/expect de 'vitest'. Fica
    // explícito de onde vem cada coisa e o tsc não precisa de tipos globais.
    globals: false,

    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/test/**',
        'src/app/layout.tsx',
      ],
    },
  },
})
