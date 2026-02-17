import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Transaction, Goal } from '../../types'
import { calculateBalance } from '../../utils/calculations'
import BalanceCard from './BalanceCard'
import QuickActions from './QuickActions'
import RecentTransactions from './RecentTransactions'
import GoalCard from '../goals/GoalCard'
import GoalForm from '../goals/GoalForm'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

interface DashboardProps {
  onNavigate: (tab: 'transactions' | 'goals' | 'jobs') => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { state, dispatch } = useApp()
  const balance = calculateBalance(state.transactions)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>()

  const handleAddTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
  }

  const handleGoalSubmit = (goal: Goal) => {
    if (editingGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: goal })
    } else {
      dispatch({ type: 'ADD_GOAL', payload: goal })
    }
    handleCloseGoalModal()
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setIsGoalModalOpen(true)
  }

  const handleDeleteGoal = (goalId: string) => {
    dispatch({ type: 'DELETE_GOAL', payload: goalId })
  }

  const handleAddMoneyToGoal = (goalId: string, amount: number, transaction: Transaction) => {
    dispatch({
      type: 'ADD_TO_GOAL',
      payload: { goalId, amount, transaction },
    })
  }

  const handleCloseGoalModal = () => {
    setIsGoalModalOpen(false)
    setEditingGoal(undefined)
  }

  const handleAddNewGoal = () => {
    setEditingGoal(undefined)
    setIsGoalModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Message de bienvenue */}
      <div className="text-center py-4">
        <h2 className="text-3xl font-display text-gray-900 mb-2">
          Bienvenue dans ton porte-monnaie ! 👋
        </h2>
        <p className="text-gray-600">
          Gère ton argent de poche comme un pro !
        </p>
      </div>

      {/* Alerte solde bas */}
      {state.parentSettings?.spendingWarningThreshold != null &&
        balance < state.parentSettings.spendingWarningThreshold && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="text-amber-800 font-medium text-sm">
            Attention, ton solde est un peu bas ! Essaie de faire attention à tes dépenses.
          </p>
        </div>
      )}

      {/* Carte de solde */}
      <BalanceCard balance={balance} />

      {/* Actions rapides */}
      <QuickActions onAddTransaction={handleAddTransaction} />

      {/* Section Objectifs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">🎯 Mes Objectifs</h3>
          <Button
            size="sm"
            onClick={handleAddNewGoal}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Créer un objectif
          </Button>
        </div>

        {state.goals.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <p className="text-5xl mb-3">🎯</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Aucun objectif d'épargne
            </p>
            <p className="text-gray-500 mb-4">
              Crée ton premier objectif pour commencer à économiser !
            </p>
            <Button onClick={handleAddNewGoal}>
              Créer mon premier objectif
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.goals.slice(0, 3).map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                balance={balance}
                onAddMoney={handleAddMoneyToGoal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}

            {state.goals.length > 3 && (
              <button
                onClick={() => onNavigate('goals')}
                className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-200 hover:border-primary transition-all flex flex-col items-center justify-center min-h-[300px] group"
              >
                <div className="text-4xl mb-3">👀</div>
                <p className="text-lg font-semibold text-gray-600 group-hover:text-primary">
                  Voir tous les objectifs ({state.goals.length})
                </p>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dernières transactions */}
      <RecentTransactions
        transactions={state.transactions}
        onViewAll={() => onNavigate('transactions')}
      />

      {/* Modal Objectif */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={handleCloseGoalModal}
        title={editingGoal ? 'Modifier l\'objectif' : 'Créer un objectif'}
      >
        <GoalForm
          onSubmit={handleGoalSubmit}
          onCancel={handleCloseGoalModal}
          initialData={editingGoal}
        />
      </Modal>
    </div>
  )
}
