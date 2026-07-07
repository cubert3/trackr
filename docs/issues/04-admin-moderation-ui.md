# Build admin UI for submission moderation

**Labels:** `feature`, `priority: critical`  
**Milestone:** MVP — usable in Bangalore

## Problem
Approving crowdsourced events requires curl + `ADMIN_KEY`. You will not moderate consistently without a simple UI.

## Tasks
- [ ] Add `/admin` page (protected by `ADMIN_KEY` in header or login)
- [ ] List pending `EventSubmission` rows with title, date, college, submitter
- [ ] Approve / Reject buttons calling existing `PATCH /api/admin/submissions`
- [ ] Show review notes field on reject
- [ ] After approve, link to live event page
- [ ] Optional: badge showing pending count in header for admin

## Acceptance criteria
- Can approve a submission in under 30 seconds from phone/desktop
- No curl required for day-to-day moderation
- Non-admins cannot access the page

## Existing API
```bash
GET  /api/admin/submissions     # header: x-admin-key
PATCH /api/admin/submissions    # body: { id, action: "approve"|"reject", reviewNotes? }
```
