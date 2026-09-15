import ReactMarkdown from 'react-markdown';
import type { Metadata } from 'next';
import { legalDocsData } from '@/lib/content-data';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Information about privacy on the Trustolino platform. We explain how your data is securely processed.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/en/privacy',
    languages: {
      'de': '/datenschutz',
      'en': '/en/privacy',
    },
  },
};

export default function PrivacyPage() {
  const content = legalDocsData.privacy;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <article className="prose prose-teal max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
