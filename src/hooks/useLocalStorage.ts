import { useEffect, useRef } from 'react'
import { AppState } from '../types'
import { saveToLocalStorage } from '../utils/storage'
import { hashState } from '../utils/sync'

export function useLocalStorage(state: AppState) {
  const timeoutRef = useRef<number | null>(null)
  const lastSavedHashRef = useRef<string>('')

  useEffect(() => {
    const currentHash = hashState(state)
    if (currentHash === lastSavedHashRef.current) return

    // Debounce de 500ms
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      saveToLocalStorage(state)
      lastSavedHashRef.current = currentHash
    }, 500)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [state])
}
