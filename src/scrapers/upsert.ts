import { prisma } from "@/lib/prisma";
import { findDuplicate } from "@/lib/dedup";
import { slugify, stringifyTags } from "@/lib/utils";
import type { ScraperResult } from "./index";

export async function upsertScrapedEvents(
  results: ScraperResult[],
  citySlug: string
): Promise<{ created: number; updated: number; skipped: number; duplicates: number }> {
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  if (!city) throw new Error(`City not found: ${citySlug}`);

  const existing = await prisma.event.findMany({
    where: { cityId: city.id, status: { in: ["APPROVED", "PAST"] } },
    select: {
      id: true,
      title: true,
      startsAt: true,
      locality: true,
      venue: true,
      sourceType: true,
      externalId: true,
    },
  });

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let duplicates = 0;

  for (const result of results) {
    for (const event of result.events) {
      if (event.externalId) {
        const existingById = existing.find(
          (e) =>
            e.sourceType === result.source && e.externalId === event.externalId
        );
        if (existingById) {
          const collegeId = event.collegeSlug
            ? (
                await prisma.college.findUnique({
                  where: { slug: event.collegeSlug },
                  select: { id: true },
                })
              )?.id
            : undefined;

          await prisma.event.update({
            where: { id: existingById.id },
            data: {
              title: event.title,
              description: event.description,
              startsAt: event.startsAt,
              endsAt: event.endsAt,
              registrationDeadline: event.registrationDeadline,
              format: event.format,
              registrationUrl: event.registrationUrl,
              externalUrl: event.externalUrl,
              tags: stringifyTags(event.tags ?? []),
              collegeId,
              status: "APPROVED",
            },
          });
          updated++;
          continue;
        }
      }

      const dup = findDuplicate(
        event.title,
        event.startsAt,
        event.locality,
        existing.filter((e) => e.sourceType !== result.source)
      );
      if (dup) {
        duplicates++;
        continue;
      }

      const baseSlug = slugify(event.title);
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.event.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const collegeId = event.collegeSlug
        ? (
            await prisma.college.findUnique({
              where: { slug: event.collegeSlug },
              select: { id: true },
            })
          )?.id
        : undefined;

      const createdEvent = await prisma.event.create({
        data: {
          title: event.title,
          slug,
          description: event.description,
          startsAt: event.startsAt,
          endsAt: event.endsAt,
          registrationDeadline: event.registrationDeadline,
          format: event.format,
          category: event.category,
          venue: event.venue,
          locality: event.locality,
          cityId: city.id,
          collegeId,
          registrationUrl: event.registrationUrl,
          externalUrl: event.externalUrl,
          externalId: event.externalId,
          prizePool: event.prizePool,
          tags: stringifyTags(event.tags ?? []),
          sourceType: result.source,
          status: "APPROVED",
        },
      });

      existing.push({
        id: createdEvent.id,
        title: createdEvent.title,
        startsAt: createdEvent.startsAt,
        locality: createdEvent.locality,
        venue: createdEvent.venue,
        sourceType: createdEvent.sourceType,
        externalId: createdEvent.externalId,
      });
      created++;
    }
  }

  return { created, updated, skipped, duplicates };
}
