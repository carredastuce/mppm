# Plan : Espace Parent - Mon Petit Porte Monnaie

## Contexte

L'application MPPM est une app React/TypeScript locale pour apprendre aux enfants a gerer leur argent de poche. Actuellement, le systeme de Jobs a un toggle "Mode Adulte/Enfant" peu securise. L'objectif est de creer un **Espace Parent** complet et protege par code PIN, qui remplace entierement l'interface enfant quand il est actif.

**Choix du user** : PIN 4 chiffres | Pack complet | Acces via icone dans le header

---

## Phase 1 : Fondation (PIN + mode switching + shell parent)

### 1.1 Etendre les types
**Fichier** : `src/types/index.ts`

- Ajouter `ParentSettings` (pinHash, childName, spendingWarningThreshold?, allowance?)
- Ajouter `Allowance` (amount, frequency: 'weekly'|'monthly', isActive, lastPaidDate, createdAt)
- Ajouter `ParentTab` type union
- Etendre `AppState` avec `parentSettings?: ParentSettings`
- Ajouter actions : `SET_PARENT_SETTINGS`, `UPDATE_PARENT_SETTINGS`

### 1.2 Mettre a jour le reducer
**Fichier** : `src/context/AppReducer.ts`

- Ajouter cases `SET_PARENT_SETTINGS` et `UPDATE_PARENT_SETTINGS`
- Mettre a jour `initialState` avec `parentSettings: undefined`

### 1.3 Utilitaire PIN
**Nouveau fichier** : `src/utils/pin.ts`

- `hashPin(pin)` : hash simple (app locale, pas besoin de crypto forte)
- `verifyPin(input, storedHash)` : comparaison
- `validatePin(pin)` : verifie que c'est 4 chiffres

### 1.4 Composant PinModal
**Nouveau fichier** : `src/components/parent/PinModal.tsx`

- Deux modes : `setup` (creation + confirmation) et `login` (saisie)
- 4 inputs individuels numeriques avec auto-focus au suivant
- Utilise le composant `Modal` existant
- Messages d'erreur en francais

### 1.5 ParentNavigation
**Nouveau fichier** : `src/components/parent/ParentNavigation.tsx`

- 5 onglets : Tableau de bord, Argent de poche, Petits boulots, Historique, Parametres
- Style adulte : palette slate/indigo, pas d'emojis, icones Lucide
- Meme structure que `Navigation.tsx` existant

### 1.6 ParentHeader
**Nouveau fichier** : `src/components/parent/ParentHeader.tsx`

- Titre "Espace Parent" + nom de l'enfant si defini
- Bouton "Retour mode enfant" bien visible
- Gradient slate sombre pour differencier visuellement

### 1.7 Placeholders des pages parent
**Nouveaux fichiers** :
- `src/components/parent/ParentDashboard.tsx`
- `src/components/parent/ParentAllowance.tsx`
- `src/components/parent/ParentJobs.tsx`
- `src/components/parent/ParentHistory.tsx`
- `src/components/parent/ParentSettings.tsx`

### 1.8 Modifier App.tsx pour le mode switching
**Fichier** : `src/App.tsx`

- Ajouter etats : `isParentMode`, `showPinModal`, `parentTab`
- Handler `handleParentAccess` : verifie si PIN existe, ouvre PinModal en mode setup ou login
- Rendu conditionnel : si parent mode → ParentHeader + ParentNavigation + pages parent ; sinon → interface enfant actuelle
- Passer `onParentAccess` au Header enfant

### 1.9 Ajouter icone cadenas dans le Header enfant
**Fichier** : `src/components/layout/Header.tsx`

- Ajouter prop `onParentAccess`
- Icone `Lock` (lucide) discrete, opacity 40% → 100% au hover
- Positionnee a cote du titre ou des boutons

---

## Phase 2 : Tableau de bord parent

### 2.1 Fonctions de calcul avancees
**Fichier** : `src/utils/calculations.ts`

- `calculateSpendingThisWeek/Month(transactions)`
- `calculateIncomeThisWeek/Month(transactions)`
- `calculateCategoryBreakdown(transactions, type)` → top categories de depenses

### 2.2 Implementation ParentDashboard
**Fichier** : `src/components/parent/ParentDashboard.tsx`

- **Carte solde** : solde actuel + revenus du mois + depenses du mois (3 colonnes)
- **Tendances** : comparaison semaine courante avec barres de progression (reutiliser `ProgressBar`)
- **Resume objectifs** : liste des objectifs avec barres de progression (reutiliser `calculateGoalProgress`)
- **Resume jobs** : compteurs disponibles/en cours/termines
- **Transactions recentes** : 5 dernieres transactions

---

## Phase 3 : Gestion des Jobs cote parent

### 3.1 Implementation ParentJobs
**Fichier** : `src/components/parent/ParentJobs.tsx`

- Toujours en mode creation/edition/suppression (pas de toggle)
- Stats en haut : jobs crees, termines, total gagne par l'enfant
- Reutiliser `JobForm` existant via `Modal`
- Reutiliser `JobCard` avec `isAdultMode={true}`

### 3.2 Simplifier JobsList enfant
**Fichier** : `src/components/jobs/JobsList.tsx`

- Supprimer le state `isAdultMode` et le bouton toggle
- Supprimer le bouton "Proposer un boulot"
- L'enfant ne voit que les jobs disponibles/en cours/termines sans pouvoir en creer
- Message d'etat vide adapte : "Demande a tes parents d'en proposer dans l'espace parent !"

---

## Phase 4 : Historique complet des transactions

### 4.1 Utilitaire de recherche
**Nouveau fichier** : `src/utils/search.ts`

- `searchTransactions(transactions, query)` : recherche dans label, category, notes

### 4.2 Implementation ParentHistory
**Fichier** : `src/components/parent/ParentHistory.tsx`

- Barre de recherche textuelle
- Filtres type + categorie (reutiliser le pattern de `TransactionFilters`)
- Liste complete des transactions avec suppression possible
- Bouton "Ajouter une transaction" (reutiliser `TransactionForm` existant)
- Pagination "Voir plus" (20 par page)

---

## Phase 5 : Systeme d'argent de poche recurrent

### 5.1 Logique de calcul des versements dus
**Nouveau fichier** : `src/utils/allowance.ts`

- `calculateDueAllowances(allowance)` : genere les transactions manquees depuis `lastPaidDate`
- `getNextDueDate(allowance)` : prochaine date de versement
- Utilise `date-fns` (addWeeks, addMonths, isBefore)

### 5.2 Traitement auto au chargement de l'app
**Fichier** : `src/context/AppContext.tsx`

- Apres `LOAD_STATE`, verifier si des versements sont dus
- Si oui, creer les transactions d'argent de poche automatiquement
- Mettre a jour `lastPaidDate`

### 5.3 Implementation ParentAllowance
**Fichier** : `src/components/parent/ParentAllowance.tsx`

- **Carte statut** : actif/inactif, montant, frequence, prochaine date
- **Formulaire de configuration** : montant (Input), frequence (radio hebdo/mensuel)
- **Controles** : bouton pause/reprise, bouton editer
- **Historique** : liste des versements passes (filtres par categorie "Argent de poche")

---

## Phase 6 : Parametres et controles parentaux

### 6.1 Implementation ParentSettings
**Fichier** : `src/components/parent/ParentSettings.tsx`

Sections :
- **Prenom de l'enfant** : input texte → `parentSettings.childName`
- **Seuil d'alerte** : montant en dessous duquel l'enfant voit un avertissement
- **Changer le PIN** : verification ancien PIN puis creation nouveau
- **Export/Import donnees** : reutiliser `exportToJSON`/`importFromJSON` de `src/utils/storage.ts`
- **Reinitialiser** : double confirmation puis `RESET_STATE`

### 6.2 Afficher le prenom dans le Header enfant
**Fichier** : `src/components/layout/Header.tsx`

- Si `childName` defini, afficher "Le porte-monnaie de {prenom}" au lieu du titre generique

### 6.3 Alerte de solde bas sur le Dashboard enfant
**Fichier** : `src/components/dashboard/Dashboard.tsx`

- Si seuil defini et solde < seuil → banniere d'avertissement amicale

### 6.4 Deplacer Export/Import du Header enfant vers les Parametres parent
**Fichier** : `src/components/layout/Header.tsx`

- Supprimer les boutons Export/Import du header enfant (ces fonctions sont desormais dans l'espace parent)

---

## Fichiers impactes - Resume

| Nouveaux fichiers (11) | But |
|---|---|
| `src/utils/pin.ts` | Hash et validation PIN |
| `src/utils/allowance.ts` | Calcul versements recurrents |
| `src/utils/search.ts` | Recherche dans les transactions |
| `src/components/parent/PinModal.tsx` | Modal de saisie/creation PIN |
| `src/components/parent/ParentHeader.tsx` | Header mode parent |
| `src/components/parent/ParentNavigation.tsx` | Navigation mode parent |
| `src/components/parent/ParentDashboard.tsx` | Tableau de bord parent |
| `src/components/parent/ParentAllowance.tsx` | Gestion argent de poche |
| `src/components/parent/ParentJobs.tsx` | Gestion jobs cote parent |
| `src/components/parent/ParentHistory.tsx` | Historique complet |
| `src/components/parent/ParentSettings.tsx` | Parametres parentaux |

| Fichiers modifies (7) | Changements |
|---|---|
| `src/types/index.ts` | Nouveaux types + actions |
| `src/context/AppReducer.ts` | Nouveaux cases reducer |
| `src/context/AppContext.tsx` | Auto-versement argent de poche |
| `src/App.tsx` | Mode switching parent/enfant |
| `src/components/layout/Header.tsx` | Icone cadenas, prenom, suppression export/import |
| `src/components/jobs/JobsList.tsx` | Suppression toggle adulte |
| `src/components/dashboard/Dashboard.tsx` | Alerte solde bas |
| `src/utils/calculations.ts` | Fonctions de calcul avancees |

---

## Verification

1. **PIN** : lancer l'app, cliquer sur l'icone cadenas → creation PIN → acces espace parent → quitter → re-entrer avec PIN
2. **Dashboard parent** : verifier que les stats correspondent aux donnees enfant
3. **Jobs** : creer un job en mode parent → verifier qu'il apparait cote enfant → l'enfant l'accepte et le complete → verifier les stats parent
4. **Historique** : recherche textuelle + filtres + ajout/suppression de transaction
5. **Argent de poche** : configurer un versement hebdo → changer la date systeme ou simuler → verifier que les transactions sont auto-creees au reload
6. **Parametres** : changer le prenom → verifier le header enfant ; definir seuil → verifier l'alerte ; changer PIN → verifier l'acces
7. **Persistance** : recharger la page a chaque etape pour verifier que tout est sauvegarde en localStorage
