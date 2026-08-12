import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DictionaryProvider } from '@/lib/i18n/DictionaryContext';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary('en');

  return (
    <div lang="en">
      <DictionaryProvider dictionary={dictionary}>
        <Navbar locale="en" />
        <main className="min-h-screen pt-[72px]">
          {children}
        </main>
        <Footer locale="en" dictionary={dictionary} />
      </DictionaryProvider>
    </div>
  );
}
