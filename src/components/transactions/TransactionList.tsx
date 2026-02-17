import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Transaction, TransactionType } from '../../types'
import { getTransactionPeriod } from '../../utils/formatters'
import TransactionItem from './TransactionItem'
import TransactionForm from './TransactionForm'
import TransactionFilters from './TransactionFilters'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function TransactionList() {
  const { state, dispatch } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all')
  const [categoryFilter, setCategoryFilter] = useState('')

  // Filtrer les transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false
      if (categoryFilter && tx.category !== categoryFilter) return false
      return true
    })
  }, [state.transactions, typeFilter, categoryFilter])

  // Grouper par période
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {}

    filteredTransactions.forEach((tx) => {
      const period = getTransactionPeriod(tx.date)
      if (!groups[period]) {
        groups[period] = []
      }
      groups[period].push(tx)
    })

    // Trier les transactions dans chaque groupe par date (plus récent en premier)
    Object.keys(groups).forEach((period) => {
      groups[period].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    })

    return groups
  }, [filteredTransactions])

  const periods = ["Aujourd'hui", 'Cette semaine', 'Ce mois-ci', 'Plus ancien']
  const orderedGroups = periods.filter((period) => groupedTransactions[period])

  const handleSubmit = (transaction: Transaction) => {
    if (editingTransaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction })
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
    }
    handleCloseModal()
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(undefined)
  }

  const handleAddNew = () => {
    setEditingTransaction(undefined)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">💸 Mes Transactions</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={20} />
          Nouvelle transaction
        </Button>
      </div>

      {/* Filtres */}
      <TransactionFilters
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        onTypeFilterChange={setTypeFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {/* Liste des transactions */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Aucune transaction
          </p>
          <p className="text-gray-500">
            {typeFilter !== 'all' || categoryFilter
              ? 'Aucune transaction ne correspond aux filtres sélectionnés.'
              : 'Commence par ajouter ta première transaction !'}
          </p>
          {typeFilter === 'all' && !categoryFilter && (
            <Button onClick={handleAddNew} className="mt-6">
              Ajouter une transaction
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {orderedGroups.map((period) => (
            <div key={period}>
              <h3 className="text-lg font-bold text-gray-700 mb-3 px-1">
                {period}
              </h3>
              <div className="space-y-2">
                {groupedTransactions[period].map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onEdit={() => handleEdit(transaction)}
                    onDelete={() => handleDelete(transaction.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={editingTransaction}
        />
      </Modal>
    </div>
  )
}
