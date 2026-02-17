# Mon petit porte monnaie 💰

Application web locale pour aider les collégiens à gérer leur argent de poche de manière ludique et pédagogique.

## Fonctionnalités

### 🏠 Tableau de bord
- Affichage du solde actuel avec messages encourageants
- Actions rapides pour ajouter revenus et dépenses
- **Cartes d'objectifs complètes directement sur la page d'accueil** (jusqu'à 3 objectifs affichés)
- Aperçu des dernières transactions
- Création rapide d'objectifs depuis le dashboard

### 💸 Gestion des transactions
- Ajouter des revenus (argent de poche, cadeaux, etc.)
- Enregistrer des dépenses (nourriture, jeux, loisirs, etc.)
- Catégories prédéfinies avec icônes colorées
- Filtrage par type et catégorie
- Modification et suppression de transactions

### 🎯 Objectifs d'épargne
- Créer des objectifs avec montant cible
- Suivre la progression avec barres colorées
- Ajouter de l'argent aux objectifs depuis le solde
- Animation de célébration à l'atteinte d'un objectif
- Icônes personnalisables
- **Affichage direct sur la page d'accueil pour un suivi facile**

### 💼 Petits Boulots (NOUVEAU !)
- **Mode Adulte** : Proposer des petits boulots avec récompense (corvées, garde d'animaux, etc.)
- **Mode Enfant** : Accepter et compléter les boulots proposés
- Système de statuts : Disponible → En cours → Terminé
- Récompenses automatiquement ajoutées au solde une fois le boulot complété
- Icônes personnalisables pour chaque boulot
- Gestion complète (création, modification, suppression)

### 💾 Sauvegarde des données
- Auto-sauvegarde locale toutes les 500ms
- Export des données en JSON
- Import de données avec fusion ou remplacement
- Tout fonctionne hors ligne (pas de serveur requis)

## Installation

### Prérequis
- Node.js version 18 ou supérieure
- npm (installé avec Node.js)

### Étapes d'installation

1. Ouvrir un terminal dans le dossier du projet

2. Installer les dépendances :
```bash
npm install
```

3. L'installation est terminée !

## Utilisation

### Lancer l'application

#### Méthode 1 : Avec npm (recommandé)
```bash
npm run dev
```

L'application sera accessible dans votre navigateur à l'adresse : **http://localhost:5173**

#### Méthode 2 : Avec le script de lancement (Windows)
Double-cliquer sur le fichier **`start-app.bat`**

Une fenêtre de terminal s'ouvrira et l'application démarrera automatiquement.

### Arrêter l'application

Dans le terminal, appuyer sur **Ctrl + C**

## Créer une version de production

Pour créer une version optimisée de l'application :

```bash
npm run build
```

Les fichiers générés seront dans le dossier **`dist/`**. Vous pouvez ouvrir le fichier `dist/index.html` directement dans un navigateur.

## Structure du projet

```
sport4young/
├── public/              # Assets statiques
├── src/
│   ├── components/      # Composants React
│   │   ├── dashboard/   # Page d'accueil
│   │   ├── transactions/# Gestion des transactions
│   │   ├── goals/       # Objectifs d'épargne
│   │   ├── layout/      # En-tête et navigation
│   │   └── shared/      # Composants réutilisables
│   ├── context/         # Gestion d'état global
│   ├── hooks/           # Hooks personnalisés
│   ├── types/           # Définitions TypeScript
│   ├── utils/           # Fonctions utilitaires
│   ├── constants/       # Constantes (catégories, etc.)
│   ├── App.tsx          # Composant principal
│   └── main.tsx         # Point d'entrée
├── index.html           # Page HTML principale
├── package.json         # Configuration npm
└── README.md           # Ce fichier

```

## Guide d'utilisation pour l'utilisateur final

### Première utilisation

1. Lancer l'application
2. Le solde est à 0€ - c'est normal !
3. Cliquer sur **"💰 Ajouter un Revenu"** pour commencer

### Ajouter un revenu

1. Cliquer sur le bouton vert **"Ajouter un Revenu"**
2. Saisir le montant (ex: 10.00)
3. Sélectionner une catégorie (ex: "Argent de poche")
4. Ajouter un libellé (ex: "Argent de poche hebdomadaire")
5. Cliquer sur **"Ajouter"**

### Enregistrer une dépense

1. Cliquer sur le bouton rouge **"Ajouter une Dépense"**
2. Saisir le montant (ex: 5.00)
3. Sélectionner une catégorie (ex: "Nourriture & Snacks")
4. Ajouter un libellé (ex: "McDo avec les copains")
5. Cliquer sur **"Ajouter"**

### Créer un objectif d'épargne

Depuis la page d'accueil :
1. Cliquer sur **"➕ Créer un objectif"** sur la page d'accueil
2. Donner un nom (ex: "Nouveau vélo")
3. Définir le montant cible (ex: 200.00)
4. Choisir une icône
5. Cliquer sur **"Créer"**

Ou depuis l'onglet Objectifs :
1. Aller dans l'onglet **"Objectifs"**
2. Suivre les mêmes étapes

### Économiser pour un objectif

1. S'assurer d'avoir de l'argent dans le solde
2. Sur la carte de l'objectif (page d'accueil ou onglet Objectifs), cliquer sur **"➕ Ajouter de l'argent"**
3. Saisir le montant à mettre de côté
4. Cliquer sur **"Confirmer"**

L'argent est transféré du solde vers l'objectif. Quand l'objectif est atteint, une animation de célébration apparaît ! 🎉

### Proposer un petit boulot (pour les adultes)

1. Aller dans l'onglet **"Petits boulots"**
2. Basculer en **"Mode Adulte"** (bouton en haut à droite)
3. Cliquer sur **"➕ Proposer un boulot"**
4. Remplir le formulaire :
   - Titre (ex: "Sortir les poubelles")
   - Description (ex: "Sortir les poubelles tous les mardis")
   - Récompense en euros (ex: 2.00)
   - Choisir une icône
5. Cliquer sur **"Créer"**

Le boulot apparaît maintenant comme "Disponible" pour l'enfant.

### Accepter et compléter un boulot (pour les enfants)

1. Aller dans l'onglet **"Petits boulots"**
2. S'assurer d'être en **"Mode Enfant"**
3. Voir les boulots disponibles
4. Cliquer sur **"Accepter ce boulot"**
5. Le boulot passe en statut "En cours"
6. Une fois le boulot terminé, cliquer sur **"✓ Marquer comme terminé"**
7. Confirmer dans le dialogue
8. La récompense est automatiquement ajoutée au solde !

Le boulot passe en statut "Terminé" et une transaction de revenu est créée automatiquement.

### Sauvegarder ses données

Les données sont automatiquement sauvegardées dans le navigateur.

Pour faire une sauvegarde manuelle :
1. Cliquer sur **"💾 Exporter"** en haut à droite
2. Un fichier JSON sera téléchargé
3. Conserver ce fichier en lieu sûr

### Restaurer des données

1. Cliquer sur **"📂 Importer"** en haut à droite
2. Sélectionner le fichier JSON précédemment exporté
3. Choisir de **remplacer** ou **fusionner** les données
4. Confirmer

## Technologies utilisées

- **React 18** : Framework JavaScript moderne
- **TypeScript** : Typage statique pour un code robuste
- **Vite** : Outil de build ultra-rapide
- **Tailwind CSS** : Framework CSS utilitaire
- **Lucide React** : Icônes modernes
- **date-fns** : Gestion des dates
- **uuid** : Génération d'identifiants uniques

## Personnalisation

### Modifier les catégories

Éditer le fichier `src/constants/categories.ts` pour ajouter ou modifier les catégories de revenus et dépenses.

### Changer les couleurs

Éditer le fichier `tailwind.config.js` pour personnaliser la palette de couleurs.

## Dépannage

### L'application ne démarre pas
- Vérifier que Node.js est installé : `node --version`
- Réinstaller les dépendances : `npm install`

### Les données ont disparu
- Vérifier que le localStorage du navigateur n'a pas été vidé
- Restaurer depuis un export JSON si disponible

### Erreur lors de l'import
- Vérifier que le fichier JSON est valide
- S'assurer qu'il provient bien d'un export de l'application

## Licence

Ce projet est fourni à titre éducatif.

## Support

Pour toute question ou problème, consulter la documentation ou contacter le développeur.

---

**Fait avec ❤️ pour apprendre à gérer son argent de poche !**
