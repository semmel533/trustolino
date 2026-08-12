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
  title: 'Vertrauensvolle Betreuung, kinderleicht organisiert',
  description: 'Trustolino ist die Betreuungsplattform für pädagogisch qualifizierte Fachkräfte. Sammle Praxiserfahrung, baue dein Karriereportfolio auf und werde Trusted Educator.',
  alternates: { canonical: '/', languages: { 'de': '/', 'en': '/en' } },
  openGraph: {
    title: 'Vertrauensvolle Betreuung, kinderleicht organisiert',
    description: 'Die Plattform für pädagogische Betreuungsprofis.',
    url: 'https://trustolino.de',
    siteName: 'Trustolino',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Trustolino',
    url: 'https://trustolino.de',
    logo: 'https://trustolino.de/logo.png',
    description: 'Trustolino ist die Betreuungsplattform für pädagogisch qualifizierte Fachkräfte.',
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
