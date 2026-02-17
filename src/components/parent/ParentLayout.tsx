import { ParentTab } from '../../types'
import ParentHeader from './ParentHeader'
import ParentNavigation from './ParentNavigation'
import ParentDashboard from './ParentDashboard'
import ParentAllowance from './ParentAllowance'
import ParentJobs from './ParentJobs'
import ParentHistory from './ParentHistory'
import ParentSettings from './ParentSettings'

interface ParentLayoutProps {
  parentTab: ParentTab
  onTabChange: (tab: ParentTab) => void
  onExit: () => void
  childName?: string
}

export default function ParentLayout({ parentTab, onTabChange, onExit, childName }: ParentLayoutProps) {
  return (
    <>
      <ParentHeader childName={childName} onExit={onExit} />
      <ParentNavigation activeTab={parentTab} onTabChange={onTabChange} />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {parentTab === 'dashboard' && <ParentDashboard onNavigate={onTabChange} />}
        {parentTab === 'allowance' && <ParentAllowance />}
        {parentTab === 'jobs' && <ParentJobs />}
        {parentTab === 'history' && <ParentHistory />}
        {parentTab === 'settings' && <ParentSettings />}
      </main>
    </>
  )
}
