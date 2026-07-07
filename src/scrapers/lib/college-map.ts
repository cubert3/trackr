/** Map scraped text to Trackr college slug */
const COLLEGE_PATTERNS: { slug: string; patterns: RegExp[] }[] = [
  {
    slug: "rvce",
    patterns: [/rvce/i, /r\.?\s*v\.?\s*college of engineering/i],
  },
  {
    slug: "pes",
    patterns: [/pes university/i, /pesu/i, /pes university/i],
  },
  {
    slug: "msrit",
    patterns: [/ms rit/i, /msrit/i, /m\.?\s*s\.?\s*ramaiah/i, /ramaiah institute/i],
  },
  {
    slug: "bmsce",
    patterns: [/bmsce/i, /bms college of engineering/i],
  },
  {
    slug: "iiit-b",
    patterns: [/iiit-?b/i, /iiit bangalore/i],
  },
  {
    slug: "christ",
    patterns: [/christ university/i],
  },
  {
    slug: "dsce",
    patterns: [/dayananda sagar/i, /dsce/i],
  },
  {
    slug: "nhce",
    patterns: [/new horizon college/i, /nhce/i],
  },
];

export function inferCollegeSlug(...texts: (string | undefined)[]): string | undefined {
  const haystack = texts.filter(Boolean).join(" ").toLowerCase();
  for (const { slug, patterns } of COLLEGE_PATTERNS) {
    if (patterns.some((p) => p.test(haystack))) return slug;
  }
  return undefined;
}

export function isTechEvent(title: string, tags: string[] = []): boolean {
  const hay = `${title} ${tags.join(" ")}`.toLowerCase();
  return /hackathon|hack|coding|ctf|capture the flag|code\s*crafter|tech\s*fest|programming|developer|mlh|sih|smart india/i.test(
    hay
  );
}
