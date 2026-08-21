"use client";

import Image from "next/image";
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
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {t.heading}
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-foreground/80">
            {t.intro}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {t.members.map((member: { name: string, text: string }, i: number) => (
            <div key={i} className="rounded-2xl border border-teal-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-foreground/70">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {member.name}
                </h3>
              </div>
              <ExpandableText text={member.text} maxLength={200} className="text-sm leading-relaxed text-foreground/80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
