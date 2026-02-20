import { format, isToday, isTomorrow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Allowance } from '../../types'
import { getNextDueDate } from '../../utils/allowance'
import { formatCurrency } from '../../utils/formatters'

interface AllowanceBannerProps {
  allowance: Allowance
}

export default function AllowanceBanner({ allowance }: AllowanceBannerProps) {
  if (!allowance.isActive) return null

  const nextDate = getNextDueDate(allowance)
  if (!nextDate) return null

  let dateLabel: string
  if (isToday(nextDate)) {
    dateLabel = "aujourd'hui"
  } else if (isTomorrow(nextDate)) {
    dateLabel = 'demain'
  } else {
    dateLabel = format(nextDate, 'EEEE d MMMM', { locale: fr })
  }

  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
      <span className="text-2xl">🏦</span>
      <div>
        <p className="text-sm font-semibold text-indigo-800">
          Prochain versement : {dateLabel}
        </p>
        <p className="text-xs text-indigo-600 mt-0.5">
          {formatCurrency(allowance.amount)} seront ajoutés à ton porte-monnaie
        </p>
      </div>
    </div>
  )
}
