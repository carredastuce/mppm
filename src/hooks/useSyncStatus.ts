import { useState, useEffect } from 'react'

export type SyncStatus = 'synced' | 'pending' | 'offline' | 'not_linked'

export function useSyncStatus(isLinked: boolean, isPending: boolean): SyncStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isLinked) return 'not_linked'
  if (!isOnline) return 'offline'
  if (isPending) return 'pending'
  return 'synced'
}
