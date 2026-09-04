import { NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { sendConfirmationEmail } from "@/lib/email";

// Simple IP-based sliding window rate limiter
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "rate_limited" },
        { status: 429 }
      );
    }

    const { name, email, locale, privacyConsent } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    if (privacyConsent !== true) {
      return NextResponse.json({ error: "privacy_required" }, { status: 400 });
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(convexUrl);
    const confirmationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
    const resolvedLocale = locale === "en" ? "en" : "de";

    const result = await convex.mutation(api.waitlist.register, {
      name: name.trim(),
      email: normalizedEmail,
      locale: resolvedLocale,
      privacyConsent: true,
      confirmationToken,
      tokenExpiresAt,
    });

    if (result.status === "already_confirmed") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }

    // Send the double opt-in confirmation email
    const emailResult = await sendConfirmationEmail({
      to: normalizedEmail,
      name: name.trim(),
      token: confirmationToken,
      locale: resolvedLocale,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "email_delivery_failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, status: result.status });
  } catch {
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}
