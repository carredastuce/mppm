import { ArrowRight } from 'lucide-react'
import { Goal } from '../../types'
import { calculateGoalProgress } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import ProgressBar from '../shared/ProgressBar'
import Button from '../shared/Button'

interface GoalsOverviewProps {
  goals: Goal[]
  onViewAll: () => void
}

export default function GoalsOverview({ goals, onViewAll }: GoalsOverviewProps) {
  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-4xl mb-3">🎯</p>
        <p className="text-lg font-semibold text-gray-700 mb-1">
          Aucun objectif d'épargne
        </p>
        <p className="text-gray-500 text-sm">
          Crée un objectif pour commencer à économiser !
        </p>
        <Button onClick={onViewAll} className="mt-4">
          Créer un objectif
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Mes objectifs</h3>
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

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount)

          return (
            <div
              key={goal.id}
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{goal.imageUrl || '🎯'}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{goal.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success">
                    {progress.toFixed(0)}%
                  </p>
                </div>
              </div>
              <ProgressBar progress={progress} color="success" showLabel={false} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
