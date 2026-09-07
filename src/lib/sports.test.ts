import { afterEach, describe, expect, it, vi } from 'vitest'
import { FALLBACK_SPORTS, getSports } from './sports'

afterEach(() => vi.unstubAllGlobals())

describe('catálogo de modalidades da landing', () => {
  it('usa a resposta canônica da API', async () => {
    const resposta = [{ ...FALLBACK_SPORTS[0], label: 'Society da API' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: resposta }),
    }))

    await expect(getSports()).resolves.toEqual(resposta)
    expect(fetch).toHaveBeenCalledWith(
      'https://api.so-mais-um.com/sports',
      expect.objectContaining({ next: { revalidate: 3600 } }),
    )
  })

  it('mantém a vitrine no ar com o fallback quando a API falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await expect(getSports()).resolves.toBe(FALLBACK_SPORTS)
  })

  it('não compartilha identificadores visuais entre modalidades', () => {
    expect(new Set(FALLBACK_SPORTS.map((sport) => sport.icon)).size).toBe(FALLBACK_SPORTS.length)
  })
})
