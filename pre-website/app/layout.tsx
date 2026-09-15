import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.trustolino.de'),
  title: {
    default: 'Trustolino | Pädagogische Kinderbetreuung in Mannheim & Heidelberg',
    template: '%s | Trustolino',
  },
  description:
    'Trustolino ist die Plattform für pädagogisch qualifizierte Kinderbetreuung in Mannheim, Heidelberg und der Rhein-Neckar-Region. Qualifizierte Fachkräfte, verlässliche Betreuung und höchste Qualitätsstandards.',
  keywords: [
    'Kinderbetreuung Mannheim',
    'Kinderbetreuung Heidelberg',
    'Babysitter Mannheim',
    'Babysitter Heidelberg',
    'Pädagogische Kinderbetreuung',
    'Erzieher Nebenjob Mannheim',
    'Babysitter Stundenlohn Mannheim',
    'Trusted Educator',
    'Trustolino',
    'Rhein-Neckar-Region',
  ],
  authors: [{ name: 'Trustolino Team', url: 'https://www.trustolino.de' }],
  creator: 'Trustolino',
  publisher: 'Trustolino',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: 'en_US',
    url: 'https://www.trustolino.de',
    siteName: 'Trustolino',
    title: 'Trustolino | Pädagogische Kinderbetreuung in Mannheim & Heidelberg',
    description:
      'Vertrauensvolle Kinderbetreuung durch qualifizierte Pädagogen in Mannheim, Heidelberg und Umgebung.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Trustolino - Pädagogische Kinderbetreuung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustolino | Pädagogische Kinderbetreuung in Mannheim & Heidelberg',
    description:
      'Vertrauensvolle Kinderbetreuung durch qualifizierte Pädagogen in Mannheim, Heidelberg und Umgebung.',
    images: ['/opengraph-image.png'],
  },
  other: {
    'geo.region': 'DE-BW',
    'geo.placename': 'Mannheim, Heidelberg',
    'geo.position': '49.4875;8.4660',
    'ICBM': '49.4875, 8.4660',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans bg-[#FAF7F2] text-[#1d1d1b] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
