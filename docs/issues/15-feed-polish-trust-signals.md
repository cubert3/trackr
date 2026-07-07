# Feed polish — last scraped time, duplicate report, save events

**Labels:** `feature`, `ux`, `priority: low`  
**Milestone:** Polish

## Problem
Users can't tell if data is fresh or report bad listings. Small trust signals make the difference between "student project" and "I use this every week."

## Tasks
- [ ] Show "Last updated: X hours ago" on homepage (from latest scrape timestamp)
- [ ] Store `scrapedAt` on events or a global `ScrapeRun` table
- [ ] "Report duplicate" button on event detail → flags for review
- [ ] Optional: bookmark/save events (cookie or lightweight account)
- [ ] Optional: "Registration closes in 24h" highlight on cards

## Acceptance criteria
- Homepage shows when data was last refreshed
- User can flag a duplicate event in one click
- Saved events persist across sessions (if bookmark implemented)
