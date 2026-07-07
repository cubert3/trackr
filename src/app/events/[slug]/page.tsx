import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events";
import { CATEGORY_COLORS, SOURCE_LABELS } from "@/lib/constants";
import { cn, parseTags } from "@/lib/utils";
import {
  getEffectiveRegistrationDeadline,
  getDeadlineUrgency,
  isAttendable,
} from "@/lib/attendable";
import { format, formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} · Trackr`,
    description: event.description ?? undefined,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event || !isAttendable(event)) notFound();

  const tags = parseTags(event.tags);
  const categoryClass =
    CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER;
  const deadline = getEffectiveRegistrationDeadline(event);
  const urgency = getDeadlineUrgency(event);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bangalore events
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            categoryClass
          )}
        >
          {event.category.replace("_", " ")}
        </span>
        <span className="text-xs text-zinc-600">
          via {SOURCE_LABELS[event.sourceType]}
        </span>
        {event.college && (
          <span className="text-xs text-zinc-500">
            · {event.college.shortName ?? event.college.name}
          </span>
        )}
      </div>

      <h1 className="mb-6 text-3xl font-bold tracking-tight text-white">
        {event.title}
      </h1>

      <div className="mb-8 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex items-start gap-3 text-zinc-300">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
          <div>
            <div>{format(new Date(event.startsAt), "EEEE, MMMM d, yyyy")}</div>
            <div className="text-sm text-zinc-500">
              {format(new Date(event.startsAt), "h:mm a")}
              {event.endsAt &&
                ` – ${format(new Date(event.endsAt), "MMM d, h:mm a")}`}
            </div>
          </div>
        </div>

        {(event.venue || event.locality) && (
          <div className="flex items-start gap-3 text-zinc-300">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
            <div>
              {event.venue && <div>{event.venue}</div>}
              {event.locality && (
                <div className="text-sm text-zinc-500">{event.locality}</div>
              )}
            </div>
          </div>
        )}

        {event.prizePool && (
          <div className="flex items-center gap-3 text-amber-400">
            <Trophy className="h-5 w-5 shrink-0" />
            <span>{event.prizePool}</span>
          </div>
        )}

        <div className="flex items-start gap-3 text-zinc-300">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <div>
              Registration closes{" "}
              {format(deadline, "EEEE, MMMM d · h:mm a")}
            </div>
            <div className="text-sm text-zinc-500">
              {urgency === "today"
                ? "Closing today — register now"
                : formatDistanceToNow(deadline, { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>

      {event.description && (
        <div className="mb-8">
          <h2 className="mb-2 text-sm font-medium text-zinc-400">About</h2>
          <p className="leading-relaxed text-zinc-300">{event.description}</p>
        </div>
      )}

      {tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {event.registrationUrl && (
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
        >
          Register
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
