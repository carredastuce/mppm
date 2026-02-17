import { LogOut, Shield } from 'lucide-react'
import Button from '../shared/Button'

interface ParentHeaderProps {
  childName?: string
  onExit: () => void
}

export default function ParentHeader({ childName, onExit }: ParentHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-5 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-indigo-400" />
            <div>
              <h1 className="text-2xl font-bold">Espace Parent</h1>
              {childName && (
                <p className="text-slate-300 text-sm">Gestion de {childName}</p>
              )}
            </div>
          </div>

          <Button
            variant="warning"
            size="sm"
            onClick={onExit}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Retour mode enfant
          </Button>
        </div>
      </div>
    </header>
  )
}
