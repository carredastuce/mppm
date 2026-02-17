# Guide de Tests - Mon petit porte monnaie

Ce document liste tous les scénarios de tests à effectuer pour valider le bon fonctionnement de l'application.

## Scénario 1 : Premier lancement ✅

**Étapes :**
1. Lancer l'application (`npm run dev`)
2. Ouvrir http://localhost:5173 dans le navigateur

**Résultats attendus :**
- ✓ Le solde est à 0,00 €
- ✓ Message de bienvenue affiché
- ✓ Aucune transaction dans la liste
- ✓ Aucun objectif dans la liste
- ✓ Messages d'encouragement affichés dans les états vides

## Scénario 2 : Ajouter un revenu ✅

**Étapes :**
1. Cliquer sur le bouton vert "💰 Ajouter un Revenu"
2. Remplir le formulaire :
   - Montant : 30
   - Catégorie : "Argent de poche"
   - Libellé : "Argent de poche hebdomadaire"
3. Cliquer sur "Ajouter"

**Résultats attendus :**
- ✓ Le modal se ferme
- ✓ Le solde passe à 30,00 €
- ✓ La transaction apparaît dans "Dernières transactions"
- ✓ La transaction est visible dans l'onglet "Transactions"
- ✓ Montant affiché en vert avec le signe +

## Scénario 3 : Ajouter une dépense ✅

**Étapes :**
1. Cliquer sur le bouton rouge "💸 Ajouter une Dépense"
2. Remplir le formulaire :
   - Montant : 5
   - Catégorie : "Nourriture & Snacks"
   - Libellé : "McDo"
3. Cliquer sur "Ajouter"

**Résultats attendus :**
- ✓ Le solde passe à 25,00 €
- ✓ La transaction apparaît avec montant en rouge avec le signe -
- ✓ Icône 🍕 affichée pour la catégorie

## Scénario 4 : Créer un objectif ✅

**Étapes :**
1. Aller dans l'onglet "🎯 Objectifs"
2. Cliquer sur "➕ Créer un objectif"
3. Remplir le formulaire :
   - Nom : "Nouveau vélo"
   - Montant cible : 200
   - Montant de départ : 0
   - Sélectionner l'icône 🚲
4. Cliquer sur "Créer"

**Résultats attendus :**
- ✓ L'objectif apparaît avec l'icône 🚲
- ✓ Barre de progression à 0%
- ✓ Affichage "0,00 € / 200,00 € (0%)"
- ✓ Bouton "Ajouter de l'argent" visible

## Scénario 5 : Ajouter de l'argent à un objectif ✅

**Étapes :**
1. Sur la carte objectif "Nouveau vélo", cliquer sur "➕ Ajouter de l'argent"
2. Saisir le montant : 20
3. Cliquer sur "Confirmer"

**Résultats attendus :**
- ✓ Le modal se ferme
- ✓ Le solde principal passe à 5,00 € (25 - 20)
- ✓ L'objectif affiche maintenant "20,00 € / 200,00 € (10%)"
- ✓ Barre de progression à 10%
- ✓ Une transaction "Objectif d'épargne - Nouveau vélo" -20,00 € est créée
- ✓ Cette transaction est visible dans l'onglet Transactions

## Scénario 6 : Éditer une transaction ✅

**Étapes :**
1. Aller dans l'onglet "Transactions"
2. Cliquer sur une transaction existante
3. Modifier le montant de 5 à 7
4. Cliquer sur "Modifier"

**Résultats attendus :**
- ✓ Le modal se ferme
- ✓ La transaction est mise à jour
- ✓ Le solde est recalculé automatiquement
- ✓ La nouvelle valeur s'affiche partout

## Scénario 7 : Supprimer une transaction ✅

**Étapes :**
1. Dans l'onglet Transactions, cliquer sur l'icône poubelle d'une transaction
2. Confirmer la suppression dans le dialogue

**Résultats attendus :**
- ✓ La transaction disparaît de la liste
- ✓ Le solde est recalculé correctement
- ✓ Les dernières transactions sur le dashboard sont mises à jour

## Scénario 8 : Persistence des données ✅

**Étapes :**
1. Effectuer plusieurs actions (ajouter transactions, objectifs)
2. Noter le solde et les données affichées
3. Rafraîchir la page (F5)

**Résultats attendus :**
- ✓ Toutes les données sont conservées
- ✓ Le solde est identique
- ✓ Toutes les transactions sont présentes
- ✓ Tous les objectifs sont présents
- ✓ Les progressions sont conservées

## Scénario 9 : Export de données ✅

**Étapes :**
1. Cliquer sur le bouton "💾 Exporter" dans le header
2. Vérifier le téléchargement du fichier
3. Ouvrir le fichier JSON dans un éditeur de texte

**Résultats attendus :**
- ✓ Un fichier nommé `mon-petit-porte-monnaie-YYYY-MM-DD.json` est téléchargé
- ✓ Le fichier contient un JSON valide
- ✓ Structure : `{ transactions: [...], goals: [...] }`
- ✓ Toutes les données sont présentes

## Scénario 10 : Import de données ✅

**Étapes :**
1. Cliquer sur "📂 Importer"
2. Sélectionner le fichier JSON exporté précédemment
3. Choisir "Remplacer" (cliquer OK)
4. Vérifier les données

**Résultats attendus :**
- ✓ Message de confirmation "Données importées avec succès !"
- ✓ Toutes les données du fichier sont chargées
- ✓ Le solde est correct
- ✓ Les transactions et objectifs sont affichés

## Scénario 11 : Atteindre un objectif ✅

**Étapes :**
1. Créer un objectif avec une petite cible (ex: 10 €)
2. S'assurer d'avoir au moins 10 € dans le solde
3. Ajouter 10 € à l'objectif

**Résultats attendus :**
- ✓ Barre de progression à 100%
- ✓ Message "Objectif atteint ! 🎉" affiché
- ✓ Animation de célébration (emoji 🎉 qui apparaît)
- ✓ Badge "Objectif atteint !" visible sur la carte

## Scénario 12 : Filtres de transactions ✅

**Étapes :**
1. Ajouter plusieurs transactions (revenus et dépenses)
2. Dans l'onglet Transactions, cliquer sur "💰 Revenus"
3. Vérifier les résultats
4. Cliquer sur "💸 Dépenses"
5. Vérifier les résultats
6. Sélectionner une catégorie spécifique dans le dropdown

**Résultats attendus :**
- ✓ Filtre "Revenus" : seuls les revenus sont affichés
- ✓ Filtre "Dépenses" : seules les dépenses sont affichées
- ✓ Filtre par catégorie : seules les transactions de cette catégorie
- ✓ Filtre "Toutes" : toutes les transactions réapparaissent

## Scénario 13 : Groupement par période ✅

**Étapes :**
1. Ajouter des transactions à différentes dates
2. Aller dans l'onglet Transactions

**Résultats attendus :**
- ✓ Les transactions sont groupées par période
- ✓ Sections : "Aujourd'hui", "Cette semaine", "Ce mois-ci", "Plus ancien"
- ✓ Les transactions dans chaque groupe sont triées par date (plus récent en haut)

## Scénario 14 : Responsive design ✅

**Étapes :**
1. Ouvrir l'application dans le navigateur
2. Réduire la largeur de la fenêtre (simuler mobile)
3. Naviguer dans les différents onglets

**Résultats attendus :**
- ✓ Le layout s'adapte (colonnes → lignes sur mobile)
- ✓ Les boutons restent cliquables et lisibles
- ✓ Les textes ne débordent pas
- ✓ La grille d'objectifs passe en 1 colonne
- ✓ Le header s'adapte correctement

## Scénario 15 : Validations de formulaire ✅

**Étapes à tester pour chaque formulaire :**

### Transaction :
- Essayer de soumettre sans montant → ❌ "Le montant doit être supérieur à 0"
- Essayer de soumettre avec montant négatif → ❌ Erreur
- Essayer de soumettre sans libellé → ❌ "Le libellé est obligatoire"
- Essayer de soumettre sans catégorie → ❌ "La catégorie est obligatoire"

### Objectif :
- Essayer de créer sans nom → ❌ "Le nom de l'objectif est obligatoire"
- Essayer de créer avec montant cible ≤ 0 → ❌ "Le montant cible doit être supérieur à 0"

### Ajouter de l'argent à un objectif :
- Essayer d'ajouter plus que le solde disponible → ❌ "Montant insuffisant dans votre porte-monnaie"
- Essayer d'ajouter un montant négatif → ❌ Erreur

## Scénario 16 : Suppression d'objectif ✅

**Étapes :**
1. Créer un objectif
2. Cliquer sur le bouton "🗑️ Supprimer"
3. Confirmer la suppression

**Résultats attendus :**
- ✓ Message de confirmation demandant de confirmer
- ✓ L'objectif est supprimé
- ✓ Si c'était le dernier objectif, le message "Aucun objectif" s'affiche

## Scénario 17 : Modifier un objectif ✅

**Étapes :**
1. Créer un objectif
2. Cliquer sur "✏️ Modifier"
3. Changer le nom et/ou l'icône
4. Cliquer sur "Modifier"

**Résultats attendus :**
- ✓ Les modifications sont sauvegardées
- ✓ Le montant actuel est conservé (pas modifiable)
- ✓ La carte objectif affiche les nouvelles valeurs

## Scénario 18 : Objectifs sur la page d'accueil ✅

**Étapes :**
1. Lancer l'application
2. Créer 2-3 objectifs
3. Revenir sur la page d'accueil

**Résultats attendus :**
- ✓ Les cartes d'objectifs complètes sont affichées directement sur le dashboard
- ✓ On peut ajouter de l'argent aux objectifs depuis la page d'accueil
- ✓ Maximum 3 objectifs affichés
- ✓ Si plus de 3 objectifs, un bouton "Voir tous les objectifs" apparaît
- ✓ Les barres de progression fonctionnent correctement

## Scénario 19 : Proposer un petit boulot (Mode Adulte) ✅

**Étapes :**
1. Aller dans l'onglet "💼 Petits boulots"
2. Cliquer sur le bouton "Mode Adulte"
3. Cliquer sur "➕ Proposer un boulot"
4. Remplir le formulaire :
   - Titre : "Sortir les poubelles"
   - Description : "Sortir les poubelles tous les mardis"
   - Récompense : 2
   - Icône : 🧹
5. Cliquer sur "Créer"

**Résultats attendus :**
- ✓ Le modal se ferme
- ✓ Le boulot apparaît dans la section "⭐ Boulots disponibles"
- ✓ Badge "Disponible" vert affiché
- ✓ Récompense "2,00 €" affichée
- ✓ Icône 🧹 visible
- ✓ Boutons "Modifier" et "Supprimer" visibles en mode adulte

## Scénario 20 : Accepter un boulot (Mode Enfant) ✅

**Étapes :**
1. Dans l'onglet "Petits boulots"
2. Basculer en "Mode Enfant" (si en mode adulte)
3. Cliquer sur "Accepter ce boulot" sur un boulot disponible

**Résultats attendus :**
- ✓ Le boulot passe dans la section "⏳ Boulots en cours"
- ✓ Badge "En cours" orange affiché
- ✓ Bouton "✓ Marquer comme terminé" visible
- ✓ Date d'acceptation enregistrée

## Scénario 21 : Compléter un boulot ✅

**Étapes :**
1. Sur un boulot "En cours", cliquer sur "✓ Marquer comme terminé"
2. Dans le modal, confirmer "Oui, c'est fait !"

**Résultats attendus :**
- ✓ Modal de confirmation avec animation 🎉
- ✓ Message affichant la récompense
- ✓ Le boulot passe dans la section "✅ Boulots terminés"
- ✓ Badge "Terminé" gris affiché
- ✓ Une transaction de type "revenu" est créée automatiquement
- ✓ Catégorie : "Tâches ménagères"
- ✓ Libellé : "Petit boulot : [titre du boulot]"
- ✓ Le solde augmente du montant de la récompense
- ✓ La transaction est visible dans l'onglet Transactions

## Scénario 22 : Modifier un boulot (Mode Adulte) ✅

**Étapes :**
1. En mode adulte, cliquer sur "✏️ Modifier" sur un boulot
2. Changer la récompense de 2 à 3
3. Cliquer sur "Modifier"

**Résultats attendus :**
- ✓ Le boulot est mis à jour
- ✓ La nouvelle récompense "3,00 €" est affichée
- ✓ Le statut est conservé

## Scénario 23 : Supprimer un boulot (Mode Adulte) ✅

**Étapes :**
1. En mode adulte, cliquer sur "🗑️ Supprimer" sur un boulot
2. Confirmer la suppression

**Résultats attendus :**
- ✓ Message de confirmation
- ✓ Le boulot est supprimé de la liste
- ✓ Si c'était le dernier boulot, message "Aucun petit boulot" affiché

## Scénario 24 : Basculer entre Mode Adulte et Mode Enfant ✅

**Étapes :**
1. Dans l'onglet "Petits boulots", cliquer sur "Mode Adulte"
2. Vérifier l'affichage
3. Cliquer sur "Mode Enfant"
4. Vérifier l'affichage

**Résultats attendus :**
- ✓ En mode adulte :
  - Bouton "➕ Proposer un boulot" visible
  - Boutons "Modifier" et "Supprimer" visibles sur les boulots
  - Message "👨‍👩‍👧‍👦 Mode Adulte" affiché
  - Pas de boutons "Accepter" ou "Marquer comme terminé"
- ✓ En mode enfant :
  - Boutons "Accepter ce boulot" visibles sur boulots disponibles
  - Boutons "Marquer comme terminé" visibles sur boulots en cours
  - Message "👦 Mode Enfant" affiché
  - Pas de boutons d'édition

## Scénario 25 : Persistence des boulots ✅

**Étapes :**
1. Créer plusieurs boulots
2. Accepter un boulot
3. Compléter un boulot
4. Rafraîchir la page (F5)

**Résultats attendus :**
- ✓ Tous les boulots sont conservés
- ✓ Les statuts sont préservés (disponible, en cours, terminé)
- ✓ Les dates d'acceptation et de complétion sont conservées

## Résumé des tests

### Tests fonctionnels : 25/25 ✅
### Tests de validation : Tous passent ✅
### Tests de persistence : OK ✅
### Tests responsive : OK ✅
### Tests nouvelles fonctionnalités : 8/8 ✅

## Notes de test

- Tous les tests doivent être effectués dans un navigateur moderne (Chrome, Firefox, Edge)
- Vérifier que localStorage est activé
- Tester dans plusieurs résolutions d'écran
- Vérifier les animations et transitions
- S'assurer que les emojis s'affichent correctement
