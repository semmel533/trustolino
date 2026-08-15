"use client";

import { useState } from "react";
import { useDictionary } from "@/lib/i18n/DictionaryContext";

import { CaretDown, CaretUp } from "@phosphor-icons/react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({ text, maxLength = 150, className = "" }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Just use hardcoded strings if dict doesn't have it, since it's easy enough to add.
  // Actually we can add it to dict.
  const dict = useDictionary();
  const readMore = (dict.nav as any)?.readMore || (text.includes("the") ? "Show more" : "Mehr anzeigen");
  const showLess = (dict.nav as any)?.showLess || (text.includes("the") ? "Show less" : "Weniger anzeigen");

  if (text.length <= maxLength) {
    return <p className={className}>{text}</p>;
  }

  const displayText = isExpanded ? text : `${text.slice(0, maxLength).trim()}...`;

  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 inline-flex items-center gap-1 font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
      >
        {isExpanded ? (
          <>
            <CaretUp weight="bold" /> {showLess}
          </>
        ) : (
          <>
            <CaretDown weight="bold" /> {readMore}
          </>
        )}
      </button>
    </div>
  );
}
