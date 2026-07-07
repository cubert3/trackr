# Deploy Trackr to production (Vercel + Postgres)

**Labels:** `infra`, `priority: critical`  
**Milestone:** MVP — usable in Bangalore

## Problem
Trackr only runs locally on SQLite. Nobody can use it until it's deployed with a real database.

## Tasks
- [ ] Create Vercel project connected to GitHub repo
- [ ] Provision Postgres (Vercel Postgres, Neon, or Supabase)
- [ ] Set production env vars:
  - `DATABASE_URL` (Postgres connection string)
  - `ADMIN_KEY` (strong random secret)
- [ ] Update Prisma for production (`prisma db push` or migrations against Postgres)
- [ ] Verify build passes on Vercel (`npm run build`)
- [ ] Run initial scrape + seed colleges/cities on prod DB
- [ ] Smoke test: homepage loads, event detail works, `/submit` works

## Acceptance criteria
- Public URL loads the Bangalore feed
- Events persist across redeploys (not SQLite file)
- `.env` secrets are not in the repo

## Notes
- SQLite (`prisma/dev.db`) does not work on serverless — Postgres is required
- Keep a separate dev `.env` for local SQLite if you want
