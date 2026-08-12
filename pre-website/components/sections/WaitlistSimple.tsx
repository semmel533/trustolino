"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function WaitlistSimple() {
  const dict = useDictionary();
  const w = dict.waitlist2;
  const wForm = dict.waitlistForm;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!email) {
        setError(wForm.errorInvalidEmail || wForm.errorGeneric);
        return;
      }
      
      if (!validateEmail(email)) {
        setError(wForm.errorInvalidEmail || wForm.errorGeneric);
        return;
      }
      
      if (submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, locale: "de" }),
        });

        if (res.ok) {
          setSuccess(true);
          setEmail("");
        } else {
          const data = await res.json();
          if (data.error === "duplicate") {
            setError(wForm.errorDuplicate || wForm.errorGeneric);
          } else {
            setError(data.error || wForm.errorGeneric);
          }
        }
      } catch {
        setError(wForm.errorGeneric);
      } finally {
        setSubmitting(false);
      }
    },
    [email, submitting, wForm.errorGeneric]
  );

  return (
    <section className="bg-[#3e7c86] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
          {w.heading}
        </h2>
        <p className="mx-auto mt-6 text-base leading-relaxed text-primary-foreground/80 max-w-2xl">
          {w.text}
        </p>

        {success ? (
          <div className="mx-auto mt-10 max-w-xl rounded-xl bg-primary/90/50 p-6">
            <p className="font-heading text-lg font-bold text-accent">
              {wForm.successTitle}
            </p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              {wForm.successText}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={wForm.emailPlaceholder}
                className="w-full sm:w-80 rounded-xl border border-teal-200 bg-white px-4 py-3.5 text-foreground placeholder:text-foreground/40 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto whitespace-normal sm:whitespace-nowrap rounded-xl bg-accent px-4 sm:px-8 py-3.5 font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl disabled:opacity-50 cursor-pointer"
              >
                {submitting ? wForm.submitting : w.cta}
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-lg bg-red-500/20 border border-red-400 p-3 text-center shadow-md">
                <p className="text-sm font-medium text-red-100 transition-all duration-300 ease-in-out">{error}</p>
              </div>
            )}
            
            <p className="mx-auto mt-6 max-w-xl text-xs text-primary-foreground/70">
              {wForm.privacyConsent.split('{privacy}')[0]}
              <Link href="/datenschutz" className="underline hover:text-accent transition-colors cursor-pointer">
                {wForm.privacyLink}
              </Link>
              {wForm.privacyConsent.split('{privacy}')[1]}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
