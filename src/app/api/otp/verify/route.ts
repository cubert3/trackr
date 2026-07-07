import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyOtp } from "@/lib/otp";

const schema = z.object({
  contact: z.string().min(5),
  otp: z.string().length(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact, otp } = schema.parse(body);
    const result = await verifyOtp(contact, otp);
    return NextResponse.json(result, { status: result.verified ? 200 : 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
