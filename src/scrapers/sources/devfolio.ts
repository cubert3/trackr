import type { Scraper, ScrapedEvent } from "../index";

interface DevfolioHackathon {
  uuid: string;
  slug: string;
  name: string;
  type: string;
  starts_at: string;
  ends_at: string;
  is_online: boolean;
  timezone?: string;
  themes?: { theme: { name: string } }[];
  settings?: {
    reg_ends_at?: string;
    reg_starts_at?: string;
  };
}

interface DevfolioPageData {
  open_hackathons?: DevfolioHackathon[];
  upcoming_hackathons?: DevfolioHackathon[];
}

const BANGALORE_KEYWORDS = [
  "bangalore",
  "bengaluru",
  "blr",
  "rvce",
  "pes university",
  "pes ring",
  "bmsce",
  "msrit",
  "ms ramaiah",
  "iiit-b",
  "iiitb",
  "christ university",
  "dayananda sagar",
  "koramangala",
  "indiranagar",
  "hsr layout",
  "whitefield",
];

function parseDevfolioPage(html: string): DevfolioPageData {
  const match = html.match(/__NEXT_DATA__[^>]*>([^<]+)/);
  if (!match) return {};

  const data = JSON.parse(match[1]);
  const queries = data?.props?.pageProps?.dehydratedState?.queries ?? [];
  const hackathonQuery = queries.find(
    (q: { state?: { data?: DevfolioPageData } }) =>
      q.state?.data?.open_hackathons || q.state?.data?.upcoming_hackathons
  );

  return hackathonQuery?.state?.data ?? {};
}

function isBangaloreRelevant(h: DevfolioHackathon): boolean {
  if (h.is_online) return true;

  const haystack = `${h.name} ${h.slug}`.toLowerCase();
  return BANGALORE_KEYWORDS.some((kw) => haystack.includes(kw));
}

function isRegistrationOpen(h: DevfolioHackathon, now: Date): boolean {
  const regEnds = h.settings?.reg_ends_at;
  if (!regEnds) return new Date(h.starts_at) >= now;
  return new Date(regEnds) >= now;
}

function toScrapedEvent(h: DevfolioHackathon): ScrapedEvent {
  const tags = (h.themes ?? [])
    .map((t) => t.theme.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))
    .filter(Boolean);

  if (h.is_online) tags.push("online");

  return {
    title: h.name,
    description: `${h.type} on Devfolio${h.is_online ? " (online)" : ""}.`,
    startsAt: new Date(h.starts_at),
    endsAt: h.ends_at ? new Date(h.ends_at) : undefined,
    registrationDeadline: h.settings?.reg_ends_at
      ? new Date(h.settings.reg_ends_at)
      : new Date(h.starts_at),
    format: h.is_online ? "ONLINE" : "IN_PERSON",
    category: "HACKATHON",
    locality: h.is_online ? "Online" : undefined,
    registrationUrl: `https://devfolio.co/${h.slug}`,
    externalUrl: `https://devfolio.co/${h.slug}`,
    externalId: h.uuid,
    tags: ["devfolio", ...tags],
  };
}

export const devfolioScraper: Scraper = {
  name: "Devfolio",
  source: "DEVFOLIO",
  async run(citySlug = "bangalore") {
    const errors: string[] = [];

    try {
      const res = await fetch("https://devfolio.co/hackathons", {
        headers: {
          "User-Agent": "Trackr/1.0 (Bangalore event aggregator)",
          Accept: "text/html",
        },
      });

      if (!res.ok) {
        return {
          source: "DEVFOLIO",
          events: [],
          errors: [`Devfolio returned ${res.status}`],
        };
      }

      const html = await res.text();
      const pageData = parseDevfolioPage(html);
      const now = new Date();

      const all = [
        ...(pageData.open_hackathons ?? []),
        ...(pageData.upcoming_hackathons ?? []),
      ];

      const seen = new Set<string>();
      const events: ScrapedEvent[] = [];

      for (const h of all) {
        if (seen.has(h.uuid)) continue;
        seen.add(h.uuid);

        if (!isRegistrationOpen(h, now)) continue;
        if (new Date(h.ends_at ?? h.starts_at) < now) continue;

        if (citySlug === "bangalore" && !isBangaloreRelevant(h)) continue;

        events.push(toScrapedEvent(h));
      }

      return { source: "DEVFOLIO", events, errors };
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Devfolio fetch failed");
      return { source: "DEVFOLIO", events: [], errors };
    }
  },
};
