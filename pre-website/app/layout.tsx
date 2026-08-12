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
    default: 'Trustolino',
    template: 'Trustolino: %s',
  },
  description: 'Trustolino - Building trust between educators and students.',
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
