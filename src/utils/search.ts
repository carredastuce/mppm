import { Transaction } from '../types'

export function searchTransactions(transactions: Transaction[], query: string): Transaction[] {
  if (!query.trim()) return transactions

  const lowerQuery = query.toLowerCase().trim()

  return transactions.filter((tx) =>
    tx.label.toLowerCase().includes(lowerQuery) ||
    tx.category.toLowerCase().includes(lowerQuery) ||
    (tx.notes && tx.notes.toLowerCase().includes(lowerQuery))
  )
}
