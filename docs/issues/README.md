# GitHub issues — copy-paste index

**5 issues total.** No college-specific tickets — use the master college list issue for all campuses.

| # | File | GitHub issue title | Milestone |
|---|------|-------------------|-----------|
| 1 | `01-mvp-launch.md` | MVP launch — deploy, auth, admin, live data | MVP |
| 2 | `02-bangalore-colleges-master-list.md` | Bangalore colleges & venues — master source list | Data coverage |
| 3 | `03-data-pipeline-scrapers.md` | Data pipeline — scrapers, cron, ingest rules | Data coverage |
| 4 | `04-community-growth.md` | Community — scouts, gamification, distribution | Community |
| 5 | `05-polish-and-scale.md` | Product polish & multi-city scale | Scale |

## Create with GitHub CLI

```powershell
cd "c:\Users\Pranav\Desktop\Pranav\trackr"

gh issue create --title "MVP launch — deploy, auth, admin, live data" --body-file docs/issues/01-mvp-launch.md
gh issue create --title "Bangalore colleges & venues — master source list" --body-file docs/issues/02-bangalore-colleges-master-list.md
gh issue create --title "Data pipeline — scrapers, cron, ingest rules" --body-file docs/issues/03-data-pipeline-scrapers.md
gh issue create --title "Community — scouts, gamification, distribution" --body-file docs/issues/04-community-growth.md
gh issue create --title "Product polish & multi-city scale" --body-file docs/issues/05-polish-and-scale.md
```

## Suggested labels
`infra` · `scraper` · `data` · `feature` · `community` · `growth` · `priority: critical` · `priority: high`

## Priority order
1. MVP launch
2. Bangalore colleges master list (fill in source URLs)
3. Data pipeline
4. Community & growth
5. Polish & scale
