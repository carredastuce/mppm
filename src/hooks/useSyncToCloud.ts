import { useEffect, useRef } from 'react'
import { AppState } from '../types'
import { pushStateToCloud } from '../utils/sync'

export function useSyncToCloud(state: AppState, onStatusChange?: (pending: boolean) => void) {
  const timeoutRef = useRef<number | null>(null)

  const familyCode =
    state.parentSettings?.familyCode ?? state.linkedFamilyCode

  useEffect(() => {
    if (!familyCode) return

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    onStatusChange?.(true)

    timeoutRef.current = window.setTimeout(async () => {
      await pushStateToCloud(familyCode, state)
      onStatusChange?.(false)
    }, 1000)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, familyCode])
}
