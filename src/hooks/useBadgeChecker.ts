import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { AppState, AppAction, UnlockedBadge } from '../types'
import { BADGE_DEFINITIONS, BadgeDefinition, computeNewBadges } from '../utils/badges'

const VISIT_DAYS_KEY = 'mppm-visit-days'

function getTodayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadVisitDays(): string[] {
  try {
    const raw = localStorage.getItem(VISIT_DAYS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

function recordTodayVisit(): string[] {
  const days = loadVisitDays()
  const today = getTodayISO()
  if (!days.includes(today)) {
    const updated = [...days, today]
    localStorage.setItem(VISIT_DAYS_KEY, JSON.stringify(updated))
    return updated
  }
  return days
}

interface UseBadgeCheckerResult {
  badgeQueue: BadgeDefinition[]
  dismissFirst: () => void
}

export function useBadgeChecker(
  state: AppState,
  dispatch: React.Dispatch<AppAction>
): UseBadgeCheckerResult {
  const [badgeQueue, setBadgeQueue] = useState<BadgeDefinition[]>([])
  // Guard against re-checking the same state
  const lastCheckedRef = useRef<string>('')

  const unlockedIds = useMemo(
    () => new Set((state.unlockedBadges ?? []).map((b) => b.id)),
    [state.unlockedBadges]
  )

  const completedJobsCount = useMemo(
    () => state.jobs.filter((j) => j.completedAt).length,
    [state.jobs]
  )

  const fingerprint = useMemo(
    () =>
      JSON.stringify({
        unlocked: Array.from(unlockedIds).sort(),
        tx: state.transactions.length,
        jobs: completedJobsCount,
        goals: state.goals.length,
      }),
    [unlockedIds, state.transactions.length, completedJobsCount, state.goals.length]
  )

  useEffect(() => {
    if (fingerprint === lastCheckedRef.current) return
    lastCheckedRef.current = fingerprint

    const visitDays = recordTodayVisit()
    const newIds = computeNewBadges(state, unlockedIds, visitDays)

    if (newIds.length === 0) return

    const now = new Date().toISOString()
    const newBadges: UnlockedBadge[] = newIds.map((id) => ({ id, unlockedAt: now }))

    for (const badge of newBadges) {
      dispatch({ type: 'UNLOCK_BADGE', payload: badge })
    }

    const definitions = newIds
      .map((id) => BADGE_DEFINITIONS.find((b) => b.id === id))
      .filter((b): b is BadgeDefinition => b !== undefined)

    setBadgeQueue((prev) => [...prev, ...definitions])
  }, [fingerprint, state, unlockedIds, dispatch])

  const dismissFirst = useCallback(() => {
    setBadgeQueue((prev) => prev.slice(1))
  }, [])

  return useMemo(() => ({ badgeQueue, dismissFirst }), [badgeQueue, dismissFirst])
}
