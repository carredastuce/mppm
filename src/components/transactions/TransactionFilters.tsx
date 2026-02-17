import { TransactionType } from '../../types'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants/categories'

interface TransactionFiltersProps {
  typeFilter: 'all' | TransactionType
  categoryFilter: string
  onTypeFilterChange: (type: 'all' | TransactionType) => void
  onCategoryFilterChange: (category: string) => void
}

export default function TransactionFilters({
  typeFilter,
  categoryFilter,
  onTypeFilterChange,
  onCategoryFilterChange,
}: TransactionFiltersProps) {
  const allCategories = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
      <h3 className="font-semibold text-gray-700">Filtres</h3>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onTypeFilterChange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            typeFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Toutes
        </button>
        <button
          onClick={() => onTypeFilterChange('income')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            typeFilter === 'income'
              ? 'bg-success text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💰 Revenus
        </button>
        <button
          onClick={() => onTypeFilterChange('expense')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            typeFilter === 'expense'
              ? 'bg-danger text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💸 Dépenses
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie
        </label>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
        >
          <option value="">Toutes les catégories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
