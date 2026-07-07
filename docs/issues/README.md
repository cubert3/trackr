# GitHub issue templates

Copy-paste each file into a new GitHub Issue (title = filename without number prefix, or use the `# Title` inside).

## Milestone: MVP — usable in Bangalore
| File | Issue title |
|------|-------------|
| `01-deploy-vercel-postgres.md` | Deploy Trackr to production (Vercel + Postgres) |
| `02-daily-scrape-cron.md` | Automate daily scraping |
| `03-real-otp-sms-email.md` | Real OTP via SMS/email |
| `04-admin-moderation-ui.md` | Admin moderation UI |
| `05-replace-seed-with-live-data.md` | Replace demo seed with live data |
| `06-rvce-event-source.md` | RVCE event source |

## Milestone: Data coverage
| File | Issue title |
|------|-------------|
| `07-meetup-scraper.md` | Meetup scraper |
| `08-unstop-general-scraper.md` | General Unstop scraper |
| `09-more-college-scrapers.md` | BMSCE, IIIT-B, Christ, DSCE scrapers |

## Milestone: Community & retention
| File | Issue title |
|------|-------------|
| `10-gamification-scout-badges.md` | Gamification & badges |
| `11-telegram-bot-weekly-digest.md` | Telegram bot |
| `12-past-edition-notes.md` | Past-edition notes |
| `13-team-finding-board.md` | Team-finding board |
| `14-verified-organizer-accounts.md` | Verified organizer accounts |

## Milestone: Distribution
| File | Issue title |
|------|-------------|
| `16-campus-ambassador-program.md` | Campus ambassador program |
| `17-launch-distribution-checklist.md` | Launch distribution checklist |

## Milestone: Polish / Scale
| File | Issue title |
|------|-------------|
| `15-feed-polish-trust-signals.md` | Feed polish & trust signals |
| `18-city-expansion.md` | City expansion |
| `19-repo-hygiene-docs.md` | Repo hygiene & docs |

## Suggested labels
`infra` · `scraper` · `feature` · `growth` · `community` · `docs` · `priority: critical` · `priority: high` · `priority: medium` · `priority: low`

## Bulk create with GitHub CLI
```bash
gh issue create --title "Deploy Trackr to production (Vercel + Postgres)" --body-file docs/issues/01-deploy-vercel-postgres.md --label "infra,priority: critical"
```

Repeat for each file, or ask Cursor to script it.
