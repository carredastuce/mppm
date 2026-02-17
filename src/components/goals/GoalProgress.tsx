import { calculateGoalProgress } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import ProgressBar from '../shared/ProgressBar'

interface GoalProgressProps {
  currentAmount: number
  targetAmount: number
}

export default function GoalProgress({ currentAmount, targetAmount }: GoalProgressProps) {
  const progress = calculateGoalProgress(currentAmount, targetAmount)

  return (
    <div className="space-y-2">
      <ProgressBar progress={progress} color="success" showLabel={false} />
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700">
          {formatCurrency(currentAmount)} / {formatCurrency(targetAmount)}
        </span>
        <span className="font-bold text-success">
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}
