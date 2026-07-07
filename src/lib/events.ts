import { prisma } from "@/lib/prisma";
import { isAttendable, shouldMarkPast } from "@/lib/attendable";
import type { EventCategory, EventFormat } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export interface EventFilters {
  citySlug?: string;
  category?: EventCategory;
  format?: EventFormat;
  locality?: string;
  collegeSlug?: string;
  search?: string;
  /** Only events with open registration and not ended (default: true) */
  attendableOnly?: boolean;
}

/** Mark events whose end date has passed as PAST */
export async function archivePastEvents(citySlug?: string) {
  const now = new Date();
  const where: Prisma.EventWhereInput = {
    status: "APPROVED",
    ...(citySlug ? { city: { slug: citySlug } } : {}),
  };

  const candidates = await prisma.event.findMany({
    where,
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      registrationDeadline: true,
      status: true,
    },
  });

  const toArchive = candidates.filter((e) => shouldMarkPast(e, now));
  if (toArchive.length === 0) return 0;

  await prisma.event.updateMany({
    where: { id: { in: toArchive.map((e) => e.id) } },
    data: { status: "PAST" },
  });

  return toArchive.length;
}

export async function getEvents(filters: EventFilters = {}) {
  const {
    citySlug = "bangalore",
    category,
    format,
    locality,
    collegeSlug,
    search,
    attendableOnly = true,
  } = filters;

  await archivePastEvents(citySlug);

  const where: Prisma.EventWhereInput = {
    status: "APPROVED",
    city: { slug: citySlug },
  };

  if (category) where.category = category;
  if (format) where.format = format;
  if (locality) where.locality = { contains: locality };
  if (collegeSlug) where.college = { slug: collegeSlug };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { locality: { contains: search } },
      { venue: { contains: search } },
    ];
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      city: true,
      college: true,
    },
    orderBy: [{ registrationDeadline: "asc" }, { startsAt: "asc" }],
  });

  if (!attendableOnly) return events;

  const now = new Date();
  return events.filter((e) => isAttendable(e, now));
}

export async function getTrendingByCollege(citySlug: string, collegeSlug: string, limit = 6) {
  const events = await getEvents({
    citySlug,
    collegeSlug,
    attendableOnly: true,
  });
  return events.slice(0, limit);
}

export async function getEventBySlug(slug: string) {
  const event = await prisma.event.findUnique({
    where: { slug },
    include: {
      city: true,
      college: true,
      submittedBy: { include: { college: true } },
    },
  });

  if (event) {
    if (shouldMarkPast(event)) {
      await prisma.event.update({
        where: { id: event.id },
        data: { status: "PAST" },
      });
      return null;
    }
    if (!isAttendable(event)) return null;
  }

  return event;
}

export async function getActiveCities() {
  return prisma.city.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getCollegesByCity(citySlug: string) {
  return prisma.college.findMany({
    where: { city: { slug: citySlug } },
    orderBy: { name: "asc" },
  });
}

export async function getCollegeBySlug(slug: string) {
  return prisma.college.findFirst({
    where: { slug },
    include: { city: true },
  });
}

export async function getEventStats(citySlug = "bangalore") {
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  if (!city) return { total: 0, hackathons: 0, meetups: 0, thisWeek: 0, closingSoon: 0 };

  await archivePastEvents(citySlug);

  const all = await prisma.event.findMany({
    where: { cityId: city.id, status: "APPROVED" },
  });

  const now = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const threeDays = new Date();
  threeDays.setDate(threeDays.getDate() + 3);

  const attendable = all.filter((e) => isAttendable(e, now));

  return {
    total: attendable.length,
    hackathons: attendable.filter((e) => e.category === "HACKATHON").length,
    meetups: attendable.filter((e) => e.category === "MEETUP").length,
    thisWeek: attendable.filter((e) => {
      const start = new Date(e.startsAt);
      return start >= now && start <= weekEnd;
    }).length,
    closingSoon: attendable.filter((e) => {
      const deadline = e.registrationDeadline ?? e.startsAt;
      return deadline >= now && deadline <= threeDays;
    }).length,
  };
}
