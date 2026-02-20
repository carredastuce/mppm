import { createClient } from '@supabase/supabase-js'
import { AppState, Transaction, Goal, Job, ParentSettings, DeletedIds } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Supabase est optionnel : si les clés ne sont pas configurées, la sync est silencieusement désactivée
const isConfigured = supabaseUrl && supabaseAnonKey &&
  !supabaseUrl.includes('VOTRE_PROJECT_ID') &&
  !supabaseAnonKey.includes('votre_cle_anon')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Caractères sans ambiguïté (pas 0, O, 1, I, L)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

// Bug 4 fix : génère un code unique en vérifiant qu'il n'existe pas déjà
export async function generateFamilyCode(): Promise<string> {
  const MAX_ATTEMPTS = 5
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
    }
    if (!supabase) return code
    const { data } = await supabase
      .from('family_data')
      .select('family_code')
      .eq('family_code', code)
      .maybeSingle()
    if (!data) return code
  }
  throw new Error('Impossible de générer un code unique, veuillez réessayer.')
}

// Bug 1 fix : hash léger de l'état pour détecter les changements réels
export function hashState(state: AppState): string {
  const significant = {
    t: state.transactions.map((t) => t.id).sort(),
    g: state.goals.map((g) => `${g.id}:${g.currentAmount}`).sort(),
    j: state.jobs.map((j) => `${j.id}:${j.status}:${j.frequency || 'once'}`).sort(),
    dt: [...(state.deletedIds?.transactions || [])].sort(),
    dg: [...(state.deletedIds?.goals || [])].sort(),
    dj: [...(state.deletedIds?.jobs || [])].sort(),
    ps: state.parentSettings ? {
      cn: state.parentSettings.childName,
      sw: state.parentSettings.spendingWarningThreshold,
      a: state.parentSettings.allowance,
      fc: state.parentSettings.familyCode,
    } : null,
    lfc: state.linkedFamilyCode,
  }
  return JSON.stringify(significant)
}

// Amél 3 : retire les données sensibles (pinHash) avant le push cloud
function sanitizeForCloud(state: AppState): AppState {
  if (!state.parentSettings) return state
  const { pinHash, ...safeSettings } = state.parentSettings
  return {
    ...state,
    parentSettings: safeSettings as ParentSettings,
  }
}

// Amél 1 : retry avec backoff exponentiel
const MAX_RETRIES = 3
const BASE_DELAY = 1000

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, BASE_DELAY * Math.pow(2, attempt)))
      }
    }
  }
  throw lastError
}

// Amél 1 : retourne un booléen de succès
export async function pushStateToCloud(code: string, state: AppState): Promise<boolean> {
  if (!supabase) return false
  try {
    const cleanState = sanitizeForCloud(state)
    await withRetry(async () => {
      const { error } = await supabase!
        .from('family_data')
        .upsert({ family_code: code, state: cleanState, updated_at: new Date().toISOString() })
      if (error) throw error
    })
    return true
  } catch (err) {
    console.warn('[sync] push failed after retries:', err)
    return false
  }
}

export async function pullStateFromCloud(code: string): Promise<AppState | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('family_data')
      .select('state')
      .eq('family_code', code)
      .single()
    if (error || !data) return null
    return data.state as AppState
  } catch (err) {
    console.warn('[sync] pull failed:', err)
    return null
  }
}

// Bug 3 fix : supprimer les données cloud lors de la désactivation
export async function deleteFromCloud(code: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('family_data').delete().eq('family_code', code)
  } catch (err) {
    console.warn('[sync] delete failed:', err)
  }
}

export function subscribeToFamily(
  code: string,
  onUpdate: (state: AppState) => void
): () => void {
  if (!supabase) return () => {}

  const channel = supabase
    .channel(`family:${code}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'family_data',
        filter: `family_code=eq.${code}`,
      },
      (payload) => {
        const newState = (payload.new as { state: AppState })?.state
        if (newState) onUpdate(newState)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// Merge par entité avec gestion des suppressions via tombstones.
// Les IDs présents dans deletedIds sont exclus du résultat final,
// ce qui empêche un item supprimé localement de revenir depuis le cloud.
function mergeById<T extends { id: string }>(
  local: T[],
  remote: T[],
  remoteWins: boolean,
  deletedIds: string[]
): T[] {
  const deletedSet = new Set(deletedIds)
  const map = new Map<string, T>()

  if (remoteWins) {
    // Remote autoritaire : on part de local puis on écrase avec remote
    local.forEach((item) => map.set(item.id, item))
    remote.forEach((item) => map.set(item.id, item))
  } else {
    // Local autoritaire : on part de remote puis on écrase avec local
    remote.forEach((item) => map.set(item.id, item))
    local.forEach((item) => map.set(item.id, item))
  }

  // Filtrer les items supprimés (tombstones)
  return Array.from(map.values()).filter((item) => !deletedSet.has(item.id))
}

function mergeDeletedIds(local: DeletedIds | undefined, remote: DeletedIds | undefined): DeletedIds {
  const merge = (a: string[] = [], b: string[] = []) => Array.from(new Set([...a, ...b]))
  return {
    transactions: merge(local?.transactions, remote?.transactions),
    goals: merge(local?.goals, remote?.goals),
    jobs: merge(local?.jobs, remote?.jobs),
  }
}

// Bug 7 fix : purge les deleted IDs qui ne correspondent à aucun élément existant
// Garde les IDs récents pour la propagation cross-device, mais limite la taille
const MAX_DELETED_PER_LIST = 200

function purgeDeletedList(deletedIds: string[], existingIds: Set<string>): string[] {
  // Garder les IDs qui bloquent encore un élément existant
  const relevant: string[] = []
  const rest: string[] = []
  for (const id of deletedIds) {
    if (existingIds.has(id)) {
      relevant.push(id)
    } else {
      rest.push(id)
    }
  }
  // Garder aussi les IDs récents pour la propagation cross-device
  const remaining = MAX_DELETED_PER_LIST - relevant.length
  if (remaining > 0) {
    relevant.push(...rest.slice(-remaining))
  }
  return relevant
}

export function mergeStates(local: AppState, remote: AppState): AppState {
  const mergedDeletedIds = mergeDeletedIds(local.deletedIds, remote.deletedIds)

  const mergedJobs = mergeById<Job>(local.jobs, remote.jobs, true, mergedDeletedIds.jobs)
  const mergedTransactions = mergeById<Transaction>(local.transactions, remote.transactions, false, mergedDeletedIds.transactions)
  const mergedGoals = mergeById<Goal>(local.goals, remote.goals, false, mergedDeletedIds.goals)

  // Bug 7 : purger les IDs de suppression qui ne servent plus
  const purgedDeletedIds: DeletedIds = {
    transactions: purgeDeletedList(mergedDeletedIds.transactions, new Set(mergedTransactions.map((t) => t.id))),
    goals: purgeDeletedList(mergedDeletedIds.goals, new Set(mergedGoals.map((g) => g.id))),
    jobs: purgeDeletedList(mergedDeletedIds.jobs, new Set(mergedJobs.map((j) => j.id))),
  }

  // Amél 3 : préserver le pinHash local (il n'est pas dans le remote cloud)
  const mergedParentSettings = remote.parentSettings || local.parentSettings
    ? {
        ...local.parentSettings,
        ...remote.parentSettings,
        pinHash: local.parentSettings?.pinHash || remote.parentSettings?.pinHash || '',
      }
    : undefined

  return {
    jobs: mergedJobs,
    transactions: mergedTransactions,
    goals: mergedGoals,
    parentSettings: mergedParentSettings,
    linkedFamilyCode: local.linkedFamilyCode ?? remote.linkedFamilyCode,
    deletedIds: purgedDeletedIds,
  }
}
