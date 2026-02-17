import { useState, useMemo } from 'react'
import { Plus, Search, Trash2, Clock } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Transaction, TransactionType } from '../../types'
import { searchTransactions } from '../../utils/search'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories'
import TransactionForm from '../transactions/TransactionForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

const PAGE_SIZE = 20

export default function ParentHistory() {
  const { state, dispatch } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  const filteredTransactions = useMemo(() => {
    let results = state.transactions

    if (searchQuery.trim()) {
      results = searchTransactions(results, searchQuery)
    }

    if (typeFilter !== 'all') {
      results = results.filter(tx => tx.type === typeFilter)
    }

    if (categoryFilter) {
      results = results.filter(tx => tx.category === categoryFilter)
    }

    return results
  }, [state.transactions, searchQuery, typeFilter, categoryFilter])

  const visibleTransactions = filteredTransactions.slice(0, visibleCount)
  const hasMore = visibleCount < filteredTransactions.length

  const handleDelete = (txId: string) => {
    if (window.confirm('Supprimer cette transaction ?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: txId })
    }
  }

  const handleAddTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock size={24} className="text-indigo-600" />
          Historique des transactions
        </h2>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} />
          Ajouter
        </Button>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les transactions..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE) }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setTypeFilter('all'); setVisibleCount(PAGE_SIZE) }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              typeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => { setTypeFilter('income'); setVisibleCount(PAGE_SIZE) }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              typeFilter === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Revenus
          </button>
          <button
            onClick={() => { setTypeFilter('expense'); setVisibleCount(PAGE_SIZE) }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              typeFilter === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Dépenses
          </button>

          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setVisibleCount(PAGE_SIZE) }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="">Toutes les catégories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-500">
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des transactions */}
      {visibleTransactions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-gray-700">Aucune transaction trouvée</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {visibleTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{tx.label}</p>
                <p className="text-xs text-gray-500">{tx.category} · {formatDate(tx.date)}</p>
                {tx.notes && <p className="text-xs text-gray-400 truncate mt-0.5">{tx.notes}</p>}
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className={`font-bold text-sm whitespace-nowrap ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voir plus */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
          >
            Voir plus ({filteredTransactions.length - visibleCount} restantes)
          </Button>
        </div>
      )}

      {/* Modal ajout transaction */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter une transaction"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
