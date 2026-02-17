import { isThisWeek, isThisMonth } from 'date-fns'
import { Transaction } from '../types'

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, tx) => {
    return tx.type === 'income' ? acc + tx.amount : acc - tx.amount
  }, 0)
}

export function calculateGoalProgress(currentAmount: number, targetAmount: number): number {
  if (targetAmount === 0) return 0
  return Math.min((currentAmount / targetAmount) * 100, 100)
}

export function isGoalCompleted(currentAmount: number, targetAmount: number): boolean {
  return currentAmount >= targetAmount
}

export function calculateSpendingThisWeek(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'expense' && isThisWeek(new Date(tx.date)))
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function calculateSpendingThisMonth(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'expense' && isThisMonth(new Date(tx.date)))
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function calculateIncomeThisWeek(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'income' && isThisWeek(new Date(tx.date)))
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function calculateIncomeThisMonth(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'income' && isThisMonth(new Date(tx.date)))
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function calculateCategoryBreakdown(
  transactions: Transaction[],
  type: 'income' | 'expense'
): { category: string; amount: number }[] {
  const map = new Map<string, number>()

  transactions
    .filter(tx => tx.type === type && isThisMonth(new Date(tx.date)))
    .forEach(tx => {
      map.set(tx.category, (map.get(tx.category) || 0) + tx.amount)
    })

  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}
