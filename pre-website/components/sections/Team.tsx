"use client";

import Image from "next/image";
import { User } from "@phosphor-icons/react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { ExpandableText } from "@/components/ui/ExpandableText";

export default function Team() {
  const dict = useDictionary();
  const t = dict.team;

  return (
    <section id="team" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <div className="mb-10 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Trustolino Logo"
              width={260}
              height={95}
              className="h-20 md:h-24 w-auto object-contain drop-shadow-xs"
              priority
            />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {t.heading}
          </h2>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg leading-relaxed text-foreground/80">
            {t.intro}
          </p>
        </div>

        <div className="grid gap-8 lg:gap-10 lg:grid-cols-2">
          {t.members.map((member: { name: string, text: string }, i: number) => (
            <div
              key={i}
              className={`group flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl border border-teal-100 bg-white p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-teal-200 ${
                i === 4 ? "lg:col-span-2 lg:max-w-[calc(50%-1.25rem)] lg:mx-auto w-full" : ""
              }`}
            >
              {/* Vertical image placeholder */}
              <div className="relative flex flex-col items-center justify-center w-36 sm:w-40 md:w-44 aspect-[3/4] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-teal-50/90 via-teal-100/30 to-teal-100/70 border border-teal-200/70 shadow-2xs group-hover:border-teal-300 transition-all duration-300">
                <div className="flex size-16 md:size-20 items-center justify-center rounded-full bg-white/90 border border-teal-200/80 font-heading text-2xl md:text-3xl font-bold text-primary shadow-xs">
                  {member.name.charAt(0)}
                </div>
                <div className="absolute bottom-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white/90 border border-teal-200/60 text-primary/70 shadow-2xs">
                  <User weight="bold" className="size-3.5" />
                </div>
              </div>

              {/* Text content: Name on top, text underneath */}
              <div className="flex flex-1 flex-col min-w-0 text-left w-full">
                <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-3 text-center sm:text-left">
                  {member.name}
                </h3>
                <ExpandableText
                  text={member.text}
                  maxLength={220}
                  className="text-sm leading-relaxed text-foreground/80"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
