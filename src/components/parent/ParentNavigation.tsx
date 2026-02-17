import { LayoutDashboard, Coins, Briefcase, Clock, Settings } from 'lucide-react'
import { ParentTab } from '../../types'

interface ParentNavigationProps {
  activeTab: ParentTab
  onTabChange: (tab: ParentTab) => void
}

export default function ParentNavigation({ activeTab, onTabChange }: ParentNavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'allowance' as const, label: 'Argent de poche', icon: Coins },
    { id: 'jobs' as const, label: 'Petits boulots', icon: Briefcase },
    { id: 'history' as const, label: 'Historique', icon: Clock },
    { id: 'settings' as const, label: 'Paramètres', icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 overflow-x-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-4 whitespace-nowrap ${
                  isActive
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                    : 'text-gray-600 border-transparent hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
