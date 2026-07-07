import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  getEvents,
  getCollegesByCity,
  getEventStats,
  getTrendingByCollege,
} from "@/lib/events";
import { EventCard } from "@/components/event-card";
import { EventFilters } from "@/components/event-filters";
import { CollegePicker, COOKIE_NAME } from "@/components/college-picker";
import { DEFAULT_CITY_SLUG } from "@/lib/constants";
import type { EventCategory, EventFormat } from "@/lib/types";
import { CalendarDays, Clock, MapPin, Trophy, Users } from "lucide-react";
import Link from "next/link";

interface HomeProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    locality?: string;
    college?: string;
    format?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const myCollege =
    params.college ?? cookieStore.get(COOKIE_NAME)?.value ?? undefined;

  const colleges = await getCollegesByCity(DEFAULT_CITY_SLUG);
  const stats = await getEventStats(DEFAULT_CITY_SLUG);

  const events = await getEvents({
    citySlug: DEFAULT_CITY_SLUG,
    search: params.q,
    category: params.category as EventCategory | undefined,
    locality: params.locality,
    collegeSlug: myCollege,
    format: params.format as EventFormat | undefined,
    attendableOnly: true,
  });

  const trending = myCollege
    ? await getTrendingByCollege(DEFAULT_CITY_SLUG, myCollege, 3)
    : [];

  const myCollegeName = colleges.find((c) => c.slug === myCollege);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
          <MapPin className="h-3 w-3" />
          Bangalore · Karnataka
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Hackathons you can still join
          <span className="block text-violet-400">registration open</span>
        </h1>
        <p className="max-w-2xl text-zinc-400">
          Only events with open registration and upcoming dates — no stale or
          already-finished listings.
        </p>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard icon={CalendarDays} label="Open to join" value={stats.total} />
        <StatCard icon={Trophy} label="Hackathons" value={stats.hackathons} />
        <StatCard icon={Users} label="Meetups" value={stats.meetups} />
        <StatCard icon={CalendarDays} label="This week" value={stats.thisWeek} />
        <StatCard icon={Clock} label="Closing soon" value={stats.closingSoon} />
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <Suspense fallback={<div className="h-20 animate-pulse rounded-lg bg-zinc-900" />}>
          <EventFilters colleges={colleges} />
        </Suspense>
        <Suspense fallback={null}>
          <CollegePicker colleges={colleges} />
        </Suspense>
      </div>

      {myCollege && trending.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Trending at {myCollegeName?.shortName ?? myCollegeName?.name}
            </h2>
            <Link
              href={`/college/${myCollege}`}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {trending.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-4">
        <h2 className="mb-4 text-lg font-semibold text-white">
          {myCollege
            ? `All open events · ${myCollegeName?.shortName ?? "your college"}`
            : "All open events in Bangalore"}
        </h2>
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 py-16 text-center">
            <p className="text-zinc-500">
              No events with open registration match your filters.
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Know one? Add it nearby →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <section className="mt-16 rounded-xl border border-zinc-800 bg-gradient-to-br from-violet-950/40 to-zinc-900 p-8 text-center">
        <h2 className="text-xl font-semibold text-white">
          Spotted a hackathon on WhatsApp?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
          Add it with the registration deadline — we only show events you can
          still apply to.
        </p>
        <Link
          href="/submit"
          className="mt-6 inline-block rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          Add event nearby
        </Link>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <Icon className="mb-2 h-5 w-5 text-violet-400" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}
