import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

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

export default async function ImpressumPage() {
  const filePath = path.join(process.cwd(), 'public/content/de/legal/impressum.md');

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    content = '# Impressum\n\nPlatzhalter für das Impressum.';
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
