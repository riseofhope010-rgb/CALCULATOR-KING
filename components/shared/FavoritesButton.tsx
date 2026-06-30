'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { addToFavorites, removeFromFavorites, isFavorite as checkFavorite, getFavorites } from '@/lib/utils/storage'

interface FavoritesButtonProps {
  calculatorId: string
  calculatorName: string
  path: string
}

export default function FavoritesButton({
  calculatorId,
  calculatorName,
  path,
}: FavoritesButtonProps) {
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    setIsFav(checkFavorite(calculatorId))
  }, [calculatorId])

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(calculatorId)
      setIsFav(false)
    } else {
      addToFavorites({ calculatorId, calculatorName, path })
      setIsFav(true)
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isFav
          ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border-2 border-red-300 dark:border-red-700'
          : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      {isFav ? 'Favorited' : 'Add to Favorites'}
    </button>
  )
}

// Favorites List component for displaying all favorites
export function FavoritesList() {
  const [favorites, setFavorites] = useState(getFavorites().filter(f => typeof window === 'undefined' || true))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFavorites(getFavorites())
  }, [])

  if (!mounted || favorites.length === 0) return null

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Your Favorites</h3>
      <div className="grid gap-2">
        {favorites.map((fav) => (
          <a
            key={fav.calculatorId}
            href={fav.path}
            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-dark-surface rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{fav.calculatorName}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
