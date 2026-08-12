'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { useDictionary } from '@/lib/i18n/DictionaryContext';

interface NavbarProps {
  locale: 'de' | 'en';
}

export function Navbar({ locale }: NavbarProps) {
  const t = useDictionary();

  const navLinks = useMemo(() => [
    { href: locale === 'de' ? '/ratgeber' : '/en/advisor', label: t.nav?.advisor || 'Ratgeber Portal', isPage: true },
  ], [t, locale]);



  return (
    <div className="px-6 lg:px-8 absolute w-full z-50">
      <header className="mx-auto max-w-7xl bg-white rounded-b-2xl shadow-sm border border-border border-t-0 p-4 md:p-0 md:px-6 md:h-[72px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 transition-all duration-300">
        <Link href="/" className="flex items-center cursor-pointer">
          <Image src="/label.svg" alt="Trustolino Logo" width={120} height={28} priority className="object-contain" />
        </Link>

        {/* Links & Language Toggle */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-semibold text-foreground cursor-pointer after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle currentLocale={locale} />
        </div>
      </header>
    </div>
  );
}
