import { PrismaClient } from "@prisma/client";
import type { SourceType, EventCategory, EventFormat } from "../src/lib/types";
import { slugify, stringifyTags } from "../src/lib/utils";

const prisma = new PrismaClient();

const bangaloreColleges = [
  { name: "RV College of Engineering", slug: "rvce", shortName: "RVCE" },
  { name: "PES University", slug: "pes", shortName: "PES" },
  { name: "BMS College of Engineering", slug: "bmsce", shortName: "BMSCE" },
  { name: "MS Ramaiah Institute of Technology", slug: "msrit", shortName: "MSRIT" },
  { name: "IIIT Bangalore", slug: "iiit-b", shortName: "IIIT-B" },
  { name: "Christ University", slug: "christ", shortName: "Christ" },
  { name: "Dayananda Sagar College of Engineering", slug: "dsce", shortName: "DSCE" },
  { name: "BMS Institute of Technology", slug: "bmsit", shortName: "BMSIT" },
  { name: "New Horizon College of Engineering", slug: "nhce", shortName: "NHCE" },
  { name: "SRM Institute of Science and Technology", slug: "srm-blr", shortName: "SRM" },
];

interface SeedEvent {
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  format: EventFormat;
  category: EventCategory;
  venue?: string;
  locality: string;
  collegeSlug?: string;
  registrationUrl?: string;
  prizePool?: string;
  tags: string[];
  sourceType: SourceType;
  externalUrl?: string;
}

function daysFromNow(days: number, hour = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function regDeadlineBefore(startIso: string, daysBefore = 2, hour = 23): Date {
  const d = new Date(startIso);
  d.setDate(d.getDate() - daysBefore);
  d.setHours(hour, 59, 0, 0);
  return d;
}

const seedEvents: SeedEvent[] = [
  {
    title: "CodeStorm 2026 — RVCE Annual Hackathon",
    description: "48-hour campus hackathon at RVCE. Open to all engineering students across Bangalore. Tracks: AI/ML, Web3, Sustainability.",
    startsAt: daysFromNow(12).toISOString(),
    endsAt: daysFromNow(14, 18).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "RV College of Engineering",
    locality: "RVCE Campus",
    collegeSlug: "rvce",
    registrationUrl: "https://unstop.com",
    prizePool: "₹2,00,000",
    tags: ["campus", "ai-ml", "web3"],
    sourceType: "COLLEGE",
  },
  {
    title: "PES HackOverflow 2026",
    description: "PES University's flagship hackathon. 36 hours, 500+ participants expected. Sponsored by top Bangalore startups.",
    startsAt: daysFromNow(18).toISOString(),
    endsAt: daysFromNow(20, 16).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "PES University Ring Road Campus",
    locality: "PES Campus",
    collegeSlug: "pes",
    prizePool: "₹1,50,000",
    tags: ["campus", "startup"],
    sourceType: "COLLEGE",
  },
  {
    title: "BMSCE Technovation Hackathon",
    description: "Inter-college hackathon hosted by BMSCE IEEE. Problem statements from industry partners.",
    startsAt: daysFromNow(25).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "BMS College of Engineering",
    locality: "BMSCE Campus",
    collegeSlug: "bmsce",
    prizePool: "₹75,000",
    tags: ["campus", "ieee"],
    sourceType: "COLLEGE",
  },
  {
    title: "IIIT-B Open Hack 2026",
    description: "Research-focused hackathon at IIIT Bangalore. Strong emphasis on NLP, CV, and systems.",
    startsAt: daysFromNow(30).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "IIIT Bangalore",
    locality: "IIIT-B Campus",
    collegeSlug: "iiit-b",
    prizePool: "₹1,00,000",
    tags: ["research", "ai-ml", "nlp"],
    sourceType: "COLLEGE",
  },
  {
    title: "MSRIT Hackathon — Innovate Bengaluru",
    description: "MSRIT CSE department annual hackathon. Themes: Smart City, HealthTech, EdTech.",
    startsAt: daysFromNow(8).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "MS Ramaiah Institute of Technology",
    locality: "MSRIT Campus",
    collegeSlug: "msrit",
    prizePool: "₹50,000",
    tags: ["campus", "healthtech"],
    sourceType: "COLLEGE",
  },
  {
    title: "GDG Bangalore — Build with AI Workshop",
    description: "Hands-on workshop on Gemini API and Firebase AI. Free, beginner-friendly.",
    startsAt: daysFromNow(5, 14).toISOString(),
    format: "IN_PERSON",
    category: "WORKSHOP",
    venue: "Google Office Bangalore",
    locality: "Koramangala",
    registrationUrl: "https://meetup.com",
    tags: ["gdg", "ai-ml", "workshop"],
    sourceType: "MEETUP",
  },
  {
    title: "PyData Bangalore Monthly Meetup",
    description: "Talks on data engineering and ML in production. Pizza and networking after.",
    startsAt: daysFromNow(9, 18).toISOString(),
    format: "IN_PERSON",
    category: "MEETUP",
    venue: "91springboard Koramangala",
    locality: "Koramangala",
    tags: ["pydata", "data-science"],
    sourceType: "MEETUP",
  },
  {
    title: "Bangalore AI/ML Community Meetup",
    description: "Lightning talks from practitioners at Flipkart, Razorpay, and startups. Open Q&A.",
    startsAt: daysFromNow(14, 18).toISOString(),
    format: "IN_PERSON",
    category: "MEETUP",
    venue: "WeWork Embassy Tech Village",
    locality: "Indiranagar",
    tags: ["ai-ml", "networking"],
    sourceType: "MEETUP",
  },
  {
    title: "91springboard Startup Demo Day",
    description: "Batch demo day for 91springboard accelerator cohort. Open to investors and students.",
    startsAt: daysFromNow(21, 16).toISOString(),
    format: "IN_PERSON",
    category: "DEMO_DAY",
    venue: "91springboard HSR Layout",
    locality: "HSR Layout",
    tags: ["startup", "demo-day"],
    sourceType: "COWORKING",
  },
  {
    title: "NASSCOM 10000 Startups — Pitch Day Bangalore",
    description: "Early-stage startup pitches. Great for students exploring entrepreneurship.",
    startsAt: daysFromNow(28, 11).toISOString(),
    format: "IN_PERSON",
    category: "DEMO_DAY",
    venue: "NASSCOM Startup Warehouse",
    locality: "Koramangala",
    tags: ["startup", "nasscom"],
    sourceType: "COWORKING",
  },
  {
    title: "Devfolio Hack This Fall — Bangalore Edition",
    description: "Online-first hackathon with optional in-person meetup at HSR co-working space.",
    startsAt: daysFromNow(15).toISOString(),
    endsAt: daysFromNow(17).toISOString(),
    format: "HYBRID",
    category: "HACKATHON",
    venue: "91springboard HSR",
    locality: "HSR Layout",
    registrationUrl: "https://devfolio.co",
    prizePool: "₹3,00,000",
    tags: ["devfolio", "online"],
    sourceType: "DEVFOLIO",
  },
  {
    title: "Smart India Hackathon 2026 — Internal Round (Christ)",
    description: "Christ University internal SIH selection hackathon. Winners proceed to national round.",
    startsAt: daysFromNow(35).toISOString(),
    format: "IN_PERSON",
    category: "COMPETITION",
    venue: "Christ University Hosur Road",
    locality: "Electronic City",
    collegeSlug: "christ",
    tags: ["sih", "government"],
    sourceType: "COLLEGE",
  },
  {
    title: "Dayananda Sagar Tech Fest — CodeRush",
    description: "DSCE annual tech fest featuring 24-hour hackathon, robotics, and coding contests.",
    startsAt: daysFromNow(42).toISOString(),
    format: "IN_PERSON",
    category: "TECH_FEST",
    venue: "Dayananda Sagar College of Engineering",
    locality: "Electronic City",
    collegeSlug: "dsce",
    prizePool: "₹80,000",
    tags: ["tech-fest", "campus"],
    sourceType: "COLLEGE",
  },
  {
    title: "React Bangalore — Server Components Deep Dive",
    description: "Community meetup covering Next.js App Router patterns. All levels welcome.",
    startsAt: daysFromNow(7, 18).toISOString(),
    format: "IN_PERSON",
    category: "MEETUP",
    venue: "Razorpay Office",
    locality: "Koramangala",
    tags: ["react", "frontend"],
    sourceType: "MEETUP",
  },
  {
    title: "Bangalore Blockchain Hackathon",
    description: "Web3 hackathon focused on DeFi and identity. Sponsored by local crypto startups.",
    startsAt: daysFromNow(22).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "WeWork Galaxy",
    locality: "Bellandur",
    prizePool: "₹1,25,000",
    tags: ["web3", "blockchain"],
    sourceType: "CROWDSOURCED",
  },
  {
    title: "Flipkart GRiD 2026 — Bangalore Finals",
    description: "Engineering challenge finals for Flipkart GRiD. Top teams from south zone compete.",
    startsAt: daysFromNow(45, 9).toISOString(),
    format: "IN_PERSON",
    category: "COMPETITION",
    venue: "Flipkart Campus",
    locality: "Whitefield",
    prizePool: "Internship + prizes",
    tags: ["flipkart", "competition"],
    sourceType: "UNSTOP",
  },
  {
    title: "AWS Community Day Bangalore",
    description: "Full-day conference with workshops on cloud, serverless, and GenAI on AWS.",
    startsAt: daysFromNow(38).toISOString(),
    format: "IN_PERSON",
    category: "WORKSHOP",
    venue: "Hotel Lalit Ashok",
    locality: "Malleshwaram",
    tags: ["aws", "cloud"],
    sourceType: "MEETUP",
  },
  {
    title: "HSR Hack Night — Co-working Edition",
    description: "Informal overnight hack session at HSR co-working space. Bring your own team.",
    startsAt: daysFromNow(3, 20).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "91springboard HSR Layout",
    locality: "HSR Layout",
    tags: ["informal", "coworking"],
    sourceType: "COWORKING",
  },
  {
    title: "Women Who Code Bangalore — Hack for Impact",
    description: "Inclusive hackathon focused on social impact projects. Mentorship from industry leaders.",
    startsAt: daysFromNow(32).toISOString(),
    format: "HYBRID",
    category: "HACKATHON",
    venue: "Thoughtworks Office",
    locality: "Koramangala",
    prizePool: "₹60,000",
    tags: ["diversity", "social-impact"],
    sourceType: "CROWDSOURCED",
  },
  {
    title: "MLH Local Hack Day — Bangalore",
    description: "Beginner-friendly hack day organized by MLH. Learn Git, build a project in 12 hours.",
    startsAt: daysFromNow(16, 9).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "NHCE Campus",
    locality: "Marathahalli",
    collegeSlug: "nhce",
    tags: ["mlh", "beginner"],
    sourceType: "MLH",
  },
  {
    title: "HackerEarth Hiring Challenge — Bangalore DevOps",
    description: "Online coding challenge with onsite interview round for Bangalore roles.",
    startsAt: daysFromNow(10).toISOString(),
    format: "ONLINE",
    category: "COMPETITION",
    locality: "Online",
    registrationUrl: "https://hackerearth.com",
    tags: ["hiring", "devops"],
    sourceType: "HACKEREARTH",
  },
  {
    title: "Indiranagar Startup Pitch Night",
    description: "Monthly open mic for early-stage founders. Students welcome to attend and network.",
    startsAt: daysFromNow(6, 19).toISOString(),
    format: "IN_PERSON",
    category: "MEETUP",
    venue: "The Brew Room",
    locality: "Indiranagar",
    tags: ["startup", "networking"],
    sourceType: "CROWDSOURCED",
  },
  {
    title: "SRM Bangalore HackFusion 2026",
    description: "SRM's inter-department hackathon. Cross-functional teams encouraged.",
    startsAt: daysFromNow(50).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "SRM University Bangalore",
    locality: "Electronic City",
    collegeSlug: "srm-blr",
    prizePool: "₹40,000",
    tags: ["campus"],
    sourceType: "COLLEGE",
  },
  {
    title: "Bangalore Open Source Meetup",
    description: "Contributing to open source, GSoC tips, and project showcases.",
    startsAt: daysFromNow(11, 17).toISOString(),
    format: "IN_PERSON",
    category: "MEETUP",
    venue: "HasGeek House",
    locality: "Indiranagar",
    tags: ["open-source", "gsoc"],
    sourceType: "MEETUP",
  },
  {
    title: "FinTech Hackathon — Razorpay x Bangalore Startups",
    description: "Build payment and banking solutions. API credits and mentorship provided.",
    startsAt: daysFromNow(27).toISOString(),
    format: "IN_PERSON",
    category: "HACKATHON",
    venue: "Razorpay HQ",
    locality: "Koramangala",
    prizePool: "₹2,50,000",
    tags: ["fintech", "razorpay"],
    sourceType: "MANUAL",
  },
];

async function main() {
  console.log("Seeding Trackr database...");

  await prisma.otpVerification.deleteMany();
  await prisma.eventSubmission.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.college.deleteMany();
  await prisma.city.deleteMany();

  const bangalore = await prisma.city.create({
    data: {
      name: "Bangalore",
      slug: "bangalore",
      state: "Karnataka",
      isActive: true,
      latitude: 12.9716,
      longitude: 77.5946,
    },
  });

  const inactiveCities = [
    { name: "Mumbai", slug: "mumbai", state: "Maharashtra" },
    { name: "Delhi NCR", slug: "delhi-ncr", state: "Delhi" },
    { name: "Hyderabad", slug: "hyderabad", state: "Telangana" },
    { name: "Chennai", slug: "chennai", state: "Tamil Nadu" },
    { name: "Pune", slug: "pune", state: "Maharashtra" },
  ];

  for (const city of inactiveCities) {
    await prisma.city.create({
      data: { ...city, isActive: false },
    });
  }

  const collegeMap = new Map<string, string>();

  for (const college of bangaloreColleges) {
    const created = await prisma.college.create({
      data: {
        name: college.name,
        slug: college.slug,
        shortName: college.shortName,
        cityId: bangalore.id,
      },
    });
    collegeMap.set(college.slug, created.id);
  }

  for (const event of seedEvents) {
    const baseSlug = slugify(event.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    await prisma.event.create({
      data: {
        title: event.title,
        slug,
        description: event.description,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        registrationDeadline: regDeadlineBefore(event.startsAt),
        format: event.format,
        category: event.category,
        venue: event.venue,
        locality: event.locality,
        cityId: bangalore.id,
        collegeId: event.collegeSlug
          ? collegeMap.get(event.collegeSlug)
          : undefined,
        registrationUrl: event.registrationUrl,
        prizePool: event.prizePool,
        tags: stringifyTags(event.tags),
        sourceType: event.sourceType,
        externalUrl: event.externalUrl,
        status: "APPROVED",
      },
    });
  }

  console.log(`Seeded ${seedEvents.length} Bangalore events across ${bangaloreColleges.length} colleges.`);

  // Expired examples — should never appear in attendable feed
  const expiredStarts = daysFromNow(-5);
  await prisma.event.create({
    data: {
      title: "[EXPIRED] Old RVCE Hackathon 2025",
      slug: "expired-rvce-hackathon",
      description: "Past event for testing — registration closed.",
      startsAt: expiredStarts,
      endsAt: daysFromNow(-3),
      registrationDeadline: daysFromNow(-7),
      format: "IN_PERSON",
      category: "HACKATHON",
      venue: "RV College of Engineering",
      locality: "RVCE Campus",
      cityId: bangalore.id,
      collegeId: collegeMap.get("rvce"),
      tags: stringifyTags(["expired", "test"]),
      sourceType: "MANUAL",
      status: "APPROVED",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
