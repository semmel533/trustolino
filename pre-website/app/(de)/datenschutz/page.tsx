import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { legalDocsData } from '@/lib/content-data';

export const metadata: Metadata = {
  title: 'Datenschutz',
  description: 'Informationen zum Datenschutz auf der Trustolino Plattform. Wir erklären, wie deine Daten sicher verarbeitet werden.',
  alternates: {
    canonical: '/datenschutz',
    languages: {
      'de': '/datenschutz',
      'en': '/en/privacy',
    },
  },
};

export default function DatenschutzPage() {
  const content = legalDocsData.datenschutz;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
