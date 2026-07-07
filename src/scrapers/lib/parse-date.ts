const MONTHS: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  sept: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

/** Parse "July 04, 2026" or "16 Apr'26, 11:59 PM IST" */
export function parseFlexibleDate(text: string): Date | null {
  const trimmed = text.trim();

  let m = trimmed.match(
    /(\w+)\s+(\d{1,2}),?\s+(\d{4})(?:\s+[\d:]+\s*(?:AM|PM)?)?/i
  );
  if (m) {
    const month = MONTHS[m[1].toLowerCase()];
    if (month === undefined) return null;
    return new Date(Number(m[3]), month, Number(m[2]), 23, 59, 0);
  }

  m = trimmed.match(/(\d{1,2})\s+(\w+)'(\d{2})/i);
  if (m) {
    const month = MONTHS[m[2].toLowerCase()];
    if (month === undefined) return null;
    const year = 2000 + Number(m[3]);
    const hourMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    let hour = 23;
    let minute = 59;
    if (hourMatch) {
      hour = Number(hourMatch[1]) % 12;
      minute = Number(hourMatch[2]);
      if (hourMatch[3].toUpperCase() === "PM") hour += 12;
    }
    return new Date(year, month, Number(m[1]), hour, minute, 0);
  }

  return null;
}

export function parseDateRange(text: string): { start: Date; end?: Date } | null {
  const parts = text.split(/\s*-\s*/);
  const start = parseFlexibleDate(parts[0]);
  if (!start) return null;
  const end = parts[1] ? parseFlexibleDate(parts[1]) : undefined;
  return { start, end: end ?? undefined };
}
