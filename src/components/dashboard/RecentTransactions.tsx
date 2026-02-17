import { ArrowRight } from 'lucide-react'
import { Transaction } from '../../types'
import { formatCurrency, formatDateRelative } from '../../utils/formatters'
import { CATEGORY_ICONS } from '../../constants/categories'
import Button from '../shared/Button'

interface RecentTransactionsProps {
  transactions: Transaction[]
  onViewAll: () => void
}

export default function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const recentTransactions = transactions.slice(0, 5)

  if (recentTransactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-4xl mb-3">📝</p>
        <p className="text-lg font-semibold text-gray-700 mb-1">
          Aucune transaction
        </p>
        <p className="text-gray-500 text-sm">
          Ajoute ta première transaction pour commencer !
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Dernières transactions</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewAll}
          className="flex items-center gap-2"
        >
          Voir tout
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => {
          const icon = CATEGORY_ICONS[transaction.category] || '💵'
          const isIncome = transaction.type === 'income'

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{transaction.label}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateRelative(transaction.date)}
                  </p>
                </div>
              </div>
              <p
                className={`font-bold ${
                  isIncome ? 'text-success' : 'text-danger'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
