import { createContext, useContext, useReducer, useEffect, useRef, useState, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AppState, AppAction, Transaction } from '../types'
import { appReducer, initialState } from './AppReducer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSyncToCloud } from '../hooks/useSyncToCloud'
import { loadFromLocalStorage } from '../utils/storage'
import { calculateDueAllowances } from '../utils/allowance'
import { pullStateFromCloud, subscribeToFamily, hashState } from '../utils/sync'

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  syncPending: boolean
  canUndo: boolean
  undo: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const allowanceProcessedRef = useRef(false)
  const [syncPending, setSyncPending] = useState(false)
  const undoSnapshotRef = useRef<AppState | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [canUndo, setCanUndo] = useState(false)

  const DESTRUCTIVE_ACTIONS = new Set([
    'DELETE_TRANSACTION', 'DELETE_GOAL', 'DELETE_JOB', 'COMPLETE_JOB',
  ])

  const dispatchWithHistory: React.Dispatch<AppAction> = (action) => {
    if (DESTRUCTIVE_ACTIONS.has(action.type)) {
      undoSnapshotRef.current = state
      setCanUndo(true)
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
      undoTimerRef.current = setTimeout(() => {
        undoSnapshotRef.current = null
        setCanUndo(false)
      }, 5000)
    }
    dispatch(action)
  }

  const undo = () => {
    if (!undoSnapshotRef.current) return
    dispatch({ type: 'LOAD_STATE', payload: undoSnapshotRef.current })
    undoSnapshotRef.current = null
    setCanUndo(false)
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
  }

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

  // Amél 2 fix : familyCode en tant que valeur dérivée pour les dépendances
  const familyCode = state.parentSettings?.familyCode ?? state.linkedFamilyCode

  // Bug 1 fix : ref pour stocker le hash du dernier état reçu via Realtime/pull
  const lastReceivedHashRef = useRef<string>('')

  // Dispatch SYNC_STATE avec guard anti-boucle
  const safeSyncDispatch = (remote: AppState) => {
    const remoteHash = hashState(remote)
    if (remoteHash === lastReceivedHashRef.current) return
    if (remoteHash === hashState(state)) return
    lastReceivedHashRef.current = remoteHash
    dispatch({ type: 'SYNC_STATE', payload: remote })
  }

  // Effet 1 : Pull depuis Supabase + subscribe Realtime
  // Amél 2 fix : dépend de familyCode pour se reconnecter si le code change
  useEffect(() => {
    if (!familyCode) return

    // Pull initial
    pullStateFromCloud(familyCode).then((remote) => {
      if (remote) safeSyncDispatch(remote)
    })

    // Subscribe Realtime
    const unsubscribe = subscribeToFamily(familyCode, (remote) => {
      safeSyncDispatch(remote)
    })

    return unsubscribe
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyCode])

  // Effet 2 : Pull au retour du focus / visibilitychange
  // Bug 2 fix : nettoyage correct des deux listeners
  useEffect(() => {
    const handleFocus = () => {
      if (!familyCode) return
      pullStateFromCloud(familyCode).then((remote) => {
        if (remote) safeSyncDispatch(remote)
      })
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') handleFocus()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyCode])

  // Auto-sauvegarde locale
  useLocalStorage(state)

  // Effet 3 : Push vers Supabase (debounce 1000ms)
  useSyncToCloud(state, setSyncPending)

  return (
    <AppContext.Provider value={{ state, dispatch: dispatchWithHistory, syncPending, canUndo, undo }}>
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
