import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { findDuplicate, validateEventDate } from "@/lib/dedup";
import { verifyOtp, findOrCreateUser } from "@/lib/otp";
import { stringifyTags } from "@/lib/utils";

const submissionSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  registrationDeadline: z.string().datetime().optional(),
  format: z.enum(["IN_PERSON", "ONLINE", "HYBRID"]),
  category: z.enum([
    "HACKATHON",
    "MEETUP",
    "WORKSHOP",
    "DEMO_DAY",
    "TECH_FEST",
    "COMPETITION",
    "OTHER",
  ]),
  venue: z.string().max(200).optional(),
  locality: z.string().max(100).optional(),
  citySlug: z.string().default("bangalore"),
  collegeSlug: z.string().optional(),
  registrationUrl: z.string().url().optional().or(z.literal("")),
  posterUrl: z.string().url().optional().or(z.literal("")),
  prizePool: z.string().max(100).optional(),
  tags: z.array(z.string()).max(10).optional(),
  contact: z.string().min(5),
  otp: z.string().length(6),
  community: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = submissionSchema.parse(body);

    const otpResult = await verifyOtp(data.contact, data.otp);
    if (!otpResult.verified) {
      return NextResponse.json({ error: otpResult.message }, { status: 400 });
    }

    const startsAt = new Date(data.startsAt);
    const dateError = validateEventDate(startsAt);
    if (dateError) {
      return NextResponse.json({ error: dateError }, { status: 400 });
    }

    const registrationDeadline = data.registrationDeadline
      ? new Date(data.registrationDeadline)
      : startsAt;

    if (registrationDeadline < new Date()) {
      return NextResponse.json(
        { error: "Registration deadline must be in the future" },
        { status: 400 }
      );
    }

    const city = await prisma.city.findUnique({
      where: { slug: data.citySlug },
    });
    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 400 });
    }

    let collegeId: string | undefined;
    if (data.collegeSlug) {
      const college = await prisma.college.findUnique({
        where: { slug: data.collegeSlug },
      });
      collegeId = college?.id;
    }

    const existing = await prisma.event.findMany({
      where: { cityId: city.id, status: "APPROVED" },
      select: {
        id: true,
        title: true,
        startsAt: true,
        locality: true,
        venue: true,
      },
    });

    const duplicate = findDuplicate(
      data.title,
      startsAt,
      data.locality,
      existing
    );
    if (duplicate) {
      return NextResponse.json(
        {
          error: "This looks like a duplicate of an existing event",
          duplicateId: duplicate.id,
        },
        { status: 409 }
      );
    }

    const user = await findOrCreateUser(data.contact);

    const submission = await prisma.eventSubmission.create({
      data: {
        title: data.title,
        description: data.description,
        startsAt,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
        registrationDeadline,
        format: data.format,
        category: data.category,
        venue: data.venue,
        locality: data.locality,
        cityId: city.id,
        collegeId,
        registrationUrl: data.registrationUrl || null,
        posterUrl: data.posterUrl || null,
        prizePool: data.prizePool,
        tags: stringifyTags(data.tags ?? []),
        status: "PENDING",
        otpVerified: true,
        submittedById: user.id,
        submitterEmail: data.contact.includes("@") ? data.contact : null,
        submitterPhone: !data.contact.includes("@") ? data.contact : null,
      },
    });

    return NextResponse.json(
      {
        id: submission.id,
        message: "Submission received! It will appear after moderation.",
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid submission", details: err.issues },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
