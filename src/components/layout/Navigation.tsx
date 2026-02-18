import { Home, List, Target, Briefcase } from 'lucide-react'

interface NavigationProps {
  activeTab: 'dashboard' | 'transactions' | 'goals' | 'jobs'
  onTabChange: (tab: 'dashboard' | 'transactions' | 'goals' | 'jobs') => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Accueil', icon: Home },
    { id: 'transactions' as const, label: 'Transactions', icon: List },
    { id: 'goals' as const, label: 'Objectifs', icon: Target },
    { id: 'jobs' as const, label: 'Boulots', icon: Briefcase },
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
                    ? 'text-primary border-primary bg-blue-50'
                    : 'text-gray-500 border-transparent hover:text-primary hover:bg-gray-50'
                }`}
              >
                <Icon size={22} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
