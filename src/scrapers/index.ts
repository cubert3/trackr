import type { EventCategory, EventFormat, SourceType } from "@/lib/types";

export interface ScrapedEvent {
  title: string;
  description?: string;
  startsAt: Date;
  endsAt?: Date;
  registrationDeadline?: Date;
  format: EventFormat;
  category: EventCategory;
  venue?: string;
  locality?: string;
  registrationUrl?: string;
  externalUrl?: string;
  externalId?: string;
  prizePool?: string;
  tags?: string[];
  collegeSlug?: string;
}

export interface ScraperResult {
  source: SourceType;
  events: ScrapedEvent[];
  errors: string[];
}

export interface Scraper {
  name: string;
  source: SourceType;
  /** Filter by city slug when scraper supports it */
  run(citySlug?: string): Promise<ScraperResult>;
}

export { runAllScrapers } from "./runner";
export { upsertScrapedEvents } from "./upsert";
