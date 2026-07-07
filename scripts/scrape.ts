import { runAllScrapers } from "../src/scrapers/runner";
import { upsertScrapedEvents } from "../src/scrapers/upsert";

const citySlug = process.argv[2] ?? "bangalore";

async function main() {
  console.log(`Scraping events for ${citySlug}...\n`);
  const results = await runAllScrapers(citySlug);
  const stats = await upsertScrapedEvents(results, citySlug);

  console.log("\nDone:");
  console.log(`  Created: ${stats.created}`);
  console.log(`  Updated: ${stats.updated}`);
  console.log(`  Skipped (already exists): ${stats.skipped}`);
  console.log(`  Duplicates filtered: ${stats.duplicates}`);
}

main().catch(console.error);
