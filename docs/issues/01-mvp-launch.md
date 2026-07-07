# MVP launch — deploy, auth, admin, live data

**Labels:** `infra`, `priority: critical`  
**Milestone:** MVP

## Goal
Get Trackr on a public URL with real auth and moderation so other people can actually use it.

## Tasks

### Deploy & database
- [ ] Deploy to Vercel (or similar) connected to GitHub
- [ ] Postgres in production (Neon / Vercel Postgres / Supabase) — SQLite is dev-only
- [ ] Set prod env: `DATABASE_URL`, `ADMIN_KEY` (strong secret)
- [ ] `prisma db push` against prod, seed cities/colleges structure only

### Real OTP
- [ ] Replace console OTP in `src/lib/otp.ts` with MSG91 / Twilio / Resend
- [ ] Rate-limit OTP sends

### Admin moderation UI
- [ ] `/admin` page — list pending submissions, approve/reject
- [ ] Uses existing `GET/PATCH /api/admin/submissions`
- [ ] No curl for day-to-day moderation

### Live data (not demo seed)
- [ ] Run `npm run scrape` on prod after deploy
- [ ] Strip fake placeholder events from `prisma/seed.ts` — keep cities/colleges only
- [ ] Manually add real events if feed is thin after first scrape

### Repo hygiene
- [ ] Update README (what's actually built today)
- [ ] Add `.env.example`
- [ ] Gitignore `prisma/*.db`

## Acceptance criteria
- Public URL, events load, submit flow works with real OTP
- Admin can approve a submission in <30 seconds
- Feed is mostly scraped/crowdsourced, not fake seed titles
