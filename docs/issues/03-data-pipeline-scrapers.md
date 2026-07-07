# Data pipeline — scrapers, cron, attendable-only ingest

**Labels:** `scraper`, `infra`, `priority: high`  
**Milestone:** Data coverage

## Goal
Fresh, accurate event data without manual work. One pipeline for all sources — not separate issues per platform or college.

## Tasks

### Automation
- [ ] GitHub Action or Vercel Cron: daily `npm run scrape` + `npm run archive`
- [ ] Log created/updated/errors per run
- [ ] Optional: alert on scrape failure

### Platform scrapers (implement or finish)
| Source | Status | Notes |
|--------|--------|-------|
| Devfolio | ✅ Done | Open hackathons, reg deadline |
| PES events portal | ✅ Done | Template for HTML fest pages |
| Unstop (college filter) | ✅ Partial | Paginate + org name matching |
| Unstop (general Bangalore) | ❌ Stub | `src/scrapers/sources/unstop.ts` |
| Meetup | ❌ Stub | GDG, PyData, React BLR — needs API key |
| Devpost | ❌ | National + filter Bangalore |
| MLH | ❌ | Local Hack Day events |
| HackerEarth | ❌ | Hiring challenges + hackathons |
| Co-working boards | ❌ | 91springboard, etc. |

### Generic college fest parser pattern
- [ ] Reusable HTML parser (like `pes-events.ts`) configurable per `eventSourceUrl`
- [ ] Works for **any** college on the master list — not hardcoded to one campus
- [ ] Config: `{ slug, listingUrl, detailUrlPattern, collegeSlug }`
- [ ] Unstop AMP fallback for any org URL on the master list

### Ingest rules (all sources)
- [ ] Only import if registration deadline ≥ now
- [ ] Skip ended events
- [ ] Dedup via existing fuzzy title + date + location pipeline
- [ ] Upsert by `externalId` + refresh deadlines on re-scrape

## Acceptance criteria
- Scrapers run daily without manual intervention
- New Bangalore hackathon on Devfolio/Unstop appears within 24h
- Zero past or closed-registration events in feed

## Files
- `src/scrapers/`
- `scripts/scrape.ts`
- `scripts/archive-past.ts`
