import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  locale: 'de' | 'en';
  dictionary: Record<string, any>;
}

export function Footer({ locale, dictionary }: FooterProps) {
  const t = dictionary;

  const links = [
    { href: locale === 'en' ? '/en/advisor' : '/ratgeber', label: t.footer.ratgeber },
    { href: locale === 'en' ? '/en/legal' : '/impressum', label: t.footer.impressum },
    { href: locale === 'en' ? '/en/privacy' : '/datenschutz', label: t.footer.datenschutz },
  ];

  return (
    <div className="px-6 lg:px-8 pb-0">
      <footer className="mx-auto flex max-w-7xl flex-col items-center rounded-t-2xl border border-border border-b-0 bg-white pb-8 pt-12 shadow-sm text-foreground px-6 lg:px-8">
        <div className="mb-6">
          <Image
            src="/logo.svg"
            alt="Trustolino Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>

        <p className="mb-8 max-w-md text-center text-foreground">
          {t.footer.tagline}
        </p>

        <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-6">
          <Link
            href={links[0].href}
            className="relative text-sm font-medium cursor-pointer after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
          >
            {links[0].label}
          </Link>
          <div className="flex flex-row items-center justify-center gap-6">
            <Link
              href={links[1].href}
              className="relative text-sm font-medium cursor-pointer after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {links[1].label}
            </Link>
            <Link
              href={links[2].href}
              className="relative text-sm font-medium cursor-pointer after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {links[2].label}
            </Link>
          </div>
        </div>

      </footer>
    </div>
  );
}
