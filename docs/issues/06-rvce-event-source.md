# Add RVCE event source (fest page / Unstop / Instagram)

**Labels:** `scraper`, `college`, `priority: high`  
**Milestone:** MVP — usable in Bangalore

## Problem
RVCE events are not reliably ingested. `rvce.edu.in` blocks scrapers (403). College Unstop scraper only catches events when registration is open and org name matches.

## Tasks
- [ ] Identify where RVCE tech club / 8th Mile / dept hackathons are actually posted (Unstop org URL, Instagram, Linktree, WhatsApp)
- [ ] Implement one parser:
  - Option A: Curated Unstop AMP slugs (like MSRIT Code Crafter)
  - Option B: Instagram bio link / fest microsite HTML
  - Option C: Manual curated JSON file updated by campus scout
- [ ] Tag events with `collegeSlug: "rvce"`
- [ ] Filter attendable-only (open registration)
- [ ] Test: at least 1 RVCE event appears when fest season is active

## Acceptance criteria
- RVCE-filtered feed (`/college/rvce`) can show real events without manual DB edits
- Scraper documented in README with source URL

## Files
- `src/scrapers/sources/college.ts`
- `src/scrapers/sources/unstop-college.ts` (curated slugs list)
