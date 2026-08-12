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
  title: 'Trusted Care, Easily Organized',
  description: 'Trustolino is the care platform for pedagogically qualified professionals. Gain practical experience, build your career portfolio and become a Trusted Educator.',
  alternates: { canonical: '/en', languages: { 'de': '/', 'en': '/en' } },
  openGraph: {
    title: 'Trusted Care, Easily Organized',
    description: 'The platform for pedagogical care professionals.',
    url: 'https://trustolino.de/en',
    siteName: 'Trustolino',
    locale: 'en_US',
    type: 'website',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Trustolino',
    url: 'https://trustolino.de/en',
    logo: 'https://trustolino.de/logo.png',
    description: 'Trustolino is the care platform for pedagogically qualified professionals.',
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
