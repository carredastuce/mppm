import { AppState } from '../types'

const STORAGE_KEY = 'mon-petit-porte-monnaie-data'

export function saveToLocalStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données', error)
  }
}

export function loadFromLocalStorage(): AppState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      // Migration : normaliser les champs pour les anciennes versions
      return {
        transactions: data.transactions || [],
        goals: data.goals || [],
        jobs: data.jobs || [],
        parentSettings: data.parentSettings,
        linkedFamilyCode: data.linkedFamilyCode,
        deletedItemIds: data.deletedItemIds || [],
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données', error)
  }
  return null
}

export function exportToJSON(state: AppState): void {
  try {
    const dataStr = JSON.stringify(state, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `mon-petit-porte-monnaie-${date}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Erreur lors de l'export des données", error)
    alert("Erreur lors de l'export des données")
  }
}

export function importFromJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validation basique de la structure
        if (!data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Format de fichier invalide : transactions manquantes')
        }
        if (!data.goals || !Array.isArray(data.goals)) {
          throw new Error('Format de fichier invalide : objectifs manquants')
        }

        resolve(data)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'))
    }

    reader.readAsText(file)
  })
}
