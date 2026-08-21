import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal',
  description: 'Legal notice and company information for Trustolino GmbH.',
  alternates: {
    canonical: '/en/legal',
    languages: {
      'de': '/impressum',
      'en': '/en/legal',
    },
  },
};

export default async function LegalPage() {
  const filePath = path.join(process.cwd(), 'public/content/en/legal/legal.md');

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    content = '# Legal Notice\n\nPlaceholder for legal information.';
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
