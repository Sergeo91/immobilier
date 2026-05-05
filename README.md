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

### Commande tout-en-un (recommandée)

Une fois les dépendances installées et Docker disponible :

```bash
npm run setup:dev && npm run dev
```

Équivalent “manuel” (copie `.env` seulement s’il manque, puis Docker + migrations + seed + dev) :

```bash
npm install && ([ -f .env ] || cp .env.example .env) && docker compose up -d && npx prisma migrate dev --name init && npm run seed && npm run dev
```

Le script npm `setup:dev` fait la partie setup jusqu’au seed (sans lancer `next dev`) :

```bash
npm run setup:dev
```

## GitHub : plusieurs comptes avec `gh` (GitHub CLI)

### Installation

Sur macOS (Homebrew) :

```bash
brew install gh
```

### Se connecter / changer de compte

Connexion interactive (navigateur ou token) :

```bash
gh auth login
```

Vérifier quel compte est actif :

```bash
gh auth status
```

Se déconnecter du compte courant sur GitHub.com :

```bash
gh auth logout -h github.com
```

Puis se reconnecter avec l’autre compte :

```bash
gh auth login
```

(Optionnel mais utile) dire à Git d’utiliser `gh` comme aide aux credentials HTTPS :

```bash
gh auth setup-git
```

Astuce : si tu pushes souvent vers **deux comptes différents**, garde des dépôts distincts (`origin` vers le compte “principal”) et ajoute un second remote pour l’autre compte.

### Pousser vers le bon dépôt (cas fréquent : 403)

Si tu vois `Permission denied ... denied to <userA>` alors que le repo appartient à `<userB>`, c’est presque toujours un problème de **remote** ou de **session GitHub**.

Vérifier où pointe `origin` :

```bash
git remote -v
```

Basculer `origin` vers ton fork / ton user :

```bash
git remote set-url origin git@github.com:TON_USER/TON_REPO.git
```

Ou ajouter un second remote :

```bash
git remote add perso git@github.com:TON_USER/TON_REPO.git
git push -u perso main
```

### HTTPS vs SSH (choix à prendre une fois)

- **HTTPS** : `gh auth login` configure souvent Git Credential Manager ; pratique sur une machine perso.
- **SSH** : configure une clé SSH dans GitHub ; très stable pour les pushes répétés.

Tester SSH :

```bash
ssh -T git@github.com
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
