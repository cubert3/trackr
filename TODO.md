# Trackr — What’s left to make it actually useful

## Already done (don’t redo)

- [x] Bangalore event feed with filters (category, locality, college, search)
- [x] Attendable-only view (open registration + not ended)
- [x] Devfolio scraper (live hackathons)
- [x] PES events portal scraper (`events.pes.edu`)
- [x] Unstop college scraper (RVCE / MSRIT / Bangalore filter)
- [x] Crowdsourcing form + OTP flow + moderation API
- [x] College picker + trending + `/college/[slug]` pages
- [x] Dedup pipeline + auto-archive past events

---

## Must do — critical path to “real product”

These are the things that turn a local demo into something people can actually use.

### Data & scrapers
- [ ] **Run `npm run scrape` daily** — set a cron (GitHub Action or Windows Task Scheduler) so the feed stays fresh without you
- [ ] **Replace seed data with live data** — stop relying on the 25 fake events; after scrapers run, trim or remove `prisma/seed.ts` demo events
- [ ] **RVCE direct source** — RV site blocks scrapers; add Instagram / fest Unstop URL / WhatsApp scout for RVCE specifically
- [ ] **BMSCE, IIIT-B, Christ, DSCE fest parsers** — same pattern as PES (`events.pes.edu`-style or their Unstop org pages)
- [ ] **Meetup scraper** — GDG Bangalore, PyData, React Bangalore (needs Meetup API key)
- [ ] **Main Unstop scraper** — general Bangalore hackathons (college scraper only catches org-name matches)

### Production
- [ ] **Deploy** — Vercel + Postgres (SQLite is dev-only; `prisma/dev.db` won’t work on serverless)
- [ ] **Migrate DB to Postgres** — update `DATABASE_URL`, run `prisma db push` / migrate on prod
- [ ] **Real OTP** — swap console logging in `src/lib/otp.ts` for MSG91 / Twilio / Resend
- [ ] **Set prod `ADMIN_KEY`** — strong secret, not `dev-admin-key-change-me`

### Moderation (you’ll hate life without this)
- [ ] **Admin UI** — simple `/admin` page to approve/reject submissions (instead of curl)
- [ ] **Manually seed 10–20 real events** if scrapers are thin — empty feed kills trust

---

## Should do — high impact, makes it stand out

### Trust & quality
- [ ] **Remove or hide `[EXPIRED]` test events** from seed
- [ ] **Show “last scraped” timestamp** on feed so users know data is fresh
- [ ] **Link out to registration** — verify every card’s `registrationUrl` works
- [ ] **Duplicate reporting** — “this is a duplicate” button on event page

### Community (your differentiator vs Unstop)
- [ ] **Campus ambassador program** — 1 scout each at RVCE, PES, MSRIT, BMSCE, IIIT-B
- [ ] **Post in college WhatsApp / Telegram groups** — “found this useful, add events here”
- [ ] **Instagram page** — weekly “Bangalore hackathons this week” carousel
- [ ] **Gamification** — surface points / “Bangalore Scout” badge for verified submitters (schema exists, UI doesn’t)

### Phase 3 (from original plan)
- [ ] **Telegram bot** — “/thisweek” pushes open hackathons in Bangalore
- [ ] **Email digest** — optional weekly for users who pick a college
- [ ] **Past-edition notes** — after an event, prompt “how was it?” (theme, difficulty, worth it?)

---

## Can do — polish & growth

### Product features
- [ ] **Team-finding board** — “need UI designer for X hackathon this weekend”
- [ ] **Verified organizer accounts** — college tech clubs post directly, skip moderation
- [ ] **Notifications** — “registration closes in 24h” for saved events
- [ ] **Save / bookmark events** — cookie or lightweight account
- [ ] **Map view** — events by locality (Indiranagar, Koramangala, HSR)
- [ ] **SIH / Flipkart GRiD / major comps filter** — dedicated tag or page

### More sources
- [ ] Devpost scraper
- [ ] MLH Local Hack Day scraper
- [ ] HackerEarth Bangalore filter
- [ ] 91springboard / WeWork event boards
- [ ] College Instagram monitors (manual list of handles)

### Geo expansion (after Bangalore is dense)
- [ ] Activate Mumbai / Hyderabad in `City` table
- [ ] City switcher in header
- [ ] Repeat campus scout playbook per city

### Dev / repo hygiene
- [ ] Update README (still says scrapers are stubs — they’re not anymore)
- [ ] Add `prisma/*.db` to `.gitignore` before GitHub push
- [ ] GitHub Action: `npm run scrape` + optional commit or DB update
- [ ] Add `.env.example` with required vars documented

---

## Distribution checklist — makes it useful to *others*, not just you

| Week | Action |
|------|--------|
| 1 | Deploy live URL, share in your college groups |
| 1 | Manually add every event you know about this month |
| 2 | Recruit 2 campus scouts (give them auto-trust / badge) |
| 2 | Post in GDG / PyData / student meme pages |
| 3 | Instagram “this week’s hackathons” post |
| 4 | Ask tech club coordinators to submit via `/submit` |
| Ongoing | Run scrape daily, moderate submissions within 24h |

---

## Priority order (if you’re doing one thing at a time)

1. **Deploy + Postgres + real URL**
2. **Daily scrape cron + kill fake seed data**
3. **Admin UI for moderation**
4. **10 real events in feed + share in one college group**
5. **1 campus scout at your college**
6. **RVCE / MSRIT source** (Instagram or fest link you know)
7. **Meetup scraper**
8. **Telegram bot or Instagram for retention**

---

## Honest status

| Area | Reality |
|------|---------|
| **App shell** | Solid |
| **Live data** | Devfolio yes; PES/Unstop college yes when events are open; Meetup/RV direct no |
| **Users** | Zero until you deploy + distribute |
| **Moat** | Crowdsourcing + hyperlocal + college feed — only matters if feed is dense and fresh |

**Bottom line:** The code is ~40% of “useful.” The other 60% is **fresh data, deployment, moderation, and getting 5–10 people to submit events from WhatsApp.** Without that, it’s a portfolio project. With that, it’s something RVCE/PES students would actually open every week.

---

Want this saved as `TODO.md` in the repo? I can add it there.
