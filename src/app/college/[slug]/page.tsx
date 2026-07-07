import { notFound } from "next/navigation";
import { getCollegeBySlug, getEvents } from "@/lib/events";
import { EventCard } from "@/components/event-card";
import { DEFAULT_CITY_SLUG } from "@/lib/constants";
import { GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);
  if (!college) return { title: "College not found" };
  return {
    title: `${college.shortName ?? college.name} events · Trackr`,
    description: `Open hackathons and tech events at ${college.name}, Bangalore`,
  };
}

export default async function CollegePage({ params }: PageProps) {
  const { slug } = await params;
  const college = await getCollegeBySlug(slug);
  if (!college) notFound();

  const events = await getEvents({
    citySlug: DEFAULT_CITY_SLUG,
    collegeSlug: slug,
    attendableOnly: true,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all events
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20">
          <GraduationCap className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {college.shortName ?? college.name}
          </h1>
          <p className="text-sm text-zinc-500">
            {events.length} event{events.length !== 1 ? "s" : ""} with open
            registration
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 py-16 text-center">
          <p className="text-zinc-500">
            No open events at {college.shortName ?? college.name} right now.
          </p>
          <Link
            href="/submit"
            className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300"
          >
            Add a campus event →
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
  );
}
