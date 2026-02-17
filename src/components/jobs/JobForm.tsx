import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Job } from '../../types'
import Input from '../shared/Input'
import Button from '../shared/Button'

interface JobFormProps {
  onSubmit: (job: Job) => void
  onCancel: () => void
  initialData?: Job
}

const JOB_ICONS = ['🧹', '🐕', '🐈', '🌱', '🚗', '📦', '🍳', '🧺', '🪟', '🎨']

export default function JobForm({ onSubmit, onCancel, initialData }: JobFormProps) {
  const isEditing = !!initialData

  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [reward, setReward] = useState(initialData?.reward.toString() || '')
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || '🧹')
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rewardNumber = parseFloat(reward)

    const titleError = !title.trim() ? 'Le titre est obligatoire' : null
    const descriptionError = !description.trim() ? 'La description est obligatoire' : null
    const rewardError = isNaN(rewardNumber) || rewardNumber <= 0 ? 'La récompense doit être supérieure à 0' : null

    if (titleError || descriptionError || rewardError) {
      setErrors({
        title: titleError,
        description: descriptionError,
        reward: rewardError,
      })
      return
    }

    const job: Job = {
      id: initialData?.id || uuidv4(),
      title: title.trim(),
      description: description.trim(),
      reward: rewardNumber,
      status: initialData?.status || 'available',
      createdAt: initialData?.createdAt || new Date().toISOString(),
      acceptedAt: initialData?.acceptedAt,
      completedAt: initialData?.completedAt,
      icon: selectedIcon,
    }

    onSubmit(job)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Titre */}
      <Input
        type="text"
        label="Titre du boulot"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex: Sortir les poubelles, Laver la voiture..."
        maxLength={50}
        error={errors.title}
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris le boulot en détail..."
          rows={3}
          maxLength={200}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none ${
            errors.description ? 'border-danger' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="text-danger text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Récompense */}
      <Input
        type="number"
        label="Récompense (€)"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.reward}
      />

      {/* Sélection d'icône */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Icône
        </label>
        <div className="grid grid-cols-5 gap-2">
          {JOB_ICONS.map((icon) => (
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
