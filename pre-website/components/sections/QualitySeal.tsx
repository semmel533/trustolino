"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function QualitySeal() {
  const dict = useDictionary();
  const s = dict.qualitySeal;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {s.heading}
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-foreground/80/70">{s.text}</p>
        </div>
      </div>
    </section>
  );
}
