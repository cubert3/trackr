# Community — crowdsourcing, scouts, gamification, retention

**Labels:** `feature`, `community`, `growth`  
**Milestone:** Community

## Goal
Turn Trackr from a scraper into a community-owned feed. WhatsApp and campus groups are the highest-value source — design for that.

## Tasks

### Crowdsourcing (partially done — harden it)
- [ ] Faster moderation SLA (target: <24h)
- [ ] Email/Telegram notify admin on new submission
- [ ] Duplicate report button on event pages

### Campus scouts (any college on master list)
- [ ] Scout program doc: post events from **their** campus using `/submit`
- [ ] Recruit 1 scout per college for top 10 colleges on master list (not one named college)
- [ ] Scouts get trust score boost + leaderboard credit
- [ ] Track submissions per `collegeSlug` in admin

### Gamification (schema exists, UI doesn't)
- [ ] Points + "Bangalore Scout" badge after verified submissions
- [ ] Public leaderboard by college
- [ ] Auto-approve above trust threshold (optional)

### Retention features
- [ ] Telegram bot: `/thisweek` → open Bangalore events
- [ ] Past-edition notes after events end ("worth it?", difficulty, theme)
- [ ] Team-finding board scoped to event + city
- [ ] Verified organizer accounts (tech clubs post without queue)

### Distribution
- [ ] Share live URL in college WhatsApp/Telegram groups
- [ ] Instagram: weekly "open hackathons in Bangalore" post
- [ ] Get listed in GDG / PyData / student newsletters
- [ ] **Do not expand cities** until Bangalore feed has 20+ attendable events consistently

## Acceptance criteria
- ≥5 crowdsourced events in first month
- ≥3 active scouts across different colleges
- Feed never empty >48h after launch
