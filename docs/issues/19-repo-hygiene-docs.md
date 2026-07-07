# Repo hygiene — README, .env.example, gitignore

**Labels:** `docs`, `infra`, `priority: low`  
**Milestone:** Polish

## Problem
README still says scrapers are stubs (they're not). New contributors / future-you won't know how to run things. Risk of committing secrets or `dev.db`.

## Tasks
- [ ] Update README:
  - Current status (Devfolio ✅, PES ✅, college Unstop ✅, Meetup ❌)
  - Attendable-only feed behavior
  - Link to `docs/issues/` or GitHub Issues
- [ ] Add `.env.example`:
  ```
  DATABASE_URL="file:./dev.db"
  ADMIN_KEY="change-me"
  # MSG91_API_KEY=
  # TELEGRAM_BOT_TOKEN=
  ```
- [ ] Add to `.gitignore`:
  ```
  prisma/*.db
  prisma/*.db-journal
  ```
- [ ] Add GitHub repo description + topics: `nextjs`, `hackathon`, `bangalore`, `prisma`

## Acceptance criteria
- README accurately reflects what's built
- Fresh clone + README = working local setup
- No secrets or SQLite files in git history going forward
