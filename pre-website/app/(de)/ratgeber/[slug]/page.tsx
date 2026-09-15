import { getArticleBySlug, getArticles } from '@/lib/articles';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = getArticles('de');
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, 'de');
  if (!article) return { title: { absolute: 'Not Found' } };

  const title = article.meta.title;
  const description = article.meta.description || article.meta.title;
  const url = `https://www.trustolino.de/ratgeber/${slug}`;

  return {
    title: {
      absolute: title,
    },
    description,
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
    alternates: {
      canonical: `/ratgeber/${slug}`,
      languages: {
        'de': `/ratgeber/${slug}`,
        'en': `/en/advisor/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Trustolino',
      locale: 'de_DE',
      type: 'article',
      publishedTime: article.meta.date,
      authors: [article.meta.author || 'Trustolino Team'],
      section: article.meta.category === 'paedagogen' ? 'Pädagogen' : 'Eltern',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image.png'],
    },
  };
}

export default async function AdvisorArticleDE({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dict = await getDictionary('de');
  const article = getArticleBySlug(slug, 'de');

  if (!article) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://www.trustolino.de/ratgeber/${slug}#article`,
        isPartOf: {
          '@type': 'WebPage',
          '@id': `https://www.trustolino.de/ratgeber/${slug}`,
          url: `https://www.trustolino.de/ratgeber/${slug}`,
          name: article.meta.title,
          description: article.meta.description,
          inLanguage: 'de-DE',
        },
        headline: article.meta.title,
        description: article.meta.description,
        datePublished: article.meta.date,
        dateModified: article.meta.date,
        mainEntityOfPage: `https://www.trustolino.de/ratgeber/${slug}`,
        author: {
          '@type': 'Organization',
          name: article.meta.author || 'Trustolino Team',
          url: 'https://www.trustolino.de',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Trustolino',
          url: 'https://www.trustolino.de',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.trustolino.de/icon.svg',
          },
        },
        articleSection:
          article.meta.category === 'paedagogen'
            ? 'Pädagogik & Karriere'
            : 'Elternratgeber',
        inLanguage: 'de-DE',
        spatialCoverage: {
          '@type': 'Place',
          name: 'Mannheim und Heidelberg, Baden-Württemberg',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 49.4875,
            longitude: 8.4660,
          },
        },
        about: [
          { '@type': 'Thing', name: 'Kinderbetreuung' },
          { '@type': 'Place', name: 'Mannheim' },
          { '@type': 'Place', name: 'Heidelberg' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://www.trustolino.de/ratgeber/${slug}#breadcrumb`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: article.meta.title,
            item: `https://www.trustolino.de/ratgeber/${slug}`,
          },
        ],
      },
    ],
  };

  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: ({ node, ...props }: any) => {
      let src = props.src;
      if (src && (src.startsWith('./') || src.startsWith('../'))) {
        const cleanSrc = src.replace(/^(\.\/|\.\.\/)+/, '');
        src = `/content/de/ratgeber/${slug}/${cleanSrc}?v=1`;
      }
      return <img {...props} src={src} className="rounded-lg shadow-sm" alt={props.alt || ''} />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8">
        <Link href="/ratgeber" className="flex items-center gap-2 font-medium text-foreground/70 hover:text-foreground">
          &larr; {dict.advisor.backToOverview}
        </Link>
      </div>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-foreground/60">
          <span className="rounded-full bg-teal-50 px-3 py-1 font-medium text-foreground/80">
            {article.meta.category === 'paedagogen' ? dict.advisor.category.paedagogen : dict.advisor.category.eltern}
          </span>
          <span>{article.meta.date}</span>
          <span>&bull;</span>
          <span>{article.meta.readingTime} {dict.advisor.minReadingTime}</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{article.meta.title}</h1>
        {article.meta.description && (
          <p className="mt-4 text-lg text-foreground/70">{article.meta.description}</p>
        )}
      </header>

      <article className="prose md:prose-lg prose-teal max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {article.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
