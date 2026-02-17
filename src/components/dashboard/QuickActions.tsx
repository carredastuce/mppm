import { useState } from 'react'
import { PlusCircle, MinusCircle } from 'lucide-react'
import { Transaction } from '../../types'
import TransactionForm from '../transactions/TransactionForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

interface QuickActionsProps {
  onAddTransaction: (transaction: Transaction) => void
}

export default function QuickActions({ onAddTransaction }: QuickActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income')

  const handleOpenModal = (type: 'income' | 'expense') => {
    setTransactionType(type)
    setIsModalOpen(true)
  }

  const handleSubmit = (transaction: Transaction) => {
    onAddTransaction(transaction)
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="success"
          size="lg"
          onClick={() => handleOpenModal('income')}
          className="flex items-center justify-center gap-3 py-8"
        >
          <PlusCircle size={32} />
          <div className="text-left">
            <p className="text-xl font-bold">Ajouter un Revenu</p>
            <p className="text-sm opacity-90">Argent de poche, cadeau...</p>
          </div>
        </Button>

        <Button
          variant="danger"
          size="lg"
          onClick={() => handleOpenModal('expense')}
          className="flex items-center justify-center gap-3 py-8"
        >
          <MinusCircle size={32} />
          <div className="text-left">
            <p className="text-xl font-bold">Ajouter une Dépense</p>
            <p className="text-sm opacity-90">Snacks, jeux, loisirs...</p>
          </div>
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={transactionType === 'income' ? 'Ajouter un Revenu' : 'Ajouter une Dépense'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          defaultType={transactionType}
        />
      </Modal>
    </>
  )
}
