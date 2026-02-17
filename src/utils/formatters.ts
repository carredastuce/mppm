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
