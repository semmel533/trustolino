import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DictionaryProvider } from '@/lib/i18n/DictionaryContext';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function DeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary('de');

  return (
    <div lang="de">
      <DictionaryProvider dictionary={dictionary}>
        <Navbar locale="de" />
        <main className="min-h-screen pt-[72px]">
          {children}
        </main>
        <Footer locale="de" dictionary={dictionary} />
      </DictionaryProvider>
    </div>
  );
}
