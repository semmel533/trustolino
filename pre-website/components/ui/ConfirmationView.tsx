"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { CheckCircle, WarningCircle, Clock, CircleNotch } from "@phosphor-icons/react";

type ConfirmationStatus =
  | "loading"
  | "success"
  | "already_confirmed"
  | "expired"
  | "invalid";

interface ConfirmationViewProps {
  locale: "de" | "en";
}

export default function ConfirmationView({ locale }: ConfirmationViewProps) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dict = useDictionary();
  const c = dict.confirmationPage;

  const [status, setStatus] = useState<ConfirmationStatus>("loading");
  const [userName, setUserName] = useState<string>("");
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!token || token.trim().length === 0) {
      setStatus("invalid");
      return;
    }

    if (requestedRef.current) {
      return;
    }
    requestedRef.current = true;

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      setStatus("invalid");
      return;
    }

    const client = new ConvexHttpClient(convexUrl);

    client
      .mutation(api.waitlist.confirm, { token: token.trim() })
      .then((res) => {
        if (res.name) {
          setUserName(res.name);
        }
        setStatus(res.status);
      })
      .catch(() => {
        setStatus("invalid");
      });
  }, [token]);

  const homeHref = locale === "en" ? "/en" : "/";
  const advisorHref = locale === "en" ? "/en/advisor" : "/ratgeber";
  const waitlistHref = locale === "en" ? "/en#waitlist" : "/#waitlist";

  const successText = c.successText.replace(
    "{name}",
    userName ? ` ${userName}` : ""
  );

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-cream-50/60 px-6 py-16 md:py-24">
      <div className="w-full max-w-lg rounded-3xl border border-teal-100/90 bg-white p-8 text-center md:p-12">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-8">
            <CircleNotch className="size-12 animate-spin text-primary" />
            <p className="mt-5 text-base font-medium text-foreground/80">
              {c.loading}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle weight="fill" className="size-16 text-primary" />

            <h1 className="font-heading mt-5 text-2xl font-bold text-foreground md:text-3xl">
              {c.successTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">
              {successText}
            </p>
            <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={homeHref}
                className="w-full sm:w-auto rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
              >
                {c.ctaHome}
              </Link>
              <Link
                href={advisorHref}
                className="w-full sm:w-auto rounded-xl border border-border bg-white px-6 py-3.5 font-bold text-foreground transition-colors hover:bg-muted cursor-pointer"
              >
                {c.ctaAdvisor}
              </Link>
            </div>
          </div>
        )}

        {status === "already_confirmed" && (
          <div className="flex flex-col items-center">
            <CheckCircle weight="fill" className="size-16 text-primary" />

            <h1 className="font-heading mt-5 text-2xl font-bold text-foreground md:text-3xl">
              {c.alreadyConfirmedTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">
              {c.alreadyConfirmedText}
            </p>
            <div className="mt-8 flex w-full justify-center">
              <Link
                href={homeHref}
                className="w-full sm:w-auto rounded-xl bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-primary/90 cursor-pointer"
              >
                {c.ctaHome}
              </Link>
            </div>
          </div>
        )}

        {status === "expired" && (
          <div className="flex flex-col items-center">
            <Clock weight="fill" className="size-16 text-amber-500" />

            <h1 className="font-heading mt-5 text-2xl font-bold text-foreground md:text-3xl">
              {c.expiredTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">
              {c.expiredText}
            </p>
            <div className="mt-8 flex w-full justify-center">
              <Link
                href={waitlistHref}
                className="w-full sm:w-auto rounded-xl bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-colors hover:bg-accent/90 cursor-pointer"
              >
                {c.ctaReRegister}
              </Link>
            </div>
          </div>
        )}

        {status === "invalid" && (
          <div className="flex flex-col items-center">
            <WarningCircle weight="fill" className="size-16 text-red-500" />

            <h1 className="font-heading mt-5 text-2xl font-bold text-foreground md:text-3xl">
              {c.invalidTitle}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-foreground/80">
              {c.invalidText}
            </p>
            <div className="mt-8 flex w-full justify-center">
              <Link
                href={homeHref}
                className="w-full sm:w-auto rounded-xl bg-primary px-7 py-3.5 font-bold text-white transition-colors hover:bg-primary/90 cursor-pointer"
              >
                {c.ctaHome}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
