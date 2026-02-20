export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  label: string
  date: string
  notes?: string
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  createdAt: string
  imageUrl?: string
}

export interface Job {
  id: string
  title: string
  description: string
  reward: number
  status: 'available' | 'in_progress' | 'pending_validation' | 'completed'
  createdAt: string
  acceptedAt?: string
  completedAt?: string
  icon?: string
  transactionId?: string
}

export interface Allowance {
  amount: number
  frequency: 'weekly' | 'monthly'
  isActive: boolean
  lastPaidDate?: string
  createdAt: string
}

export interface ParentSettings {
  pinHash: string
  childName?: string
  spendingWarningThreshold?: number
  allowance?: Allowance
  familyCode?: string
}

export type ParentTab = 'dashboard' | 'allowance' | 'jobs' | 'history' | 'settings'

export interface DeletedIds {
  transactions: string[]
  goals: string[]
  jobs: string[]
}

export interface AppState {
  transactions: Transaction[]
  goals: Goal[]
  jobs: Job[]
  parentSettings?: ParentSettings
  linkedFamilyCode?: string
  deletedIds?: DeletedIds
}

export type TransactionType = 'income' | 'expense'

export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_TO_GOAL'; payload: { goalId: string; amount: number; transaction: Transaction } }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ACCEPT_JOB'; payload: string }
  | { type: 'SUBMIT_JOB'; payload: string }
  | { type: 'VALIDATE_JOB'; payload: { jobId: string; transaction: Transaction } }
  | { type: 'REJECT_JOB'; payload: string }
  | { type: 'COMPLETE_JOB'; payload: { jobId: string; transaction: Transaction } }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'RESET_STATE' }
  | { type: 'RESET_CHILD_DATA' }
  | { type: 'SET_PARENT_SETTINGS'; payload: ParentSettings }
  | { type: 'UPDATE_PARENT_SETTINGS'; payload: Partial<ParentSettings> }
  | { type: 'SYNC_STATE'; payload: AppState }
  | { type: 'SET_FAMILY_CODE'; payload: string }
