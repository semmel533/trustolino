import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Information about privacy on the Trustolino platform. We explain how your data is securely processed.',
  alternates: {
    canonical: '/en/privacy',
    languages: {
      'de': '/datenschutz',
      'en': '/en/privacy',
    },
  },
};

export default async function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'content/en/privacy/privacy.md');

  let content = '';
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    content = '# Privacy Policy\n\nPlaceholder for the privacy policy.';
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
