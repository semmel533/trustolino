"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";
import {
  CheckCircle,
  XCircle,
  UserCheck,
  Target,
  Receipt,
  GraduationCap,
} from "@phosphor-icons/react";

const CATEGORY_ICONS = [UserCheck, Target, Receipt, GraduationCap];

export default function WhoWeAre() {
  const dict = useDictionary();
  const w = dict.whoWeAre;

  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {w.heading}
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80">
            {w.text}
          </p>
        </div>

        {/* Responsive Comparative Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {w.table.rows.map((row: string[], i: number) => {
            const Icon = CATEGORY_ICONS[i] || UserCheck;

            return (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-teal-100/80 bg-white p-6 md:p-7 shadow-xs transition-all duration-300 hover:shadow-md hover:border-teal-200"
              >
                {/* Category Header */}
                <div className="mb-5 flex items-center justify-between border-b border-border/40 pb-4">
                  <span className="font-heading text-lg md:text-xl font-bold text-foreground">
                    {row[0]}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl border border-teal-100/80 bg-teal-50 text-primary">
                    <Icon weight="duotone" className="size-5" />
                  </div>
                </div>

              {/* Comparative Dual Cards */}
              <div className="space-y-3.5">
                {/* Standard Platforms (Negative/Muted) */}
                <div className="rounded-xl border border-red-100/70 bg-red-50/40 p-4 transition-colors">
                  <div className="mb-1.5 flex items-center gap-2">
                    <XCircle weight="fill" className="size-4.5 shrink-0 text-red-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700/90">
                      {w.table.headers[1]}
                    </span>
                  </div>
                  <p className="pl-6.5 text-sm text-foreground/75 leading-relaxed">
                    {row[1]}
                  </p>
                </div>

                {/* Trustolino (Positive/Elevated) */}
                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-4 shadow-2xs transition-all">
                  <div className="mb-1.5 flex items-center gap-2">
                    <CheckCircle weight="fill" className="size-4.5 shrink-0 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {w.table.headers[2]}
                    </span>
                  </div>
                  <p className="pl-6.5 text-sm font-semibold text-foreground leading-relaxed">
                    {row[2]}
                  </p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

