import { NextResponse } from "next/server";

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
      return NextResponse.json({ error: "rate_limit" }, { status: 429 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const { name, email, locale, privacyConsent } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    // Sanitize name: remove control characters and trim
    const sanitizedName = name.replace(/[\x00-\x1F\x7F]/g, "").trim();
    if (sanitizedName.length === 0 || sanitizedName.length > 100) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    // Validate email format and length
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    const confirmationToken = generateToken();
    const resolvedLocale = locale === "en" ? "en" : "de";

    const mutationArgs: {
      name: string;
      email: string;
      locale: "de" | "en";
      privacyConsent: boolean;
      confirmationToken: string;
      serverSecret?: string;
    } = {
      name: sanitizedName,
      email: normalizedEmail,
      locale: resolvedLocale,
      privacyConsent: true,
      confirmationToken,
    };
    if (serverSecret) {
      mutationArgs.serverSecret = serverSecret;
    }

    const convexRes = await fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "waitlist:register",
        format: "json",
        args: [mutationArgs],
      }),
    });

    if (!convexRes.ok) {
      const errText = await convexRes.text().catch(() => "");
      throw new Error(`Convex API responded with status ${convexRes.status}: ${errText}`);
    }

    const convexData = (await convexRes.json()) as {
      status: "success" | "error";
      value?: { status: string; id: string };
      errorMessage?: string;
    };

    if (convexData.status !== "success" || !convexData.value) {
      throw new Error(convexData.errorMessage || "Convex mutation failed");
    }

    const result = convexData.value;

    if (result.status === "already_confirmed") {
      return NextResponse.json({ error: "duplicate" }, { status: 409 });
    }

    // Return status: Convex scheduler takes care of email dispatch asynchronously
    return NextResponse.json({ success: true, status: result.status });
  } catch (err: unknown) {
    console.error("Waitlist registration failed:", err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      { error: "server_error" },
      { status: 500 }
    );
  }
}
