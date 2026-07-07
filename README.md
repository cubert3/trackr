# Trackr

Hyperlocal hackathon and tech event finder — **Bangalore first**, built to expand across India.

Unlike Unstop-style national aggregators, Trackr focuses on the dense, chaotic local scene: campus fests (RVCE, PES, BMSCE), Indiranagar/Koramangala meetups, HSR co-working hackathons, and events that only exist on WhatsApp.

## What's built (Phase 1–2)

- **Event feed** — Bangalore events with filters by category, locality, college, search
- **25 seeded events** — campus hackathons, GDG/PyData meetups, co-working demo days
- **Crowdsourcing** — "Add event nearby" with OTP verification and moderation queue
- **Dedup pipeline** — fuzzy title + date + location matching for scraped and submitted events
- **Scraper framework** — stub adapters for Unstop, Devfolio, Meetup, college fest pages
- **India-ready schema** — cities table with Bangalore active; Mumbai, Delhi, Hyderabad, etc. ready to activate

## Quick start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run db:seed` | Seed Bangalore cities, colleges, 25 events |
| `npm run scrape` | Run all scrapers (stubs until implemented) |
| `npm run db:studio` | Open Prisma Studio |

## Crowdsourcing flow

1. User fills form at `/submit`
2. OTP sent to email/phone (logged to console in dev)
3. Submission enters **pending queue** (`EventSubmission` table)
4. Admin approves via API:

```bash
# List pending
curl -H "x-admin-key: dev-admin-key-change-me" http://localhost:3000/api/admin/submissions

# Approve
curl -X PATCH -H "x-admin-key: dev-admin-key-change-me" \
  -H "Content-Type: application/json" \
  -d '{"id":"<submission-id>","action":"approve"}' \
  http://localhost:3000/api/admin/submissions
```

Approved submissions become live events with `sourceType: CROWDSOURCED` and award submitter points.

## Architecture

```
src/
├── app/              # Next.js pages + API routes
├── components/       # Event cards, filters, submit form
├── lib/              # Prisma, OTP, dedup, event queries
└── scrapers/         # Source adapters + upsert pipeline
prisma/
├── schema.prisma     # Events, cities, colleges, submissions, users
└── seed.ts           # Bangalore seed data
```

### Data model highlights

- **City** — `slug`, `isActive` (only Bangalore active now)
- **Event** — normalized schema regardless of source; `sourceType` + `submittedBy`
- **EventSubmission** — pending queue before going live
- **User** — trust score + points for gamification (Phase 4)

## Build roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Scraper + DB + seed data | Done |
| 2 | Submission + OTP + moderation | Done |
| 3 | College tagging, trending feed, Telegram bot | Next |
| 4 | Ambassador program, gamification, past-edition notes | Planned |
| 5 | Team-finding board, organizer accounts, geo expansion | Planned |

## Expanding beyond Bangalore

1. Add events/sources for a new city
2. Set `isActive: true` on the city in the database
3. Implement city-specific scrapers in `src/scrapers/sources/`
4. Recruit campus scouts (same playbook as Bangalore)

Cities already in schema (inactive): Mumbai, Delhi NCR, Hyderabad, Chennai, Pune.

## Environment

```env
DATABASE_URL="file:./dev.db"
ADMIN_KEY="your-secret-key"
```

For production OTP: replace console logging in `src/lib/otp.ts` with Twilio, MSG91, or Resend.

## Sources to implement (Phase 1 scrapers)

**National:** Unstop, Devfolio, Devpost, MLH, HackerEarth

**Bangalore-specific:**
- College fest pages: RVCE, PES, BMSCE, MSRIT, IIIT-B, Christ, DSCE
- Co-working: 91springboard, WeWork, NASSCOM 10000 Startups
- Meetup: GDG Bangalore, PyData, React Bangalore
- Instagram / WhatsApp → crowdsourcing (hardest to scrape, highest value)
