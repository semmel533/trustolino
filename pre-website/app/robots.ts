import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/bestaetigung', '/en/confirm'],
      },
    ],
    sitemap: 'https://www.trustolino.de/sitemap.xml',
  };
}
