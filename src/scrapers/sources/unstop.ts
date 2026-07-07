import type { Scraper } from "../index";

/**
 * Unstop scraper stub.
 * TODO: Implement actual scraping via Unstop API or HTML parser.
 * Filter: location=Bangalore, type=hackathons
 */
export const unstopScraper: Scraper = {
  name: "Unstop",
  source: "UNSTOP",
  async run(citySlug = "bangalore") {
    if (citySlug !== "bangalore") {
      return { source: "UNSTOP", events: [], errors: [] };
    }
    return {
      source: "UNSTOP",
      events: [],
      errors: ["Unstop scraper not yet implemented — add API key or HTML parser"],
    };
  },
};
