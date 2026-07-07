import { fetchHtml } from "../src/scrapers/lib/http";
import { parseFlexibleDate } from "../src/scrapers/lib/parse-date";
import { isTechEvent } from "../src/scrapers/lib/college-map";

async function main() {
  const html = await fetchHtml("https://events.pes.edu/");
  const dateEntries = [
    ...html.matchAll(/href="(\/\d+\/)"[\s\S]{0,1200}?event-date-text[^>]*>([^<]+)/g),
  ];
  const now = new Date();
  for (const m of dateEntries) {
    const chunk = html.slice(
      Math.max(0, html.indexOf(m[0]) - 800),
      html.indexOf(m[0]) + m[0].length
    );
    const title =
      chunk.match(/title-sin_item"><a[^>]*>([^<]+)/)?.[1]?.trim() ??
      chunk.match(/<h6>([^<]+)<\/h6>/)?.[1]?.trim() ??
      "?";
    const ribbon = chunk.match(/ribbon-(upcoming|ongoing|previous)/)?.[1];
    const listDate = parseFlexibleDate(m[2].trim());
    const tech = isTechEvent(title);
    console.log({
      path: m[1],
      title,
      listDate: m[2].trim(),
      ribbon,
      tech,
      past: listDate && listDate < now,
    });
  }
}

main().catch(console.error);
