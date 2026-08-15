"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { CheckCircle } from "@phosphor-icons/react";

export default function WaitlistCTA() {
  const dict = useDictionary();
  const wInfo = dict.waitlistInfo;
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
    <section id="waitlist" className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="rounded-3xl bg-primary/50 p-8 md:p-12 text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
            {wInfo.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/80">
            {wInfo.text}
          </p>

          {success ? (
            <div className="mx-auto mt-8 max-w-xl rounded-xl bg-primary/90/50 p-8 flex flex-col items-center text-center">
              <CheckCircle weight="fill" className="size-16 text-accent mb-4 drop-shadow-md" />
              <p className="font-heading text-2xl font-bold text-accent">
                {wForm.successTitle}
              </p>
              <p className="mt-3 text-base text-primary-foreground/90">
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
                  className="w-full sm:w-80 rounded-xl border border-border bg-white px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-left"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto whitespace-normal sm:whitespace-nowrap rounded-xl bg-accent px-4 sm:px-8 py-3.5 font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? wForm.submitting : wInfo.cta}
                </button>
              </div>
              {error && (
                <div className="mt-4 rounded-lg bg-red-500/20 border border-red-400 p-3 text-center shadow-md">
                  <p className="text-sm font-medium text-red-100 transition-all duration-300 ease-in-out">{error}</p>
                </div>
              )}
              
              <p className="mt-6 text-xs text-primary-foreground/70">
                {wForm.privacyConsent.split('{privacy}')[0]}
                <Link href="/datenschutz" className="underline hover:text-accent transition-colors cursor-pointer">
                  {wForm.privacyLink}
                </Link>
                {wForm.privacyConsent.split('{privacy}')[1]}
              </p>
            </form>
          )}

          <p className="mx-auto mt-6 max-w-xl text-xs text-primary-foreground/50">
            {wInfo.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
