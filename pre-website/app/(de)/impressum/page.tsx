import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { legalDocsData } from '@/lib/content-data';

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Angaben zur Trustolino GmbH.',
  alternates: {
    canonical: '/impressum',
    languages: {
      'de': '/impressum',
      'en': '/en/legal',
    },
  },
};

export default function ImpressumPage() {
  const content = legalDocsData.impressum;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
