export const INCOME_CATEGORIES = [
  'Argent de poche',
  'Cadeau',
  'Tâches ménagères',
  "Argent d'anniversaire",
  'Autre revenu',
] as const

export const EXPENSE_CATEGORIES = [
  'Nourriture & Snacks',
  'Jeux & Jouets',
  'Livres & BD',
  "Objectif d'épargne",
  'Cadeau pour les autres',
  'Loisirs',
  'Autre dépense',
] as const

export const CATEGORY_ICONS: Record<string, string> = {
  // Revenus
  'Argent de poche': '💰',
  'Cadeau': '🎁',
  'Tâches ménagères': '🧹',
  "Argent d'anniversaire": '🎂',
  'Autre revenu': '💵',
  // Dépenses
  'Nourriture & Snacks': '🍕',
  'Jeux & Jouets': '🎮',
  'Livres & BD': '📚',
  "Objectif d'épargne": '🎯',
  'Cadeau pour les autres': '🎁',
  'Loisirs': '🎪',
  'Autre dépense': '💸',
}
