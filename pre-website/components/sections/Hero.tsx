"use client";

import Image from "next/image";
import { useDictionary } from "@/lib/i18n/DictionaryContext";

export default function Hero() {
  const dict = useDictionary();
  const h = dict.hero;

  const scrollToWaitlist = () => {
    const el = document.getElementById("waitlist");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-cream-100 h-[calc(100svh-72px)] min-h-[600px] flex flex-col justify-center pt-4 md:pt-8"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-6 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-10 lg:gap-16 lg:px-8">
        {/* Text content */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left gap-6 w-full">
          <span className="inline-flex max-w-fit items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-semibold text-foreground/80 ring-1 ring-inset ring-teal-600/20">
            {h.badge}
          </span>
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {h.heading}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-foreground/80/80">
            {h.subtext}
          </p>
          <div>
            <button
              onClick={scrollToWaitlist}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {h.cta}
            </button>
          </div>
        </div>

        {/* Mascot illustration */}
        <div className="hidden md:flex items-center justify-end w-full">
          <div className="relative w-full max-w-[24rem] lg:max-w-[31rem] xl:max-w-[33rem] aspect-[5/4]">
            <Image
              src="/icon.svg"
              alt="Trustolino Mascot"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
