import { useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { BADGE_DEFINITIONS } from '../../utils/badges'

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BadgeGallery() {
  const { state } = useApp()
  const unlockedBadges = state.unlockedBadges ?? []

  const { unlocked, locked } = useMemo(() => {
    const unlockedIds = new Set(unlockedBadges.map(b => b.id))
    return {
      unlocked: BADGE_DEFINITIONS.filter(b => unlockedIds.has(b.id)),
      locked: BADGE_DEFINITIONS.filter(b => !unlockedIds.has(b.id)),
    }
  }, [unlockedBadges])
  const total = BADGE_DEFINITIONS.length

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
        <p className="text-3xl font-bold text-gray-800">
          {unlocked.length}{' '}
          <span className="text-gray-400 font-normal text-xl">/ {total}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">badges débloqués</p>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
            style={{ width: `${(unlocked.length / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Débloqués
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map((badge) => {
              const ub = unlockedBadges.find((b) => b.id === badge.id)
              return (
                <div
                  key={badge.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-yellow-200 flex flex-col items-center text-center gap-2"
                >
                  <span className="text-4xl" role="img" aria-label={badge.name}>
                    {badge.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{badge.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                  </div>
                  {ub && (
                    <p className="text-xs text-yellow-600 font-medium">
                      {formatDate(ub.unlockedAt)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            À débloquer
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {locked.map((badge) => {
              const isSecret = badge.hidden
              return (
                <div
                  key={badge.id}
                  className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col items-center text-center gap-2 opacity-60"
                >
                  <span className="text-4xl grayscale" role="img" aria-label={isSecret ? 'Badge mystère' : badge.name}>
                    {isSecret ? '🔒' : badge.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      {isSecret ? 'Badge mystère' : badge.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isSecret ? '???' : badge.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
