# Implement Meetup scraper (GDG, PyData, React Bangalore)

**Labels:** `scraper`, `priority: medium`  
**Milestone:** Data coverage

## Problem
Bangalore has a dense meetup scene (GDG, PyData, React Bangalore, AI/ML groups) that doesn't appear on Devfolio or Unstop. `src/scrapers/sources/meetup.ts` is still a stub.

## Tasks
- [ ] Get Meetup API access (GraphQL or REST)
- [ ] Fetch upcoming events for Bangalore tech groups (curated group slugs/IDs)
- [ ] Map to Trackr schema: title, startsAt, venue, registrationUrl, locality
- [ ] Set `registrationDeadline` from RSVP close date or event start
- [ ] Category: `MEETUP` or `WORKSHOP`
- [ ] Wire into `npm run scrape` pipeline + dedup

## Acceptance criteria
- At least 3 real upcoming Bangalore meetups appear after scrape
- No duplicate entries vs Devfolio/Unstop for same event

## Files
- `src/scrapers/sources/meetup.ts`
- `src/scrapers/runner.ts`
