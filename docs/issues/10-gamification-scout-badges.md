# Gamification UI — Bangalore Scout badges & leaderboard

**Labels:** `feature`, `community`, `priority: medium`  
**Milestone:** Community & retention

## Problem
Schema has `User.points`, `User.trustScore`, `User.badge` but no UI. Gamification was planned to turn scouts into an ongoing data pipeline.

## Tasks
- [ ] Show submitter points after approved submission
- [ ] Assign badge tiers (e.g. "Bangalore Scout" at 3 verified submissions)
- [ ] Public leaderboard page: top contributors per college
- [ ] Auto-approve submissions from users above trust threshold (optional)
- [ ] Display badge on event card for crowdsourced events ("Added by @scout")

## Acceptance criteria
- Submitting and getting approved increases visible points
- Leaderboard updates when admin approves events
- At least one badge tier implemented

## Files
- `prisma/schema.prisma` (User model — already has fields)
- `src/app/api/admin/submissions/route.ts` (already increments points on approve)
