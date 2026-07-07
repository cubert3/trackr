import type { ScrapedEvent } from "../index";
import { fetchHtml, stripHtml } from "../lib/http";
import { parseDateRange, parseFlexibleDate } from "../lib/parse-date";
import { isTechEvent } from "../lib/college-map";

const BASE = "https://events.pes.edu";

interface PesListingItem {
  path: string;
  title: string;
  listDate: string;
  ribbon?: string;
}

function parseListing(html: string): PesListingItem[] {
  const items: PesListingItem[] = [];
  const seen = new Set<string>();

  const dateEntries = [
    ...html.matchAll(/href="(\/\d+\/)"[\s\S]{0,1200}?event-date-text[^>]*>([^<]+)/g),
  ];
  for (const m of dateEntries) {
    if (seen.has(m[1])) continue;
    seen.add(m[1]);

    const chunk = html.slice(
      Math.max(0, html.indexOf(m[0]) - 800),
      html.indexOf(m[0]) + m[0].length
    );
    const title =
      chunk.match(/title-sin_item"><a[^>]*>([^<]+)/)?.[1]?.trim() ??
      chunk.match(/<h6>([^<]+)<\/h6>/)?.[1]?.trim() ??
      "PES Event";
    const ribbon = chunk.match(/ribbon-(upcoming|ongoing|previous)/)?.[1];

    items.push({
      path: m[1],
      title,
      listDate: m[2].trim(),
      ribbon,
    });
  }

  return items;
}

function inferCategory(title: string, tags: string[]): ScrapedEvent["category"] {
  const hay = `${title} ${tags.join(" ")}`.toLowerCase();
  if (/hackathon|hack\b|ctf|capture the flag|coding/i.test(hay)) return "HACKATHON";
  if (/workshop/i.test(hay)) return "WORKSHOP";
  if (/fest|symposium/i.test(hay)) return "TECH_FEST";
  if (/competition|contest/i.test(hay)) return "COMPETITION";
  return "OTHER";
}

async function parseDetail(
  path: string,
  listDate: string
): Promise<Partial<ScrapedEvent> | null> {
  const html = await fetchHtml(`${BASE}${path}`);

  const title =
    html.match(/<h2>([^<]+)/)?.[1]?.trim() ??
    html.match(/<title>([^<|-]+)/)?.[1]?.trim();
  if (!title) return null;

  const dateRangeText = html.match(
    /fa-calendar[\s\S]{0,120}?(\w+ \d{1,2}, \d{4}\s*-\s*\w+ \d{1,2}, \d{4})/
  )?.[1];
  const singleDateText = html.match(
    /fa-calendar[\s\S]{0,120}?(\w+ \d{1,2}, \d{4})/
  )?.[1];

  let startsAt: Date | undefined;
  let endsAt: Date | undefined;

  if (dateRangeText) {
    const range = parseDateRange(dateRangeText);
    if (range) {
      startsAt = range.start;
      endsAt = range.end;
    }
  } else if (singleDateText) {
    startsAt = parseFlexibleDate(singleDateText) ?? undefined;
  }

  const regClose = html.match(/Registration Closes On:\s*([^<\n]+)/i)?.[1];
  const registrationDeadline = regClose
    ? parseFlexibleDate(regClose) ?? undefined
    : undefined;

  const aboutHtml = html.match(
    /About This Event[\s\S]*?list-single-main-item_content[\s\S]*?(<p[\s\S]*?)<\/div>/i
  )?.[1];
  const description = aboutHtml ? stripHtml(aboutHtml).slice(0, 2000) : undefined;

  const venue = html.match(/address-text[\s\S]*?<p[^>]*>([^<]+)/i)?.[1]?.trim();

  const campus = html.match(/fa-university[\s\S]{0,80}?>\s*([^<]+)/)?.[1]?.trim();

  const tags = [
    ...html.matchAll(/href="\/tag\/([^/]+)\//g),
  ].map((m) => m[1].replace(/-/g, " "));

  const ribbon = html.match(/ribbon-(upcoming|ongoing|previous)/)?.[1];
  const now = new Date();

  if (ribbon === "previous") return null;
  if (endsAt && endsAt < now) return null;
  if (startsAt && !endsAt && startsAt < now && ribbon !== "ongoing") return null;
  if (registrationDeadline && registrationDeadline < now) return null;

  const listStart = parseFlexibleDate(listDate);
  if (!startsAt && listStart) startsAt = listStart;

  return {
    title,
    description,
    startsAt: startsAt ?? listStart ?? undefined,
    endsAt,
    registrationDeadline: registrationDeadline ?? startsAt,
    format: "IN_PERSON",
    category: inferCategory(title, tags),
    venue: venue ?? "PES University",
    locality: campus?.includes("EC") ? "Electronic City" : "PES Campus",
    registrationUrl: `${BASE}${path}`,
    externalUrl: `${BASE}${path}`,
    externalId: `pes-${path.replace(/\//g, "")}`,
    collegeSlug: "pes",
    tags: ["pes", "campus", ...tags.slice(0, 5)],
  };
}

export async function scrapePesEvents(): Promise<ScrapedEvent[]> {
  const html = await fetchHtml(BASE);
  const listing = parseListing(html);
  const now = new Date();
  const events: ScrapedEvent[] = [];

  for (const item of listing) {
    const listDate = parseFlexibleDate(item.listDate);
    if (listDate && listDate < now && item.ribbon !== "ongoing") continue;
    if (item.ribbon === "previous") continue;

    if (!isTechEvent(item.title)) continue;

    try {
      const detail = await parseDetail(item.path, item.listDate);
      if (!detail?.startsAt) continue;

      events.push({
        title: detail.title ?? item.title,
        description: detail.description,
        startsAt: detail.startsAt,
        endsAt: detail.endsAt,
        registrationDeadline: detail.registrationDeadline ?? detail.startsAt,
        format: detail.format ?? "IN_PERSON",
        category: detail.category ?? "HACKATHON",
        venue: detail.venue,
        locality: detail.locality,
        registrationUrl: detail.registrationUrl,
        externalUrl: detail.externalUrl,
        externalId: detail.externalId,
        collegeSlug: "pes",
        tags: detail.tags ?? ["pes", "campus"],
      });
    } catch {
      // skip failed detail fetch
    }
  }

  return events;
}
