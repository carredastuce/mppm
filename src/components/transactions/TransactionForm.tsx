import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Transaction, TransactionType } from '../../types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories'
import { validateTransactionAmount, validateTransactionLabel } from '../../utils/validators'
import Input from '../shared/Input'
import Button from '../shared/Button'

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void
  onCancel: () => void
  initialData?: Transaction
  defaultType?: TransactionType
}

export default function TransactionForm({
  onSubmit,
  onCancel,
  initialData,
  defaultType = 'income',
}: TransactionFormProps) {
  const isEditing = !!initialData

  const [type, setType] = useState<TransactionType>(initialData?.type || defaultType)
  const [amount, setAmount] = useState(initialData?.amount.toString() || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [label, setLabel] = useState(initialData?.label || '')
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  // Reset category when type changes
  useEffect(() => {
    if (!isEditing && category && !(categories as readonly string[]).includes(category)) {
      setCategory('')
    }
  }, [type, category, categories, isEditing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const amountNumber = parseFloat(amount)
    const amountError = validateTransactionAmount(amountNumber)
    const labelError = validateTransactionLabel(label)

    if (amountError || labelError || !category) {
      setErrors({
        amount: amountError,
        label: labelError,
        category: !category ? 'La catégorie est obligatoire' : null,
      })
      return
    }

    const transaction: Transaction = {
      id: initialData?.id || uuidv4(),
      type,
      amount: amountNumber,
      category,
      label: label.trim(),
      date: initialData?.date || new Date().toISOString(),
      notes: notes.trim() || undefined,
    }

    onSubmit(transaction)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de transaction
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                type === 'income'
                  ? 'bg-success text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💰 Revenu
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-danger text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💸 Dépense
            </button>
          </div>
        </div>
      )}

      {/* Montant */}
      <Input
        type="number"
        label="Montant (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.amount}
      />

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Catégorie
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
            errors.category ? 'border-danger' : 'border-gray-300'
          }`}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-danger text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Libellé */}
      <Input
        type="text"
        label="Libellé"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Ex: McDo, Argent de poche..."
        maxLength={100}
        error={errors.label}
      />

      {/* Notes */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Notes (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ajouter des détails..."
          rows={3}
          maxLength={200}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          {isEditing ? 'Modifier' : 'Ajouter'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  )
}
