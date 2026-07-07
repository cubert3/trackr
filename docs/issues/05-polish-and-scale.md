# Product polish & multi-city scale

**Labels:** `feature`, `ux`, `growth`  
**Milestone:** Scale

## Goal
Trust signals and geographic expansion — only after Bangalore works.

## Feed polish (do anytime)
- [ ] "Last scraped X hours ago" on homepage
- [ ] Bookmark / save events
- [ ] "Closing in 24h" urgency on cards (partially done)
- [ ] Map view by locality (Indiranagar, Koramangala, HSR, etc.)

## City expansion (do later — prerequisites below)

**Do not start until:**
- Bangalore has 20+ attendable events consistently
- Daily scrape cron running
- Crowdsourcing + scouts working
- 3+ active campus scouts

**Then per city:**
- [ ] Activate city in DB (`Mumbai`, `Hyderabad`, `Delhi NCR`, `Chennai`, `Pune` — already in schema)
- [ ] Create **master college list issue** for that city (copy format from Bangalore list)
- [ ] 2–3 scrapers + scout recruitment in that city
- [ ] City switcher in header

## Acceptance criteria
- Polish items ship independently
- Second city only launches with its own dense feed, not re-exported Bangalore data
