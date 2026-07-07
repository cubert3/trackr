import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, stringifyTags } from "@/lib/utils";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_KEY && !!process.env.ADMIN_KEY;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.eventSubmission.findMany({
    where: { status: "PENDING" },
    include: { college: true, submittedBy: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(submissions);
}

export async function PATCH(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, action, reviewNotes } = await request.json();

  const submission = await prisma.eventSubmission.findUnique({
    where: { id },
  });
  if (!submission || submission.status !== "PENDING") {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  if (action === "reject") {
    await prisma.eventSubmission.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewNotes,
        reviewedAt: new Date(),
      },
    });
    return NextResponse.json({ message: "Rejected" });
  }

  if (action === "approve") {
    const baseSlug = slugify(submission.title);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const event = await prisma.event.create({
      data: {
        title: submission.title,
        slug,
        description: submission.description,
        startsAt: submission.startsAt,
        endsAt: submission.endsAt,
        registrationDeadline: submission.registrationDeadline,
        format: submission.format,
        category: submission.category,
        venue: submission.venue,
        locality: submission.locality,
        cityId: submission.cityId,
        collegeId: submission.collegeId,
        registrationUrl: submission.registrationUrl,
        posterUrl: submission.posterUrl,
        prizePool: submission.prizePool,
        tags: submission.tags || stringifyTags([]),
        sourceType: "CROWDSOURCED",
        status: "APPROVED",
        submittedById: submission.submittedById,
      },
    });

    await prisma.eventSubmission.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewNotes,
        reviewedAt: new Date(),
        promotedEventId: event.id,
      },
    });

    if (submission.submittedById) {
      await prisma.user.update({
        where: { id: submission.submittedById },
        data: {
          points: { increment: 10 },
          trustScore: { increment: 5 },
        },
      });
    }

    return NextResponse.json({ message: "Approved", eventId: event.id });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
