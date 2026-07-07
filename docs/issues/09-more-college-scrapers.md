# Add college scrapers: BMSCE, IIIT-B, Christ, DSCE

**Labels:** `scraper`, `college`, `priority: medium`  
**Milestone:** Data coverage

## Problem
PES has a working parser (`events.pes.edu`). Other Bangalore colleges still rely on seed data or crowdsourcing.

## Tasks
- [ ] **BMSCE** — find fest/TPO event page or Unstop org listing
- [ ] **IIIT-B** — check research/campus event calendar
- [ ] **Christ University** — fest or dept hackathon page
- [ ] **DSCE** — CodeRush / tech fest source
- [ ] Each parser outputs `collegeSlug`, `registrationDeadline`, attendable-only
- [ ] Add to `collegeScraper` orchestrator in `src/scrapers/sources/college.ts`

## Acceptance criteria
- Each college has at least one documented source URL
- `/college/bmsce`, `/college/iiit-b`, etc. can show real events when active
- PES parser remains unchanged and working

## Pattern to follow
- `src/scrapers/sources/pes-events.ts` (HTML listing + detail pages)
