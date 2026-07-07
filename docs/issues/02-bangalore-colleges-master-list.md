# Bangalore colleges & venues — master source list

**Labels:** `data`, `scraper`, `priority: high`  
**Milestone:** Data coverage

## Goal
One canonical list of every Bangalore institution and venue that can host hackathons, tech fests, meetups, or coding competitions. Trackr scrapers, filters, and campus scouts all reference this list — **no one-off parsers per college.**

## Already in DB (`prisma/seed.ts`)
| Slug | Name | Notes |
|------|------|-------|
| `rvce` | RV College of Engineering | 8th Mile fest, dept hackathons, Unstop |
| `pes` | PES University | `events.pes.edu` portal ✅ scraper exists |
| `bmsce` | BMS College of Engineering | Tech fest, IEEE events |
| `msrit` | MS Ramaiah Institute of Technology | Code Crafter, dept competitions |
| `iiit-b` | IIIT Bangalore | Research hackathons, workshops |
| `christ` | Christ University | Tech fest, SIH internal rounds |
| `dsce` | Dayananda Sagar College of Engineering | CodeRush, tech fest |
| `bmsit` | BMS Institute of Technology | Campus events |
| `nhce` | New Horizon College of Engineering | MLH Local Hack Day, dept fests |
| `srm-blr` | SRM University (Bangalore) | Inter-dept hackathons |

## Add to DB — major engineering colleges
| Slug (suggested) | Name |
|------------------|------|
| `rit` | Ramaiah Institute of Technology (if distinct from MSRIT) |
| `cmr` | CMR Institute of Technology / CMR University |
| `presidency` | Presidency University, Bengaluru |
| `reva` | Reva University |
| `acharya` | Acharya Institute of Technology |
| `sir-mvisvesvaraya` | Sir M. Visvesvaraya Institute of Technology |
| `bnmit` | BNMIT |
| `jssate` | JSS Academy of Technical Education |
| `global` | Global Academy of Technology |
| `nitte` | Nitte Meenakshi Institute of Technology |
| `cml` | CMR Law / CMR IT (verify campus) |
| `oxford-eng` | Oxford College of Engineering |
| `sapthagiri` | Sapthagiri College of Engineering |
| `mvj` | MVJ College of Engineering |
| `east-point` | East Point College of Engineering |
| `gopalan` | Gopalan College of Engineering |
| `ambedkar` | Dr. Ambedkar Institute of Technology |
| `rnsit` | RNS Institute of Technology |
| `kssem` | K.S. School of Engineering & Management |
| `vishwa-chetnana` | Vishwa Chetnana College of Engineering |
| `cambridge` | Cambridge Institute of Technology |
| `sjb` | SJB Institute of Technology |
| `biet` | Bangalore Institute of Technology |
| `cit-blr` | Cambridge / CIT (confirm slug) |
| `isbr` | ISBR Business School (hackathons) |
| `iisc` | IISc Bangalore (research hackathons, workshops) |
| `iimb` | IIM Bangalore (case comps, startup events) |
| `st-joseph` | St. Joseph's College / group |
| `jain` | Jain University |
| `amrita-blr` | Amrita School of Engineering, Bengaluru |
| `manipal-blr` | Manipal Institute of Technology (Bangalore campus if applicable) |
| `git` | GITAM (if Bangalore events) |

## Add to DB — design / multi-disciplinary (still host tech events)
| Slug | Name |
|------|------|
| `nid` | NID Bangalore (design jams) |
| `srishti` | Srishti Institute |
| `nicc` | NICC / design colleges with hackathons |

## Not colleges — but host events (tag as `venue`, not `college`)
| Slug | Name | Event types |
|------|------|-------------|
| `91springboard` | 91springboard (Koramangala, HSR, etc.) | Hackathons, demo days |
| `wework` | WeWork Bangalore | Startup events, hack nights |
| `nasscom` | NASSCOM 10000 Startups | Pitch days, hackathons |
| `t-hub` | T-Hub Bangalore chapter | Demo days |
| `hasgeek` | HasGeek House | Meetups, workshops |
| `google-blr` | Google Bangalore | GDG events |
| `microsoft-reactor` | Microsoft Reactor | Workshops |
| `razorpay-hq` | Razorpay HQ | Fintech hackathons |
| `flipkart-campus` | Flipkart Campus Whitefield | GRiD, hiring comps |

## Community groups (not venues — `source: meetup` / manual)
- GDG Bangalore
- PyData Bangalore
- React Bangalore
- Bangalore AI/ML Community
- Women Who Code Bangalore
- Bangalore Open Source Meetup
- DevOps Bangalore
- AWS User Group Bangalore
- Kubernetes Bangalore

## Tasks
- [ ] Add all missing colleges above to `prisma/seed.ts` (or a dedicated `prisma/colleges-bangalore.ts` data file)
- [ ] For each entry, document **where events get posted** (column: `eventSourceUrl` or notes in this issue)
- [ ] Research and fill in: Unstop org URL, fest website, Instagram handle, events subdomain (like PES)
- [ ] Mark `isActive: true` only for colleges with at least one known event source
- [ ] College filter dropdown on homepage pulls from this full list
- [ ] Scraper matching uses `inferCollegeSlug()` patterns in `src/scrapers/lib/college-map.ts` — extend for all slugs above

## Source discovery template (fill per college)
```
College: ___
Fest name: ___
Events page: ___
Unstop: ___
Instagram: ___
WhatsApp (manual/crowdsource): ___
Typical event months: ___
Last checked: ___
```

## Acceptance criteria
- Single data file or seed section with **40+ Bangalore colleges/venues**
- README or this issue links to the list as source of truth
- No GitHub issues titled after one specific college — all ingestion is generic against this list

## Notes
- Start with **source discovery** for top 20 by event frequency, not all 40 at once
- WhatsApp-only events → crowdsourcing + campus scouts, not scrapers
- When expanding to other cities, duplicate this issue per city (Mumbai colleges list, etc.)
