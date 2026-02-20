import { useEffect, useState } from 'react'
import { BadgeDefinition } from '../../utils/badges'

interface BadgeUnlockedToastProps {
  badge: BadgeDefinition | undefined
  onDismiss: () => void
}

const DURATION = 4000

export default function BadgeUnlockedToast({ badge, onDismiss }: BadgeUnlockedToastProps) {
  const [progress, setProgress] = useState(100)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!badge) {
      setVisible(false)
      return
    }

    setProgress(100)
    setVisible(true)

    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100)
      setProgress(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        setVisible(false)
        setTimeout(onDismiss, 300)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [badge, onDismiss])

  if (!badge) return null

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{ minWidth: '280px', maxWidth: '90vw' }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-yellow-200 overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={badge.name}>
            {badge.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-wide">
              🏆 Nouveau badge débloqué !
            </p>
            <p className="text-sm font-bold text-gray-800 truncate">{badge.name}</p>
            <p className="text-xs text-gray-500 truncate">{badge.description}</p>
          </div>
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 300) }}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-1"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
        <div className="h-1 bg-yellow-100">
          <div
            className="h-full bg-yellow-400 transition-all"
            style={{ width: `${progress}%`, transitionDuration: '50ms' }}
          />
        </div>
      </div>
    </div>
  )
}
