import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'

export default function Simulator() {
  const { state } = useApp()
  const allowanceWeekly = (() => {
    const a = state.parentSettings?.allowance
    if (!a?.isActive) return 0
    return a.frequency === 'weekly' ? a.amount : a.amount / 4.33
  })()

  const [weeklyAmount, setWeeklyAmount] = useState(Math.max(1, Math.round(allowanceWeekly)))

  const activeGoals = state.goals.filter((g) => g.currentAmount < g.targetAmount)

  function weeksToGoal(remaining: number): string {
    if (weeklyAmount <= 0) return '∞'
    const weeks = Math.ceil(remaining / weeklyAmount)
    if (weeks <= 0) return 'déjà atteint !'
    if (weeks === 1) return '1 semaine'
    if (weeks < 5) return `${weeks} semaines`
    const months = Math.round(weeks / 4.33)
    if (months < 12) return `~${months} mois`
    const years = (weeks / 52).toFixed(1)
    return `~${years} ans`
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-3xl font-display text-gray-900 mb-2">🔮 Simulateur</h2>
        <p className="text-gray-600">Et si j'économisais plus chaque semaine ?</p>
      </div>

      {/* Slider */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700">
            J'épargne chaque semaine
          </label>
          <span className="text-2xl font-bold text-primary">{formatCurrency(weeklyAmount)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={50}
          step={0.5}
          value={weeklyAmount}
          onChange={(e) => setWeeklyAmount(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0€</span>
          <span>50€</span>
        </div>
        {allowanceWeekly > 0 && (
          <button
            onClick={() => setWeeklyAmount(Math.round(allowanceWeekly * 10) / 10)}
            className="mt-3 text-xs text-primary underline"
          >
            Utiliser mon argent de poche ({formatCurrency(Math.round(allowanceWeekly * 10) / 10)}/sem)
          </button>
        )}
      </div>

      {/* Résultats par objectif */}
      {activeGoals.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <p className="text-5xl mb-3">🎯</p>
          <p className="text-lg font-semibold text-gray-700">Aucun objectif en cours</p>
          <p className="text-gray-500 text-sm mt-1">Crée un objectif pour voir la simulation !</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Mes objectifs</h3>
          {activeGoals.map((goal) => {
            const remaining = goal.targetAmount - goal.currentAmount
            const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100)
            const eta = weeksToGoal(remaining)
            return (
              <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{goal.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-400">{progress}%</span>
                </div>
                {/* Barre de progression */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* ETA */}
                <div className="bg-indigo-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-xs text-indigo-500 mb-0.5">À ce rythme, objectif atteint dans</p>
                  <p className="text-xl font-bold text-indigo-700">{eta}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
