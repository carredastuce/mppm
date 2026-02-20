import { Home, List, Target, Briefcase, Calculator, Trophy } from 'lucide-react'
import { ChildTab } from '../../types'
import { useApp } from '../../context/AppContext'

interface NavigationProps {
  activeTab: ChildTab
  onTabChange: (tab: ChildTab) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { state } = useApp()
  const unlockedCount = (state.unlockedBadges ?? []).length
  const hasNew = unlockedCount > 0 && activeTab !== 'badges'

  const tabs = [
    { id: 'dashboard' as const, label: 'Accueil', icon: Home },
    { id: 'transactions' as const, label: 'Transactions', icon: List },
    { id: 'goals' as const, label: 'Objectifs', icon: Target },
    { id: 'jobs' as const, label: 'Boulots', icon: Briefcase },
    { id: 'simulator' as const, label: 'Simulateur', icon: Calculator },
    { id: 'badges' as const, label: 'Badges', icon: Trophy },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            const showBadge = tab.id === 'badges' && hasNew

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-all border-b-2 ${
                  isActive
                    ? 'text-primary border-primary bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-primary hover:bg-gray-50'
                }`}
              >
                <span className="relative">
                  <Icon size={22} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
