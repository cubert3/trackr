import { prisma } from "./prisma";

const OTP_EXPIRY_MINUTES = 10;

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(contact: string): Promise<{ success: boolean; message: string }> {
  const normalized = contact.trim().toLowerCase();
  if (!normalized.includes("@") && !/^\+?\d{10,13}$/.test(normalized.replace(/\s/g, ""))) {
    return { success: false, message: "Enter a valid email or 10-digit phone number" };
  }

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.otpVerification.create({
    data: { contact: normalized, otp, expiresAt },
  });

  // Dev mode: log OTP. Replace with Twilio/MSG91/Resend in production.
  console.log(`[Trackr OTP] ${normalized} → ${otp} (expires ${expiresAt.toISOString()})`);

  return {
    success: true,
    message: process.env.NODE_ENV === "development"
      ? `OTP sent (dev: check server console) — ${otp}`
      : "OTP sent to your contact",
  };
}

export async function verifyOtp(
  contact: string,
  otp: string
): Promise<{ verified: boolean; message: string }> {
  const normalized = contact.trim().toLowerCase();

  const record = await prisma.otpVerification.findFirst({
    where: {
      contact: normalized,
      otp,
      verified: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { verified: false, message: "Invalid or expired OTP" };
  }

  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return { verified: true, message: "Verified" };
}

export async function findOrCreateUser(contact: string) {
  const normalized = contact.trim().toLowerCase();
  const isEmail = normalized.includes("@");

  const existing = isEmail
    ? await prisma.user.findUnique({ where: { email: normalized } })
    : await prisma.user.findUnique({ where: { phone: normalized } });

  if (existing) return existing;

  return prisma.user.create({
    data: isEmail ? { email: normalized } : { phone: normalized },
  });
}
