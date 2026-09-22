# wakeel.connect

Pakistan ka verified lawyer marketplace — oladoc-style, wakeel kay context mei.
Monorepo: Next.js frontend + Fastify API + Prisma/PostgreSQL.

## Structure

```
wakeel-connect-v2/
  frontend/        Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4
  backend/         Fastify 5 + TypeScript + Prisma 6 + PostgreSQL
    prisma/
      schema.prisma        Domain model (source of truth)
      migrations/          SQL migrations (incl. DB-level guards)
      seed.ts              Reference data + clearly-marked demo lawyers
    src/
      server.ts            Fastify app entry
      lib/prisma.ts        Prisma client singleton
  docker-compose.yml       Local PostgreSQL 16 for development
```

## Quick start (local dev)

Prerequisites: Node.js 20+, Docker (for the local database).

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env        # fill in DATABASE_URL (compose defaults work as-is)
npm install
npx prisma migrate dev      # creates DB + applies migrations
npm run prisma:seed         # cities, practice areas, languages, demo lawyers
npm run dev                 # http://localhost:4000  →  GET /health

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:3000
```

## Conventions (non-negotiable)

- **Money:** integer paisa (`feePaisa`), never floats. Snapshot amounts on booking/payment rows.
- **Timestamps:** UTC in the database; display in `Asia/Karachi` in app code.
- **PII:** CNIC is stored as `cnicHash` only — never plaintext. Verification documents live in private storage, referenced by `storageKey`, served through signed URLs.
- **History:** financial and legal records are never cascade-deleted.
- **Seed data:** demo lawyers carry `isSeedData = true` and must never be presented as real verified lawyers.
- **Secrets:** `.env` files are gitignored. Copy `.env.example` and fill locally.

## Deployment (plan)

- **Launch (free tiers):** frontend → Vercel, API → Render, PostgreSQL → Supabase, Cloudflare (free) in front for DNS/CDN/security. Only cost: `.com` domain.
- **After revenue:** Hostinger VPS (Docker Compose: Next.js + Fastify + Postgres + Nginx + Let's Encrypt).

See `../goals/wakeel-connect-development/REBUILD_PLAN.md` for the full product plan.
