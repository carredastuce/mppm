import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Job, JobFrequency } from '../../types'
import Input from '../shared/Input'
import Button from '../shared/Button'

const FREQUENCY_OPTIONS: { value: JobFrequency; label: string }[] = [
  { value: 'once', label: 'Une seule fois' },
  { value: 'daily', label: 'Tous les jours' },
  { value: 'weekly', label: 'Toutes les semaines' },
  { value: 'specific_day', label: 'Un jour précis' },
  { value: 'monthly', label: 'Tous les mois' },
]

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

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
  const [frequency, setFrequency] = useState<JobFrequency>(initialData?.frequency || 'once')
  const [frequencyDay, setFrequencyDay] = useState<number>(initialData?.frequencyDay ?? 1)
  const [requiresValidation, setRequiresValidation] = useState<boolean>(initialData?.requiresValidation !== false)
  const [dueDate, setDueDate] = useState<string>(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ''
  )
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
      frequency,
      frequencyDay: frequency === 'specific_day' ? frequencyDay : undefined,
      requiresValidation,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
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

      {/* Fréquence */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fréquence
        </label>
        <div className="flex flex-wrap gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFrequency(opt.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                frequency === opt.value
                  ? 'bg-primary text-white ring-2 ring-primary ring-offset-1'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sélection du jour pour 'specific_day' */}
        {frequency === 'specific_day' && (
          <div className="mt-3">
            <label className="block text-sm text-gray-600 mb-1">Quel jour ?</label>
            <div className="flex flex-wrap gap-2">
              {DAY_NAMES.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFrequencyDay(index)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    frequencyDay === index
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-1'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Date limite */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Date limite <span className="text-gray-400 font-normal">(optionnel)</span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().slice(0, 10)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
        />
      </div>

      {/* Validation parentale */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-700">Validation parentale</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {requiresValidation
              ? 'L\'enfant soumet, le parent valide avant le paiement'
              : 'L\'enfant marque directement comme terminé'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRequiresValidation(!requiresValidation)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            requiresValidation ? 'bg-primary' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              requiresValidation ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
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
