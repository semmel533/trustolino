"use client";

import { ShieldCheck, TrendUp, Briefcase } from "@phosphor-icons/react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function Experience() {
  const dict = useDictionary();
  const e = dict.expertise;

  const cards = [
    {
      icon: ShieldCheck,
      title: e.cards[0].title,
      text: e.cards[0].text,
    },
    {
      icon: TrendUp,
      title: e.cards[1].title,
      text: e.cards[1].text,
    },
    {
      icon: Briefcase,
      title: e.cards[2].title,
      text: e.cards[2].text,
    },
  ];

  return (
    <section id="experience" className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {e.heading}
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-teal-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-teal-50">
                <card.icon
                  weight="duotone"
                  className="size-6 text-foreground/70"
                />
              </div>
              <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/80/70">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
