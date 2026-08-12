import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

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

export default async function DatenschutzPage() {
  const filePath = path.join(process.cwd(), 'content/de/privacy/datenschutz.md');

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    content = '# Datenschutzerklärung\n\nPlatzhalter für die Datenschutzerklärung.';
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
