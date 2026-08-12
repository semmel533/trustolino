import type { Locale } from './config';

const dictionaries = {
  de: () => import('./dictionaries/de.json').then((mod) => mod.default),
  en: () => import('./dictionaries/en.json').then((mod) => mod.default),
};

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] || dictionaries.de;
  return loader();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dictionary = Record<string, any>;
