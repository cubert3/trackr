import { cn, parseTags } from "@/lib/utils";
import { CATEGORY_COLORS, SOURCE_LABELS } from "@/lib/constants";
import {
  getDeadlineUrgency,
  getEffectiveRegistrationDeadline,
} from "@/lib/attendable";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, MapPin, Trophy, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import type { Event, City, College } from "@prisma/client";

type EventWithRelations = Event & {
  city: City;
  college: College | null;
};

interface EventCardProps {
  event: EventWithRelations;
}

const URGENCY_STYLES = {
  today: "border-red-500/40 bg-red-500/10 text-red-300",
  soon: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  closed: "border-zinc-600/40 bg-zinc-800/50 text-zinc-500",
};

export function EventCard({ event }: EventCardProps) {
  const tags = parseTags(event.tags);
  const categoryClass =
    CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.OTHER;
  const deadline = getEffectiveRegistrationDeadline(event);
  const urgency = getDeadlineUrgency(event);

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-violet-500/40 hover:bg-zinc-900"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-xs font-medium",
            categoryClass
          )}
        >
          {event.category.replace("_", " ")}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            URGENCY_STYLES[urgency]
          )}
        >
          <Clock className="h-3 w-3" />
          {urgency === "today"
            ? "Reg closes today"
            : urgency === "soon"
              ? `Reg closes ${formatDistanceToNow(deadline, { addSuffix: true })}`
              : `Reg open · ${format(deadline, "MMM d")}`}
        </span>
        {event.format === "ONLINE" && (
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs text-sky-300">
            Online
          </span>
        )}
        <span className="text-xs text-zinc-600">
          via {SOURCE_LABELS[event.sourceType] ?? event.sourceType}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-violet-200 transition-colors line-clamp-2">
        {event.title}
      </h3>

      {event.description && (
        <p className="mb-4 text-sm text-zinc-400 line-clamp-2">
          {event.description}
        </p>
      )}

      <div className="space-y-1.5 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-violet-400" />
          <span>
            {format(new Date(event.startsAt), "EEE, MMM d · h:mm a")}
          </span>
        </div>

        {(event.locality || event.venue) && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-violet-400" />
            <span className="truncate">
              {event.venue ?? event.locality}
              {event.venue && event.locality && event.venue !== event.locality
                ? ` · ${event.locality}`
                : ""}
            </span>
          </div>
        )}

        {event.college && (
          <div className="text-xs text-zinc-600">
            {event.college.shortName ?? event.college.name}
          </div>
        )}

        {event.prizePool && (
          <div className="flex items-center gap-2 text-amber-400/90">
            <Trophy className="h-4 w-4 shrink-0" />
            <span>{event.prizePool}</span>
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {event.registrationUrl && (
        <div className="mt-4 flex items-center gap-1 text-xs text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-3 w-3" />
          Register now
        </div>
      )}
    </Link>
  );
}
