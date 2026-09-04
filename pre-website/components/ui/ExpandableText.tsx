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
  
  const dict = useDictionary();
  const readMore = dict.common.readMore;
  const showLess = dict.common.showLess;

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
