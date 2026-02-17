import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Goal, Transaction } from '../../types'
import { calculateBalance } from '../../utils/calculations'
import GoalCard from './GoalCard'
import GoalForm from './GoalForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

export default function GoalsList() {
  const { state, dispatch } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()

  const balance = calculateBalance(state.transactions)

  const handleSubmit = (goal: Goal) => {
    if (editingGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: goal })
    } else {
      dispatch({ type: 'ADD_GOAL', payload: goal })
    }
    handleCloseModal()
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setIsModalOpen(true)
  }

  const handleDelete = (goalId: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: goalId })
  }

  const handleAddMoney = (goalId: string, amount: number, transaction: Transaction) => {
    dispatch({
      type: 'ADD_TO_GOAL',
      payload: { goalId, amount, transaction },
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGoal(undefined)
  }

  const handleAddNew = () => {
    setEditingGoal(undefined)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">🎯 Mes Objectifs</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={20} />
          Créer un objectif
        </Button>
      </div>

      {/* Liste des objectifs */}
      {state.goals.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">🎯</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            Aucun objectif d'épargne
          </p>
          <p className="text-gray-500 mb-6">
            Crée ton premier objectif d'épargne pour commencer à économiser !
          </p>
          <Button onClick={handleAddNew}>
            Créer mon premier objectif
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              balance={balance}
              onAddMoney={handleAddMoney}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {/* Carte "Ajouter un objectif" */}
          <button
            onClick={handleAddNew}
            className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-200 hover:border-primary transition-all flex flex-col items-center justify-center min-h-[300px] group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
              ➕
            </div>
            <p className="text-lg font-semibold text-gray-600 group-hover:text-primary">
              Créer un nouvel objectif
            </p>
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? 'Modifier l\'objectif' : 'Créer un objectif'}
      >
        <GoalForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={editingGoal}
        />
      </Modal>
    </div>
  )
}
