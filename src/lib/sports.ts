export interface Sport {
  id: string
  label: string
  icon: string
  iconFallback: string | null
  description: string
  group: string
  groupLabel: string
  groupIcon: string
  groupIconFallback: string | null
  groupOrder: number
}

const API_URL = process.env.API_URL ?? 'https://api.so-mais-um.com'
const REVALIDAR_SEGUNDOS = 3600

/**
 * A API é a fonte da verdade. O fallback mantém a vitrine renderizável durante
 * indisponibilidade e é auditado pelo `contrato:check` contra o mesmo endpoint.
 */
export const FALLBACK_SPORTS: Sport[] = [
  { id: 'SOCIETY', label: 'Society', icon: 'society', iconFallback: '⚽', description: 'Campo society — grama sintética', group: 'FUTEBOL', groupLabel: 'Futebol', groupIcon: 'futebol', groupIconFallback: '⚽', groupOrder: 1 },
  { id: 'CAMPO', label: 'Futebol de Campo', icon: 'futebol-campo', iconFallback: '🏟️', description: 'Campo convencional', group: 'FUTEBOL', groupLabel: 'Futebol', groupIcon: 'futebol', groupIconFallback: '⚽', groupOrder: 1 },
  { id: 'FUTSAL', label: 'Futsal', icon: 'futsal', iconFallback: '👟', description: 'Quadra de futsal coberta', group: 'FUTEBOL', groupLabel: 'Futebol', groupIcon: 'futebol', groupIconFallback: '⚽', groupOrder: 1 },
  { id: 'AREIA', label: 'Futevôlei', icon: 'futevolei', iconFallback: null, description: 'Quadra de areia', group: 'FUTEVOLEI', groupLabel: 'Futevôlei', groupIcon: 'futevolei', groupIconFallback: null, groupOrder: 2 },
  { id: 'VOLEI', label: 'Vôlei', icon: 'volei', iconFallback: '🏐', description: 'Quadra de vôlei indoor', group: 'VOLEI', groupLabel: 'Vôlei', groupIcon: 'volei', groupIconFallback: '🏐', groupOrder: 3 },
  { id: 'VOLEI_AREIA', label: 'Vôlei de Areia', icon: 'volei-areia', iconFallback: null, description: 'Quadra de vôlei de areia', group: 'VOLEI', groupLabel: 'Vôlei', groupIcon: 'volei', groupIconFallback: '🏐', groupOrder: 3 },
  { id: 'HANDBALL', label: 'Handebol', icon: 'handebol', iconFallback: '🤾', description: 'Quadra de handebol', group: 'HANDBALL', groupLabel: 'Handebol', groupIcon: 'handebol', groupIconFallback: '🤾', groupOrder: 4 },
  { id: 'PETECA', label: 'Peteca', icon: 'peteca', iconFallback: null, description: 'Quadra de peteca', group: 'PETECA', groupLabel: 'Peteca', groupIcon: 'peteca', groupIconFallback: null, groupOrder: 5 },
  { id: 'BEACH_TENNIS', label: 'Beach Tennis', icon: 'beach-tennis', iconFallback: '🎾', description: 'Quadra de beach tennis', group: 'BEACH_TENNIS', groupLabel: 'Beach Tennis', groupIcon: 'beach-tennis', groupIconFallback: '🎾', groupOrder: 6 },
  { id: 'BASQUETE', label: 'Basquete', icon: 'basquete', iconFallback: '🏀', description: 'Quadra de basquete', group: 'BASQUETE', groupLabel: 'Basquete', groupIcon: 'basquete', groupIconFallback: '🏀', groupOrder: 7 },
  { id: 'TENIS', label: 'Tênis', icon: 'tenis', iconFallback: '🥎', description: 'Quadra de tênis', group: 'TENIS', groupLabel: 'Tênis', groupIcon: 'tenis', groupIconFallback: '🥎', groupOrder: 8 },
  { id: 'POKER', label: 'Poker', icon: 'poker', iconFallback: '🃏', description: 'Mesa de poker', group: 'POKER', groupLabel: 'Poker', groupIcon: 'poker', groupIconFallback: '🃏', groupOrder: 9 },
]

function ehSport(valor: unknown): valor is Sport {
  if (!valor || typeof valor !== 'object') return false
  const sport = valor as Partial<Sport>
  return (
    typeof sport.id === 'string' &&
    typeof sport.label === 'string' &&
    typeof sport.icon === 'string' &&
    (typeof sport.iconFallback === 'string' || sport.iconFallback === null) &&
    typeof sport.description === 'string'
  )
}

export async function getSports(): Promise<Sport[]> {
  try {
    const resposta = await fetch(`${API_URL}/sports`, {
      next: { revalidate: REVALIDAR_SEGUNDOS },
    })
    if (!resposta.ok) return FALLBACK_SPORTS

    const corpo: unknown = await resposta.json()
    const dados = (corpo as { data?: unknown } | null)?.data
    return Array.isArray(dados) && dados.length > 0 && dados.every(ehSport)
      ? dados
      : FALLBACK_SPORTS
  } catch {
    return FALLBACK_SPORTS
  }
}
