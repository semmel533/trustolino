"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function Freiraum() {
  const dict = useDictionary();
  const f = dict.freiraum;

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
          {f.heading}
        </h2>
        <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-foreground/80/80">
          {f.text}
        </p>
      </div>
    </section>
  );
}
