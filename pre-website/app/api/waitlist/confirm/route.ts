import { NextResponse } from "next/server";

const DEFAULT_CONVEX_URL = "https://charming-shrimp-686.eu-west-1.convex.cloud";

function getConvexUrl(): string {
  let url = process.env.NEXT_PUBLIC_CONVEX_URL || DEFAULT_CONVEX_URL;
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, "");
  if (url.includes("charming-shrimp-686.convex.cloud")) {
    url = url.replace("charming-shrimp-686.convex.cloud", "charming-shrimp-686.eu-west-1.convex.cloud");
  }
  return url;
}

async function handleConfirm(token: string | null | undefined) {
  if (!token || typeof token !== "string") {
    return NextResponse.json({ status: "invalid" }, { status: 200 });
  }

  const trimmedToken = token.trim();
  if (!/^[0-9a-f]{64}$/i.test(trimmedToken)) {
    return NextResponse.json({ status: "invalid" }, { status: 200 });
  }

  try {
    const convexUrl = getConvexUrl();
    const convexRes = await fetch(`${convexUrl}/api/mutation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: "waitlist:confirm",
        format: "json",
        args: [{ token: trimmedToken }],
      }),
    });

    if (!convexRes.ok) {
      const errText = await convexRes.text().catch(() => "");
      console.error("Convex confirm API error:", convexRes.status, errText);
      return NextResponse.json({ status: "invalid", error: "server_error" }, { status: 500 });
    }

    const convexData = (await convexRes.json()) as {
      status: "success" | "error";
      value?: {
        status: "success" | "already_confirmed" | "expired" | "invalid";
        name?: string;
        locale?: string;
      };
      errorMessage?: string;
    };

    if (convexData.status !== "success" || !convexData.value) {
      console.error("Convex confirm mutation error:", convexData.errorMessage);
      return NextResponse.json({ status: "invalid" }, { status: 200 });
    }

    return NextResponse.json(convexData.value);
  } catch (err: unknown) {
    console.error("Confirmation route error:", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ status: "invalid" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = body && typeof body === "object" ? body.token : null;
  return handleConfirm(token);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  return handleConfirm(token);
}
