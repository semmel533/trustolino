import Hero from '@/components/sections/Hero';
import ValueProposition from '@/components/sections/ValueProposition';
import Experience from '@/components/sections/Experience';
import WhoWeAre from '@/components/sections/WhoWeAre';
import QualitySeal from '@/components/sections/QualitySeal';
import TrustedEducator from '@/components/sections/TrustedEducator';
import Team from '@/components/sections/Team';
import Promise from '@/components/sections/Promise';
import Freiraum from '@/components/sections/Freiraum';
import WaitlistCTA from '@/components/sections/WaitlistCTA';
import WaitlistSimple from '@/components/sections/WaitlistSimple';
import FAQ from '@/components/sections/FAQ';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pädagogische Kinderbetreuung in Mannheim & Heidelberg',
  description:
    'Trustolino ist die Plattform für pädagogisch qualifizierte Fachkräfte und Familien in Mannheim, Heidelberg und der Rhein-Neckar-Region. Sichere Betreuung mit Herz und Verstand.',
  alternates: { canonical: '/', languages: { 'de': '/', 'en': '/en' } },
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
    title: 'Trustolino | Pädagogische Kinderbetreuung in Mannheim & Heidelberg',
    description:
      'Vertrauensvolle Kinderbetreuung durch qualifizierte Pädagogen und Erzieher in Mannheim & Heidelberg.',
    url: 'https://www.trustolino.de',
    siteName: 'Trustolino',
    locale: 'de_DE',
    type: 'website',
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
      'Vertrauensvolle Kinderbetreuung durch qualifizierte Pädagogen und Erzieher in Mannheim & Heidelberg.',
    images: ['/opengraph-image.png'],
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.trustolino.de/#website',
        url: 'https://www.trustolino.de',
        name: 'Trustolino',
        inLanguage: 'de-DE',
        description:
          'Plattform für pädagogisch qualifizierte Kinderbetreuung in Mannheim und Heidelberg.',
      },
      {
        '@type': ['Organization', 'LocalBusiness', 'ChildCare'],
        '@id': 'https://www.trustolino.de/#organization',
        name: 'Trustolino',
        url: 'https://www.trustolino.de',
        logo: 'https://www.trustolino.de/icon.svg',
        image: 'https://www.trustolino.de/opengraph-image.png',
        description:
          'Trustolino vermittelt geprüfte, pädagogisch qualifizierte Betreuungskräfte an Familien in Mannheim, Heidelberg und der Rhein-Neckar-Region.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Mannheim',
          addressRegion: 'Baden-Württemberg',
          addressCountry: 'DE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 49.4875,
          longitude: 8.4660,
        },
        areaServed: [
          { '@type': 'City', name: 'Mannheim' },
          { '@type': 'City', name: 'Heidelberg' },
          { '@type': 'AdministrativeArea', name: 'Rhein-Neckar-Kreis' },
          { '@type': 'City', name: 'Ludwigshafen am Rhein' },
        ],
        knowsAbout: [
          'Kinderbetreuung',
          'Pädagogik',
          'Babysitting',
          'Frühkindliche Bildung',
          'Erzieher',
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ValueProposition />
      <Experience />
      <QualitySeal />
      <WhoWeAre />
      <WaitlistCTA />
      <TrustedEducator />
      <Team />
      <Promise />
      <WaitlistSimple />
      <Freiraum />
      <FAQ />
    </>
  );
}
