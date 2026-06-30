'use client'

import { useState, useEffect } from 'react'
import { History, X, RotateCcw, Trash2 } from 'lucide-react'
import { getHistory, clearHistory, HistoryItem } from '@/lib/utils/storage'
import { format } from 'date-fns'

interface HistoryPanelProps {
  calculatorId: string
  onRerun?: (item: HistoryItem) => void
}

export default function HistoryPanel({ calculatorId, onRerun }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (isOpen) {
      const allHistory = getHistory()
      setHistory(allHistory.filter((h) => h.calculatorId === calculatorId))
    }
  }, [isOpen, calculatorId])

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <>
      {/* History Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <History className="w-4 h-4" />
        History
        {history.length > 0 && (
          <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        )}
      </button>

      {/* Slide-over Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-bg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Calculation History
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No calculation history yet.</p>
                  <p className="text-sm mt-2">Your calculations will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(item.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                        {onRerun && (
                          <button
                            onClick={() => {
                              onRerun(item)
                              setIsOpen(false)
                            }}
                            className="text-primary hover:text-primary-700 text-sm flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Re-run
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {Object.entries(item.results)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1">
                              <span className="text-gray-500">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-bg">
                <button
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
