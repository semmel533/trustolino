import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// IP-based sliding window rate limiter with auto-eviction
const ipRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries when memory threshold is reached
  if (ipRateLimitMap.size > 1000) {
    for (const [key, value] of ipRateLimitMap.entries()) {
      if (now > value.resetTime) {
        ipRateLimitMap.delete(key);
      }
    }
  }

  const record = ipRateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    ipRateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count += 1;
  return record.count > MAX_REQUESTS;
}

const DEFAULT_CONVEX_URL = "https://charming-shrimp-686.eu-west-1.convex.cloud";

function getConvexUrl(): string {
  return process.env.NEXT_PUBLIC_CONVEX_URL || DEFAULT_CONVEX_URL;
}

function getServerSecret(): string | undefined {
  return process.env.CONVEX_INTERNAL_SECRET;
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { name, email, locale, privacyConsent } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    // Strip control characters and clamp length
    const sanitizedName = name.replace(/[\x00-\x1F\x7F]/g, "").trim();
    if (sanitizedName.length === 0 || sanitizedName.length > 100) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (
      normalizedEmail.length === 0 ||
      normalizedEmail.length > 254 ||
      /[\r\n]/.test(normalizedEmail) ||
      !emailRegex.test(normalizedEmail)
    ) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    if (privacyConsent !== true) {
      return NextResponse.json({ error: "privacy_required" }, { status: 400 });
    }

    const convexUrl = getConvexUrl();
    const serverSecret = getServerSecret();

    const convex = new ConvexHttpClient(convexUrl);
    const confirmationToken = generateToken();
    const resolvedLocale = locale === "en" ? "en" : "de";

    const result = await convex.mutation(api.waitlist.register, {
      serverSecret,
      name: sanitizedName,
      email: normalizedEmail,
      locale: resolvedLocale,
      privacyConsent: true,
      confirmationToken,
    });

    if (result.status === "already_confirmed") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }

    // Return status: Convex scheduler takes care of email dispatch asynchronously
    return NextResponse.json({ success: true, status: result.status });
  } catch (err) {
    console.error("Waitlist registration failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      {
        error: "server_error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
