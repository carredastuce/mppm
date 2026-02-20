import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Job, Transaction } from '../../types'

const STORAGE_KEY = 'mppm-last-child-visit'

interface Notifications {
  newJobs: number
  validatedAmount: number
}

function getNotifications(jobs: Job[], transactions: Transaction[], lastVisit: string): Notifications {
  const lastVisitDate = new Date(lastVisit)
  const newJobs = jobs.filter(
    (j) => j.status === 'available' && new Date(j.createdAt) > lastVisitDate
  ).length
  const validatedAmount = transactions
    .filter(
      (tx) =>
        tx.type === 'income' &&
        tx.label.startsWith('Petit boulot') &&
        new Date(tx.date) > lastVisitDate
    )
    .reduce((sum, tx) => sum + tx.amount, 0)
  return { newJobs, validatedAmount }
}

interface NotificationBannerProps {
  jobs: Job[]
  transactions: Transaction[]
}

export default function NotificationBanner({ jobs, transactions }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notifications | null>(null)

  useEffect(() => {
    const lastVisit = localStorage.getItem(STORAGE_KEY)
    if (lastVisit) {
      const notifs = getNotifications(jobs, transactions, lastVisit)
      if (notifs.newJobs > 0 || notifs.validatedAmount > 0) {
        setNotifications(notifs)
      }
    }
    // Mise à jour de la date de visite
    localStorage.setItem(STORAGE_KEY, new Date().toISOString())
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!notifications) return null

  return (
    <div className="space-y-2">
      {notifications.newJobs > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-blue-800">
            🆕 {notifications.newJobs} nouveau{notifications.newJobs > 1 ? 'x' : ''} boulot{notifications.newJobs > 1 ? 's' : ''} disponible{notifications.newJobs > 1 ? 's' : ''} !
          </p>
          <button
            onClick={() => setNotifications((n) => n && { ...n, newJobs: 0 })}
            className="text-blue-400 hover:text-blue-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {notifications.validatedAmount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-green-800">
            🎉 Boulot validé · +{notifications.validatedAmount.toFixed(2)}€ ajoutés à ton porte-monnaie !
          </p>
          <button
            onClick={() => setNotifications((n) => n && { ...n, validatedAmount: 0 })}
            className="text-green-400 hover:text-green-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
