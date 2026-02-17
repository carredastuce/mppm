import { useApp } from '../../context/AppContext'
import { calculateBalance, calculateSpendingThisMonth, calculateIncomeThisMonth, calculateSpendingThisWeek, calculateIncomeThisWeek, calculateCategoryBreakdown } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { TrendingDown, TrendingUp, Wallet, Target, Briefcase, ArrowRight } from 'lucide-react'
import ProgressBar from '../shared/ProgressBar'
import { calculateGoalProgress } from '../../utils/calculations'
import { ParentTab } from '../../types'

interface ParentDashboardProps {
  onNavigate: (tab: ParentTab) => void
}

export default function ParentDashboard({ onNavigate }: ParentDashboardProps) {
  const { state } = useApp()
  const balance = calculateBalance(state.transactions)
  const incomeMonth = calculateIncomeThisMonth(state.transactions)
  const spendingMonth = calculateSpendingThisMonth(state.transactions)
  const incomeWeek = calculateIncomeThisWeek(state.transactions)
  const spendingWeek = calculateSpendingThisWeek(state.transactions)
  const topExpenses = calculateCategoryBreakdown(state.transactions, 'expense')

  const availableJobs = state.jobs.filter(j => j.status === 'available').length
  const inProgressJobs = state.jobs.filter(j => j.status === 'in_progress').length
  const completedJobs = state.jobs.filter(j => j.status === 'completed').length
  const totalEarnedFromJobs = state.jobs
    .filter(j => j.status === 'completed')
    .reduce((sum, j) => sum + j.reward, 0)

  return (
    <div className="space-y-6">
      {/* Cartes de solde */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={20} className="text-indigo-600" />
            <span className="text-sm font-medium text-gray-500">Solde actuel</span>
          </div>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={20} className="text-green-600" />
            <span className="text-sm font-medium text-gray-500">Revenus du mois</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(incomeMonth)}</p>
          <p className="text-sm text-gray-400 mt-1">Cette semaine : {formatCurrency(incomeWeek)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown size={20} className="text-red-500" />
            <span className="text-sm font-medium text-gray-500">Dépenses du mois</span>
          </div>
          <p className="text-3xl font-bold text-red-500">{formatCurrency(spendingMonth)}</p>
          <p className="text-sm text-gray-400 mt-1">Cette semaine : {formatCurrency(spendingWeek)}</p>
        </div>
      </div>

      {/* Top dépenses par catégorie */}
      {topExpenses.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top dépenses par catégorie</h3>
          <div className="space-y-3">
            {topExpenses.slice(0, 5).map((cat) => (
              <div key={cat.category} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-40 truncate">{cat.category}</span>
                <div className="flex-1">
                  <ProgressBar
                    progress={spendingMonth > 0 ? (cat.amount / spendingMonth) * 100 : 0}
                    showLabel={false}
                    color="danger"
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-20 text-right">{formatCurrency(cat.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Résumé objectifs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target size={20} className="text-indigo-600" />
              Objectifs
            </h3>
          </div>
          {state.goals.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun objectif en cours</p>
          ) : (
            <div className="space-y-3">
              {state.goals.slice(0, 4).map((goal) => {
                const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount)
                return (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{goal.name}</span>
                      <span className="text-gray-500">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <ProgressBar
                      progress={progress}
                      showLabel={false}
                      color={progress >= 100 ? 'success' : 'primary'}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Résumé jobs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Briefcase size={20} className="text-indigo-600" />
              Petits boulots
            </h3>
            <button
              onClick={() => onNavigate('jobs')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
            >
              Gérer <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{availableJobs}</p>
              <p className="text-xs text-green-700">Disponibles</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{inProgressJobs}</p>
              <p className="text-xs text-amber-700">En cours</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-gray-600">{completedJobs}</p>
              <p className="text-xs text-gray-700">Terminés</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalEarnedFromJobs)}</p>
              <p className="text-xs text-indigo-700">Total gagné</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions récentes */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Transactions récentes</h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
        {state.transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucune transaction</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {state.transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{tx.label}</p>
                  <p className="text-xs text-gray-500">{tx.category}</p>
                </div>
                <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
