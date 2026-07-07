# Geographic expansion — Mumbai, Hyderabad, Delhi (after Bangalore)

**Labels:** `growth`, `scraper`, `priority: low`  
**Milestone:** Scale

## Problem
Schema supports multiple cities but only Bangalore is active. Expanding too early creates a thin national feed — the opposite of Trackr's value prop.

## Prerequisites (do NOT start until all are true)
- [ ] Bangalore feed has 20+ attendable events consistently
- [ ] Daily scrape cron running
- [ ] At least 3 campus scouts active in Bangalore
- [ ] Crowdsourcing flow working in prod

## Tasks (per city)
- [ ] Set `City.isActive = true` in DB
- [ ] Add colleges for that city to seed/schema
- [ ] Implement 2–3 city-specific scrapers (college fests, local Meetup groups)
- [ ] Recruit 3–5 campus scouts in that city
- [ ] City switcher in header UI
- [ ] Repeat distribution playbook from Bangalore launch issue

## Cities already in schema (inactive)
- Mumbai, Delhi NCR, Hyderabad, Chennai, Pune

## Acceptance criteria
- New city has its own dense feed, not a re-export of Bangalore events
- Each city has ≥1 working scraper source + crowdsourcing
