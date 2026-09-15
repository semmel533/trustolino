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
  title: 'Pedagogical Childcare in Mannheim & Heidelberg',
  description:
    'Trustolino is the premier childcare platform connecting families with qualified educators in Mannheim, Heidelberg, and the Rhine-Neckar region. Safe, reliable, pedagogical care.',
  alternates: { canonical: '/en', languages: { 'de': '/', 'en': '/en' } },
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
    title: 'Trustolino | Pedagogical Childcare in Mannheim & Heidelberg',
    description:
      'Reliable childcare by qualified educators and pedagogical professionals in Mannheim & Heidelberg.',
    url: 'https://www.trustolino.de/en',
    siteName: 'Trustolino',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Trustolino - Pedagogical Childcare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustolino | Pedagogical Childcare in Mannheim & Heidelberg',
    description:
      'Reliable childcare by qualified educators and pedagogical professionals in Mannheim & Heidelberg.',
    images: ['/opengraph-image.png'],
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.trustolino.de/en#website',
        url: 'https://www.trustolino.de/en',
        name: 'Trustolino',
        inLanguage: 'en-US',
        description:
          'Platform for qualified pedagogical childcare in Mannheim and Heidelberg.',
      },
      {
        '@type': ['Organization', 'LocalBusiness', 'ChildCare'],
        '@id': 'https://www.trustolino.de/#organization',
        name: 'Trustolino',
        url: 'https://www.trustolino.de',
        logo: 'https://www.trustolino.de/icon.svg',
        image: 'https://www.trustolino.de/opengraph-image.png',
        description:
          'Trustolino connects vetted, pedagogically qualified educators with families across Mannheim, Heidelberg, and the Rhine-Neckar metropolitan region.',
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
          'Childcare',
          'Pedagogy',
          'Babysitting',
          'Early Childhood Education',
          'Educators',
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
