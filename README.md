# Achat Location — Plateforme SaaS Immobilière Mondiale

Plateforme intermédiaire sécurisée entre clients (recherche de biens) et propriétaires (location/vente).

## Stack

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS** + **DaisyUI** (thèmes: dark, luxury, business, corporate, coffee, cyberpunk)
- **Prisma** + PostgreSQL
- **Redis** + BullMQ
- **Argon2id** + JWT + Refresh Tokens
- **Stripe** + Mobile Money (abstraction)
- **ElasticSearch** (recherche)
- **S3** (stockage)
- **Sentry** (monitoring)
- **Docker**

## Règles absolues

- Client et propriétaire **ne s'échangent jamais** leurs coordonnées hors plateforme
- Toutes les transactions passent par la plateforme (commission)
- Super Admin a contrôle total
- Identité propriétaire masquée jusqu'à validation

## Démarrage

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env
# Éditer .env et renseigner au minimum DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 3. Lancer PostgreSQL + Redis (+ ElasticSearch)
docker compose up -d

# 4. Base de données
npx prisma migrate dev --name init

# 5. Seed (Super Admin, propriétaires, clients, biens demo)
npm run seed

# 6. Lancer l'app
npm run dev
```

## Comptes demo (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | superadmin@achat-location.com | Demo123!@# |
| Propriétaire | owner1@demo.com | Demo123!@# |
| Client | client1@demo.com | Demo123!@# |

## Super Admin

URL secrète : `/ss91-admin-global`

## Structure

```
src/
├── app/           # App Router, pages, API
├── components/    # Composants UI
├── context/       # Auth, Theme
├── hooks/         # useProperties, useFavorites
├── lib/           # Prisma, auth, Stripe, S3, Redis, etc.
worker/            # BullMQ worker
prisma/            # Schema + seed
```

## Backup DB

```bash
pg_dump -U postgres achat_location > backup_$(date +%Y%m%d).sql
```

## Production

- Configurer Sentry (SENTRY_DSN)
- Configurer Stripe (clés réelles)
- Configurer S3
- HSTS, CSP, cookies sécurisés (déjà en place)
- Variables d'environnement sensibles via secrets

---

**Achat Location** — Immobilier mondial, sécurisé.
