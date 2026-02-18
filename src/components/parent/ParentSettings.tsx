import { useState, useRef } from 'react'
import { Settings, Download, Upload, AlertTriangle, Link, Copy, Check, Unlink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { hashPin, verifyPin, validatePin } from '../../utils/pin'
import { exportToJSON, importFromJSON } from '../../utils/storage'
import { generateFamilyCode, pushStateToCloud } from '../../utils/sync'
import Input from '../shared/Input'
import Button from '../shared/Button'
import Modal from '../shared/Modal'

export default function ParentSettings() {
  const { state, dispatch } = useApp()
  const parentSettings = state.parentSettings

  const [childName, setChildName] = useState(parentSettings?.childName || '')
  const [threshold, setThreshold] = useState(parentSettings?.spendingWarningThreshold?.toString() || '')
  const [nameSuccess, setNameSuccess] = useState(false)
  const [thresholdSuccess, setThresholdSuccess] = useState(false)

  // PIN change
  const [showPinChange, setShowPinChange] = useState(false)
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSuccess, setPinSuccess] = useState(false)

  // Sync
  const [codeCopied, setCodeCopied] = useState(false)
  const familyCode = parentSettings?.familyCode

  const handleActivateSync = async () => {
    const code = generateFamilyCode()
    dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: { familyCode: code } })
    // Push immédiatement avec le nouveau code
    await pushStateToCloud(code, { ...state, parentSettings: { ...parentSettings!, familyCode: code } })
  }

  const handleCopyCode = () => {
    if (!familyCode) return
    navigator.clipboard.writeText(familyCode).then(() => {
      setCodeCopied(true)
      setTimeout(() => setCodeCopied(false), 2000)
    })
  }

  const handleDeactivateSync = () => {
    dispatch({ type: 'UPDATE_PARENT_SETTINGS', payload: { familyCode: undefined } })
  }

  // Import
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSaveChildName = () => {
    dispatch({
      type: 'UPDATE_PARENT_SETTINGS',
      payload: { childName: childName.trim() || undefined },
    })
    setNameSuccess(true)
    setTimeout(() => setNameSuccess(false), 2000)
  }

  const handleSaveThreshold = () => {
    const value = parseFloat(threshold)
    dispatch({
      type: 'UPDATE_PARENT_SETTINGS',
      payload: { spendingWarningThreshold: isNaN(value) || value <= 0 ? undefined : value },
    })
    setThresholdSuccess(true)
    setTimeout(() => setThresholdSuccess(false), 2000)
  }

  const handlePinChange = () => {
    if (!parentSettings) return

    if (!verifyPin(currentPin, parentSettings.pinHash)) {
      setPinError('Code PIN actuel incorrect')
      return
    }
    if (!validatePin(newPin)) {
      setPinError('Le nouveau code doit contenir 4 chiffres')
      return
    }
    if (newPin !== confirmPin) {
      setPinError('Les codes ne correspondent pas')
      return
    }

    dispatch({
      type: 'UPDATE_PARENT_SETTINGS',
      payload: { pinHash: hashPin(newPin) },
    })

    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    setPinError(null)
    setPinSuccess(true)
    setShowPinChange(false)
    setTimeout(() => setPinSuccess(false), 2000)
  }

  const handleExport = () => {
    exportToJSON(state)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const importedData = await importFromJSON(file)
      const shouldReplace = window.confirm(
        'Voulez-vous remplacer les données ou les fusionner ?\n\n' +
        'OK = Remplacer\nAnnuler = Fusionner'
      )

      if (shouldReplace) {
        // Préserver les parentSettings locaux
        dispatch({
          type: 'LOAD_STATE',
          payload: { ...importedData, parentSettings: state.parentSettings },
        })
      } else {
        const mergedState = {
          transactions: [...state.transactions, ...importedData.transactions],
          goals: [...state.goals, ...importedData.goals],
          jobs: [...state.jobs, ...(importedData.jobs || [])],
          parentSettings: state.parentSettings,
        }
        dispatch({ type: 'LOAD_STATE', payload: mergedState })
      }
      alert('Données importées avec succès !')
    } catch (error) {
      console.error("Erreur lors de l'import", error)
      alert("Erreur lors de l'import des données. Vérifiez que le fichier est valide.")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReset = () => {
    dispatch({ type: 'RESET_CHILD_DATA' })
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Settings size={24} className="text-indigo-600" />
        Paramètres
      </h2>

      {/* Prénom enfant */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Prénom de l'enfant</h3>
        <p className="text-sm text-gray-500 mb-3">Personnalise le header du mode enfant</p>
        <div className="flex gap-3">
          <Input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Prénom"
            maxLength={30}
          />
          <Button onClick={handleSaveChildName} size="sm">
            {nameSuccess ? 'Enregistré !' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* Seuil d'alerte */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Seuil d'alerte de solde bas</h3>
        <p className="text-sm text-gray-500 mb-3">
          Votre enfant verra un avertissement quand son solde descend en dessous de ce montant. Laissez vide pour désactiver.
        </p>
        <div className="flex gap-3">
          <Input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Ex: 5.00"
            step="0.50"
            min="0"
          />
          <Button onClick={handleSaveThreshold} size="sm">
            {thresholdSuccess ? 'Enregistré !' : 'Enregistrer'}
          </Button>
        </div>
      </div>

      {/* Changer le PIN */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Code PIN</h3>
        {pinSuccess && <p className="text-green-600 text-sm mb-3 font-medium">Code PIN modifié avec succès !</p>}
        {!showPinChange ? (
          <Button variant="secondary" onClick={() => setShowPinChange(true)}>
            Changer le code PIN
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              type="password"
              label="Code PIN actuel"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              placeholder="····"
            />
            <Input
              type="password"
              label="Nouveau code PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              placeholder="····"
            />
            <Input
              type="password"
              label="Confirmer le nouveau code"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              placeholder="····"
              error={pinError}
            />
            <div className="flex gap-3">
              <Button onClick={handlePinChange}>Valider</Button>
              <Button variant="secondary" onClick={() => { setShowPinChange(false); setPinError(null) }}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Synchronisation */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Link size={20} className="text-indigo-600" />
          Synchronisation multi-appareils
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Génère un code famille pour lier le téléphone de votre enfant. Les données se synchronisent automatiquement.
        </p>

        {!familyCode ? (
          <Button onClick={handleActivateSync} className="flex items-center gap-2">
            <Link size={18} />
            Activer la synchronisation
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-xl p-4 text-center">
              <p className="text-xs text-indigo-600 font-medium mb-2 uppercase tracking-wide">Code famille</p>
              <p className="font-mono tracking-widest text-4xl font-bold text-indigo-700 select-all">
                {familyCode}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Entrez ce code dans l'appareil de votre enfant pour lier les deux appareils
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCopyCode}
                className="flex items-center gap-2 flex-1"
              >
                {codeCopied ? <Check size={16} /> : <Copy size={16} />}
                {codeCopied ? 'Copié !' : 'Copier le code'}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeactivateSync}
                className="flex items-center gap-2"
              >
                <Unlink size={16} />
                Désactiver
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Export/Import */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Données</h3>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={18} />
            Exporter
          </Button>
          <Button
            variant="secondary"
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex items-center gap-2"
          >
            <Upload size={18} />
            {isImporting ? 'Import...' : 'Importer'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Réinitialisation */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
        <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
          <AlertTriangle size={20} />
          Zone de danger
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          Supprime toutes les transactions, objectifs et petits boulots. Le code PIN et les paramètres parent seront conservés.
        </p>
        <Button variant="danger" onClick={() => setShowResetConfirm(true)}>
          Réinitialiser les données enfant
        </Button>
      </div>

      {/* Modal confirmation reset */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Confirmer la réinitialisation"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 font-medium">
              Cette action est irréversible. Toutes les transactions, objectifs et petits boulots seront supprimés.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleReset} className="flex-1">
              Confirmer la réinitialisation
            </Button>
            <Button variant="secondary" onClick={() => setShowResetConfirm(false)} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
