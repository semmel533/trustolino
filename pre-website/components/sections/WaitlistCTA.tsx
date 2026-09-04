"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { CheckCircle, Check } from "@phosphor-icons/react";

export default function WaitlistCTA() {
  const dict = useDictionary();
  const wInfo = dict.waitlistInfo;
  const wForm = dict.waitlistForm;
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en");
  const locale = isEn ? "en" : "de";
  const privacyHref = isEn ? "/en/privacy" : "/datenschutz";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (submitting) return;

      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name: name.trim(), 
            email: email.trim(), 
            locale, 
            privacyConsent 
          }),
        });

        if (res.ok) {
          setSuccess(true);
          setName("");
          setEmail("");
          setPrivacyConsent(false);
        } else {
          const data = await res.json();
          if (data.error === "duplicate") {
            setError(wForm.errorDuplicate);
          } else if (data.error === "invalid_name") {
            setError(wForm.errorInvalidName);
          } else if (data.error === "invalid_email") {
            setError(wForm.errorInvalidEmail);
          } else if (data.error === "privacy_required") {
            setError(wForm.errorPrivacyRequired);
          } else if (data.error === "rate_limited") {
            setError(wForm.errorRateLimited);
          } else if (data.error === "email_delivery_failed") {
            setError(wForm.errorEmailDelivery);
          } else {
            setError(wForm.errorGeneric);
          }
        }
      } catch {
        setError(wForm.errorGeneric);
      } finally {
        setSubmitting(false);
      }
    },
    [name, email, privacyConsent, submitting, locale, wForm]
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
            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-10 max-w-xl text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={wForm.namePlaceholder}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
                />
                <input
                  type="text"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={wForm.emailPlaceholder}
                  className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm md:text-base"
                />
              </div>

              <div
                onClick={() => {
                  setPrivacyConsent(!privacyConsent);
                  if (error) setError(null);
                }}
                className="mb-4 flex items-start gap-3 text-left cursor-pointer group select-none"
              >
                <div
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[8px] border-2 transition-all duration-200 ${
                    privacyConsent
                      ? "border-accent bg-accent text-accent-foreground shadow-md scale-105"
                      : "border-white/40 bg-white/15 group-hover:border-white/80 group-hover:bg-white/25 group-hover:scale-105"
                  }`}
                >
                  {privacyConsent && (
                    <Check weight="bold" className="size-4 stroke-[3]" />
                  )}
                </div>
                <label className="cursor-pointer text-xs leading-relaxed text-primary-foreground/90">
                  {wForm.privacyCheckbox.split('{privacy}')[0]}
                  <Link
                    href={privacyHref}
                    onClick={(e) => e.stopPropagation()}
                    className="underline font-semibold hover:text-accent transition-colors"
                    target="_blank"
                  >
                    {wForm.privacyLink}
                  </Link>
                  {wForm.privacyCheckbox.split('{privacy}')[1]}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-accent px-6 py-3.5 font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl disabled:opacity-50 cursor-pointer text-base text-center"
              >
                {submitting ? wForm.submitting : wInfo.cta}
              </button>

              {error && (
                <div className="mt-4 rounded-lg bg-red-500/20 border border-red-400 p-3 text-center shadow-md">
                  <p className="text-sm font-medium text-red-100 transition-all duration-300 ease-in-out">{error}</p>
                </div>
              )}
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
