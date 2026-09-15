import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { legalDocsData } from '@/lib/content-data';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal notice and company information for Trustolino GmbH.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/en/legal',
    languages: {
      'de': '/impressum',
      'en': '/en/legal',
    },
  },
};

export default function LegalPage() {
  const content = legalDocsData.legal;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
