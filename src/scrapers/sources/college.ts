import type { Scraper } from "../index";
import { scrapePesEvents } from "./pes-events";
import { scrapeUnstopCollegeEvents } from "./unstop-college";

/**
 * College fest / campus event scraper.
 * Sources: PES events portal, Unstop (RVCE, MSRIT, etc.)
 */
export const collegeScraper: Scraper = {
  name: "College Fest Pages",
  source: "COLLEGE",
  async run(citySlug = "bangalore") {
    if (citySlug !== "bangalore") {
      return { source: "COLLEGE", events: [], errors: [] };
    }

    const errors: string[] = [];
    const events = [];

    try {
      const pes = await scrapePesEvents();
      events.push(...pes);
    } catch (err) {
      errors.push(`PES: ${err instanceof Error ? err.message : "fetch failed"}`);
    }

    try {
      const unstop = await scrapeUnstopCollegeEvents();
      events.push(...unstop.events);
      errors.push(...unstop.errors);
    } catch (err) {
      errors.push(`Unstop: ${err instanceof Error ? err.message : "fetch failed"}`);
    }

    return { source: "COLLEGE", events, errors };
  },
};
