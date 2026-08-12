"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function Promise() {
  const dict = useDictionary();
  const p = dict.mission;

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-bold leading-tight text-white md:text-4xl">
          {p.heading}
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-primary-foreground/90">
          {p.text}
        </p>
      </div>
    </section>
  );
}
