import { getArticles } from '@/lib/articles';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ratgeber Kinderbetreuung in Mannheim & Heidelberg',
  description:
    'Praxisnahe Tipps, Expertenwissen und Orientierung zu pädagogischer Kinderbetreuung, Babysitter-Stundenlöhnen und Nebenjobs in Mannheim und Heidelberg.',
  alternates: {
    canonical: '/ratgeber',
    languages: {
      'de': '/ratgeber',
      'en': '/en/advisor',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Trustolino: Ratgeber Kinderbetreuung in Mannheim & Heidelberg',
    description:
      'Hilfreiche Artikel, Tipps und Expertenwissen rund um pädagogische Betreuung für Eltern und Pädagogen.',
    url: 'https://www.trustolino.de/ratgeber',
    siteName: 'Trustolino',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Trustolino Ratgeber',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustolino: Ratgeber Kinderbetreuung in Mannheim & Heidelberg',
    description:
      'Hilfreiche Artikel, Tipps und Expertenwissen rund um pädagogische Betreuung für Eltern und Pädagogen.',
    images: ['/opengraph-image.png'],
  },
};

export default async function AdvisorPageDE() {
  const dict = await getDictionary('de');
  const articles = getArticles('de');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.trustolino.de/ratgeber#collection',
        url: 'https://www.trustolino.de/ratgeber',
        name: 'Trustolino: Ratgeber Kinderbetreuung',
        description:
          'Praxisnahe Tipps und Expertenwissen zu pädagogischer Kinderbetreuung in Mannheim & Heidelberg.',
        inLanguage: 'de-DE',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.trustolino.de/ratgeber#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.trustolino.de',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Ratgeber',
            item: 'https://www.trustolino.de/ratgeber',
          },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="mb-10 font-heading text-3xl font-bold text-foreground md:text-4xl">
        {dict.advisor.allArticles}
      </h1>

      {articles.length === 0 ? (
        <p className="text-foreground/60">Noch keine Artikel verfügbar.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={`/ratgeber/${article.slug}`} className="group block">
              <div className="h-full rounded-2xl border border-teal-100 bg-white p-6 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-foreground/80">
                    {article.category === 'paedagogen' ? dict.advisor.category.paedagogen : dict.advisor.category.eltern}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {article.readingTime} {dict.advisor.minReadingTime}
                  </span>
                </div>
                <h2 className="mb-2 font-heading text-lg font-bold leading-snug text-foreground">
                  {article.title}
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-foreground/60">
                  {article.description}
                </p>
                <span className="mt-4 inline-block text-sm font-medium text-gold-600">
                  {dict.advisor.readMore} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
