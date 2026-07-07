# Implement general Unstop Bangalore hackathon scraper

**Labels:** `scraper`, `priority: medium`  
**Milestone:** Data coverage

## Problem
`src/scrapers/sources/unstop.ts` is a stub. College-specific Unstop logic exists in `unstop-college.ts` but misses general Bangalore hackathons not tied to RV/PES/MSR org names.

## Tasks
- [ ] Use Unstop public search API (`/api/public/opportunity/search`) with pagination
- [ ] Filter: `oppstatus=open`, Bangalore/Bengaluru in org/location/URL
- [ ] Parse `regnRequirements.end_regn_dt` as registration deadline
- [ ] Skip non-tech (internships, random jobs — API returns noise)
- [ ] Upsert with `sourceType: UNSTOP`, `externalId: item.id`
- [ ] Merge with college scraper without duplicates

## Acceptance criteria
- Open Bangalore hackathons on Unstop appear in feed without manual entry
- Closed-registration events never imported

## Reference
- Working pattern in `src/scrapers/sources/unstop-college.ts`
- API returns `organisation.name`, `public_url`, `start_date`, `end_date`
