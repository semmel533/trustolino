'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LanguageToggleProps {
  currentLocale: 'de' | 'en';
}

const DE_TO_EN_MAP: Record<string, string> = {
  'datenschutz': 'privacy',
  'impressum': 'legal',
  'ratgeber': 'advisor',
};

const EN_TO_DE_MAP: Record<string, string> = {
  'privacy': 'datenschutz',
  'legal': 'impressum',
  'advisor': 'ratgeber',
};

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = (newLocale: 'de' | 'en') => {
    if (newLocale === currentLocale) return;

    let segments = pathname.split('/').filter(Boolean);

    if (newLocale === 'en') {
      if (segments.length > 0 && DE_TO_EN_MAP[segments[0]]) {
        segments[0] = DE_TO_EN_MAP[segments[0]];
      }
      const newPath = segments.length === 0 ? '/en' : `/en/${segments.join('/')}`;
      router.push(newPath, { scroll: false });
    } else {
      if (segments[0] === 'en') {
        segments = segments.slice(1);
      }
      if (segments.length > 0 && EN_TO_DE_MAP[segments[0]]) {
        segments[0] = EN_TO_DE_MAP[segments[0]];
      }
      const newPath = segments.length === 0 ? '/' : `/${segments.join('/')}`;
      router.push(newPath, { scroll: false });
    }
  };

  return (
    <div className="flex bg-[#FAF7F2] p-1 rounded-full border border-gray-200 w-fit">
      <button
        onClick={() => handleToggle('de')}
        className={`flex-1 rounded-full py-1.5 px-3 text-xs font-semibold transition-all duration-300 cursor-pointer ${
          currentLocale === 'de'
            ? 'bg-accent text-accent-foreground'
            : 'text-[#163B39] hover:bg-[#1B4D4A]/10'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => handleToggle('en')}
        className={`flex-1 rounded-full py-1.5 px-3 text-xs font-semibold transition-all duration-300 cursor-pointer ${
          currentLocale === 'en'
            ? 'bg-accent text-accent-foreground'
            : 'text-[#163B39] hover:bg-[#1B4D4A]/10'
        }`}
      >
        EN
      </button>
    </div>
  );
}
