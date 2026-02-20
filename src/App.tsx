import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import UpdatePrompt from './components/shared/UpdatePrompt'
import UndoToast from './components/shared/UndoToast'
import Header from './components/layout/Header'
import Navigation from './components/layout/Navigation'
import Dashboard from './components/dashboard/Dashboard'
import TransactionList from './components/transactions/TransactionList'
import GoalsList from './components/goals/GoalsList'
import JobsList from './components/jobs/JobsList'
import Simulator from './components/simulator/Simulator'
import ParentLayout from './components/parent/ParentLayout'
import PinModal from './components/parent/PinModal'
import { ChildTab, ParentTab } from './types'
import { hashPin, verifyPin } from './utils/pin'

function AppContent() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState<ChildTab>('dashboard')
  const [isParentMode, setIsParentMode] = useState(false)
  const [parentTab, setParentTab] = useState<ParentTab>('dashboard')
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinMode, setPinMode] = useState<'setup' | 'login'>('login')
  const [pinError, setPinError] = useState<string | null>(null)

  const handleParentAccess = () => {
    const hasPin = !!state.parentSettings?.pinHash
    setPinMode(hasPin ? 'login' : 'setup')
    setPinError(null)
    setShowPinModal(true)
  }

  const handlePinSubmit = (pin: string) => {
    if (pinMode === 'setup') {
      dispatch({
        type: 'SET_PARENT_SETTINGS',
        payload: {
          pinHash: hashPin(pin),
          ...(state.parentSettings || {}),
        },
      })
      setShowPinModal(false)
      setParentTab('dashboard')
      setIsParentMode(true)
    } else {
      if (state.parentSettings && verifyPin(pin, state.parentSettings.pinHash)) {
        setPinError(null)
        setShowPinModal(false)
        setParentTab('dashboard')
        setIsParentMode(true)
      } else {
        setPinError('Code PIN incorrect')
      }
    }
  }

  const handleExitParentMode = () => {
    setIsParentMode(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isParentMode ? (
        <ParentLayout
          parentTab={parentTab}
          onTabChange={setParentTab}
          onExit={handleExitParentMode}
          childName={state.parentSettings?.childName}
        />
      ) : (
        <>
          <Header onParentAccess={handleParentAccess} />
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="container mx-auto px-4 py-6 max-w-6xl">
            {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'transactions' && <TransactionList />}
            {activeTab === 'goals' && <GoalsList />}
            {activeTab === 'jobs' && <JobsList />}
            {activeTab === 'simulator' && <Simulator />}
          </main>
        </>
      )}

      <UndoToast />

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        mode={pinMode}
        onSubmit={handlePinSubmit}
        error={pinError}
      />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
      <UpdatePrompt />
    </AppProvider>
  )
}

export default App
