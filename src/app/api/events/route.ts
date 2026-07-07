import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/events";
import type { EventCategory, EventFormat } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const events = await getEvents({
    citySlug: searchParams.get("city") ?? "bangalore",
    category: (searchParams.get("category") as EventCategory) || undefined,
    format: (searchParams.get("format") as EventFormat) || undefined,
    locality: searchParams.get("locality") || undefined,
    collegeSlug: searchParams.get("college") || undefined,
    search: searchParams.get("q") || undefined,
    attendableOnly: searchParams.get("attendable") !== "false",
  });

  return NextResponse.json(events);
}
