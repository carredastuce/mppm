import { createClient } from '@supabase/supabase-js'
import { AppState, Transaction, Goal, Job } from '../types'

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

export function generateFamilyCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

export async function pushStateToCloud(code: string, state: AppState): Promise<void> {
  if (!supabase) return
  try {
    await supabase
      .from('family_data')
      .upsert({ family_code: code, state, updated_at: new Date().toISOString() })
  } catch (err) {
    console.warn('[sync] push failed:', err)
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

// Merge par entité :
// - jobs : remote gagne (parent est authoritative)
// - transactions, goals : local gagne (enfant est authoritative)
// - parentSettings : remote gagne
function mergeById<T extends { id: string }>(local: T[], remote: T[], remoteWins: boolean): T[] {
  const map = new Map<string, T>()
  if (remoteWins) {
    local.forEach((item) => map.set(item.id, item))
    remote.forEach((item) => map.set(item.id, item))
  } else {
    remote.forEach((item) => map.set(item.id, item))
    local.forEach((item) => map.set(item.id, item))
  }
  return Array.from(map.values())
}

export function mergeStates(local: AppState, remote: AppState): AppState {
  // Combiner les IDs supprimés des deux côtés pour propager les suppressions
  const allDeletedIds = new Set([
    ...(local.deletedItemIds || []),
    ...(remote.deletedItemIds || []),
  ])

  return {
    jobs: mergeById<Job>(local.jobs, remote.jobs, true).filter((j) => !allDeletedIds.has(j.id)),
    transactions: mergeById<Transaction>(local.transactions, remote.transactions, false).filter((t) => !allDeletedIds.has(t.id)),
    goals: mergeById<Goal>(local.goals, remote.goals, false).filter((g) => !allDeletedIds.has(g.id)),
    parentSettings: remote.parentSettings ?? local.parentSettings,
    linkedFamilyCode: local.linkedFamilyCode ?? remote.linkedFamilyCode,
    deletedItemIds: Array.from(allDeletedIds),
  }
}
