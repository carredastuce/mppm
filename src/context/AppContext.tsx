import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppState, AppAction, Transaction } from '../types'
import { appReducer, initialState } from './AppReducer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSyncToCloud } from '../hooks/useSyncToCloud'
import { loadFromLocalStorage } from '../utils/storage'
import { calculateDueAllowances } from '../utils/allowance'
import { pullStateFromCloud, subscribeToFamily } from '../utils/sync'

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  syncPending: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const allowanceProcessedRef = useRef(false)
  const [syncPending, setSyncPending] = useState(false)

  // Charger les données au démarrage
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    if (savedData) {
      dispatch({ type: 'LOAD_STATE', payload: savedData })

      // Traiter les versements d'argent de poche dus (une seule fois)
      if (!allowanceProcessedRef.current && savedData.parentSettings?.allowance?.isActive) {
        allowanceProcessedRef.current = true
        const dues = calculateDueAllowances(savedData.parentSettings.allowance)

        for (const due of dues) {
          const tx: Transaction = {
            id: uuidv4(),
            type: 'income',
            amount: due.amount,
            category: 'Argent de poche',
            label: 'Argent de poche (automatique)',
            date: due.date.toISOString(),
          }
          dispatch({ type: 'ADD_TRANSACTION', payload: tx })
        }

        if (dues.length > 0) {
          dispatch({
            type: 'UPDATE_PARENT_SETTINGS',
            payload: {
              allowance: {
                ...savedData.parentSettings.allowance,
                lastPaidDate: dues[dues.length - 1].date.toISOString(),
              },
            },
          })
        }
      }
    }
  }, [])

  // Effet 1 : Au mount, pull depuis Supabase + subscribe aux changements Realtime
  useEffect(() => {
    const savedData = loadFromLocalStorage()
    const familyCode =
      savedData?.parentSettings?.familyCode ?? savedData?.linkedFamilyCode
    if (!familyCode) return

    // Pull initial
    pullStateFromCloud(familyCode).then((remote) => {
      if (remote) dispatch({ type: 'SYNC_STATE', payload: remote })
    })

    // Subscribe Realtime
    const unsubscribe = subscribeToFamily(familyCode, (remote) => {
      dispatch({ type: 'SYNC_STATE', payload: remote })
    })

    return unsubscribe
  }, [])

  // Effet 2 : Pull au retour du focus / visibilitychange
  useEffect(() => {
    const handleFocus = () => {
      const familyCode =
        state.parentSettings?.familyCode ?? state.linkedFamilyCode
      if (!familyCode) return
      pullStateFromCloud(familyCode).then((remote) => {
        if (remote) dispatch({ type: 'SYNC_STATE', payload: remote })
      })
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleFocus()
    })

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [state.parentSettings?.familyCode, state.linkedFamilyCode])

  // Auto-sauvegarde locale
  useLocalStorage(state)

  // Effet 3 : Push vers Supabase (debounce 1000ms)
  useSyncToCloud(state, setSyncPending)

  return (
    <AppContext.Provider value={{ state, dispatch, syncPending }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
