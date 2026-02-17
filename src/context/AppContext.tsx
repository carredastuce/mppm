import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppState, AppAction, Transaction } from '../types'
import { appReducer, initialState } from './AppReducer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { loadFromLocalStorage } from '../utils/storage'
import { calculateDueAllowances } from '../utils/allowance'

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const allowanceProcessedRef = useRef(false)

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

  // Auto-sauvegarde
  useLocalStorage(state)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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
