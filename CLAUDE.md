# Notes projet MPPM

## TODO - À traiter plus tard

### Amélioration 4 — Sécurité Supabase / Row Level Security (RLS)

Le code famille (6 caractères) est la seule "authentification" pour accéder aux données.
N'importe qui connaissant un code peut lire et écraser les données financières de l'enfant via `upsert`.

Actions à mener :
- Vérifier que les Row Level Security (RLS) policies sont correctement configurées côté Supabase
- Envisager une authentification plus robuste (token par appareil, signature, etc.)
- Éventuellement limiter les opérations possibles par rôle (lecture seule côté enfant, écriture côté parent)

### Idées fonctionnalités — Revue produit

#### Haute valeur / Facile
- **Notifications visuelles** : bandeau "1 nouveau boulot" / "Job validé, +5€" au retour de l'enfant
- **Date limite sur les jobs** : champ `dueDate` optionnel, compte à rebours, pastille "urgent"
- **Historique argent de poche côté enfant** : "Prochain versement : lundi, 5€" sur le dashboard
- **Graphique évolution du solde** : courbe sur le mois/semaine, côté parent ET enfant

#### Haute valeur / Effort modéré
- **Multi-enfants** : gérer plusieurs profils enfants depuis un seul espace parent
- **Budget par catégorie** : "Max 10€/mois en Jeux & Jouets" avec suivi
- **Badges / récompenses** : "Premier objectif", "10 jobs", "100€ économisés", etc.
- **Jobs récurrents** : jobs hebdo/quotidiens qui réapparaissent automatiquement

#### Valeur éducative
- **Besoins vs Envies** : taguer les dépenses, camembert de répartition
- **Épargne automatique** : "20% de l'argent de poche → objectif Vélo"
- **Simulateur "Et si..."** : "3€/semaine = vélo dans X semaines"

#### Confort / QoL
- **Mode sombre**
- **Choix de la devise** (actuellement hardcodé EUR)
- **Corbeille / Undo** : restauration pendant 7 jours
- **Export PDF** : résumé mensuel lisible pour le parent
