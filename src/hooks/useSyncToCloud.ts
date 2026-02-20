import { useEffect, useRef } from 'react'
import { AppState } from '../types'
import { pushStateToCloud, hashState } from '../utils/sync'

export function useSyncToCloud(state: AppState, onStatusChange?: (pending: boolean) => void) {
  const timeoutRef = useRef<number | null>(null)
  const lastPushedHashRef = useRef<string>('')

  const familyCode =
    state.parentSettings?.familyCode ?? state.linkedFamilyCode

  useEffect(() => {
    if (!familyCode) return

    const currentHash = hashState(state)

    // Bug 1 fix : ne pas re-push si l'état n'a pas changé (évite la boucle push→realtime→merge→push)
    if (currentHash === lastPushedHashRef.current) {
      onStatusChange?.(false)
      return
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    onStatusChange?.(true)

    timeoutRef.current = window.setTimeout(async () => {
      const success = await pushStateToCloud(familyCode, state)
      if (success) {
        lastPushedHashRef.current = currentHash
      }
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
