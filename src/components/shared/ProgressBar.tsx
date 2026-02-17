interface ProgressBarProps {
  progress: number
  showLabel?: boolean
  color?: 'primary' | 'success' | 'warning' | 'danger'
}

export default function ProgressBar({
  progress,
  showLabel = true,
  color = 'primary',
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  }

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm font-semibold text-gray-600 mt-1 text-right">
          {clampedProgress.toFixed(0)}%
        </p>
      )}
    </div>
  )
}
