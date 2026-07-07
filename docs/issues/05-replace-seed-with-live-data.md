# Replace demo seed data with live scraped events

**Labels:** `scraper`, `data`, `priority: high`  
**Milestone:** MVP — usable in Bangalore

## Problem
The feed still includes ~25 hand-written demo events from `prisma/seed.ts`. Users can tell the difference between fake and real listings — that kills trust.

## Tasks
- [ ] Run `npm run scrape` on prod and confirm real Devfolio + college events appear
- [ ] Remove or drastically reduce fake events in `prisma/seed.ts`
- [ ] Keep seed for: cities, colleges, inactive city stubs (structure only)
- [ ] Delete `[EXPIRED]` test event from seed
- [ ] Document in README: `db:seed` = structure only, `scrape` = live events
- [ ] Manually add 10–15 real events you know about if scrapers are thin

## Acceptance criteria
- Homepage shows mostly scraped/crowdsourced events with real registration links
- Seed script does not create placeholder hackathon titles
- Empty feed never happens on first deploy (either scrape or manual seed)

## Files
- `prisma/seed.ts`
- `scripts/scrape.ts`
