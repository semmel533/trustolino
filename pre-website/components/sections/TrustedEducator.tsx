"use client";

import { useDictionary } from "@/lib/i18n/DictionaryContext";
import { CheckCircle } from "@phosphor-icons/react";
import { ExpandableText } from "@/components/ui/ExpandableText";

export default function TrustedEducator() {
  const dict = useDictionary();
  const te = dict.sealSteps;

  const steps = [
    { num: "1", title: te.steps[0].title, text: te.steps[0].text, tip: te.steps[0].tip },
    { num: "2", title: te.steps[1].title, text: te.steps[1].text, tip: te.steps[1].tip },
    { num: "3", title: te.steps[2].title, text: te.steps[2].text, tip: te.steps[2].tip },
  ];

  return (
    <section id="trusted-educator" className="bg-cream-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {te.heading}
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="rounded-2xl border border-teal-100 bg-cream-50 p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-white shadow-md">
                    {step.num}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {step.title.replace(/^(Schritt|Step) \d+:\s*/, "")}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80/80">
                  {step.text}
                </p>
                {step.tip && (
                  <div className="mt-6 rounded-xl bg-gold-50 p-4 border border-gold-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle weight="fill" className="mt-0.5 size-5 shrink-0 text-gold-600" />
                      <ExpandableText text={step.tip} maxLength={150} className="text-xs leading-relaxed text-foreground whitespace-pre-wrap" />
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
