import { archivePastEvents } from "@/lib/events";

const citySlug = process.argv[2] ?? "bangalore";

async function main() {
  const archived = await archivePastEvents(citySlug);
  console.log(`Archived ${archived} past event(s) in ${citySlug}.`);
}

main().catch(console.error);
