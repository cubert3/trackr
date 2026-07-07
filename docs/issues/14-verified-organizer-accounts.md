# Verified organizer accounts (college tech clubs)

**Labels:** `feature`, `community`, `priority: low`  
**Milestone:** Community & retention

## Problem
Moderation doesn't scale if every event goes through you. Verified RVCE IEEE / PES Devfolio club accounts should post directly.

## Tasks
- [ ] Schema: `Organizer` — name, collegeId, verified boolean, contact email
- [ ] Organizer login (email OTP or magic link)
- [ ] Organizer dashboard: post event → goes live without manual review
- [ ] Badge on events: "Posted by RVCE IEEE"
- [ ] Application flow: club fills form → you verify once
- [ ] Trust score bypass for verified organizers only

## Acceptance criteria
- Verified organizer can publish event in under 2 minutes
- Unverified users still go through moderation queue
- Organizer badge visible on event cards

## Phase 5 item from original plan
