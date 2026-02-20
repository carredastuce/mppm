import { format, isToday, isThisWeek, isThisMonth } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return format(date, 'dd/MM/yyyy', { locale: fr })
}

export function formatDateRelative(dateString: string): string {
  const date = new Date(dateString)

  if (isToday(date)) {
    return "Aujourd'hui"
  }

  if (isThisWeek(date)) {
    return format(date, 'EEEE', { locale: fr })
  }

  if (isThisMonth(date)) {
    return format(date, 'dd MMMM', { locale: fr })
  }

  return format(date, 'dd/MM/yyyy', { locale: fr })
}

export function getTransactionPeriod(dateString: string): string {
  const date = new Date(dateString)

  if (isToday(date)) {
    return "Aujourd'hui"
  }

  if (isThisWeek(date)) {
    return 'Cette semaine'
  }

  if (isThisMonth(date)) {
    return 'Ce mois-ci'
  }

  return 'Plus ancien'
}

export function toDay(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10)
}

export function isoWeek(dateStr: string): string {
  const d = new Date(dateStr)
  const jan4 = new Date(d.getFullYear(), 0, 4)
  const startOfWeek1 = new Date(jan4)
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7))
  const diff = d.getTime() - startOfWeek1.getTime()
  const week = Math.floor(diff / (7 * 24 * 3600 * 1000)) + 1
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}
