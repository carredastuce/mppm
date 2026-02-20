import { AppState, Job } from '../types'
import { calculateBalance, calculateTotalIncome } from './calculations'
import { toDay, isoWeek } from './formatters'

export interface BadgeContext {
  completedJobs: Job[]
  balance: number
  totalIncome: number
}

function buildBadgeContext(state: AppState): BadgeContext {
  return {
    completedJobs: state.jobs.filter(j => j.status === 'completed' || !!j.completedAt),
    balance: calculateBalance(state.transactions),
    totalIncome: calculateTotalIncome(state.transactions),
  }
}

export interface BadgeDefinition {
  id: string
  emoji: string
  name: string
  description: string
  hidden: boolean
  condition: (state: AppState, visitDays: string[], ctx?: BadgeContext) => boolean
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // --- Premiers pas ---
  {
    id: 'first_transaction',
    emoji: '🌱',
    name: 'Premier pas',
    description: 'Première transaction enregistrée',
    hidden: false,
    condition: (state) => state.transactions.length >= 1,
  },
  {
    id: 'first_job',
    emoji: '💼',
    name: 'En selle !',
    description: 'Premier boulot accepté',
    hidden: false,
    condition: (state) =>
      state.jobs.some(
        (j) =>
          j.status === 'in_progress' ||
          j.status === 'pending_validation' ||
          j.status === 'completed' ||
          j.acceptedAt !== undefined
      ),
  },
  {
    id: 'first_goal',
    emoji: '🎯',
    name: 'Visionnaire',
    description: 'Premier objectif créé',
    hidden: false,
    condition: (state) => state.goals.length >= 1,
  },

  // --- Petits boulots ---
  {
    id: 'apprenti',
    emoji: '🔨',
    name: 'Apprenti',
    description: '3 boulots terminés',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.completedJobs.length ?? 0) >= 3,
  },
  {
    id: 'travailleur',
    emoji: '💪',
    name: 'Travailleur',
    description: '10 boulots terminés',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.completedJobs.length ?? 0) >= 10,
  },
  {
    id: 'super_hero',
    emoji: '🦸',
    name: 'Super héros',
    description: '25 boulots terminés',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.completedJobs.length ?? 0) >= 25,
  },
  {
    id: 'eclair',
    emoji: '⚡',
    name: 'Éclair',
    description: 'Boulot terminé en moins de 24h après acceptation',
    hidden: false,
    condition: (state) =>
      state.jobs.some((j) => {
        if (!j.acceptedAt || !j.completedAt) return false
        const diff = new Date(j.completedAt).getTime() - new Date(j.acceptedAt).getTime()
        return diff < 24 * 3600 * 1000
      }),
  },
  {
    id: 'en_feu',
    emoji: '🔥',
    name: 'En feu',
    description: 'Boulots terminés sur 4 semaines consécutives',
    hidden: false,
    condition: (state) => {
      const weeks = new Set(
        state.jobs
          .filter((j) => j.completedAt)
          .map((j) => isoWeek(j.completedAt!))
      )
      if (weeks.size < 4) return false
      const sorted = Array.from(weeks).sort()
      let streak = 1
      for (let i = 1; i < sorted.length; i++) {
        const [y1, w1] = sorted[i - 1].split('-W').map(Number)
        const [y2, w2] = sorted[i].split('-W').map(Number)
        const weekNum1 = y1 * 53 + w1
        const weekNum2 = y2 * 53 + w2
        if (weekNum2 - weekNum1 === 1) {
          streak++
          if (streak >= 4) return true
        } else {
          streak = 1
        }
      }
      return false
    },
  },

  // --- Épargne ---
  {
    id: 'sur_la_bonne_voie',
    emoji: '📈',
    name: 'Sur la bonne voie',
    description: '50% d\'un objectif atteint',
    hidden: false,
    condition: (state) =>
      state.goals.some(
        (g) => g.targetAmount > 0 && g.currentAmount / g.targetAmount >= 0.5
      ),
  },
  {
    id: 'dans_la_cible',
    emoji: '🏁',
    name: 'Dans la cible',
    description: 'Premier objectif complété',
    hidden: false,
    condition: (state) =>
      state.goals.some((g) => g.currentAmount >= g.targetAmount && g.targetAmount > 0),
  },
  {
    id: 'aigle',
    emoji: '🦅',
    name: 'Aigle',
    description: '3 objectifs complétés',
    hidden: false,
    condition: (state) =>
      state.goals.filter((g) => g.currentAmount >= g.targetAmount && g.targetAmount > 0).length >= 3,
  },
  {
    id: 'ambitieux',
    emoji: '🌟',
    name: 'Ambitieux',
    description: '3 objectifs actifs simultanément',
    hidden: false,
    condition: (state) =>
      state.goals.filter((g) => g.currentAmount < g.targetAmount).length >= 3,
  },

  // --- Milestones financiers ---
  {
    id: 'premier_euro',
    emoji: '💵',
    name: 'Premier euro',
    description: 'Solde ≥ 1 €',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.balance ?? 0) >= 1,
  },
  {
    id: 'petit_epargnant',
    emoji: '🏦',
    name: 'Petit épargnant',
    description: 'Solde ≥ 20 €',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.balance ?? 0) >= 20,
  },
  {
    id: 'bonne_pioche',
    emoji: '💰',
    name: 'Bonne pioche',
    description: 'Solde ≥ 50 €',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.balance ?? 0) >= 50,
  },
  {
    id: 'presque_riche',
    emoji: '🤑',
    name: 'Presque riche',
    description: 'Solde ≥ 100 €',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.balance ?? 0) >= 100,
  },
  {
    id: 'legende',
    emoji: '💎',
    name: 'Légende',
    description: 'Revenus totaux ≥ 200 €',
    hidden: false,
    condition: (_state, _visitDays, ctx) => (ctx?.totalIncome ?? 0) >= 200,
  },

  // --- Régularité ---
  {
    id: 'fidele',
    emoji: '📅',
    name: 'Fidèle',
    description: '7 jours de visite distincts',
    hidden: false,
    condition: (_state, visitDays) => visitDays.length >= 7,
  },
  {
    id: 'habitue',
    emoji: '🗓️',
    name: 'Habitué',
    description: '30 jours de visite distincts',
    hidden: false,
    condition: (_state, visitDays) => visitDays.length >= 30,
  },
  {
    id: 'sage_du_mois',
    emoji: '🧠',
    name: 'Sage du mois',
    description: 'Revenus > dépenses ce mois',
    hidden: false,
    condition: (state) => {
      const now = new Date()
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      const monthTx = state.transactions.filter((tx) => tx.date.startsWith(monthStr))
      const income = monthTx.filter((tx) => tx.type === 'income').reduce((a, tx) => a + tx.amount, 0)
      const expense = monthTx.filter((tx) => tx.type === 'expense').reduce((a, tx) => a + tx.amount, 0)
      return income > 0 && income > expense
    },
  },

  // --- Secrets ---
  {
    id: 'licorne',
    emoji: '🦄',
    name: 'Licorne',
    description: 'Objectif + boulot terminé + dépense le même jour',
    hidden: true,
    condition: (state) => {
      const completedGoalDays = new Set(
        state.goals
          .filter((g) => g.currentAmount >= g.targetAmount && g.targetAmount > 0)
          .map((g) => toDay(g.createdAt))
      )
      const completedJobDays = new Set(
        state.jobs.filter((j) => j.completedAt).map((j) => toDay(j.completedAt!))
      )
      const expenseDays = new Set(
        state.transactions.filter((tx) => tx.type === 'expense').map((tx) => toDay(tx.date))
      )
      for (const day of completedGoalDays) {
        if (completedJobDays.has(day) && expenseDays.has(day)) return true
      }
      return false
    },
  },
  {
    id: 'pirate',
    emoji: '🏴‍☠️',
    name: 'Pirate',
    description: 'Solde repassé ≥ 0 après avoir été négatif',
    hidden: true,
    condition: (state) => {
      const sorted = [...state.transactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      let balance = 0
      let wasNegative = false
      for (const tx of sorted) {
        balance += tx.type === 'income' ? tx.amount : -tx.amount
        if (balance < 0) wasNegative = true
        if (wasNegative && balance >= 0) return true
      }
      return false
    },
  },
  {
    id: 'coup_de_chance',
    emoji: '🎲',
    name: 'Coup de chance',
    description: 'Récompense d\'un boulot est un nombre rond ≥ 5 €',
    hidden: true,
    condition: (state) =>
      state.jobs.some((j) => j.reward >= 5 && j.reward % 5 === 0),
  },
]

export function computeNewBadges(
  state: AppState,
  unlockedIds: Set<string>,
  visitDays: string[]
): string[] {
  const ctx = buildBadgeContext(state)
  const newIds: string[] = []
  for (const badge of BADGE_DEFINITIONS) {
    if (unlockedIds.has(badge.id)) continue
    try {
      if (badge.condition(state, visitDays, ctx)) {
        newIds.push(badge.id)
      }
    } catch {
      // ignore errors in badge conditions
    }
  }
  return newIds
}
