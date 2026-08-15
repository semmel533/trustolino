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
  const articles = getArticles('en');
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug, 'en');

  if (!article) return { title: 'Not Found' };

  return {
    title: `${article.meta.title}`,
    description: article.meta.description || article.meta.title,
    alternates: {
      canonical: `/en/advisor/${slug}`,
      languages: {
        'de': `/ratgeber/${slug}`,
        'en': `/en/advisor/${slug}`,
      }
    }
  };
}

export default async function AdvisorArticleEN({ params }: Props) {
  const { slug } = await params;
  const dict = await getDictionary('en');
  const article = getArticleBySlug(slug, 'en');

  if (!article) {
    notFound();
  }

  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: ({ node, ...props }: any) => {
      let src = props.src;
      if (src && (src.startsWith('./') || src.startsWith('../'))) {
        const cleanSrc = src.replace(/^(\.\/|\.\.\/)+/, '');
        src = `/content/en/advisor/${slug}/${cleanSrc}?v=1`;
      }
      return <img {...props} src={src} className="rounded-lg shadow-sm" alt={props.alt || ''} />;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <Link href="/en/advisor" className="flex items-center gap-2 font-medium text-foreground/70 hover:text-foreground">
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
