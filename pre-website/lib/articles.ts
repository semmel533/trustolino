import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMeta {
    title: string;
    description: string;
    slug: string;
    category: string;
    author: string;
    date: string;
    readingTime: number;
    lang: 'de' | 'en';
    image?: string;
}

const contentDir = path.join(process.cwd(), 'content');

export function getArticles(locale: 'de' | 'en'): ArticleMeta[] {
    const typeDir = locale === 'de' ? 'ratgeber' : 'advisor';
    const articlesDir = path.join(contentDir, locale, typeDir);

    if (!fs.existsSync(articlesDir)) {
        return [];
    }

    const folders = fs.readdirSync(articlesDir);
    const articles: ArticleMeta[] = folders.map((folder) => {
        const articlePath = path.join(articlesDir, folder, 'article.md');
        if (!fs.existsSync(articlePath)) {
            return null;
        }

        const fileContents = fs.readFileSync(articlePath, 'utf8');
        const { data, content } = matter(fileContents);
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        return {
            title: data.title,
            description: data.description,
            slug: folder,
            category: data.category,
            author: data.author || 'Trustolino Team',
            date: data.date,
            readingTime,
            lang: locale,
            image: data.image,
        } as ArticleMeta;
    }).filter((article): article is ArticleMeta => article !== null);

    return articles.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getArticleBySlug(slug: string, locale: 'de' | 'en'): { meta: ArticleMeta, content: string } | null {
    const typeDir = locale === 'de' ? 'ratgeber' : 'advisor';
    const articlePath = path.join(contentDir, locale, typeDir, slug, 'article.md');

    if (!fs.existsSync(articlePath)) {
        return null;
    }

    const fileContents = fs.readFileSync(articlePath, 'utf8');
    const { data, content } = matter(fileContents);
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return {
        meta: {
            title: data.title,
            description: data.description,
            slug: slug,
            category: data.category,
            author: data.author || 'Trustolino Team',
            date: data.date,
            readingTime,
            lang: locale,
            image: data.image,
        } as ArticleMeta,
        content
    };
}
