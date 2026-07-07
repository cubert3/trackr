/**
 * Fuzzy duplicate detection for events.
 * Matches on normalized title + date + locality/city.
 */

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(hackathon|hack|fest|2024|2025|2026|2027)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.85;

  const longer = na.length > nb.length ? na : nb;
  const shorter = na.length > nb.length ? nb : na;
  let matches = 0;
  for (const char of shorter) {
    if (longer.includes(char)) matches++;
  }
  return matches / longer.length;
}

export interface DedupCandidate {
  id: string;
  title: string;
  startsAt: Date;
  locality?: string | null;
  venue?: string | null;
}

export function findDuplicate(
  title: string,
  startsAt: Date,
  locality: string | null | undefined,
  candidates: DedupCandidate[],
  threshold = 0.75
): DedupCandidate | null {
  const sameDay = candidates.filter((c) => {
    const a = new Date(c.startsAt);
    return (
      a.getFullYear() === startsAt.getFullYear() &&
      a.getMonth() === startsAt.getMonth() &&
      a.getDate() === startsAt.getDate()
    );
  });

  for (const candidate of sameDay) {
    const sim = titleSimilarity(title, candidate.title);
    if (sim >= threshold) {
      const locA = (locality ?? "").toLowerCase();
      const locB = (candidate.locality ?? candidate.venue ?? "").toLowerCase();
      if (!locA || !locB || locA.includes(locB) || locB.includes(locA)) {
        return candidate;
      }
      if (sim >= 0.9) return candidate;
    }
  }

  return null;
}

export function validateEventDate(startsAt: Date): string | null {
  const now = new Date();
  const oneYearOut = new Date();
  oneYearOut.setFullYear(oneYearOut.getFullYear() + 1);

  if (startsAt < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) {
    return "Event date is in the past";
  }
  if (startsAt > oneYearOut) {
    return "Event date is more than a year away";
  }
  return null;
}
