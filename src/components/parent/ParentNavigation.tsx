import { LayoutDashboard, Coins, Briefcase, Clock, Settings } from 'lucide-react'
import { ParentTab } from '../../types'

interface ParentNavigationProps {
  activeTab: ParentTab
  onTabChange: (tab: ParentTab) => void
}

export default function ParentNavigation({ activeTab, onTabChange }: ParentNavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Tableau', icon: LayoutDashboard },
    { id: 'allowance' as const, label: 'Argent', icon: Coins },
    { id: 'jobs' as const, label: 'Boulots', icon: Briefcase },
    { id: 'history' as const, label: 'Historique', icon: Clock },
    { id: 'settings' as const, label: 'Réglages', icon: Settings },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                  isActive
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50'
                    : 'text-gray-500 border-transparent hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
