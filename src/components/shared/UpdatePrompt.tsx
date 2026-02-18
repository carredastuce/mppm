import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-indigo-600 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 pointer-events-auto max-w-sm w-full">
        <RefreshCw size={18} className="shrink-0" />
        <p className="text-sm font-medium flex-1">Nouvelle version disponible</p>
        <button
          onClick={() => updateServiceWorker(true)}
          className="bg-white text-indigo-600 text-sm font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
        >
          Mettre à jour
        </button>
      </div>
    </div>
  )
}
