import { RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function UndoToast() {
  const { canUndo, undo } = useApp()

  if (!canUndo) return null

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-gray-900 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
        <span className="text-sm">Action effectuée</span>
        <button
          onClick={undo}
          className="flex items-center gap-1.5 bg-white text-gray-900 rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={14} />
          Annuler
        </button>
      </div>
    </div>
  )
}
