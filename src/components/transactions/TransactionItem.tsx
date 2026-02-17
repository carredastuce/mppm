import { Trash2 } from 'lucide-react'
import { Transaction } from '../../types'
import { formatCurrency, formatDateRelative } from '../../utils/formatters'
import { CATEGORY_ICONS } from '../../constants/categories'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: () => void
  onDelete: () => void
}

export default function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const icon = CATEGORY_ICONS[transaction.category] || '💵'
  const isIncome = transaction.type === 'income'

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      onDelete()
    }
  }

  return (
    <div
      onClick={onEdit}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{icon}</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{transaction.label}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{formatDateRelative(transaction.date)}</span>
            </div>
            {transaction.notes && (
              <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p
            className={`text-lg font-bold ${
              isIncome ? 'text-success' : 'text-danger'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-danger transition-colors p-2 hover:bg-red-50 rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
