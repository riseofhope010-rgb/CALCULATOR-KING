const HISTORY_KEY = 'calculator_king_history'
const FAVORITES_KEY = 'calculator_king_favorites'
const THEME_KEY = 'calculator_king_theme'

export interface HistoryItem {
  id: string
  calculatorId: string
  calculatorName: string
  inputs: Record<string, unknown>
  results: Record<string, unknown>
  timestamp: number
}

export interface FavoriteItem {
  calculatorId: string
  calculatorName: string
  path: string
  addedAt: number
}

export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): void => {
  if (typeof window === 'undefined') return
  const history = getHistory()
  const newItem: HistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  }
  const updated = [newItem, ...history].slice(0, 10)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export const clearHistory = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HISTORY_KEY)
}

export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch {
    return []
  }
}

export const addToFavorites = (item: Omit<FavoriteItem, 'addedAt'>): void => {
  if (typeof window === 'undefined') return
  const favorites = getFavorites()
  if (!favorites.find(f => f.calculatorId === item.calculatorId)) {
    const updated = [...favorites, { ...item, addedAt: Date.now() }]
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  }
}

export const removeFromFavorites = (calculatorId: string): void => {
  if (typeof window === 'undefined') return
  const favorites = getFavorites()
  const updated = favorites.filter(f => f.calculatorId !== calculatorId)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
}

export const isFavorite = (calculatorId: string): boolean => {
  const favorites = getFavorites()
  return favorites.some(f => f.calculatorId === calculatorId)
}

export const getTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  try {
    const theme = localStorage.getItem(THEME_KEY)
    return theme === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export const setTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_KEY, theme)
}
