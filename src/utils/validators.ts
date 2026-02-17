export function validateTransactionAmount(amount: number): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Le montant doit être supérieur à 0'
  }
  return null
}

export function validateTransactionLabel(label: string): string | null {
  if (!label || label.trim().length === 0) {
    return 'Le libellé est obligatoire'
  }
  if (label.trim().length > 100) {
    return 'Le libellé ne peut pas dépasser 100 caractères'
  }
  return null
}

export function validateGoalName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return "Le nom de l'objectif est obligatoire"
  }
  if (name.trim().length > 50) {
    return "Le nom ne peut pas dépasser 50 caractères"
  }
  return null
}

export function validateGoalAmount(amount: number): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Le montant cible doit être supérieur à 0'
  }
  return null
}

export function validateGoalCurrentAmount(amount: number): string | null {
  if (isNaN(amount) || amount < 0) {
    return 'Le montant de départ ne peut pas être négatif'
  }
  return null
}

export function validateAddToGoal(amount: number, balance: number): string | null {
  if (isNaN(amount) || amount <= 0) {
    return 'Le montant doit être supérieur à 0'
  }
  if (amount > balance) {
    return 'Montant insuffisant dans votre porte-monnaie'
  }
  return null
}
