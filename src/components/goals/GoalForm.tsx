import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Goal } from '../../types'
import { validateGoalName, validateGoalAmount, validateGoalCurrentAmount } from '../../utils/validators'
import Input from '../shared/Input'
import Button from '../shared/Button'

interface GoalFormProps {
  onSubmit: (goal: Goal) => void
  onCancel: () => void
  initialData?: Goal
}

const GOAL_ICONS = ['🚲', '🎮', '📱', '⚽', '🎸', '📚', '🎧', '💻', '🎨', '🎯']

export default function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const isEditing = !!initialData

  const [name, setName] = useState(initialData?.name || '')
  const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount.toString() || '')
  const [currentAmount, setCurrentAmount] = useState(initialData?.currentAmount.toString() || '0')
  const [selectedIcon, setSelectedIcon] = useState(initialData?.imageUrl || '🎯')
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nameError = validateGoalName(name)
    const targetError = validateGoalAmount(parseFloat(targetAmount))
    const currentError = validateGoalCurrentAmount(parseFloat(currentAmount))

    if (nameError || targetError || currentError) {
      setErrors({
        name: nameError,
        targetAmount: targetError,
        currentAmount: currentError,
      })
      return
    }

    const goal: Goal = {
      id: initialData?.id || uuidv4(),
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      createdAt: initialData?.createdAt || new Date().toISOString(),
      imageUrl: selectedIcon,
    }

    onSubmit(goal)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom */}
      <Input
        type="text"
        label="Nom de l'objectif"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Nouveau vélo, PlayStation..."
        maxLength={50}
        error={errors.name}
      />

      {/* Montant cible */}
      <Input
        type="number"
        label="Montant cible (€)"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.targetAmount}
      />

      {/* Montant de départ (seulement pour création) */}
      {!isEditing && (
        <Input
          type="number"
          label="Montant de départ (€)"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          error={errors.currentAmount}
        />
      )}

      {/* Sélection d'icône */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Icône
        </label>
        <div className="grid grid-cols-5 gap-2">
          {GOAL_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setSelectedIcon(icon)}
              className={`text-4xl p-3 rounded-lg transition-all ${
                selectedIcon === icon
                  ? 'bg-primary bg-opacity-20 ring-2 ring-primary scale-110'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {isEditing ? 'Modifier' : 'Créer'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  )
}
