import { Lock, Wallet, Download } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateBalance } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { exportToJSON } from '../../utils/storage'

interface HeaderProps {
  onParentAccess: () => void
}

export default function Header({ onParentAccess }: HeaderProps) {
  const { state } = useApp()
  const balance = calculateBalance(state.transactions)
  const childName = state.parentSettings?.childName
  const hasParentSettings = !!state.parentSettings?.pinHash

  const handleExport = () => {
    exportToJSON(state)
  }

  const title = childName ? `Porte-monnaie de ${childName}` : 'Mon petit porte monnaie'

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
      <div className="px-4 py-4 max-w-6xl mx-auto">
        {/* Layout mobile : une seule ligne compacte */}
        <div className="flex items-center justify-between gap-3">

          {/* Icône + titre */}
          <div className="flex items-center gap-2 min-w-0">
            <Wallet size={28} className="shrink-0" />
            <h1 className="font-display text-lg leading-tight truncate">
              {title}
            </h1>
          </div>

          {/* Solde + actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right bg-white bg-opacity-20 px-3 py-2 rounded-lg">
              <p className="text-xs opacity-80">Solde</p>
              <p className="text-base font-bold leading-tight">{formatCurrency(balance)}</p>
            </div>

            {!hasParentSettings && (
              <button
                onClick={handleExport}
                className="opacity-70 hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                title="Exporter"
              >
                <Download size={20} />
              </button>
            )}

            <button
              onClick={onParentAccess}
              className="opacity-40 hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              title="Espace Parent"
            >
              <Lock size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
