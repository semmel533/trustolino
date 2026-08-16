"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { CheckCircle, XCircle } from "@phosphor-icons/react";

export default function WhoWeAre() {
  const dict = useDictionary();
  const w = dict.whoWeAre;

  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {w.heading}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80/70">{w.text}</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-teal-100 bg-cream-50 shadow-sm">
          <table className="w-full text-left text-sm md:text-base">
            <thead className="bg-teal-50 font-heading font-bold text-foreground">
              <tr>
                {w.table.headers.map((header: string, i: number) => (
                  <th key={i} className="px-6 py-4 border-b border-teal-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-100">
              {w.table.rows.map((row: string[], i: number) => (
                <tr key={i} className="transition-colors hover:bg-cream-100">
                  <td className="px-6 py-4 font-semibold text-foreground">{row[0]}</td>
                  <td className="px-6 py-4 text-foreground/80">
                    <div className="flex items-start gap-2">
                      <XCircle weight="fill" className="mt-0.5 size-5 shrink-0 text-red-500" />
                      <span>{row[1]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle weight="fill" className="mt-0.5 size-5 shrink-0 text-teal-600" />
                      <span>{row[2]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
