import type { Scraper, ScraperResult } from "./index";
import { unstopScraper } from "./sources/unstop";
import { devfolioScraper } from "./sources/devfolio";
import { meetupScraper } from "./sources/meetup";
import { collegeScraper } from "./sources/college";

const scrapers: Scraper[] = [
  unstopScraper,
  devfolioScraper,
  meetupScraper,
  collegeScraper,
];

export async function runAllScrapers(citySlug = "bangalore"): Promise<ScraperResult[]> {
  const results: ScraperResult[] = [];

  for (const scraper of scrapers) {
    try {
      console.log(`Running ${scraper.name}...`);
      const result = await scraper.run(citySlug);
      results.push(result);
      console.log(`  Found ${result.events.length} events`);
      if (result.errors.length) {
        console.warn(`  Errors: ${result.errors.join(", ")}`);
      }
    } catch (err) {
      results.push({
        source: scraper.source,
        events: [],
        errors: [err instanceof Error ? err.message : "Unknown error"],
      });
    }
  }

  return results;
}
