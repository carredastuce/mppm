import { AppState, AppAction } from '../types'
import { mergeStates } from '../utils/sync'

export const initialState: AppState = {
  transactions: [],
  goals: [],
  jobs: [],
  parentSettings: undefined,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id ? action.payload : tx
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
        deletedItemIds: [...(state.deletedItemIds || []), action.payload],
      }

    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      }

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      }

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
        deletedItemIds: [...(state.deletedItemIds || []), action.payload],
      }

    case 'ADD_TO_GOAL': {
      const { goalId, amount, transaction } = action.payload

      return {
        ...state,
        transactions: [transaction, ...state.transactions],
        goals: state.goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, currentAmount: goal.currentAmount + amount }
            : goal
        ),
      }
    }

    case 'ADD_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
      }

    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload.id ? action.payload : job
        ),
      }

    case 'DELETE_JOB': {
      const jobToDelete = state.jobs.find((job) => job.id === action.payload)
      const deletedIds = [action.payload]
      if (jobToDelete?.transactionId) {
        deletedIds.push(jobToDelete.transactionId)
      }
      return {
        ...state,
        jobs: state.jobs.filter((job) => job.id !== action.payload),
        transactions: jobToDelete?.transactionId
          ? state.transactions.filter((tx) => tx.id !== jobToDelete.transactionId)
          : state.transactions,
        deletedItemIds: [...(state.deletedItemIds || []), ...deletedIds],
      }
    }

    case 'ACCEPT_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload
            ? { ...job, status: 'in_progress', acceptedAt: new Date().toISOString() }
            : job
        ),
      }

    case 'SUBMIT_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload
            ? { ...job, status: 'pending_validation' }
            : job
        ),
      }

    case 'VALIDATE_JOB': {
      const { jobId, transaction } = action.payload
      return {
        ...state,
        transactions: [transaction, ...state.transactions],
        jobs: state.jobs.map((job) =>
          job.id === jobId
            ? { ...job, status: 'completed', completedAt: new Date().toISOString(), transactionId: transaction.id }
            : job
        ),
      }
    }

    case 'REJECT_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job.id === action.payload
            ? { ...job, status: 'available', acceptedAt: undefined }
            : job
        ),
      }

    case 'COMPLETE_JOB': {
      const { jobId, transaction } = action.payload

      return {
        ...state,
        transactions: [transaction, ...state.transactions],
        jobs: state.jobs.map((job) =>
          job.id === jobId
            ? { ...job, status: 'completed', completedAt: new Date().toISOString(), transactionId: transaction.id }
            : job
        ),
      }
    }

    // Bug 5 fix : préserver deletedItemIds si le payload n'en contient pas
    case 'LOAD_STATE':
      return {
        ...action.payload,
        parentSettings: action.payload.parentSettings ?? state.parentSettings,
        deletedItemIds: action.payload.deletedItemIds ?? state.deletedItemIds ?? [],
      }

    case 'RESET_STATE':
      return initialState

    case 'RESET_CHILD_DATA':
      return {
        ...initialState,
        parentSettings: state.parentSettings,
        deletedItemIds: [
          ...(state.deletedItemIds || []),
          ...state.transactions.map((tx) => tx.id),
          ...state.goals.map((g) => g.id),
          ...state.jobs.map((j) => j.id),
        ],
      }

    case 'SET_PARENT_SETTINGS':
      return {
        ...state,
        parentSettings: action.payload,
      }

    case 'UPDATE_PARENT_SETTINGS': {
      if (!state.parentSettings) return state
      const updated = { ...state.parentSettings, ...action.payload }
      if (action.payload.allowance && state.parentSettings.allowance) {
        updated.allowance = { ...state.parentSettings.allowance, ...action.payload.allowance }
      }
      return { ...state, parentSettings: updated }
    }

    case 'SYNC_STATE':
      return mergeStates(state, action.payload)

    case 'SET_FAMILY_CODE':
      return { ...state, linkedFamilyCode: action.payload }

    default:
      return state
  }
}
