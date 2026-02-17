import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Plus, Trash2, Edit } from 'lucide-react'
import { Goal, Transaction } from '../../types'
import { isGoalCompleted } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { validateAddToGoal } from '../../utils/validators'
import GoalProgress from './GoalProgress'
import Modal from '../shared/Modal'
import Input from '../shared/Input'
import Button from '../shared/Button'

interface GoalCardProps {
  goal: Goal
  balance: number
  onAddMoney: (goalId: string, amount: number, transaction: Transaction) => void
  onEdit: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

export default function GoalCard({ goal, balance, onAddMoney, onEdit, onDelete }: GoalCardProps) {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const isCompleted = isGoalCompleted(goal.currentAmount, goal.targetAmount)

  const handleAddMoney = () => {
    const amountNumber = parseFloat(amount)
    const validationError = validateAddToGoal(amountNumber, balance)

    if (validationError) {
      setError(validationError)
      return
    }

    // Vérifier que le montant n'excède pas le montant restant pour atteindre l'objectif
    const remainingAmount = goal.targetAmount - goal.currentAmount
    if (amountNumber > remainingAmount) {
      setError(`Tu ne peux ajouter que ${formatCurrency(remainingAmount)} maximum pour atteindre ton objectif`)
      return
    }

    // Créer la transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'expense',
      amount: amountNumber,
      category: "Objectif d'épargne",
      label: `Objectif d'épargne - ${goal.name}`,
      date: new Date().toISOString(),
    }

    onAddMoney(goal.id, amountNumber, transaction)

    // Vérifier si l'objectif sera atteint après cet ajout
    const newAmount = goal.currentAmount + amountNumber
    if (newAmount >= goal.targetAmount && !isCompleted) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }

    setIsAddMoneyModalOpen(false)
    setAmount('')
    setError(null)
  }

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'objectif "${goal.name}" ?`)) {
      onDelete(goal.id)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100 relative overflow-hidden">
        {/* Icône de célébration */}
        {isCompleted && (
          <div className="absolute top-2 right-2 text-4xl animate-bounce">
            🎉
          </div>
        )}

        {/* Icône */}
        <div className="text-6xl text-center mb-4">
          {goal.imageUrl || '🎯'}
        </div>

        {/* Nom */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {goal.name}
        </h3>

        {/* Progression */}
        <div className="mb-6">
          <GoalProgress
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
          />
        </div>

        {/* Message si complété */}
        {isCompleted && (
          <div className="bg-success bg-opacity-10 border border-success text-success px-4 py-2 rounded-lg text-center font-semibold mb-4">
            Objectif atteint ! 🎉
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {!isCompleted && (
            <Button
              variant="success"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsAddMoneyModalOpen(true)}
            >
              <Plus size={18} />
              Ajouter de l'argent
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => onEdit(goal)}
            >
              <Edit size={16} />
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Ajouter de l'argent */}
      <Modal
        isOpen={isAddMoneyModalOpen}
        onClose={() => {
          setIsAddMoneyModalOpen(false)
          setAmount('')
          setError(null)
        }}
        title={`Ajouter de l'argent à : ${goal.name}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Ton solde</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Montant restant</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(goal.targetAmount - goal.currentAmount)}
              </p>
            </div>
          </div>

          <Input
            type="number"
            label="Montant à ajouter (€)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            max={Math.min(balance, goal.targetAmount - goal.currentAmount)}
            error={error}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="success"
              className="flex-1"
              onClick={handleAddMoney}
            >
              Confirmer
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsAddMoneyModalOpen(false)
                setAmount('')
                setError(null)
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>

      {/* Animation de célébration */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-9xl animate-bounce">
            🎉
          </div>
        </div>
      )}
    </>
  )
}
