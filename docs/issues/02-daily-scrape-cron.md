# Automate daily scraping (cron / GitHub Action)

**Labels:** `scraper`, `infra`, `priority: critical`  
**Milestone:** MVP — usable in Bangalore

## Problem
The feed goes stale unless someone manually runs `npm run scrape`. For Trackr to be useful, data must refresh daily.

## Tasks
- [ ] Add GitHub Action (or Vercel Cron) that runs on schedule (e.g. 6 AM IST daily)
- [ ] Action runs: `npm run scrape` then `npm run archive`
- [ ] Decide where scraped data lives in prod (same Postgres as app)
- [ ] Log scrape results (created / updated / errors) in Action output
- [ ] Optional: notify on failure (email or Telegram)

## Acceptance criteria
- Scrapers run automatically without manual intervention
- Devfolio + college scrapers update prod DB daily
- Past events get archived after scrape

## Commands today
```bash
npm run scrape
npm run archive
```
