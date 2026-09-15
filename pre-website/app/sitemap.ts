import { MetadataRoute } from 'next';
import { getArticles } from '@/lib/articles';

const BASE_URL = 'https://www.trustolino.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const deArticles = getArticles('de');
  const enArticles = getArticles('en');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: { de: BASE_URL, en: `${BASE_URL}/en` },
      },
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: { de: BASE_URL, en: `${BASE_URL}/en` },
      },
    },
    {
      url: `${BASE_URL}/ratgeber`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: { de: `${BASE_URL}/ratgeber`, en: `${BASE_URL}/en/advisor` },
      },
    },
    {
      url: `${BASE_URL}/en/advisor`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: { de: `${BASE_URL}/ratgeber`, en: `${BASE_URL}/en/advisor` },
      },
    },
  ];

  const deArticleRoutes: MetadataRoute.Sitemap = deArticles.map((article) => ({
    url: `${BASE_URL}/ratgeber/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        de: `${BASE_URL}/ratgeber/${article.slug}`,
        en: `${BASE_URL}/en/advisor/${article.slug}`,
      },
    },
  }));

  const enArticleRoutes: MetadataRoute.Sitemap = enArticles.map((article) => ({
    url: `${BASE_URL}/en/advisor/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        de: `${BASE_URL}/ratgeber/${article.slug}`,
        en: `${BASE_URL}/en/advisor/${article.slug}`,
      },
    },
  }));

  return [...staticRoutes, ...deArticleRoutes, ...enArticleRoutes];
}
