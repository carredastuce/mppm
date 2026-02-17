import { Lock, Wallet, Download } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateBalance } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { exportToJSON } from '../../utils/storage'
import Button from '../shared/Button'

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

  return (
    <header className="bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Titre */}
          <div className="flex items-center gap-3">
            <Wallet size={40} />
            <h1 className="text-3xl font-display">
              {childName ? `Le porte-monnaie de ${childName}` : 'Mon petit porte monnaie'}
            </h1>
          </div>

          {/* Solde et actions */}
          <div className="flex items-center gap-4">
            <div className="text-center bg-white bg-opacity-20 px-6 py-3 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90">Ton solde</p>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
            </div>

            {/* Export toujours accessible (lecture seule) */}
            {!hasParentSettings && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Exporter
              </Button>
            )}

            {/* Cadenas vers espace parent */}
            <button
              onClick={onParentAccess}
              className="opacity-40 hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              title="Espace Parent"
            >
              <Lock size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
