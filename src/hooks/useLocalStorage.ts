import { useEffect, useRef } from 'react'
import { AppState } from '../types'
import { saveToLocalStorage } from '../utils/storage'

export function useLocalStorage(state: AppState) {
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // Debounce de 500ms
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      saveToLocalStorage(state)
    }, 500)

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [state])
}
