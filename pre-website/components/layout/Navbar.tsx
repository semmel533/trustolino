'use client';

import { useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageToggle } from './LanguageToggle';
import { useDictionary } from '@/lib/i18n/DictionaryContext';

interface NavbarProps {
  locale: 'de' | 'en';
}

export function Navbar({ locale }: NavbarProps) {
  const t = useDictionary();
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === '/' || pathname === '/en';

  useEffect(() => {
    if (isHome) {
      const scrollToId = sessionStorage.getItem('scrollTo');
      if (scrollToId) {
        // Small delay to ensure the DOM is fully rendered after navigation
        setTimeout(() => {
          const element = document.getElementById(scrollToId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          sessionStorage.removeItem('scrollTo');
        }, 150);
      }
    }
  }, [isHome, pathname]);

  const navLinks = useMemo(() => [
    { href: '#experience', label: t.nav.features, isAnchor: true },
    { href: '#trusted-educator', label: t.nav.trustedEducator, isAnchor: true },
    { href: '#team', label: t.nav.team, isAnchor: true },
    { href: locale === 'de' ? '/ratgeber' : '/en/advisor', label: t.nav.advisor, isPage: true },
  ], [t, locale]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    
    if (isHome) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const base = locale === 'de' ? '/' : '/en';
      sessionStorage.setItem('scrollTo', targetId);
      router.push(base);
    }
  };

  return (
    <div className="px-6 lg:px-8 absolute w-full z-50">
      <header className="relative mx-auto max-w-7xl bg-white rounded-b-2xl shadow-sm border border-border border-t-0 p-4 md:p-0 md:px-6 md:h-[72px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 transition-all duration-300">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
          <Image src="/label.svg" alt="Trustolino Logo" width={120} height={28} priority className="object-contain" />
        </Link>

        {/* Center: Anchor Links */}
        <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {navLinks.filter(link => link.isAnchor).map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link.href)}
              className="relative text-sm font-semibold text-foreground cursor-pointer after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Page Links & Language Toggle */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 md:gap-6">
            {navLinks.filter(link => !link.isAnchor).map((link) => (
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
