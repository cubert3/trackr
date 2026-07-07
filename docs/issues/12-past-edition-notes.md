# Past-edition notes — "how was it?" after events

**Labels:** `feature`, `community`, `priority: low`  
**Milestone:** Community & retention

## Problem
Unstop tells you what's upcoming. Nobody tells you if last year's RVCE hackathon was worth it, how hard judging was, or what the theme was. This is Trackr's long-term moat.

## Tasks
- [ ] After `endsAt` passes, prompt on event page: "Attended? Leave a 1-line note"
- [ ] Schema: `EventNote` or extend Event with `pastNotes` JSON
- [ ] Fields: difficulty (1–5), worth it (yes/no), free text, theme tags
- [ ] Show aggregated notes on event page for recurring fests
- [ ] Moderate notes (optional queue like submissions)
- [ ] No login required OR tie to OTP-verified user

## Acceptance criteria
- Past events can accumulate community notes
- Notes visible on event detail for next year's edition
- Spam prevented (OTP or rate limit)

## Phase 4 item from original plan
