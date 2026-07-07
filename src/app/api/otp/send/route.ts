import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendOtp } from "@/lib/otp";

const schema = z.object({
  contact: z.string().min(5),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact } = schema.parse(body);
    const result = await sendOtp(contact);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
