# Changelog - Mon petit porte monnaie

## Version 2.0.0 - 2026-02-13

### 🎉 Nouvelles fonctionnalités majeures

#### 💼 Section "Petits Boulots"
Une toute nouvelle fonctionnalité permettant aux adultes de proposer des petits boulots rémunérés aux enfants !

**Fonctionnalités :**
- **Mode Adulte** :
  - Proposer des petits boulots avec titre, description et récompense
  - Modifier les boulots existants
  - Supprimer des boulots
  - Icônes personnalisables (10 icônes disponibles : 🧹, 🐕, 🐈, 🌱, 🚗, 📦, 🍳, 🧺, 🪟, 🎨)

- **Mode Enfant** :
  - Voir tous les boulots disponibles
  - Accepter un boulot (passe en statut "En cours")
  - Marquer un boulot comme terminé
  - Recevoir automatiquement la récompense dans le solde

- **Système de statuts** :
  - 🌟 **Disponible** : Boulot proposé, en attente d'acceptation
  - ⏳ **En cours** : Boulot accepté par l'enfant
  - ✅ **Terminé** : Boulot complété, récompense versée

- **Intégration complète** :
  - Création automatique d'une transaction de revenu lors de la complétion
  - Catégorie : "Tâches ménagères"
  - Libellé : "Petit boulot : [titre]"
  - Persistence dans localStorage
  - Export/Import JSON compatible

#### 🎯 Objectifs sur la page d'accueil
Les objectifs d'épargne sont maintenant affichés directement sur la page d'accueil !

**Améliorations :**
- Affichage des **cartes d'objectifs complètes** sur le dashboard (3 premiers objectifs)
- Gestion directe depuis la page d'accueil :
  - Ajouter de l'argent à un objectif
  - Modifier un objectif
  - Supprimer un objectif
- Bouton "Créer un objectif" directement accessible
- Si plus de 3 objectifs : bouton "Voir tous les objectifs" pour accéder à la page complète
- Plus besoin d'aller dans l'onglet Objectifs pour gérer ses économies !

### ✨ Améliorations

- Nouveau type `Job` dans le système de types TypeScript
- 5 nouvelles actions dans le reducer :
  - `ADD_JOB` : Ajouter un boulot
  - `UPDATE_JOB` : Modifier un boulot
  - `DELETE_JOB` : Supprimer un boulot
  - `ACCEPT_JOB` : Accepter un boulot
  - `COMPLETE_JOB` : Compléter un boulot et créer la transaction

- Nouvel onglet dans la navigation : 💼 **Petits boulots**
- 3 nouveaux composants :
  - `JobForm` : Formulaire de création/édition de boulot
  - `JobCard` : Carte d'affichage d'un boulot avec actions
  - `JobsList` : Liste complète avec gestion des modes

### 🔧 Corrections techniques

- Gestion de la rétrocompatibilité pour l'import JSON (les anciens fichiers sans jobs sont supportés)
- Mise à jour du Dashboard pour afficher les objectifs complets
- Mise à jour de l'AppState pour inclure `jobs: Job[]`
- Import/Export mis à jour pour inclure les jobs

### 📚 Documentation

- README.md mis à jour avec :
  - Documentation de la section Petits Boulots
  - Guide d'utilisation Mode Adulte / Mode Enfant
  - Instructions pour proposer, accepter et compléter un boulot

- TESTS.md enrichi avec 8 nouveaux scénarios de test :
  - Test #18 : Objectifs sur la page d'accueil
  - Test #19 : Proposer un petit boulot (Mode Adulte)
  - Test #20 : Accepter un boulot (Mode Enfant)
  - Test #21 : Compléter un boulot
  - Test #22 : Modifier un boulot (Mode Adulte)
  - Test #23 : Supprimer un boulot (Mode Adulte)
  - Test #24 : Basculer entre Mode Adulte et Mode Enfant
  - Test #25 : Persistence des boulots

---

## Version 1.0.0 - 2026-02-13

### 🎉 Lancement initial

Première version de l'application "Mon petit porte monnaie" !

**Fonctionnalités :**
- 💰 Gestion du solde
- 💸 Transactions (revenus et dépenses)
- 🎯 Objectifs d'épargne
- 📊 Dashboard avec aperçu
- 💾 Auto-sauvegarde localStorage
- 📂 Export/Import JSON
- 🎨 Design ludique et coloré
- 📱 Responsive (mobile, tablette, desktop)

**Technologies :**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react
- date-fns
- uuid

---

**Note** : Toutes les données sont stockées localement dans le navigateur. Pensez à exporter régulièrement vos données pour faire des sauvegardes !
