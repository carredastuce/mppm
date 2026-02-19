import { useEffect, useRef } from 'react'
import { AppState } from '../types'
import { pushStateToCloud } from '../utils/sync'

export function useSyncToCloud(state: AppState, onStatusChange?: (pending: boolean) => void) {
  const timeoutRef = useRef<number | null>(null)
  // Contenu du dernier push réussi - évite de repousser l'écho du Realtime
  const lastPushedRef = useRef<string>('')

  const familyCode =
    state.parentSettings?.familyCode ?? state.linkedFamilyCode

  useEffect(() => {
    if (!familyCode) return

    const serialized = JSON.stringify(state)

    // Si le state est identique au dernier push, c'est l'écho du Realtime : on ignore
    if (serialized === lastPushedRef.current) {
      onStatusChange?.(false)
      return
    }

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    onStatusChange?.(true)

    timeoutRef.current = window.setTimeout(async () => {
      lastPushedRef.current = serialized
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
