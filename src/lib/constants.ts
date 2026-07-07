export const DEFAULT_CITY_SLUG = "bangalore";

export const CATEGORIES = [
  { value: "HACKATHON", label: "Hackathon" },
  { value: "MEETUP", label: "Meetup" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "DEMO_DAY", label: "Demo Day" },
  { value: "TECH_FEST", label: "Tech Fest" },
  { value: "COMPETITION", label: "Competition" },
  { value: "OTHER", label: "Other" },
] as const;

export const FORMATS = [
  { value: "IN_PERSON", label: "In person" },
  { value: "ONLINE", label: "Online" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const BANGALORE_LOCALITIES = [
  "Indiranagar",
  "Koramangala",
  "HSR Layout",
  "Whitefield",
  "Electronic City",
  "MG Road",
  "Jayanagar",
  "Marathahalli",
  "Bellandur",
  "Hebbal",
  "BTM Layout",
  "Malleshwaram",
  "RVCE Campus",
  "PES Campus",
  "BMSCE Campus",
  "MSRIT Campus",
  "IIIT-B Campus",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  HACKATHON: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  MEETUP: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  WORKSHOP: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  DEMO_DAY: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  TECH_FEST: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  COMPETITION: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  OTHER: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

export const SOURCE_LABELS: Record<string, string> = {
  UNSTOP: "Unstop",
  DEVFOLIO: "Devfolio",
  DEVPOST: "Devpost",
  MLH: "MLH",
  HACKEREARTH: "HackerEarth",
  MEETUP: "Meetup",
  INSTAGRAM: "Instagram",
  COWORKING: "Co-working hub",
  COLLEGE: "College",
  CROWDSOURCED: "Community",
  MANUAL: "Trackr",
};
