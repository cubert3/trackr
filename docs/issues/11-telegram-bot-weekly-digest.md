# Telegram bot — weekly Bangalore hackathon digest

**Labels:** `feature`, `distribution`, `priority: medium`  
**Milestone:** Community & retention

## Problem
Students live on Telegram. A bot that pushes "this week's open hackathons" drives retention without opening the website.

## Tasks
- [ ] Create Telegram bot via BotFather
- [ ] Commands: `/thisweek`, `/college rvce`, `/help`
- [ ] Query attendable events from DB (same filter as homepage)
- [ ] Format message: title, reg deadline, link
- [ ] Optional: subscribe to daily/weekly push
- [ ] Deploy bot (Vercel serverless webhook or small always-on service)
- [ ] Post bot link in college Telegram groups

## Acceptance criteria
- `/thisweek` returns only events with open registration in Bangalore
- Links go to Trackr event page or external registration URL
- Bot token stored in env, not committed

## Phase 3 item from original plan
