import type { ScrapedEvent } from "../index";
import { fetchHtml, stripHtml } from "../lib/http";
import { parseFlexibleDate } from "../lib/parse-date";
import { inferCollegeSlug, isTechEvent } from "../lib/college-map";

interface UnstopItem {
  id: number;
  title: string;
  public_url: string;
  start_date?: string;
  end_date?: string;
  location?: string | null;
  type?: string;
  subtype?: string;
  organisation?: { name?: string };
  regnRequirements?: {
    end_regn_dt?: string;
    start_regn_dt?: string;
  };
}

const CURATED_AMP_SLUGS = [
  "hackathons/code-crafter-national-level-coding-competition-m-s-ramaiah-institute-of-technology-msrit-bangalore-1664751",
  "hackathons/siliconsprint-rv-college-of-engineering-rvce-bangalore-1577726",
  "competitions/prodxpulse-2026-ai-product-festival-workshop-cmr-university-cmru-bangalore-karnataka-1709887",
];

function matchesCollege(item: UnstopItem): boolean {
  const hay = `${item.title} ${item.organisation?.name ?? ""} ${item.public_url ?? ""} ${item.location ?? ""}`;
  return !!inferCollegeSlug(hay) || /bangalore|bengaluru/i.test(hay);
}

function toScrapedEvent(item: UnstopItem): ScrapedEvent | null {
  const now = new Date();
  const regEnd = item.regnRequirements?.end_regn_dt
    ? new Date(item.regnRequirements.end_regn_dt)
    : item.end_date
      ? new Date(item.end_date)
      : null;

  const startsAt = item.start_date ? new Date(item.start_date) : null;
  const endsAt = item.end_date ? new Date(item.end_date) : undefined;

  if (!startsAt || !regEnd) return null;
  if (regEnd < now) return null;
  if (endsAt && endsAt < now) return null;

  const org = item.organisation?.name ?? "";
  const collegeSlug = inferCollegeSlug(item.title, org, item.public_url, item.location ?? undefined);
  const hay = `${item.title} ${org} ${item.public_url}`;

  if (!collegeSlug && !/bangalore|bengaluru/i.test(hay)) return null;
  if (!isTechEvent(item.title, [item.subtype ?? "", item.type ?? ""])) return null;

  const category: ScrapedEvent["category"] =
    item.public_url.includes("hackathon") || /hackathon|hack\b/i.test(item.title)
      ? "HACKATHON"
      : /competition|contest|coding/i.test(item.title)
        ? "COMPETITION"
        : "OTHER";

  return {
    title: item.title,
    description: org ? `${item.subtype ?? item.type ?? "Event"} hosted by ${org}.` : undefined,
    startsAt,
    endsAt,
    registrationDeadline: regEnd,
    format: "IN_PERSON",
    category,
    venue: org,
    locality: item.location ?? (collegeSlug ? `${collegeSlug.toUpperCase()} Campus` : "Bangalore"),
    registrationUrl: `https://unstop.com/${item.public_url}`,
    externalUrl: `https://unstop.com/${item.public_url}`,
    externalId: String(item.id),
    collegeSlug,
    tags: ["unstop", collegeSlug ?? "bangalore"].filter(Boolean) as string[],
  };
}

async function fetchUnstopPage(page: number): Promise<UnstopItem[]> {
  const url = `https://unstop.com/api/public/opportunity/search?perPage=50&page=${page}&oppstatus=open&subtype=hackathons`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "Trackr/1.0" },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json?.data?.data ?? [];
}

async function parseAmpPage(slug: string): Promise<ScrapedEvent | null> {
  const html = await fetchHtml(`https://unstop.com/${slug}/amp`);
  const title = stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  if (!title) return null;

  const org = html.match(/Institute of Technology[^<\n]{0,80}|College of Engineering[^<\n]{0,80}|University[^<\n]{0,60}/i)?.[0]?.trim();
  const deadlineMatch = html.match(
    /Registration Deadline[\s\S]{0,300}?(\d{1,2}\s+\w+'\d{2}[^<\n"]+)/i
  );
  const registrationDeadline = deadlineMatch
    ? parseFlexibleDate(deadlineMatch[1])
    : null;

  const dateMatch = html.match(/Date:\s*(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4})/i);
  const startsAt = dateMatch ? parseFlexibleDate(dateMatch[1]) : null;

  if (!registrationDeadline || registrationDeadline < new Date()) return null;

  const collegeSlug = inferCollegeSlug(title, org ?? "", slug);
  if (!collegeSlug) return null;

  const id = slug.match(/-(\d+)$/)?.[1] ?? slug;

  return {
    title,
    description: org ? `Listed on Unstop by ${org}.` : undefined,
    startsAt: startsAt ?? registrationDeadline,
    registrationDeadline,
    format: "IN_PERSON",
    category: /hackathon/i.test(title + slug) ? "HACKATHON" : "COMPETITION",
    venue: org,
    locality: collegeSlug === "msrit" ? "MSRIT Campus" : collegeSlug === "rvce" ? "RVCE Campus" : "Bangalore",
    registrationUrl: `https://unstop.com/${slug}`,
    externalUrl: `https://unstop.com/${slug}`,
    externalId: id,
    collegeSlug,
    tags: ["unstop", "campus", collegeSlug],
  };
}

export async function scrapeUnstopCollegeEvents(): Promise<{
  events: ScrapedEvent[];
  errors: string[];
}> {
  const errors: string[] = [];
  const seen = new Set<string>();
  const events: ScrapedEvent[] = [];

  for (let page = 1; page <= 20; page++) {
    try {
      const items = await fetchUnstopPage(page);
      if (!items.length) break;

      for (const item of items) {
        if (!matchesCollege(item)) continue;
        const scraped = toScrapedEvent(item);
        if (!scraped || seen.has(scraped.externalId!)) continue;
        seen.add(scraped.externalId!);
        events.push(scraped);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : "Unstop page fetch failed");
      break;
    }
  }

  for (const slug of CURATED_AMP_SLUGS) {
    try {
      const scraped = await parseAmpPage(slug);
      if (!scraped || seen.has(scraped.externalId!)) continue;
      if (scraped.registrationDeadline && scraped.registrationDeadline < new Date()) continue;
      seen.add(scraped.externalId!);
      events.push(scraped);
    } catch (err) {
      errors.push(`AMP ${slug}: ${err instanceof Error ? err.message : "failed"}`);
    }
  }

  return { events, errors };
}
