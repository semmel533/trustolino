import { getArticles } from '@/lib/articles';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Childcare Advisor Mannheim & Heidelberg',
  description:
    'Expert knowledge, practical tips, and career guidance on pedagogical childcare and part-time educator jobs in Mannheim and Heidelberg.',
  alternates: {
    canonical: '/en/advisor',
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
    title: 'Trustolino: Childcare Advisor Mannheim & Heidelberg',
    description:
      'Helpful articles, tips, and expert knowledge on pedagogical childcare for parents and educators in Mannheim & Heidelberg.',
    url: 'https://www.trustolino.de/en/advisor',
    siteName: 'Trustolino',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Trustolino Advisor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustolino: Childcare Advisor Mannheim & Heidelberg',
    description:
      'Helpful articles, tips, and expert knowledge on pedagogical childcare for parents and educators in Mannheim & Heidelberg.',
    images: ['/opengraph-image.png'],
  },
};

export default async function AdvisorPageEN() {
  const dict = await getDictionary('en');
  const articles = getArticles('en');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.trustolino.de/en/advisor#collection',
        url: 'https://www.trustolino.de/en/advisor',
        name: 'Trustolino: Childcare Advisor',
        description:
          'Practical advice and insights on pedagogical childcare in Mannheim & Heidelberg.',
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://www.trustolino.de/en/advisor#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.trustolino.de/en',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Advisor',
            item: 'https://www.trustolino.de/en/advisor',
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
        <p className="text-foreground/60">No articles available yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.slug} href={`/en/advisor/${article.slug}`} className="group block">
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
