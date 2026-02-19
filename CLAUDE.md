# Notes projet MPPM

## TODO - À traiter plus tard

### Amélioration 4 — Sécurité Supabase / Row Level Security (RLS)

Le code famille (6 caractères) est la seule "authentification" pour accéder aux données.
N'importe qui connaissant un code peut lire et écraser les données financières de l'enfant via `upsert`.

Actions à mener :
- Vérifier que les Row Level Security (RLS) policies sont correctement configurées côté Supabase
- Envisager une authentification plus robuste (token par appareil, signature, etc.)
- Éventuellement limiter les opérations possibles par rôle (lecture seule côté enfant, écriture côté parent)
