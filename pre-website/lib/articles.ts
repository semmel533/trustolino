import { articlesData, type ArticleMeta } from './content-data';

export type { ArticleMeta };

export function getArticles(locale: 'de' | 'en'): ArticleMeta[] {
  const articlesMap = articlesData[locale];
  if (!articlesMap) {
    return [];
  }
  const articles: ArticleMeta[] = Object.values(articlesMap).map((item) => item.meta);
  return articles.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getArticleBySlug(slug: string, locale: 'de' | 'en'): { meta: ArticleMeta; content: string } | null {
  const articlesMap = articlesData[locale];
  if (!articlesMap) {
    return null;
  }
  const article = articlesMap[slug];
  if (!article) {
    return null;
  }
  return {
    meta: article.meta,
    content: article.content,
  };
}
