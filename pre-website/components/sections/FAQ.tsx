"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState } from "react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function FAQ() {
  const dict = useDictionary();
  const f = dict.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = Object.values(f.items) as Array<{ question: string; answer: string }>;

  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h2 className="mb-12 text-center font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
          {f.heading}
        </h2>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-teal-100 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-white cursor-pointer"
              >
                <span className="pr-4 font-heading text-base font-bold text-foreground md:text-lg">
                  {item.question}
                </span>
                <CaretDown
                  weight="bold"
                  className={`size-5 shrink-0 text-teal-600 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === i
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-teal-50 px-6 pb-5 pt-4">
                  <p className="text-sm leading-relaxed text-foreground/80/70">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
