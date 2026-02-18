import { useState } from 'react'
import { Lock, Wallet, Download, Link } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { calculateBalance } from '../../utils/calculations'
import { formatCurrency } from '../../utils/formatters'
import { exportToJSON } from '../../utils/storage'
import { pullStateFromCloud } from '../../utils/sync'
import { useSyncStatus } from '../../hooks/useSyncStatus'
import Modal from '../shared/Modal'
import Button from '../shared/Button'

interface HeaderProps {
  onParentAccess: () => void
}

export default function Header({ onParentAccess }: HeaderProps) {
  const { state, dispatch, syncPending } = useApp()
  const balance = calculateBalance(state.transactions)
  const childName = state.parentSettings?.childName
  const hasParentSettings = !!state.parentSettings?.pinHash

  const familyCode = state.parentSettings?.familyCode ?? state.linkedFamilyCode
  const isLinked = !!familyCode
  const syncStatus = useSyncStatus(isLinked, syncPending)

  const [showLinkModal, setShowLinkModal] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [linkError, setLinkError] = useState<string | null>(null)
  const [isLinking, setIsLinking] = useState(false)

  const handleExport = () => {
    exportToJSON(state)
  }

  const handleLinkSubmit = async () => {
    const code = inputCode.trim().toUpperCase()
    if (code.length !== 6) {
      setLinkError('Le code doit contenir 6 caractères')
      return
    }
    setIsLinking(true)
    setLinkError(null)
    const remote = await pullStateFromCloud(code)
    setIsLinking(false)
    if (!remote) {
      setLinkError('Code introuvable. Vérifiez le code et réessayez.')
      return
    }
    dispatch({ type: 'SET_FAMILY_CODE', payload: code })
    dispatch({ type: 'SYNC_STATE', payload: remote })
    setShowLinkModal(false)
    setInputCode('')
  }

  const title = childName ? `Porte-monnaie de ${childName}` : 'Mon petit porte monnaie'

  // Dot de statut sync
  const SyncDot = () => {
    if (syncStatus === 'not_linked') return null
    const colorMap: Record<string, string> = {
      synced: 'bg-green-400',
      pending: 'bg-yellow-400 animate-pulse',
      offline: 'bg-gray-400',
      not_linked: 'bg-transparent',
    }
    const titleMap: Record<string, string> = {
      synced: 'Synchronisé',
      pending: 'Synchronisation...',
      offline: 'Hors ligne',
      not_linked: '',
    }
    return (
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full ${colorMap[syncStatus]}`}
        title={titleMap[syncStatus]}
      />
    )
  }

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

            {/* Icône sync / statut liaison */}
            {isLinked ? (
              <button
                className="p-2 rounded-lg relative"
                title={`Synchronisation : ${syncStatus}`}
                disabled
              >
                <div className="absolute top-1 right-1">
                  <SyncDot />
                </div>
                <Link size={20} className="opacity-70" />
              </button>
            ) : (
              <button
                onClick={() => setShowLinkModal(true)}
                className="opacity-40 hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                title="Lier cet appareil"
              >
                <Link size={20} />
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

      {/* Modal liaison */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => { setShowLinkModal(false); setInputCode(''); setLinkError(null) }}
        title="Lier cet appareil"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Entrez le code famille affiché dans <strong>Espace Parent → Paramètres → Synchronisation</strong>.
          </p>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="XXXXXX"
            className="w-full text-center font-mono tracking-widest text-2xl font-bold border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            maxLength={6}
            autoFocus
          />
          {linkError && (
            <p className="text-sm text-red-600">{linkError}</p>
          )}
          <div className="flex gap-3">
            <Button
              onClick={handleLinkSubmit}
              disabled={isLinking || inputCode.length !== 6}
              className="flex-1"
            >
              {isLinking ? 'Vérification...' : 'Lier'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => { setShowLinkModal(false); setInputCode(''); setLinkError(null) }}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  )
}
