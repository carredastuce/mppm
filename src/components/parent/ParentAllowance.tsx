import { useState } from 'react'
import { Coins, Play, Pause, Edit, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Allowance } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { getNextDueDate } from '../../utils/allowance'
import Button from '../shared/Button'
import Input from '../shared/Input'

export default function ParentAllowance() {
  const { state, dispatch } = useApp()
  const allowance = state.parentSettings?.allowance

  const [isEditing, setIsEditing] = useState(!allowance)
  const [amount, setAmount] = useState(allowance?.amount.toString() || '')
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>(allowance?.frequency || 'weekly')
  const [error, setError] = useState<string | null>(null)

  const nextDate = allowance ? getNextDueDate(allowance) : null

  const allowanceTransactions = state.transactions.filter(
    tx => tx.type === 'income' && tx.category === 'Argent de poche' && tx.label.includes('(automatique)')
  )

  const handleSave = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Le montant doit être supérieur à 0')
      return
    }

    const newAllowance: Allowance = {
      amount: amountNum,
      frequency,
      isActive: allowance?.isActive ?? true,
      lastPaidDate: allowance?.lastPaidDate,
      createdAt: allowance?.createdAt || new Date().toISOString(),
    }

    dispatch({
      type: 'UPDATE_PARENT_SETTINGS',
      payload: { allowance: newAllowance },
    })
    setIsEditing(false)
    setError(null)
  }

  const handleToggleActive = () => {
    if (!allowance) return
    dispatch({
      type: 'UPDATE_PARENT_SETTINGS',
      payload: {
        allowance: { ...allowance, isActive: !allowance.isActive },
      },
    })
  }

  const handleStartEditing = () => {
    if (allowance) {
      setAmount(allowance.amount.toString())
      setFrequency(allowance.frequency)
    }
    setIsEditing(true)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Coins size={24} className="text-indigo-600" />
        Argent de poche
      </h2>

      {/* Carte statut */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {allowance && !isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                  allowance.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {allowance.isActive ? 'Actif' : 'En pause'}
                </span>
                <span className="text-3xl font-bold text-gray-900">{formatCurrency(allowance.amount)}</span>
                <span className="text-gray-500">/ {allowance.frequency === 'weekly' ? 'semaine' : 'mois'}</span>
              </div>
            </div>

            {nextDate && allowance.isActive && (
              <p className="text-sm text-gray-500">
                Prochain versement : <span className="font-medium text-gray-700">{formatDate(nextDate.toISOString())}</span>
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant={allowance.isActive ? 'warning' : 'success'}
                size="sm"
                onClick={handleToggleActive}
                className="flex items-center gap-2"
              >
                {allowance.isActive ? <Pause size={16} /> : <Play size={16} />}
                {allowance.isActive ? 'Mettre en pause' : 'Reprendre'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartEditing}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {allowance ? 'Modifier l\'argent de poche' : 'Configurer l\'argent de poche'}
            </h3>

            <Input
              type="number"
              label="Montant (€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5.00"
              step="0.50"
              min="0"
              error={error}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fréquence</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    frequency === 'weekly'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Hebdomadaire
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                    frequency === 'monthly'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Mensuel
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Check size={18} />
                {allowance ? 'Enregistrer' : 'Activer'}
              </Button>
              {allowance && (
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Historique des versements */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des versements</h3>
        {allowanceTransactions.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun versement effectué pour le moment</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {allowanceTransactions.slice(0, 20).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{tx.label}</p>
                  <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                </div>
                <span className="font-bold text-sm text-green-600">+{formatCurrency(tx.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
