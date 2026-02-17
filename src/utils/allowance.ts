import { addWeeks, addMonths, isBefore, startOfDay } from 'date-fns'
import { Allowance } from '../types'

export interface DueAllowance {
  date: Date
  amount: number
}

const MAX_CATCHUP_PAYMENTS = 12

export function calculateDueAllowances(allowance: Allowance): DueAllowance[] {
  if (!allowance.isActive) return []

  const now = startOfDay(new Date())
  const start = new Date(allowance.createdAt)
  const lastPaid = allowance.lastPaidDate ? new Date(allowance.lastPaidDate) : start
  const dues: DueAllowance[] = []
  let n = 1

  // Calculer depuis createdAt pour éviter le drift des dates
  while (n <= 52) {
    const next = allowance.frequency === 'weekly'
      ? addWeeks(start, n)
      : addMonths(start, n)

    if (isBefore(next, now) || startOfDay(next).getTime() === now.getTime()) {
      if (isBefore(lastPaid, next)) {
        dues.push({ date: next, amount: allowance.amount })
      }
      n++
    } else {
      break
    }
  }

  return dues.slice(0, MAX_CATCHUP_PAYMENTS)
}

export function getNextDueDate(allowance: Allowance): Date | null {
  if (!allowance.isActive) return null

  const now = startOfDay(new Date())
  const start = new Date(allowance.createdAt)
  let n = 1

  while (n <= 52) {
    const next = allowance.frequency === 'weekly'
      ? addWeeks(start, n)
      : addMonths(start, n)

    if (isBefore(now, next)) {
      return next
    }
    n++
  }

  return null
}
